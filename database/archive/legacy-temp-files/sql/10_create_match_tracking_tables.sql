-- Complete Match Tracking Database Schema for Supabase Production
-- Run this to create all required tables for match tracking

-- 1. Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  season TEXT DEFAULT '2024-25',
  home_colors JSONB DEFAULT '{"primary": "#00A651", "secondary": "#FFFFFF"}',
  away_colors JSONB DEFAULT '{"primary": "#001F3F", "secondary": "#FFFFFF"}',
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  is_opponent BOOLEAN DEFAULT false,
  age_group TEXT,
  gender TEXT,
  league TEXT,
  home_venue TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  jersey_number INTEGER,
  position TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  opponent_team_id UUID REFERENCES teams(id),
  opponent TEXT NOT NULL,
  match_type TEXT DEFAULT 'League',
  is_home_match BOOLEAN DEFAULT true,
  venue TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  actual_kick_off TIMESTAMPTZ,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Live', 'Finished', 'Cancelled', 'Postponed')),
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  referee TEXT,
  weather TEXT,
  temperature INTEGER,
  pitch_condition TEXT DEFAULT 'Good',
  veo_recording BOOLEAN DEFAULT false,
  veo_url TEXT,
  player_of_match TEXT,
  yellow_cards TEXT,
  red_cards TEXT,
  attendance INTEGER,
  notes TEXT,
  selected_squad TEXT[], -- Player IDs who played
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  recorded_by TEXT DEFAULT 'system'
);

-- 4. Create match_events table
CREATE TABLE IF NOT EXISTS match_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  player_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_minute INTEGER NOT NULL,
  additional_time INTEGER DEFAULT 0,
  event_half INTEGER DEFAULT 1 CHECK (event_half IN (1, 2)),
  event_data JSONB DEFAULT '{}',
  notes TEXT,
  is_our_team BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT DEFAULT 'system'
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_active ON teams(is_active);
CREATE INDEX IF NOT EXISTS idx_teams_opponent ON teams(is_opponent);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_team ON matches(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_match_events_match ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_match_events_type ON match_events(event_type);

-- 6. Enable RLS (Row Level Security)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;

-- 7. Create simple RLS policies (public read, authenticated write)
CREATE POLICY "Public can view teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage teams" ON teams FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view players" ON players FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage players" ON players FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage matches" ON matches FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view match events" ON match_events FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage match events" ON match_events FOR ALL USING (auth.role() = 'authenticated');

-- 8. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();