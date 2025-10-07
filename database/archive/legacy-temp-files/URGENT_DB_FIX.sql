-- URGENT: Fix role constraint for admin/editor roles
-- Run this in Supabase SQL Editor immediately

-- Drop existing constraint
ALTER TABLE account_requests 
DROP CONSTRAINT IF EXISTS account_requests_requested_role_check;

-- Add new constraint with admin and editor roles
ALTER TABLE account_requests 
ADD CONSTRAINT account_requests_requested_role_check 
CHECK (requested_role IN ('coach', 'manager', 'parent', 'volunteer', 'admin', 'editor'));

-- Verify the constraint was added
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'account_requests_requested_role_check';