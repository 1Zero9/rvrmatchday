-- Create reference tables (safe version - handles existing policies)

-- 1. Player Positions
CREATE TABLE IF NOT EXISTS player_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO player_positions (name) VALUES
('Goalkeeper'),
('Defender'),
('Midfielder'),
('Forward')
ON CONFLICT (name) DO NOTHING;

-- 2. Age Groups
CREATE TABLE IF NOT EXISTS age_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO age_groups (name) VALUES
('U6'), ('U7'), ('U8'), ('U9'), ('U10'), ('U11'), ('U12'), ('U13'), ('U14'), ('U15'), ('U16'), ('U17'), ('U18'), ('Senior')
ON CONFLICT (name) DO NOTHING;

-- 3. Enable RLS (if not already enabled)
ALTER TABLE player_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_groups ENABLE ROW LEVEL SECURITY;

-- 4. Drop and recreate policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all for player_positions" ON player_positions;
DROP POLICY IF EXISTS "Allow all for age_groups" ON age_groups;

CREATE POLICY "Allow all for player_positions" ON player_positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for age_groups" ON age_groups FOR ALL USING (true) WITH CHECK (true);