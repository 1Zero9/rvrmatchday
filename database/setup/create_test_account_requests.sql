-- Create test account requests for testing the admin account review functionality
-- Run this in Supabase SQL Editor

-- First ensure the account_requests table exists
CREATE TABLE IF NOT EXISTS account_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    requested_role VARCHAR(20) NOT NULL CHECK (requested_role IN ('coach', 'manager', 'editor', 'admin')),
    team_interest TEXT[],
    experience TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Admin can view all account requests" ON account_requests;
CREATE POLICY "Admin can view all account requests" ON account_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tracker_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert test account requests
INSERT INTO account_requests (
    email, first_name, last_name, phone, requested_role, team_interest, experience, status
) VALUES 
(
    'newcoach@example.com',
    'John',
    'Smith',
    '+353-87-123-4567',
    'coach',
    ARRAY['U12 Boys', 'U14 Boys'],
    'Former professional player with 5 years coaching experience at youth level',
    'pending'
),
(
    'teammanager@example.com',
    'Sarah',
    'Jones',
    '+353-85-987-6543',
    'manager',
    ARRAY['U16 Girls'],
    'Parent volunteer, excellent organizational skills, managed school sports teams',
    'pending'
),
(
    'content.editor@example.com',
    'David',
    'Murphy',
    '+353-85-444-5555',
    'editor',
    ARRAY[],
    'Sports journalist, experienced in content creation and social media management',
    'pending'
),
-- Add some already reviewed examples
(
    'approved.user@example.com',
    'Lisa',
    'Walsh',
    '+353-86-222-3333',
    'coach',
    ARRAY['U8 Girls'],
    'UEFA B License holder, 3 years experience',
    'approved'
),
(
    'denied.user@example.com',
    'Tom',
    'Brown',
    '+353-87-111-2222',
    'manager',
    ARRAY['Senior Team'],
    'No relevant experience provided',
    'denied'
);

-- Update reviewed accounts with timestamps and notes
UPDATE account_requests 
SET 
    reviewed_at = NOW() - INTERVAL '2 days',
    reviewer_notes = 'Great credentials and experience. Welcome to the team!'
WHERE email = 'approved.user@example.com';

UPDATE account_requests 
SET 
    reviewed_at = NOW() - INTERVAL '1 day',
    reviewer_notes = 'Insufficient experience for senior team management role.'
WHERE email = 'denied.user@example.com';

-- Verify the test data
SELECT 
    email, 
    first_name, 
    last_name, 
    requested_role, 
    status, 
    requested_at,
    array_length(team_interest, 1) as team_count
FROM account_requests 
ORDER BY status, requested_at DESC;

-- Success message
SELECT 'Test account requests created successfully!' as result;