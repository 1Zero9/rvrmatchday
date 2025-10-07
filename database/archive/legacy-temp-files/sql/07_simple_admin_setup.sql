-- Simple admin setup without RLS recursion issues
-- Run this after fixing the policies

-- First, check if your auth user exists
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL

-- Create or update admin user (replace email first!)
INSERT INTO tracker_users (
    id,
    email,
    username,
    full_name,
    role,
    teams,
    permissions,
    is_active
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'your-email@example.com'),  -- REPLACE EMAIL
    'your-email@example.com',  -- REPLACE EMAIL
    'admin',
    'Club Administrator',
    'admin',
    ARRAY['*'],
    ARRAY['*'],
    true
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    teams = ARRAY['*'],
    permissions = ARRAY['*'],
    is_active = true,
    updated_at = NOW();

-- Verify it worked
SELECT email, role, permissions FROM tracker_users WHERE email = 'your-email@example.com';  -- REPLACE EMAIL