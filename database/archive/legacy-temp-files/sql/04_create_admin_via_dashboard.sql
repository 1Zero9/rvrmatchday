-- Create admin user with email confirmation bypassed
-- Run this AFTER creating the user via Supabase Dashboard

-- Step 1: In Supabase Dashboard → Authentication → Users
-- Click "Add User" and set:
-- - Email: your-email@example.com
-- - Password: your-secure-password  
-- - Email Confirm: CHECK THIS BOX (important!)

-- Step 2: Run this SQL after the user is created
INSERT INTO tracker_users (
    id,
    email, 
    username,
    full_name,
    role,
    teams,
    permissions,
    is_active
) 
SELECT 
    id,
    email,
    split_part(email, '@', 1) as username,
    'Club Administrator',
    'admin',
    ARRAY['*'],
    ARRAY['*'], 
    true
FROM auth.users 
WHERE email = 'your-email@example.com'  -- REPLACE WITH YOUR EMAIL
AND email_confirmed_at IS NOT NULL  -- Only confirmed users
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    teams = ARRAY['*'],
    permissions = ARRAY['*'],
    is_active = true,
    updated_at = NOW();