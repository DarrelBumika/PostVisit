import { getVisitByToken } from '../models/Visit';
import { Visit } from '../types';

/**
 * Validate a token and return the associated visit
 * Returns null if token is invalid or visit not found
 */
export async function validateToken(token: string): Promise<Visit | null> {
  // Basic token format validation
  if (!token || typeof token !== 'string' || token.length < 20) {
    return null;
  }

  // Query database for visit
  const visit = await getVisitByToken(token);
  return visit || null;
}

/**
 * Extract and validate token from request
 */
export function extractTokenFromRequest(req: any): string | null {
  // Check query parameter first
  if (req.query?.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  // Check headers
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}
