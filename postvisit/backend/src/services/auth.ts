import { getVisitByToken } from '../models/Visit';
import { Visit } from '../types';

/**
 * Validate a token and return the associated visit
 * Returns null if token is invalid or visit not found
 */
export async function validateToken(token: string): Promise<Visit | null> {
  // Basic token format validation: expect a 32-character hexadecimal string
  if (!token || typeof token !== 'string' || !/^[0-9a-fA-F]{32}$/.test(token)) {
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
  // Prefer Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Optionally allow query parameter token in non-production environments
  if (process.env.NODE_ENV !== 'production' && req.query?.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  return null;
}
