-- Quick Database Fix for Account Requests
-- Run this in Supabase SQL Editor to fix the submission error

-- 1. First, let's see what constraints exist
-- SELECT constraint_name, constraint_type FROM information_schema.table_constraints WHERE table_name = 'account_requests';

-- 2. Drop the existing role constraint if it exists
ALTER TABLE account_requests 
DROP CONSTRAINT IF EXISTS account_requests_requested_role_check;

-- 3. Add updated constraint that includes admin and editor roles
ALTER TABLE account_requests 
ADD CONSTRAINT account_requests_requested_role_check 
CHECK (requested_role IN ('coach', 'manager', 'parent', 'volunteer', 'admin', 'editor'));

-- 4. Make phone field nullable for now (we can fix this later)
ALTER TABLE account_requests 
ALTER COLUMN phone DROP NOT NULL;

-- 5. Make reason field nullable (we'll remove it later)
ALTER TABLE account_requests 
ALTER COLUMN reason DROP NOT NULL;

-- 6. Verify the current structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'account_requests' 
ORDER BY ordinal_position;