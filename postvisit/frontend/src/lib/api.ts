import { Visit, ChatMessage, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiClient {
  static async fetchVisit(token: string): Promise<Visit> {
    const response = await fetch(`${API_URL}/visit/${token}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Visit not found. Invalid or expired link.');
      }
      throw new Error('Failed to fetch visit data');
    }
    const data: ApiResponse<Visit> = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch visit data');
    }
    return data.data;
  }

  static async sendChatMessage(
    visitId: string,
    token: string,
    message: string
  ): Promise<{ messageId: string; content: string; sources: string[] }> {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitId, token, message }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid or expired link');
      }
      throw new Error('Failed to send message');
    }
    const data: ApiResponse<any> = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to send message');
    }
    return data.data;
  }
}

export default ApiClient;
