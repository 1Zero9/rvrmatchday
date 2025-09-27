/**
 * Admin API - Create New User
 * Creates a new user account with generated temporary password
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

interface CreateUserRequest {
  email: string;
  full_name: string;
  username: string;
  role: 'admin' | 'parent';
  is_active: boolean;
  adminUserId: string;
}

// Generate a secure temporary password
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, full_name, username, role, is_active, adminUserId }: CreateUserRequest = req.body;

    // Validate required fields
    if (!email || !full_name || !username || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('tracker_users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`);

    if (checkError) {
      console.error('Error checking existing users:', checkError);
      return res.status(500).json({ error: 'Database error while checking existing users' });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // First create auth account using admin client (like approve-account.ts)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return res.status(500).json({ error: 'Failed to create auth account: ' + authError.message });
    }

    // Create user profile (matching the exact pattern from approve-account.ts)
    const newUser = {
      id: authData.user.id, // Use the auth user's ID
      email,
      username,
      full_name,
      role,
      teams: [],
      permissions: [],
      is_active: is_active !== false // Default to true if not specified
    };

    console.log('Creating user with role:', role);
    console.log('Full user object:', newUser);

    const { data: createdUser, error: createError } = await supabaseAdmin
      .from('tracker_users')
      .insert([newUser])
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      // Clean up auth user if profile creation failed
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'Failed to create user: ' + createError.message });
    }

    // Log the creation event using comprehensive logging system
    await AdminEventLogger.logUserEvent(
      adminUserId,
      ACTIONS.CREATE_USER,
      createdUser.id,
      createdUser.full_name || createdUser.username,
      {
        email: email,
        username: username,
        role: role,
        full_name: full_name,
        tempPasswordGenerated: true
      },
      'success'
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
        full_name: createdUser.full_name,
        role: createdUser.role
      },
      tempPassword: tempPassword
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}