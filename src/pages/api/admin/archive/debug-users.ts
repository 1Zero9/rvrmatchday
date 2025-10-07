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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // First, let's see what users exist using admin client
    const { data: users, error: usersError } = await supabaseAdmin
      .from('tracker_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      throw new Error('Failed to fetch users: ' + usersError.message);
    }

    // Also check auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      throw new Error('Failed to fetch auth users: ' + authError.message);
    }

    return res.status(200).json({ 
      success: true,
      trackerUsers: users || [],
      trackerUsersCount: users?.length || 0,
      authUsers: authUsers.users || [],
      authUsersCount: authUsers.users?.length || 0
    });

  } catch (error) {
    console.error('Debug users error:', error);
    return res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
}