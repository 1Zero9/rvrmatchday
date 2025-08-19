-- ================================================
-- RIVERVALLEY RANGERS AFC - ADMIN ACCOUNT SETUP
-- SECURITY CRITICAL: Only run this manually from database console
-- ================================================

-- This script creates the first admin account in a secure way
-- INSTRUCTIONS:
-- 1. User must first register normally through the app
-- 2. Find their user_id from auth.users table
-- 3. Run this script to promote them to admin
-- 4. Never create admin accounts through the application

-- ================================================
-- STEP 1: Find the user you want to promote to admin
-- ================================================

-- Run this query to find the user_id of the person you want to make admin:
-- (Replace 'admin@rvrafc.ie' with the actual email address)

/*
SELECT 
    au.id as user_id,
    au.email,
    au.created_at as registered_at,
    au.confirmed_at,
    p.role as current_role,
    p.first_name,
    p.last_name
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.user_id 
WHERE au.email = 'admin@rvrafc.ie';
*/

-- ================================================
-- STEP 2: Promote user to admin (COPY AND MODIFY THE FOLLOWING)
-- ================================================

-- IMPORTANT: Replace 'USER_ID_HERE' with the actual user_id from step 1
-- IMPORTANT: Replace the email and names with actual values

/*
-- First ensure the user has a profile record (create if needed)
INSERT INTO profiles (user_id, email, role, first_name, last_name)
VALUES (
    'USER_ID_HERE', -- Replace with actual user_id
    'admin@rvrafc.ie', -- Replace with actual email
    'admin',
    'Admin', -- Replace with actual first name
    'User' -- Replace with actual last name
)
ON CONFLICT (user_id) 
DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

-- Log the admin creation for audit trail
INSERT INTO change_log (
    table_name,
    record_id,
    action,
    changed_by,
    change_summary,
    new_values
) VALUES (
    'profiles',
    (SELECT id FROM profiles WHERE user_id = 'USER_ID_HERE'), -- Replace with actual user_id
    'UPDATE',
    'USER_ID_HERE', -- Replace with actual user_id  
    'MANUAL ADMIN PROMOTION: First admin account created via database',
    jsonb_build_object(
        'role', 'admin',
        'promoted_by', 'database_admin',
        'promotion_method', 'manual_sql',
        'security_level', 'maximum',
        'timestamp', NOW()
    )
);
*/

-- ================================================
-- STEP 3: Verify admin creation
-- ================================================

-- Run this to verify the admin was created successfully:
/*
SELECT 
    p.id,
    p.email,
    p.role,
    p.first_name,
    p.last_name,
    p.created_at,
    p.updated_at,
    au.confirmed_at
FROM profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE p.role = 'admin';
*/

-- ================================================
-- EXAMPLE COMPLETE SCRIPT (TEMPLATE)
-- ================================================
-- Once you have the user_id, here's the complete script:

/*
-- Example for user ID: '12345678-1234-1234-1234-123456789012'
-- Email: 'stephen@rvrafc.ie'

-- Create/Update profile to admin
INSERT INTO profiles (user_id, email, role, first_name, last_name)
VALUES (
    '12345678-1234-1234-1234-123456789012',
    'stephen@rvrafc.ie',
    'admin',
    'Stephen',
    'Cranfield'
)
ON CONFLICT (user_id) 
DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

-- Log the creation
INSERT INTO change_log (
    table_name,
    record_id,
    action,
    changed_by,
    change_summary,
    new_values
) VALUES (
    'profiles',
    (SELECT id FROM profiles WHERE user_id = '12345678-1234-1234-1234-123456789012'),
    'UPDATE',
    '12345678-1234-1234-1234-123456789012',
    'MANUAL ADMIN PROMOTION: First admin account created via database',
    jsonb_build_object(
        'role', 'admin',
        'promoted_by', 'database_admin',
        'promotion_method', 'manual_sql',
        'security_level', 'maximum',
        'timestamp', NOW()
    )
);
*/

-- ================================================
-- SECURITY NOTES
-- ================================================

-- 1. NEVER expose this file in version control with real credentials
-- 2. Only run from secure database console with proper authentication
-- 3. Always verify the user exists and is legitimate before promoting
-- 4. Keep a backup before running any admin promotions
-- 5. Monitor the change_log table for all admin activities
-- 6. Consider IP restrictions for database access
-- 7. Use strong passwords and 2FA for database access

-- ================================================
-- SUBSEQUENT ADMIN CREATION
-- ================================================

-- After the first admin is created, use the web interface to:
-- 1. Login as admin
-- 2. Go to /admin/users
-- 3. Find existing users and change their roles
-- 4. This provides better audit trails and is safer

-- Only use direct database access for:
-- - First admin creation
-- - Emergency access recovery
-- - System maintenance