-- Create reference tables (simple version)
-- Works with existing or new database

-- 1. Player Positions (create new table)
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

-- 2. Age Groups (create new table)
CREATE TABLE IF NOT EXISTS age_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO age_groups (name) VALUES
('U6'), ('U7'), ('U8'), ('U9'), ('U10'), ('U11'), ('U12'), ('U13'), ('U14'), ('U15'), ('U16'), ('U17'), ('U18'), ('Senior')
ON CONFLICT (name) DO NOTHING;

-- 3. Use existing leagues table or create simple one
DO $$ 
BEGIN
  -- Check if leagues table exists and has our expected structure
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leagues') THEN
    CREATE TABLE leagues (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    INSERT INTO leagues (name) VALUES
    ('Cork Schoolboys League'),
    ('Munster Junior Cup'),
    ('Cork County Cup'),
    ('Friendly'),
    ('Tournament');
  END IF;
END $$;

-- 4. Use existing venues table or create simple one  
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'venues') THEN
    CREATE TABLE venues (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      address TEXT,
      is_home_venue BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    INSERT INTO venues (name, address, is_home_venue) VALUES
    ('Riverstown Park', 'Riverstown, Glanmire, Cork', true),
    ('Mayfield United FC', 'Mayfield, Cork', false),
    ('CIT Grounds', 'Cork Institute of Technology', false);
  END IF;
END $$;

-- 5. Enable RLS on new reference tables
ALTER TABLE player_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_groups ENABLE ROW LEVEL SECURITY;

-- 6. Create permissive policies 
CREATE POLICY "Allow all for player_positions" ON player_positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for age_groups" ON age_groups FOR ALL USING (true) WITH CHECK (true);