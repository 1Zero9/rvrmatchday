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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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