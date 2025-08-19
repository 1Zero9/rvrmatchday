import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'This endpoint is only available in development' });
  }

  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Create admin client with service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First, create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(500).json({ message: authError.message });
    }

    if (!authData.user) {
      return res.status(500).json({ message: 'User creation failed' });
    }

    // Then, create/update the profile as admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: authData.user.id,
        email: email,
        role: 'admin',
        first_name: firstName || 'Admin',
        last_name: lastName || 'User'
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      return res.status(500).json({ message: profileError.message });
    }

    // Log the admin creation
    const { error: logError } = await supabaseAdmin
      .from('change_log')
      .insert({
        table_name: 'profiles',
        record_id: authData.user.id,
        action: 'CREATE',
        changed_by: authData.user.id,
        change_summary: 'DEV ADMIN CREATION: First admin account created via API',
        new_values: {
          role: 'admin',
          created_by: 'dev_api',
          creation_method: 'setup_endpoint',
          security_level: 'development',
          timestamp: new Date().toISOString()
        }
      });

    if (logError) {
      console.warn('Logging error (non-critical):', logError);
    }

    res.status(200).json({ 
      success: true,
      message: 'Admin account created successfully!',
      user_id: authData.user.id,
      email: email
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Setup admin error:', error);
    res.status(500).json({ 
      success: false,
      message: errorMessage 
    });
  }
}