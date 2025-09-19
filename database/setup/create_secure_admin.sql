-- Create secure admin user for development
-- Run this in Supabase SQL Editor

-- First, create the admin user in tracker_users table
INSERT INTO tracker_users (
  id, 
  email, 
  username, 
  full_name, 
  role, 
  teams, 
  permissions, 
  is_active,
  created_at
) VALUES (
  gen_random_uuid(),
  'admin@rvr.ie',
  'admin',
  'Site Administrator',
  'admin',
  ARRAY['*'], -- Admin access to all teams
  ARRAY['*'], -- Admin has all permissions
  true,
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  teams = EXCLUDED.teams,
  permissions = EXCLUDED.permissions,
  is_active = true;

-- Then create auth user in Supabase dashboard with:
-- Email: admin@rvr.ie
-- Password: SecureAdminPass2025!

-- Enable Row Level Security for tracker_users
ALTER TABLE tracker_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users
CREATE POLICY "Users can view their own profile" ON tracker_users
FOR SELECT USING (auth.uid() = id);

-- Create RLS policy for admin users  
CREATE POLICY "Admins can view all profiles" ON tracker_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM tracker_users 
    WHERE id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

-- Display the created admin user
SELECT 
  id, email, username, full_name, role, teams, permissions, is_active, created_at
FROM tracker_users 
WHERE email = 'admin@rvr.ie';
