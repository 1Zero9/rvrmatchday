-- Fix infinite recursion in RLS policies
-- Drop all existing policies and recreate with simpler logic

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON tracker_users;
DROP POLICY IF EXISTS "Users can update own profile" ON tracker_users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON tracker_users;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON tracker_users;

-- Temporarily disable RLS to fix the recursion
ALTER TABLE tracker_users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE tracker_users ENABLE ROW LEVEL SECURITY;

-- Create simpler policies without recursion
CREATE POLICY "Users can view own profile" ON tracker_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON tracker_users
  FOR UPDATE USING (auth.uid() = id);

-- Simple admin policy using service role or bypassing for now
CREATE POLICY "Service role can manage all" ON tracker_users
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read (temporary for debugging)
CREATE POLICY "Authenticated users can read" ON tracker_users
  FOR SELECT USING (auth.role() = 'authenticated');