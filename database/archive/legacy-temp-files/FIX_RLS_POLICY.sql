-- Fix RLS Policy for Account Requests
-- Run this in Supabase SQL Editor to allow public account requests

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit account requests" ON account_requests;
DROP POLICY IF EXISTS "Public can insert account requests" ON account_requests;
DROP POLICY IF EXISTS "Allow public account requests" ON account_requests;

-- Create new policy to allow anyone to insert account requests
CREATE POLICY "Allow public account requests" ON account_requests
  FOR INSERT 
  WITH CHECK (true);

-- Keep existing admin policies
-- (These should already exist but let's ensure they're correct)

-- Allow admins to view all requests
DROP POLICY IF EXISTS "Admins can view all requests" ON account_requests;
CREATE POLICY "Admins can view all requests" ON account_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update requests
DROP POLICY IF EXISTS "Admins can update requests" ON account_requests;
CREATE POLICY "Admins can update requests" ON account_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow users to view their own requests (using email since they're not auth users yet)
DROP POLICY IF EXISTS "Users can view own requests" ON account_requests;
CREATE POLICY "Users can view own requests" ON account_requests
  FOR SELECT USING (
    email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Verify RLS is enabled
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'account_requests';