-- Check and fix tracker_users issue
-- Run this to see what's happening and fix it

-- Step 1: Check what's in auth.users for your email
SELECT 'AUTH USER:' as type, id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com'  -- REPLACE WITH YOUR EMAIL
UNION ALL
-- Step 2: Check what's in tracker_users for your email  
SELECT 'TRACKER USER:' as type, id::text, email, created_at::text, role
FROM tracker_users 
WHERE email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL

-- Step 3: If tracker_users is empty, create the record
-- Make sure to replace the email in both places below:

DELETE FROM tracker_users WHERE email = 'your-email@example.com';  -- REPLACE EMAIL

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
    split_part(au.email, '@', 1),
    'Club Administrator',
    'admin',
    ARRAY['*'],
    ARRAY['*'],
    true
FROM auth.users au
WHERE au.email = 'your-email@example.com'  -- REPLACE WITH YOUR EMAIL
AND au.email_confirmed_at IS NOT NULL;

-- Step 4: Verify both records exist and are linked
SELECT 
    'VERIFICATION:' as status,
    au.email as auth_email,
    au.id as auth_id,
    tu.email as tracker_email,
    tu.role,
    tu.is_active
FROM auth.users au
LEFT JOIN tracker_users tu ON au.id = tu.id
WHERE au.email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL