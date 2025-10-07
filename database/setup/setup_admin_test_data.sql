-- Setup test data for admin user management system
-- This script adds missing columns and creates test users

-- Add missing columns to tracker_users table if they don't exist
BEGIN;

-- Check and add account_status column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'account_status') THEN
        ALTER TABLE tracker_users ADD COLUMN account_status VARCHAR(20) DEFAULT 'active' 
        CHECK (account_status IN ('active', 'inactive', 'suspended', 'locked', 'pending'));
    END IF;
END $$;

-- Check and add failed_login_attempts column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'failed_login_attempts') THEN
        ALTER TABLE tracker_users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
    END IF;
END $$;

-- Check and add account_locked_until column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'account_locked_until') THEN
        ALTER TABLE tracker_users ADD COLUMN account_locked_until TIMESTAMP;
    END IF;
END $$;

-- Check and add password_reset_required column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'password_reset_required') THEN
        ALTER TABLE tracker_users ADD COLUMN password_reset_required BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Check and add last_password_change column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'last_password_change') THEN
        ALTER TABLE tracker_users ADD COLUMN last_password_change TIMESTAMP;
    END IF;
END $$;

-- Check and add admin_notes column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'admin_notes') THEN
        ALTER TABLE tracker_users ADD COLUMN admin_notes TEXT;
    END IF;
END $$;

-- Check and add last_activity column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'last_activity') THEN
        ALTER TABLE tracker_users ADD COLUMN last_activity TIMESTAMP;
    END IF;
END $$;

-- Update existing users to have default values
UPDATE tracker_users 
SET 
    account_status = COALESCE(account_status, 'active'),
    failed_login_attempts = COALESCE(failed_login_attempts, 0),
    password_reset_required = COALESCE(password_reset_required, FALSE)
WHERE account_status IS NULL 
   OR failed_login_attempts IS NULL 
   OR password_reset_required IS NULL;

-- Create some test users for the admin interface (if they don't exist)
INSERT INTO tracker_users (
    id, email, username, full_name, role, permissions, teams, is_active, account_status, created_at
) VALUES 
(
    'admin-test-001', 
    'admin@rvrfc.ie', 
    'admin', 
    'Site Administrator', 
    'admin', 
    ARRAY['all'], 
    ARRAY['all teams'], 
    true, 
    'active', 
    NOW()
),
(
    'coach-test-001', 
    'coach1@rvrfc.ie', 
    'coach1', 
    'John Smith', 
    'coach', 
    ARRAY['view_teams', 'edit_matches', 'view_players'], 
    ARRAY['U12 Boys'], 
    true, 
    'active', 
    NOW()
),
(
    'parent-test-001', 
    'parent1@email.com', 
    'parent1', 
    'Mary Johnson', 
    'parent', 
    ARRAY['view_basic'], 
    ARRAY['U10 Girls'], 
    true, 
    'active', 
    NOW()
),
(
    'inactive-test-001', 
    'inactive@email.com', 
    'inactive', 
    'Bob Wilson', 
    'volunteer', 
    ARRAY['view_basic'], 
    ARRAY[], 
    false, 
    'inactive', 
    NOW()
),
(
    'locked-test-001', 
    'locked@email.com', 
    'locked', 
    'Alice Brown', 
    'parent', 
    ARRAY['view_basic'], 
    ARRAY['U8 Boys'], 
    true, 
    'locked', 
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Update one user to have failed login attempts
UPDATE tracker_users 
SET failed_login_attempts = 3, admin_notes = 'Test user with failed login attempts'
WHERE id = 'locked-test-001';

-- Update one user to require password reset
UPDATE tracker_users 
SET password_reset_required = true, admin_notes = 'Test user requiring password reset'
WHERE id = 'coach-test-001';

COMMIT;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Admin test data setup completed successfully!';
    RAISE NOTICE 'Added missing columns to tracker_users table';
    RAISE NOTICE 'Created 5 test users for admin interface testing';
END $$;