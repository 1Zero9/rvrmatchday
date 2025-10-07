-- Create reference tables for dropdowns
-- This makes forms dynamic and allows easy updates

-- 1. Player Positions
CREATE TABLE IF NOT EXISTS player_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default positions
INSERT INTO player_positions (name, display_order) VALUES
('Goalkeeper', 1),
('Defender', 2),
('Midfielder', 3),
('Forward', 4)
ON CONFLICT (name) DO NOTHING;

-- 2. Age Groups  
CREATE TABLE IF NOT EXISTS age_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert common age groups
INSERT INTO age_groups (name, display_order) VALUES
('U6', 1),
('U7', 2),
('U8', 3),
('U9', 4),
('U10', 5),
('U11', 6),
('U12', 7),
('U13', 8),
('U14', 9),
('U15', 10),
('U16', 11),
('U17', 12),
('U18', 13),
('Senior', 14)
ON CONFLICT (name) DO NOTHING;

-- 3. Leagues/Competitions
CREATE TABLE IF NOT EXISTS leagues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert common leagues
INSERT INTO leagues (name, display_order) VALUES
('Cork Schoolboys League', 1),
('Munster Junior Cup', 2),
('Cork County Cup', 3),
('Friendly', 4),
('Tournament', 5)
ON CONFLICT (name) DO NOTHING;

-- 4. Match Types
CREATE TABLE IF NOT EXISTS match_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert match types
INSERT INTO match_types (name, display_order) VALUES
('League', 1),
('Cup', 2),
('Friendly', 3),
('Tournament', 4),
('Training Match', 5)
ON CONFLICT (name) DO NOTHING;

-- 5. Venues
CREATE TABLE IF NOT EXISTS venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  address TEXT,
  is_home_venue BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert common venues
INSERT INTO venues (name, address, is_home_venue) VALUES
('Riverstown Park', 'Riverstown, Glanmire, Cork', true),
('Mayfield United FC', 'Mayfield, Cork', false),
('CIT Grounds', 'Cork Institute of Technology', false)
ON CONFLICT (name) DO NOTHING;

-- 6. Enable RLS on reference tables
ALTER TABLE player_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- 7. Create permissive policies for reference tables
CREATE POLICY "Allow all for player_positions" ON player_positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for age_groups" ON age_groups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for leagues" ON leagues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for match_types" ON match_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for venues" ON venues FOR ALL USING (true) WITH CHECK (true);