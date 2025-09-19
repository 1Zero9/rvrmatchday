-- Database Migration for Account Requests Form Updates
-- Run this in your Supabase SQL Editor

-- 1. Make phone field NOT NULL (it's currently nullable)
-- First, update any existing NULL phone values
UPDATE account_requests 
SET phone = 'Phone not provided' 
WHERE phone IS NULL;

-- Then alter the column to be NOT NULL
ALTER TABLE account_requests 
ALTER COLUMN phone SET NOT NULL;

-- 2. Drop the reason field (it's currently NOT NULL, so we need to remove it)
ALTER TABLE account_requests 
DROP COLUMN IF EXISTS reason;

-- 3. Drop the compliance fields
ALTER TABLE account_requests 
DROP COLUMN IF EXISTS garda_vetting;

ALTER TABLE account_requests 
DROP COLUMN IF EXISTS safeguarding_course;

-- 4. Make experience nullable (it should already be, but let's ensure it)
ALTER TABLE account_requests 
ALTER COLUMN experience DROP NOT NULL;

-- 5. Update the role check constraint to include admin and editor roles
ALTER TABLE account_requests 
DROP CONSTRAINT IF EXISTS account_requests_requested_role_check;

ALTER TABLE account_requests 
ADD CONSTRAINT account_requests_requested_role_check 
CHECK (requested_role IN ('coach', 'manager', 'parent', 'volunteer', 'admin', 'editor'));

-- 6. Verify the final schema
-- You can run this to see the current structure:
-- \d account_requests

-- Expected final schema:
-- account_requests (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   email TEXT NOT NULL,
--   first_name TEXT NOT NULL,
--   last_name TEXT NOT NULL,
--   phone TEXT NOT NULL,  -- NOW REQUIRED
--   requested_role TEXT NOT NULL CHECK (requested_role IN ('coach', 'manager', 'parent', 'volunteer')),
--   team_interest TEXT[] DEFAULT '{}',
--   experience TEXT,  -- OPTIONAL
--   status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
--   requested_at TIMESTAMPTZ DEFAULT NOW(),
--   reviewed_at TIMESTAMPTZ,
--   reviewer_notes TEXT,
--   reviewer_id UUID REFERENCES auth.users(id),
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );