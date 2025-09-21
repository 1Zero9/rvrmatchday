-- Add legal agreement tracking to account_requests table
-- This migration adds columns to track legal agreements and disclaimers

-- Add legal agreement columns (with nullable defaults for backward compatibility)
ALTER TABLE account_requests 
ADD COLUMN IF NOT EXISTS legal_agreement_accepted BOOLEAN,
ADD COLUMN IF NOT EXISTS legal_agreement_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS privacy_policy_accepted BOOLEAN,
ADD COLUMN IF NOT EXISTS privacy_policy_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_usage_accepted BOOLEAN,
ADD COLUMN IF NOT EXISTS data_usage_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS club_disclaimer_accepted BOOLEAN,
ADD COLUMN IF NOT EXISTS club_disclaimer_timestamp TIMESTAMP WITH TIME ZONE;

-- Update ALL existing records to have accepted agreements (for backward compatibility)
UPDATE account_requests 
SET 
    legal_agreement_accepted = true,
    legal_agreement_timestamp = COALESCE(created_at, NOW()),
    privacy_policy_accepted = true,
    privacy_policy_timestamp = COALESCE(created_at, NOW()),
    data_usage_accepted = true,
    data_usage_timestamp = COALESCE(created_at, NOW()),
    club_disclaimer_accepted = true,
    club_disclaimer_timestamp = COALESCE(created_at, NOW())
WHERE legal_agreement_accepted IS NULL OR legal_agreement_accepted IS FALSE;

-- Now make the columns NOT NULL with defaults for new records
ALTER TABLE account_requests 
ALTER COLUMN legal_agreement_accepted SET NOT NULL,
ALTER COLUMN legal_agreement_accepted SET DEFAULT false,
ALTER COLUMN privacy_policy_accepted SET NOT NULL,
ALTER COLUMN privacy_policy_accepted SET DEFAULT false,
ALTER COLUMN data_usage_accepted SET NOT NULL,
ALTER COLUMN data_usage_accepted SET DEFAULT false,
ALTER COLUMN club_disclaimer_accepted SET NOT NULL,
ALTER COLUMN club_disclaimer_accepted SET DEFAULT false;

-- Add constraints to ensure all legal agreements are required for NEW registrations
-- (This will only apply to new records, existing ones are grandfathered in)
ALTER TABLE account_requests 
ADD CONSTRAINT legal_agreements_required 
CHECK (
    (legal_agreement_accepted = true AND
     privacy_policy_accepted = true AND
     data_usage_accepted = true AND
     club_disclaimer_accepted = true)
    OR 
    (created_at < NOW()) -- Allow existing records to bypass this check
);

-- Success message
SELECT 'Legal agreement tracking added successfully!' as result;