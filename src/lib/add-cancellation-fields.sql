-- Add cancellation and postponement fields to matches table
-- Run this SQL in your Supabase SQL Editor

-- Add cancellation reason field
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Add postponed to date field  
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS postponed_to_date TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN matches.cancellation_reason IS 'Reason for match cancellation or postponement';
COMMENT ON COLUMN matches.postponed_to_date IS 'New date/time when match is postponed';

-- Create index for querying cancelled/postponed matches
CREATE INDEX IF NOT EXISTS idx_matches_cancellation ON matches(status, cancellation_reason) 
WHERE status IN ('Cancelled', 'Postponed');

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'matches' 
AND column_name IN ('cancellation_reason', 'postponed_to_date')
ORDER BY ordinal_position;