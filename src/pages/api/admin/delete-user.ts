/**
 * Admin API - Delete User
 * Safely deletes a user account (soft delete with audit trail)
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { AdminEventLogger, ACTIONS } from '../../../lib/adminEventLogger';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface DeleteUserRequest {
  userId: string;
  adminUserId: string;
  reason?: string;
}

// Authentication middleware
async function authenticateAdmin(req: NextApiRequest): Promise<{ isValid: boolean; userId?: string; error?: string }> {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // SECURITY: Authenticate admin
  const authResult = await authenticateAdmin(req);
  if (!authResult.isValid) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: authResult.error 
    });
  }

  try {
    const { userId, adminUserId, reason }: DeleteUserRequest = req.body;

    // Validate required fields
    if (!userId || !adminUserId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('tracker_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError || !existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent self-deletion
    if (userId === adminUserId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Soft delete: deactivate account and mark as deleted
    const deleteTimestamp = new Date().toISOString();
    const { data: deletedUser, error: deleteError } = await supabaseAdmin
      .from('tracker_users')
      .update({
        is_active: false,
        updated_at: deleteTimestamp
      })
      .eq('id', userId)
      .select()
      .single();

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return res.status(500).json({ error: 'Failed to delete user: ' + deleteError.message });
    }

    // Disable auth account
    try {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        banned_until: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString() // Banned for 100 years
      });
    } catch (authError) {
      console.error('Warning: Could not disable auth account:', authError);
      // Continue anyway - the profile is deactivated
    }

    // Log the deletion event using comprehensive logging system
    await AdminEventLogger.logUserEvent(
      adminUserId,
      ACTIONS.DELETE_USER,
      userId,
      existingUser.full_name || existingUser.username,
      {
        deleted_user: {
          email: existingUser.email,
          full_name: existingUser.full_name,
          username: existingUser.username,
          role: existingUser.role
        },
        reason: reason || 'No reason provided',
        deletion_type: 'soft_delete',
        auth_account_disabled: true
      },
      'success'
    );

    res.status(200).json({
      message: 'User deleted successfully',
      user: {
        id: deletedUser.id,
        email: deletedUser.email,
        full_name: deletedUser.full_name,
        is_active: deletedUser.is_active
      }
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}