-- Bypass RLS for Account Requests (Temporary Fix)
-- Run this in Supabase SQL Editor

-- Option 1: Temporarily disable RLS on account_requests table
ALTER TABLE account_requests DISABLE ROW LEVEL SECURITY;

-- Check if RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'account_requests';

-- Option 2: If you want to keep RLS enabled, use this super simple policy instead:
-- (Comment out the DISABLE above and uncomment below)

/*
-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit account requests" ON account_requests;
DROP POLICY IF EXISTS "Public can insert account requests" ON account_requests;
DROP POLICY IF EXISTS "Allow public account requests" ON account_requests;
DROP POLICY IF EXISTS "public_insert_account_requests" ON account_requests;
DROP POLICY IF EXISTS "admin_view_account_requests" ON account_requests;
DROP POLICY IF EXISTS "admin_update_account_requests" ON account_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON account_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON account_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON account_requests;

-- Create the simplest possible policy - allow all operations
CREATE POLICY "allow_all_account_requests" ON account_requests
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;
*/

-- Test query to verify table access
SELECT COUNT(*) FROM account_requests;