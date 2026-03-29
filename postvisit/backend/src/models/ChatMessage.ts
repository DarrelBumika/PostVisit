import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { ChatMessage } from '../types';

/**
 * Create a new chat message (user or assistant)
 */
export async function createChatMessage(
  visitId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ChatMessage> {
  const result = await query(
    `INSERT INTO chat_messages (id, visit_id, role, content, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, visit_id, role, content, created_at`,
    [uuidv4(), visitId, role, content]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    visitId: row.visit_id,
    role: row.role,
    content: row.content,
    createdAt: new Date(row.created_at),
  };
}

/**
 * Retrieve all chat messages for a visit, ordered by creation time
 */
export async function getChatHistory(visitId: string): Promise<ChatMessage[]> {
  const result = await query(
    `SELECT id, visit_id, role, content, created_at
     FROM chat_messages
     WHERE visit_id = $1
     ORDER BY created_at ASC`,
    [visitId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    visitId: row.visit_id,
    role: row.role,
    content: row.content,
    createdAt: new Date(row.created_at),
  }));
}
