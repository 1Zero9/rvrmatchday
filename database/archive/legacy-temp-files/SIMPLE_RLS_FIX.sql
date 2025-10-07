-- Simple RLS Fix for Account Requests
-- Run this in Supabase SQL Editor

-- Drop all existing policies on account_requests
DROP POLICY IF EXISTS "Anyone can submit account requests" ON account_requests;
DROP POLICY IF EXISTS "Public can insert account requests" ON account_requests;
DROP POLICY IF EXISTS "Allow public account requests" ON account_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON account_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON account_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON account_requests;

-- Create simple policy to allow anyone to insert account requests
CREATE POLICY "public_insert_account_requests" ON account_requests
  FOR INSERT 
  WITH CHECK (true);

-- Create simple policy to allow admins to view all requests
CREATE POLICY "admin_view_account_requests" ON account_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Create simple policy to allow admins to update requests
CREATE POLICY "admin_update_account_requests" ON account_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Ensure RLS is enabled
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;

-- Verify policies
SELECT policyname, cmd, permissive, with_check, qual 
FROM pg_policies 
WHERE tablename = 'account_requests';

-- Test insert permission (this should work after the above)
-- INSERT INTO account_requests (email, first_name, last_name, phone, requested_role, team_interest, status) 
-- VALUES ('test@example.com', 'Test', 'User', '+353123456789', 'parent', ARRAY['U10 Boys'], 'pending');