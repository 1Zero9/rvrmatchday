/**
 * Admin Authentication Middleware
 * SECURITY: Protects admin API endpoints
 */

import { NextApiRequest } from 'next';
import { supabase } from './supabase';

export interface AuthResult {
  isValid: boolean;
  userId?: string;
  error?: string;
}

/**
 * Authenticates admin users for API endpoints
 * Requires Bearer token with admin role
 */
export async function authenticateAdmin(req: NextApiRequest): Promise<AuthResult> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isValid: false, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return { isValid: false, error: 'Missing access token' };
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return { isValid: false, error: 'Invalid access token' };
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('tracker_users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return { isValid: false, error: 'Insufficient permissions - admin role required' };
    }

    return { isValid: true, userId: user.id };
  } catch (error) {
    return { isValid: false, error: 'Authentication failed' };
  }
}

/**
 * Rate limiting for admin endpoints
 * Simple in-memory rate limiting (use Redis in production)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(req: NextApiRequest, maxRequests = 100, windowMs = 15 * 60 * 1000): boolean {
  const clientIP = getClientIP(req);
  const now = Date.now();
  const key = `admin_${clientIP}`;
  
  const current = requestCounts.get(key);
  
  if (!current || now > current.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
}

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) : req.socket.remoteAddress;
  return ip || 'unknown';
}