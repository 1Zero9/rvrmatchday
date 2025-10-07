-- Debug: Check what data exists in production database

-- Count records in each table
SELECT 'teams' as table_name, COUNT(*) as record_count FROM teams
UNION ALL
SELECT 'players' as table_name, COUNT(*) as record_count FROM players  
UNION ALL
SELECT 'matches' as table_name, COUNT(*) as record_count FROM matches
UNION ALL
SELECT 'match_events' as table_name, COUNT(*) as record_count FROM match_events;

-- Show sample teams data
SELECT id, name, season, home_colors, away_colors, is_active 
FROM teams 
WHERE is_active = true 
LIMIT 5;

-- Show sample matches data
SELECT id, team_id, match_date, home_away, status, our_score, their_score
FROM matches 
ORDER BY match_date DESC 
LIMIT 5;

-- Show sample match events
SELECT id, match_id, event_type, event_minute, event_half, is_our_team
FROM match_events 
ORDER BY created_at DESC 
LIMIT 5;