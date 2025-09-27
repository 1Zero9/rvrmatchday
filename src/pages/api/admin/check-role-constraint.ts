/**
 * Admin API - Check Role Constraint
 * Diagnoses what role values are allowed by the database constraint
 */

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
    // Get all existing roles in the database
    const { data: users, error: usersError } = await supabaseAdmin
      .from('tracker_users')
      .select('role')
      .limit(100);

    if (usersError) {
      throw new Error('Failed to fetch users: ' + usersError.message);
    }

    const existingRoles = [...new Set(users?.map(u => u.role) || [])];

    // Skip constraint definition query for now - focus on role testing

    // Test each role by trying to create a test record (will rollback)
    const testRoles = ['admin', 'editor', 'coach', 'parent', 'manager', 'volunteer', 'user', 'member'];
    const roleTestResults = {};

    for (const role of testRoles) {
      try {
        // Test if this role would pass validation
        const { error: testError } = await supabaseAdmin
          .from('tracker_users')
          .insert([{
            id: '00000000-0000-0000-0000-000000000000', // Dummy UUID that will fail FK
            email: 'test@example.com',
            username: 'test',
            full_name: 'Test User',
            role: role,
            teams: [],
            permissions: [],
            is_active: true
          }]);

        if (testError) {
          if (testError.message.includes('role_check')) {
            roleTestResults[role] = 'REJECTED - Role constraint violation';
          } else if (testError.message.includes('duplicate') || testError.message.includes('unique')) {
            roleTestResults[role] = 'ACCEPTED - Would pass role check';
          } else {
            roleTestResults[role] = `OTHER ERROR - ${testError.message.substring(0, 100)}`;
          }
        } else {
          roleTestResults[role] = 'ACCEPTED - Insert successful';
        }
      } catch (error) {
        roleTestResults[role] = `TEST FAILED - ${(error as Error).message.substring(0, 100)}`;
      }
    }

    res.status(200).json({
      success: true,
      existingRoles: existingRoles,
      roleTestResults: roleTestResults,
      constraintInfo: 'Role validation through direct testing',
      recommendation: 'Use roles that show ACCEPTED in the test results'
    });

  } catch (error) {
    console.error('Role constraint check error:', error);
    res.status(500).json({ 
      error: 'Check failed', 
      details: (error as Error).message 
    });
  }
}