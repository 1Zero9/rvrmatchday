/**
 * Admin API - Update User
 * Updates existing user account information
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';

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

interface UpdateUserRequest {
  userId: string;
  updates: {
    full_name?: string;
    username?: string;
    role?: 'admin' | 'parent';
    is_active?: boolean;
  };
  adminUserId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, updates, adminUserId }: UpdateUserRequest = req.body;

    // Validate required fields
    if (!userId || !updates) {
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

    // If username is being updated, check for uniqueness
    if (updates.username && updates.username !== existingUser.username) {
      const { data: existingUsername, error: usernameError } = await supabaseAdmin
        .from('tracker_users')
        .select('id')
        .eq('username', updates.username)
        .neq('id', userId);

      if (usernameError) {
        console.error('Error checking username:', usernameError);
        return res.status(500).json({ error: 'Database error while checking username' });
      }

      if (existingUsername && existingUsername.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    // Prepare update object
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Update user
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('tracker_users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user:', updateError);
      return res.status(500).json({ error: 'Failed to update user: ' + updateError.message });
    }

    // Log the update event (optional - may not have audit table yet)
    const changedFields = Object.keys(updates).filter(key => 
      updates[key as keyof typeof updates] !== existingUser[key]
    );

    if (changedFields.length > 0) {
      try {
        await supabaseAdmin
          .from('admin_audit_log')
          .insert([{
            admin_user_id: adminUserId,
            action: 'update_user',
            target_user_id: userId,
            details: {
              changed_fields: changedFields,
              old_values: Object.fromEntries(
                changedFields.map(field => [field, existingUser[field]])
              ),
              new_values: Object.fromEntries(
                changedFields.map(field => [field, updates[field as keyof typeof updates]])
              )
            },
            timestamp: new Date().toISOString()
          }]);
      } catch (auditError) {
        console.log('Audit logging failed (table may not exist):', auditError);
      }
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        full_name: updatedUser.full_name,
        role: updatedUser.role,
        is_active: updatedUser.is_active
      },
      changedFields
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}