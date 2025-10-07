-- Simple check and fix - run each section separately

-- SECTION 1: Check auth.users (run this first)
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL

-- SECTION 2: Check tracker_users (run this second)  
SELECT id, email, role, is_active, created_at
FROM tracker_users 
WHERE email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL

-- SECTION 3: If Section 2 returned no rows, run this to create the profile
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
    au.id,
    au.email,
    'admin',
    'Club Administrator',
    'admin',
    ARRAY['*'],
    ARRAY['*'],
    true
FROM auth.users au
WHERE au.email = 'your-email@example.com'  -- REPLACE WITH YOUR EMAIL
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    teams = ARRAY['*'],
    permissions = ARRAY['*'],
    updated_at = NOW();