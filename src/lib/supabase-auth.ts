/**
 * Supabase Authentication for Match Tracker
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Supabase integration for match tracker user authentication and management.
 */

import { supabase } from './supabase';
import { logChange } from './changeLog';

export interface SupabaseTrackerUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'coach' | 'manager' | 'parent' | 'player';
  teams: string[];
  permissions: string[];
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_active: boolean;
}

export interface AuthSession {
  user: SupabaseTrackerUser;
  session: any;
  expiresAt: number;
}

/**
 * Initialize user tables in Supabase if they don't exist
 */
export async function initializeUserTables() {
  try {
    // Check if tracker_users table exists
    const { data: existingUsers, error: userCheckError } = await supabase
      .from('tracker_users')
      .select('id')
      .limit(1);

    if (userCheckError && userCheckError.code === 'PGRST116') {
      console.log('Creating tracker_users table...');
      // Table doesn't exist, we'll need to create it via SQL
      // This would typically be done through Supabase dashboard or migrations
    }

    return true;
  } catch (error) {
    console.error('Error initializing user tables:', error);
    return false;
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthSession | null> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      console.error('Authentication failed:', authError);
      return null;
    }

    // Get user profile from tracker_users table
    const { data: userData, error: userError } = await supabase
      .from('tracker_users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      console.error('User profile not found:', userError);
      return null;
    }

    // Update last login
    await supabase
      .from('tracker_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id);

    // Log authentication
    await logChange({
      table_name: 'tracker_users',
      record_id: authData.user.id,
      action: 'UPDATE',
      change_summary: 'User login',
      new_values: { last_login: new Date().toISOString() }
    });

    return {
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        full_name: userData.full_name,
        role: userData.role,
        teams: userData.teams || [],
        permissions: userData.permissions || [],
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        last_login: userData.last_login,
        is_active: userData.is_active
      },
      session: authData.session,
      expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return null;
  }
}

/**
 * Sign up new user
 */
export async function signUpUser(
  email: string, 
  password: string, 
  userData: Partial<SupabaseTrackerUser>
): Promise<SupabaseTrackerUser | null> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError || !authData.user) {
      console.error('Sign up failed:', authError);
      return null;
    }

    // Create user profile
    const userProfile = {
      id: authData.user.id,
      email: authData.user.email!,
      username: userData.username || email.split('@')[0],
      full_name: userData.full_name || '',
      role: userData.role || 'parent',
      teams: userData.teams || [],
      permissions: userData.permissions || ['view_matches'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: profileData, error: profileError } = await supabase
      .from('tracker_users')
      .insert(userProfile)
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      return null;
    }

    // Log user creation
    await logChange({
      table_name: 'tracker_users',
      record_id: authData.user.id,
      action: 'INSERT',
      change_summary: 'New user registered',
      new_values: userProfile
    });

    return profileData;
  } catch (error) {
    console.error('Sign up error:', error);
    return null;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<SupabaseTrackerUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data: userData, error: userError } = await supabase
      .from('tracker_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      console.error('User profile not found:', userError);
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<SupabaseTrackerUser>
): Promise<SupabaseTrackerUser | null> {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data: userData, error: updateError } = await supabase
      .from('tracker_users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update failed:', updateError);
      return null;
    }

    // Log profile update
    await logChange({
      table_name: 'tracker_users',
      record_id: userId,
      action: 'UPDATE',
      change_summary: 'User profile updated',
      new_values: updateData
    });

    return userData;
  } catch (error) {
    console.error('Update profile error:', error);
    return null;
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Log sign out
      await logChange({
        table_name: 'tracker_users',
        record_id: user.id,
        action: 'UPDATE',
        change_summary: 'User logout'
      });
    }

    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

/**
 * Check user permissions
 */
export function hasPermission(user: SupabaseTrackerUser | null, permission: string): boolean {
  if (!user || !user.is_active) return false;
  
  // Admin has all permissions
  if (user.role === 'admin' || user.permissions.includes('*')) {
    return true;
  }
  
  return user.permissions.includes(permission);
}

/**
 * Check team access
 */
export function canAccessTeam(user: SupabaseTrackerUser | null, teamId: string): boolean {
  if (!user || !user.is_active) return false;
  
  // Admin or users with all teams access
  if (user.role === 'admin' || user.teams.includes('*')) {
    return true;
  }
  
  return user.teams.includes(teamId);
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<SupabaseTrackerUser[]> {
  try {
    const { data: users, error } = await supabase
      .from('tracker_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get users error:', error);
      return [];
    }

    return users || [];
  } catch (error) {
    console.error('Get all users error:', error);
    return [];
  }
}

/**
 * Create demo users for development
 */
export async function createDemoUsers(): Promise<void> {
  try {
    const demoUsers = [
      {
        email: 'admin@rvrfc.com',
        password: 'admin123',
        username: 'admin',
        full_name: 'Club Administrator',
        role: 'admin' as const,
        teams: ['*'],
        permissions: ['*']
      },
      {
        email: 'coach@rvrfc.com',
        password: 'coach123',
        username: 'coach',
        full_name: 'Head Coach',
        role: 'coach' as const,
        teams: ['u16-boys', 'u18-boys'],
        permissions: ['view_matches', 'create_matches', 'record_events', 'manage_teams']
      },
      {
        email: 'manager@rvrfc.com',
        password: 'manager123',
        username: 'manager',
        full_name: 'Team Manager',
        role: 'manager' as const,
        teams: ['u14-girls', 'u16-girls'],
        permissions: ['view_matches', 'create_matches', 'record_events']
      },
      {
        email: 'parent@rvrfc.com',
        password: 'parent123',
        username: 'parent',
        full_name: 'Parent User',
        role: 'parent' as const,
        teams: ['u12-boys'],
        permissions: ['view_matches', 'view_stats']
      }
    ];

    for (const user of demoUsers) {
      const { password, ...userData } = user;
      await signUpUser(user.email, password, userData);
    }

    console.log('Demo users created successfully');
  } catch (error) {
    console.error('Create demo users error:', error);
  }
}

/**
 * SQL to create required tables (run this in Supabase SQL editor)
 */
export const CREATE_TABLES_SQL = `
-- Create tracker_users table
CREATE TABLE IF NOT EXISTS tracker_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'coach', 'manager', 'parent', 'player')),
  teams TEXT[] DEFAULT '{}',
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create RLS policies
ALTER TABLE tracker_users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON tracker_users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON tracker_users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON tracker_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" ON tracker_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tracker_users_updated_at 
  BEFORE UPDATE ON tracker_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;