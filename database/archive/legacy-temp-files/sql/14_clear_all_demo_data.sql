-- Clear all demo data from Supabase (keep auth tables)
-- Run this to start fresh with your production data

-- 1. Clear match tracking data (in dependency order)
DELETE FROM match_events;
DELETE FROM matches;
DELETE FROM players;
DELETE FROM teams;

-- 2. Clear any other demo data tables (if they exist)
-- Keep auth tables: auth.users, auth.sessions, etc.

-- List what we're keeping (auth and system tables):
-- auth.users
-- auth.sessions  
-- auth.refresh_tokens
-- storage.objects
-- storage.buckets

-- 3. Verify tables are empty
SELECT 'teams' as table_name, COUNT(*) as row_count FROM teams
UNION ALL
SELECT 'players', COUNT(*) FROM players  
UNION ALL
SELECT 'matches', COUNT(*) FROM matches
UNION ALL
SELECT 'match_events', COUNT(*) FROM match_events;