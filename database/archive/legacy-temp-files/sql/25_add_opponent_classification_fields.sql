-- Migration 25: Add opponent classification fields to teams table
-- Date: 2024-12-11
-- Description: Add competition_level and primary_match_types fields for opponent team classification

-- Add competition level field for opponent teams
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS competition_level TEXT;

-- Add primary match types field for opponent teams (array of text values)
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS primary_match_types TEXT[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN teams.competition_level IS 'Competition level for opponent teams (e.g., Youth/Juvenile, Amateur, Semi-Professional, Professional, International)';
COMMENT ON COLUMN teams.primary_match_types IS 'Array of primary match types this opponent team typically plays (e.g., League, Cup, Friendly, Tournament, Playoff, Exhibition)';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_teams_competition_level ON teams(competition_level);
CREATE INDEX IF NOT EXISTS idx_teams_primary_match_types ON teams USING GIN(primary_match_types);

-- Verify the changes (optional - this will show you the new columns)
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'teams' 
AND column_name IN ('competition_level', 'primary_match_types')
ORDER BY column_name;

-- Test query to ensure the new fields work
-- SELECT id, name, is_opponent, competition_level, primary_match_types 
-- FROM teams 
-- WHERE is_opponent = true
-- LIMIT 5;