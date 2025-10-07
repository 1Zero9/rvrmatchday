-- Link existing auth.users to tracker_users
-- This creates the missing tracker_users profile for your existing auth user

-- STEP 1: Check what users exist in auth.users
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- STEP 2: Replace 'your-email@example.com' with the email from Step 1 results
-- Then run this to create the tracker_users profile:

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
WHERE email = 'your-email@example.com'  -- REPLACE WITH YOUR ACTUAL EMAIL
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    teams = ARRAY['*'],
    permissions = ARRAY['*'],
    is_active = true,
    updated_at = NOW();

-- STEP 3: Verify the link worked
SELECT 
    au.email as auth_email,
    tu.email as tracker_email,
    tu.role,
    tu.permissions
FROM auth.users au
LEFT JOIN tracker_users tu ON au.id = tu.id
WHERE au.email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL