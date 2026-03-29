import { Router, Request, Response } from 'express';
import { validateToken } from '../services/auth';
import { callClaude, extractSources } from '../services/llm';
import { createChatMessage, getChatHistory } from '../models/ChatMessage';
import { ChatRequest, ApiResponse } from '../types';

const router = Router();

/**
 * POST /api/chat
 * Send a message and get a response from the LLM
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { visitId, token, message }: ChatRequest = req.body;

    // Validate input
    if (!visitId || !token || !message) {
      const error: ApiResponse<null> = {
        success: false,
        error: 'visitId, token, and message are required',
      };
      return res.status(400).json(error);
    }

    // Validate token
    const visit = await validateToken(token);
    if (!visit || visit.id !== visitId) {
      const error: ApiResponse<null> = {
        success: false,
        error: 'Invalid or expired token',
      };
      return res.status(401).json(error);
    }

    // Get chat history for context (before storing current message to avoid duplication)
    const chatHistory = await getChatHistory(visitId);

    // Store user message
    await createChatMessage(visitId, 'user', message);

    // Call LLM
    let assistantResponse: string;
    try {
      assistantResponse = await callClaude(visit, chatHistory, message);
    } catch (llmError: any) {
      console.error('LLM error:', llmError);
      const error: ApiResponse<null> = {
        success: false,
        error: 'Failed to generate response',
      };
      return res.status(500).json(error);
    }

    // Store assistant message
    const storedMessage = await createChatMessage(visitId, 'assistant', assistantResponse);

    // Extract sources mentioned in response
    const sources = extractSources(assistantResponse);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        messageId: storedMessage.id,
        content: assistantResponse,
        sources,
        createdAt: storedMessage.createdAt,
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error processing chat:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
    };
    res.status(500).json(response);
  }
});

export default router;
