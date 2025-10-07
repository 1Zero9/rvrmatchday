-- Migration to add opponent classification fields to teams table
-- RVR Football Club Match Tracking System
-- Run this SQL in your Supabase SQL Editor

-- Add competition level field for opponent teams
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS competition_level TEXT;

-- Add primary match types field for opponent teams (array of text values)
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS primary_match_types TEXT[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN teams.competition_level IS 'Competition level for opponent teams (e.g., Youth/Juvenile, Amateur, Semi-Professional, Professional, International)';
COMMENT ON COLUMN teams.primary_match_types IS 'Array of primary match types this opponent team typically plays (e.g., League, Cup, Friendly, Tournament, Playoff, Exhibition)';

-- Create index for better query performance on competition level
CREATE INDEX IF NOT EXISTS idx_teams_competition_level ON teams(competition_level);

-- Create index for better query performance on primary match types using GIN index for array operations
CREATE INDEX IF NOT EXISTS idx_teams_primary_match_types ON teams USING GIN(primary_match_types);

-- Update the updated_at timestamp for any existing records (optional)
-- UPDATE teams SET updated_at = NOW() WHERE competition_level IS NULL OR primary_match_types = '{}';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'teams' 
AND column_name IN ('competition_level', 'primary_match_types')
ORDER BY column_name;