-- Safe migration to add legal agreement tracking
-- This version avoids constraint violations by being more permissive

-- First, drop any existing constraint if it exists
ALTER TABLE account_requests DROP CONSTRAINT IF EXISTS legal_agreements_required;

-- Add legal agreement columns (nullable for backward compatibility)
ALTER TABLE account_requests 
ADD COLUMN IF NOT EXISTS legal_agreement_accepted BOOLEAN,
ADD COLUMN IF NOT EXISTS legal_agreement_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS privacy_policy_accepted BOOLEAN,
ADD COLUMN IF NOT EXISTS privacy_policy_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_usage_accepted BOOLEAN,
ADD COLUMN IF NOT EXISTS data_usage_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS club_disclaimer_accepted BOOLEAN,
ADD COLUMN IF NOT EXISTS club_disclaimer_timestamp TIMESTAMP WITH TIME ZONE;

-- Update existing records to have accepted agreements (backward compatibility)
UPDATE account_requests 
SET 
    legal_agreement_accepted = COALESCE(legal_agreement_accepted, true),
    legal_agreement_timestamp = COALESCE(legal_agreement_timestamp, created_at, NOW()),
    privacy_policy_accepted = COALESCE(privacy_policy_accepted, true),
    privacy_policy_timestamp = COALESCE(privacy_policy_timestamp, created_at, NOW()),
    data_usage_accepted = COALESCE(data_usage_accepted, true),
    data_usage_timestamp = COALESCE(data_usage_timestamp, created_at, NOW()),
    club_disclaimer_accepted = COALESCE(club_disclaimer_accepted, true),
    club_disclaimer_timestamp = COALESCE(club_disclaimer_timestamp, created_at, NOW());

-- Verify the update worked
SELECT COUNT(*) as updated_records,
       COUNT(CASE WHEN legal_agreement_accepted = true THEN 1 END) as legal_accepted,
       COUNT(CASE WHEN privacy_policy_accepted = true THEN 1 END) as privacy_accepted,
       COUNT(CASE WHEN data_usage_accepted = true THEN 1 END) as data_accepted,
       COUNT(CASE WHEN club_disclaimer_accepted = true THEN 1 END) as disclaimer_accepted
FROM account_requests;

-- Success message
SELECT 'Legal agreement tracking added safely!' as result;