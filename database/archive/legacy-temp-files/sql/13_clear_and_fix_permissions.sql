-- Clear demo data and fix write permissions
-- Run this in Supabase SQL Editor to enable writes

-- 1. Clear demo data from match tracking tables (keep auth tables intact)
DELETE FROM match_events;
DELETE FROM matches;
DELETE FROM players;
DELETE FROM teams;

-- 2. Drop restrictive RLS policies
DROP POLICY IF EXISTS "Public can view teams" ON teams;
DROP POLICY IF EXISTS "Authenticated can manage teams" ON teams;
DROP POLICY IF EXISTS "Public can view players" ON players;
DROP POLICY IF EXISTS "Authenticated can manage players" ON players;
DROP POLICY IF EXISTS "Public can view matches" ON matches;
DROP POLICY IF EXISTS "Authenticated can manage matches" ON matches;
DROP POLICY IF EXISTS "Public can view match events" ON match_events;
DROP POLICY IF EXISTS "Authenticated can manage match events" ON match_events;

-- 3. Create permissive policies for development/demo
-- Allow all operations for now (tighten security later)
CREATE POLICY "Allow all for teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for matches" ON matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for match_events" ON match_events FOR ALL USING (true) WITH CHECK (true);

-- 4. Verify RLS is enabled but permissive
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;