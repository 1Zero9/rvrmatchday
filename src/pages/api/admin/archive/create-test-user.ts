import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create a test user account in Supabase Auth first
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'testuser@rvrfc.ie',
      password: 'TestPassword123!',
      email_confirm: true
    });

    if (authError) {
      throw new Error('Failed to create auth user: ' + authError.message);
    }

    // Create user profile in tracker_users with the auth user's ID
    const { data: user, error: profileError } = await supabaseAdmin
      .from('tracker_users')
      .insert({
        id: authData.user.id,
        email: 'testuser@rvrfc.ie',
        username: 'testuser',
        full_name: 'Test User',
        role: 'parent',
        permissions: ['view_basic'],
        teams: ['U10 Boys'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up auth user if profile creation failed
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error('Failed to create user profile: ' + profileError.message);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Test user created successfully',
      user: user,
      tempPassword: 'TestPassword123!'
    });

  } catch (error) {
    console.error('Create test user error:', error);
    return res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
}