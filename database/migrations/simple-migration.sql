-- Simple Migration for Match Tracker
-- Run this to add missing columns to existing teams table

-- Add missing columns to teams table (ignore errors if columns already exist)
ALTER TABLE teams ADD COLUMN IF NOT EXISTS age_group TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS coach_ids TEXT[] DEFAULT '{}';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS assistant_coach_ids TEXT[] DEFAULT '{}';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS season TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS league TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS home_kit JSONB DEFAULT '{}';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS away_kit JSONB DEFAULT '{}';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS is_opponent BOOLEAN DEFAULT false;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS home_venue TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS notes TEXT;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Now run the original schema for new tables
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  jersey_number INTEGER,
  position TEXT,
  date_of_birth DATE,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  role TEXT DEFAULT 'player',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  opponent TEXT NOT NULL,
  match_type TEXT NOT NULL,
  is_home_match BOOLEAN NOT NULL,
  venue TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  actual_kick_off TIMESTAMPTZ,
  status TEXT DEFAULT 'Scheduled',
  referee TEXT,
  assistant_referees TEXT[] DEFAULT '{}',
  weather TEXT,
  temperature INTEGER,
  pitch_condition TEXT,
  home_score INTEGER,
  away_score INTEGER,
  veo_recording BOOLEAN DEFAULT false,
  veo_url TEXT,
  player_of_the_match TEXT,
  yellow_cards TEXT,
  red_cards TEXT,
  attendance INTEGER,
  notes TEXT,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  minute INTEGER NOT NULL,
  additional_time INTEGER,
  half INTEGER NOT NULL,
  event_data JSONB DEFAULT '{}',
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  recorded_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS match_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  possession INTEGER,
  shots INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0,
  corners INTEGER DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  offsides INTEGER DEFAULT 0,
  passes INTEGER,
  pass_accuracy INTEGER,
  crosses INTEGER,
  tackles INTEGER,
  saves INTEGER,
  goals_conceded INTEGER,
  clean_sheet BOOLEAN DEFAULT false,
  player_ratings JSONB DEFAULT '{}',
  man_of_the_match UUID REFERENCES players(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS league_tables (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  league TEXT NOT NULL,
  season TEXT NOT NULL,
  age_group TEXT,
  standings JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(league, season, age_group)
);

-- Create indices
CREATE INDEX IF NOT EXISTS idx_teams_season ON teams(season);
CREATE INDEX IF NOT EXISTS idx_teams_age_group ON teams(age_group);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_active ON players(is_active);
CREATE INDEX IF NOT EXISTS idx_matches_team_id ON matches(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_scheduled_date ON matches(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_match_events_match_id ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_match_events_player_id ON match_events(player_id);
CREATE INDEX IF NOT EXISTS idx_match_events_type ON match_events(event_type);
CREATE INDEX IF NOT EXISTS idx_match_stats_match_id ON match_stats(match_id);
CREATE INDEX IF NOT EXISTS idx_league_tables_season ON league_tables(season, league);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_tables ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow all for now, can be restricted later)
DROP POLICY IF EXISTS "Allow all access to teams" ON teams;
CREATE POLICY "Allow all access to teams" ON teams FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to players" ON players;
CREATE POLICY "Allow all access to players" ON players FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to matches" ON matches;
CREATE POLICY "Allow all access to matches" ON matches FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to match_events" ON match_events;
CREATE POLICY "Allow all access to match_events" ON match_events FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to match_stats" ON match_stats;
CREATE POLICY "Allow all access to match_stats" ON match_stats FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to league_tables" ON league_tables;
CREATE POLICY "Allow all access to league_tables" ON league_tables FOR ALL USING (true);

-- Create updated_at triggers
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

DROP TRIGGER IF EXISTS update_match_stats_updated_at ON match_stats;
CREATE TRIGGER update_match_stats_updated_at BEFORE UPDATE ON match_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_league_tables_updated_at ON league_tables;
CREATE TRIGGER update_league_tables_updated_at BEFORE UPDATE ON league_tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();