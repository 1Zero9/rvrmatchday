-- Migration Script for Match Tracker Database
-- Run this if you get "column does not exist" errors

-- First, check if tables exist and add missing columns
DO $$ 
BEGIN
    -- Add age_group column to teams if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'age_group') THEN
        ALTER TABLE teams ADD COLUMN age_group TEXT;
    END IF;
    
    -- Add other missing columns to teams
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'gender') THEN
        ALTER TABLE teams ADD COLUMN gender TEXT;
        ALTER TABLE teams ADD CONSTRAINT check_gender CHECK (gender IN ('Boys', 'Girls', 'Mixed', 'Male', 'Female'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'coach_ids') THEN
        ALTER TABLE teams ADD COLUMN coach_ids TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'assistant_coach_ids') THEN
        ALTER TABLE teams ADD COLUMN assistant_coach_ids TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'season') THEN
        ALTER TABLE teams ADD COLUMN season TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'league') THEN
        ALTER TABLE teams ADD COLUMN league TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'home_kit') THEN
        ALTER TABLE teams ADD COLUMN home_kit JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'away_kit') THEN
        ALTER TABLE teams ADD COLUMN away_kit JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'is_opponent') THEN
        ALTER TABLE teams ADD COLUMN is_opponent BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'home_venue') THEN
        ALTER TABLE teams ADD COLUMN home_venue TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'contact_email') THEN
        ALTER TABLE teams ADD COLUMN contact_email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'contact_phone') THEN
        ALTER TABLE teams ADD COLUMN contact_phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teams' AND column_name = 'notes') THEN
        ALTER TABLE teams ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Create indices if they don't exist
CREATE INDEX IF NOT EXISTS idx_teams_season ON teams(season);
CREATE INDEX IF NOT EXISTS idx_teams_age_group ON teams(age_group);

-- Run the rest of the original schema (for tables that don't exist yet)
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create players table
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
  role TEXT DEFAULT 'player' CHECK (role IN ('player', 'substitute', 'coach')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  opponent TEXT NOT NULL,
  match_type TEXT NOT NULL CHECK (match_type IN ('League', 'Cup', 'Friendly', 'Tournament')),
  is_home_match BOOLEAN NOT NULL,
  venue TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  actual_kick_off TIMESTAMPTZ,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Live', 'Finished', 'Cancelled', 'Postponed')),
  
  -- Match Officials
  referee TEXT,
  assistant_referees TEXT[] DEFAULT '{}',
  
  -- Weather & Conditions
  weather TEXT,
  temperature INTEGER,
  pitch_condition TEXT CHECK (pitch_condition IN ('Excellent', 'Good', 'Fair', 'Poor')),
  
  -- Result
  home_score INTEGER,
  away_score INTEGER,
  
  -- VEO Recording Integration
  veo_recording BOOLEAN DEFAULT false,
  veo_url TEXT,
  
  -- Additional Match Info
  player_of_the_match TEXT,
  yellow_cards TEXT,
  red_cards TEXT,
  attendance INTEGER,
  notes TEXT,
  
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create match_events table
CREATE TABLE IF NOT EXISTS match_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'Goal', 'YellowCard', 'RedCard', 'Substitution', 'Injury', 
    'CornerKick', 'FreeKick', 'PenaltyKick', 'OffsideCall', 'Foul', 'Shot', 'Save'
  )),
  minute INTEGER NOT NULL,
  additional_time INTEGER,
  half INTEGER NOT NULL CHECK (half IN (1, 2)),
  
  -- Event-specific data stored as JSONB
  event_data JSONB DEFAULT '{}',
  
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  recorded_by TEXT NOT NULL
);

-- Create match_stats table
CREATE TABLE IF NOT EXISTS match_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  
  -- Team Stats
  possession INTEGER,
  shots INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0,
  corners INTEGER DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  offsides INTEGER DEFAULT 0,
  
  -- Additional stats
  passes INTEGER,
  pass_accuracy INTEGER,
  crosses INTEGER,
  tackles INTEGER,
  
  -- Goalkeeper specific
  saves INTEGER,
  goals_conceded INTEGER,
  clean_sheet BOOLEAN DEFAULT false,
  
  -- Player ratings and MOTM
  player_ratings JSONB DEFAULT '{}',
  man_of_the_match UUID REFERENCES players(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create league_tables table
CREATE TABLE IF NOT EXISTS league_tables (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  league TEXT NOT NULL,
  season TEXT NOT NULL,
  age_group TEXT,
  standings JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(league, season, age_group)
);

-- Create remaining indices
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

-- Enable RLS (Row Level Security) on new tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_tables ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables (only if not exists)
DO $$
BEGIN
    -- Players policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'players' AND policyname = 'Allow read access to players') THEN
        CREATE POLICY "Allow read access to players" ON players FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'players' AND policyname = 'Admin can manage players') THEN
        CREATE POLICY "Admin can manage players" ON players FOR ALL USING (
          EXISTS (
            SELECT 1 FROM tracker_users 
            WHERE id = auth.uid() AND role = 'admin'
          )
        );
    END IF;

    -- Matches policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'matches' AND policyname = 'Allow read access to matches') THEN
        CREATE POLICY "Allow read access to matches" ON matches FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'matches' AND policyname = 'Admin can manage matches') THEN
        CREATE POLICY "Admin can manage matches" ON matches FOR ALL USING (
          EXISTS (
            SELECT 1 FROM tracker_users 
            WHERE id = auth.uid() AND role = 'admin'
          )
        );
    END IF;

    -- Match Events policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'match_events' AND policyname = 'Allow read access to match events') THEN
        CREATE POLICY "Allow read access to match events" ON match_events FOR SELECT USING (true);
    END IF;
    
    -- Match Stats policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'match_stats' AND policyname = 'Allow read access to match stats') THEN
        CREATE POLICY "Allow read access to match stats" ON match_stats FOR SELECT USING (true);
    END IF;
    
    -- League Tables policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'league_tables' AND policyname = 'Allow read access to league tables') THEN
        CREATE POLICY "Allow read access to league tables" ON league_tables FOR SELECT USING (true);
    END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_teams_updated_at') THEN
        CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_players_updated_at') THEN
        CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_matches_updated_at') THEN
        CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_match_stats_updated_at') THEN
        CREATE TRIGGER update_match_stats_updated_at BEFORE UPDATE ON match_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_league_tables_updated_at') THEN
        CREATE TRIGGER update_league_tables_updated_at BEFORE UPDATE ON league_tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;