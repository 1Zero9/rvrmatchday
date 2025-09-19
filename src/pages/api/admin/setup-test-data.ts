import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create test users for the admin interface - using only existing columns
    const testUsers = [
      {
        email: 'admin@rvrfc.ie',
        username: 'admin',
        full_name: 'Site Administrator',
        role: 'admin',
        permissions: ['all'],
        teams: ['all teams'],
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        email: 'coach1@rvrfc.ie',
        username: 'coach1',
        full_name: 'John Smith',
        role: 'coach',
        permissions: ['view_teams', 'edit_matches', 'view_players'],
        teams: ['U12 Boys'],
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        email: 'parent1@email.com',
        username: 'parent1',
        full_name: 'Mary Johnson',
        role: 'parent',
        permissions: ['view_basic'],
        teams: ['U10 Girls'],
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        email: 'inactive@email.com',
        username: 'inactive',
        full_name: 'Bob Wilson',
        role: 'volunteer',
        permissions: ['view_basic'],
        teams: [],
        is_active: false,
        created_at: new Date().toISOString()
      },
      {
        email: 'locked@email.com',
        username: 'locked',
        full_name: 'Alice Brown',
        role: 'parent',
        permissions: ['view_basic'],
        teams: ['U8 Boys'],
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];

    // Insert test users
    const { data: insertedUsers, error: insertError } = await supabase
      .from('tracker_users')
      .upsert(testUsers, { onConflict: 'email' })
      .select();

    if (insertError) {
      console.error('Error inserting test users:', insertError);
      return res.status(500).json({ error: 'Failed to create test users', details: insertError.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Test data created successfully',
      usersCreated: insertedUsers?.length || 0,
      users: insertedUsers
    });

  } catch (error) {
    console.error('Setup test data error:', error);
    return res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
}