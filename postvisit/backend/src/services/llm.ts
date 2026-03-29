import axios from 'axios';
import { Visit, ChatMessage } from '../types';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

/**
 * Build context string from visit data and conversation history
 */
export function buildChatContext(visit: Visit, chatHistory: ChatMessage[]): string {
  let context = `Patient: ${visit.patientName}\nVisit Date: ${visit.visitDate.toLocaleDateString()}\n\n`;

  context += `=== DIAGNOSIS & FINDINGS ===\n`;
  context += `Diagnosis: ${visit.diagnosis}\n`;
  if (visit.symptoms.length > 0) {
    context += `Symptoms: ${visit.symptoms.join(', ')}\n`;
  }
  context += `Findings: ${visit.findings}\n\n`;

  context += `=== MEDICATIONS ===\n`;
  visit.medications.forEach((med) => {
    context += `- ${med.name} ${med.dosage}: ${med.frequency} for ${med.duration}`;
    if (med.instructions) {
      context += ` (${med.instructions})`;
    }
    context += '\n';
  });

  context += `\n=== CARE INSTRUCTIONS ===\n${visit.instructions}\n`;

  if (visit.followUpDate) {
    context += `\nFollow-up appointment: ${visit.followUpDate.toLocaleDateString()}\n`;
  }

  if (visit.notes) {
    context += `\nDoctor's notes: ${visit.notes}\n`;
  }

  if (chatHistory.length > 0) {
    context += `\n=== CONVERSATION HISTORY ===\n`;
    chatHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'Patient' : 'Assistant';
      context += `${role}: ${msg.content}\n`;
    });
  }

  return context;
}

/**
 * Call Claude API with visit context and user message
 */
export async function callClaude(
  visit: Visit,
  chatHistory: ChatMessage[],
  userMessage: string
): Promise<string> {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY environment variable is not set');
  }

  const context = buildChatContext(visit, chatHistory);
  const systemPrompt = `You are a helpful medical assistant. Your role is to help patients understand their visit results and medical information.

IMPORTANT GUIDELINES:
1. Only reference information from the patient's actual visit data provided below
2. Explain medical terms in simple, understandable language
3. Be empathetic and supportive
4. If the patient asks something outside the scope of their visit, politely suggest they contact their doctor
5. Do not provide new medical diagnoses or prescribe treatments
6. Always cite which part of the visit you're referencing in your answer

PATIENT VISIT DATA:
${context}`;

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    if (response.data.content && response.data.content.length > 0) {
      return response.data.content[0].text;
    }

    throw new Error('No response from Claude API');
  } catch (error: any) {
    const status = error.response?.status;
    const requestId = error.response?.headers?.['x-request-id'];
    console.error('Claude API error', { status, requestId });
    if (status) {
      throw new Error(`Failed to get response from Claude API (status ${status})`);
    }
    throw new Error('Failed to get response from Claude API');
  }
}

/**
 * Extract sources mentioned in the assistant response
 * Returns array of visit section names (e.g., ['diagnosis', 'medications'])
 */
export function extractSources(assistantMessage: string): string[] {
  const sources: Set<string> = new Set();

  const lowerContent = assistantMessage.toLowerCase();

  if (
    lowerContent.includes('diagnosis') ||
    lowerContent.includes('diagnosed') ||
    lowerContent.includes('condition')
  ) {
    sources.add('diagnosis');
  }

  if (
    lowerContent.includes('medication') ||
    lowerContent.includes('medicine') ||
    lowerContent.includes('drug') ||
    lowerContent.includes('tablet') ||
    lowerContent.includes('paracetamol') ||
    lowerContent.includes('take') && (lowerContent.includes('mg') || lowerContent.includes('daily'))
  ) {
    sources.add('medications');
  }

  if (
    lowerContent.includes('instruction') ||
    lowerContent.includes('care') ||
    lowerContent.includes('rest') ||
    lowerContent.includes('follow-up')
  ) {
    sources.add('instructions');
  }

  if (sources.size === 0) {
    sources.add('visit-summary');
  }

  return Array.from(sources);
}
