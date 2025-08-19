-- ================================================
-- RIVERVALLEY RANGERS AFC - EXTENDED MATCHDAY TRACKER SCHEMA
-- Enhanced schema for comprehensive match tracking and team management
-- ================================================

-- COMPLETE CLEAN SLATE - Remove everything that might exist
-- NOTE: Some of these DROP statements may show "does not exist" errors - that's perfectly fine!

-- Drop triggers first (they depend on functions and tables)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_coaches_updated_at ON coaches;
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;

-- Drop functions (CASCADE will remove dependent triggers too)
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop all our tables with CASCADE to remove dependent objects
DROP TABLE IF EXISTS change_log CASCADE;
DROP TABLE IF EXISTS match_events CASCADE;
DROP TABLE IF EXISTS match_players CASCADE;
DROP TABLE IF EXISTS team_players CASCADE;
DROP TABLE IF EXISTS player_positions CASCADE;
DROP TABLE IF EXISTS team_coaches CASCADE;
DROP TABLE IF EXISTS coach_approvals CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS coaches CASCADE;
DROP TABLE IF EXISTS team_types CASCADE;
DROP TABLE IF EXISTS positions CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS opponents CASCADE;
DROP TABLE IF EXISTS leagues CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop any existing RLS policies (just in case)
-- Note: These will error if they don't exist, but that's okay

-- ================================================
-- REFERENCE DATA TABLES
-- ================================================

-- Position types (flexible for different age groups)
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    short_name VARCHAR(10) NOT NULL,
    category VARCHAR(20) NOT NULL, -- 'GK', 'DEF', 'MID', 'FWD'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team types and formats
CREATE TABLE team_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- 'Under 12 Boys', 'Senior Women', 'Walking Football'
    short_name VARCHAR(20) NOT NULL, -- 'U12B', 'SW', 'WF'
    age_group VARCHAR(20), -- 'U12', 'Senior', 'O35'
    gender VARCHAR(10), -- 'Boys', 'Girls', 'Men', 'Women', 'Mixed'
    players_on_pitch INTEGER NOT NULL DEFAULT 11, -- 5, 7, 9, 11
    squad_size_min INTEGER DEFAULT 12,
    squad_size_max INTEGER DEFAULT 25,
    official_tracking BOOLEAN DEFAULT true, -- false for promotional teams
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leagues and competitions
CREATE TABLE leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(20) NOT NULL,
    season VARCHAR(20) NOT NULL, -- '2024-25'
    division VARCHAR(50),
    external_league_id VARCHAR(100), -- for DDSL integration later
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues where matches are played
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_home_ground BOOLEAN DEFAULT false,
    facilities TEXT[], -- ['Changing rooms', 'Parking', 'Refreshments']
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opposition teams
CREATE TABLE opponents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(30),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    home_colors VARCHAR(100),
    away_colors VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- SYSTEM MANAGEMENT TABLES
-- ================================================

-- User profiles for role management
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member', -- 'admin', 'coach', 'member', 'parent'
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Change control log for admin tracking
CREATE TABLE change_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    old_values JSONB,
    new_values JSONB,
    change_summary TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- USER MANAGEMENT TABLES
-- ================================================

-- Coaches (linked to Supabase auth)
CREATE TABLE coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    coaching_qualifications TEXT[],
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    is_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    bio TEXT,
    profile_image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach approval workflow
CREATE TABLE coach_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players in the club
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    registration_number VARCHAR(50),
    parent_email VARCHAR(255),
    parent_phone VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_notes TEXT,
    preferred_position UUID REFERENCES positions(id),
    jersey_number INTEGER,
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TEAM STRUCTURE TABLES  
-- ================================================

-- Club teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(30) NOT NULL,
    team_type_id UUID REFERENCES team_types(id),
    league_id UUID REFERENCES leagues(id),
    season VARCHAR(20) NOT NULL DEFAULT '2024-25',
    home_colors VARCHAR(100),
    away_colors VARCHAR(100),
    is_public BOOLEAN DEFAULT true, -- false for private coach-only dashboards
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES coaches(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team coaches (many-to-many relationship)
CREATE TABLE team_coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'Coach', -- 'Head Coach', 'Assistant Coach', 'Coach'
    is_primary BOOLEAN DEFAULT false,
    appointed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, coach_id)
);

-- Team squad (many-to-many relationship)
CREATE TABLE team_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    jersey_number INTEGER,
    preferred_position UUID REFERENCES positions(id),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, player_id, is_active) -- prevent duplicate active players
);

-- ================================================
-- MATCH TRACKING TABLES
-- ================================================

-- Matches
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    opponent_id UUID REFERENCES opponents(id),
    venue_id UUID REFERENCES venues(id),
    league_id UUID REFERENCES leagues(id),
    
    match_date TIMESTAMPTZ NOT NULL,
    kick_off_time TIME,
    match_type VARCHAR(50) DEFAULT 'League', -- 'League', 'Cup', 'Friendly'
    home_away VARCHAR(10) NOT NULL CHECK (home_away IN ('Home', 'Away')),
    
    -- Match status and scores
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'live', 'finished', 'cancelled'
    our_score INTEGER DEFAULT 0,
    their_score INTEGER DEFAULT 0,
    
    -- Match details
    referee_name VARCHAR(100),
    weather_conditions VARCHAR(100),
    pitch_conditions VARCHAR(100),
    attendance INTEGER,
    
    -- Match notes and reports
    match_report TEXT,
    private_notes TEXT, -- coach-only notes
    
    -- Metadata
    created_by UUID REFERENCES coaches(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players selected for specific match
CREATE TABLE match_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    
    -- Starting lineup
    is_starter BOOLEAN DEFAULT false,
    starting_position UUID REFERENCES positions(id),
    jersey_number INTEGER,
    
    -- Substitution tracking
    substituted_on_at INTEGER, -- minute
    substituted_off_at INTEGER, -- minute
    
    -- Performance notes
    performance_rating INTEGER CHECK (performance_rating BETWEEN 1 AND 10),
    coach_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(match_id, player_id)
);

-- Match events (goals, cards, substitutions, etc.)
CREATE TABLE match_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id), -- NULL for opponent events
    
    event_type VARCHAR(20) NOT NULL, -- 'goal', 'assist', 'yellow_card', 'red_card', 'substitution_on', 'substitution_off', 'own_goal', 'penalty_save', 'injury'
    event_minute INTEGER NOT NULL,
    event_half INTEGER DEFAULT 1 CHECK (event_half IN (1, 2)), -- 1st half, 2nd half
    
    -- Event details
    description TEXT,
    is_our_team BOOLEAN DEFAULT true, -- false for opponent events
    
    -- Related events (e.g., assist linked to goal)
    related_event_id UUID REFERENCES match_events(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES coaches(id)
);

-- ================================================
-- INSERT REFERENCE DATA
-- ================================================

-- Standard playing positions
INSERT INTO positions (name, short_name, category, sort_order) VALUES
('Goalkeeper', 'GK', 'GK', 1),
('Right Back', 'RB', 'DEF', 2),
('Centre Back', 'CB', 'DEF', 3),
('Left Back', 'LB', 'DEF', 4),
('Defensive Midfielder', 'DM', 'MID', 5),
('Right Midfielder', 'RM', 'MID', 6),
('Centre Midfielder', 'CM', 'MID', 7),
('Left Midfielder', 'LM', 'MID', 8),
('Attacking Midfielder', 'AM', 'MID', 9),
('Right Winger', 'RW', 'FWD', 10),
('Striker', 'ST', 'FWD', 11),
('Left Winger', 'LW', 'FWD', 12);

-- Team types for the club
INSERT INTO team_types (name, short_name, age_group, gender, players_on_pitch, squad_size_min, squad_size_max, official_tracking, sort_order) VALUES
('Under 12 Boys', 'U12B', 'U12', 'Boys', 9, 12, 18, true, 12),
('Under 13 Boys', 'U13B', 'U13', 'Boys', 11, 14, 20, true, 13),
('Under 14 Boys', 'U14B', 'U14', 'Boys', 11, 14, 20, true, 14),
('Under 15 Boys', 'U15B', 'U15', 'Boys', 11, 14, 20, true, 15),
('Under 16 Boys', 'U16B', 'U16', 'Boys', 11, 14, 20, true, 16),
('Under 17 Boys', 'U17B', 'U17', 'Boys', 11, 14, 20, true, 17),
('Under 18 Boys', 'U18B', 'U18', 'Boys', 11, 16, 22, true, 18),
('Senior Men', 'SM', 'Senior', 'Men', 11, 16, 25, true, 20),
('Over 35 Men', 'O35M', 'O35', 'Men', 11, 14, 20, true, 21),
('Under 12 Girls', 'U12G', 'U12', 'Girls', 9, 12, 18, true, 32),
('Under 13 Girls', 'U13G', 'U13', 'Girls', 11, 14, 20, true, 33),
('Under 14 Girls', 'U14G', 'U14', 'Girls', 11, 14, 20, true, 34),
('Under 15 Girls', 'U15G', 'U15', 'Girls', 11, 14, 20, true, 35),
('Under 16 Girls', 'U16G', 'U16', 'Girls', 11, 14, 20, true, 36),
('Senior Women', 'SW', 'Senior', 'Women', 11, 16, 25, true, 40),
('Walking Football', 'WF', 'O35', 'Mixed', 7, 10, 16, false, 50),
('Inclusive Team', 'IT', 'Mixed', 'Mixed', 7, 8, 14, false, 51);

-- Sample venues
INSERT INTO venues (name, address, is_home_ground) VALUES
('Rivervalley Park', 'Rivervalley, Swords, Co. Dublin', true),
('Swords Manor FC', 'Swords Manor, Swords, Co. Dublin', false),
('Portmarnock FC', 'Portmarnock, Co. Dublin', false),
('Malahide United FC', 'Malahide, Co. Dublin', false);

-- ================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;

-- Public read access for reference tables
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE opponents ENABLE ROW LEVEL SECURITY;

-- Reference tables - public read access
CREATE POLICY "Public read access for positions" ON positions FOR SELECT USING (true);
CREATE POLICY "Public read access for team_types" ON team_types FOR SELECT USING (true);
CREATE POLICY "Public read access for leagues" ON leagues FOR SELECT USING (true);
CREATE POLICY "Public read access for venues" ON venues FOR SELECT USING (true);
CREATE POLICY "Public read access for opponents" ON opponents FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Anyone can create profile" ON profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Change log policies - admin only access
CREATE POLICY "Admin only access to change_log" ON change_log FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Coaches policies
CREATE POLICY "Coaches can read own profile" ON coaches FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Coaches can update own profile" ON coaches FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Anyone can create coach profile" ON coaches FOR INSERT WITH CHECK (user_id = auth.uid());

-- Teams policies - coaches can manage their teams, public can view public teams
CREATE POLICY "Public can view public teams" ON teams FOR SELECT USING (is_public = true);
CREATE POLICY "Team coaches can view their teams" ON teams FOR SELECT USING (
    id IN (SELECT team_id FROM team_coaches WHERE coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid()))
);
CREATE POLICY "Approved coaches can create teams" ON teams FOR INSERT WITH CHECK (
    created_by IN (SELECT id FROM coaches WHERE user_id = auth.uid() AND is_approved = true)
);
CREATE POLICY "Team coaches can update their teams" ON teams FOR UPDATE USING (
    id IN (SELECT team_id FROM team_coaches WHERE coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid()))
);

-- Match policies
CREATE POLICY "Public can view public team matches" ON matches FOR SELECT USING (
    team_id IN (SELECT id FROM teams WHERE is_public = true)
);
CREATE POLICY "Team coaches can view their team matches" ON matches FOR SELECT USING (
    team_id IN (SELECT team_id FROM team_coaches WHERE coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid()))
);
CREATE POLICY "Team coaches can manage their team matches" ON matches FOR ALL USING (
    team_id IN (SELECT team_id FROM team_coaches WHERE coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid()))
);

-- Players policies - coaches can manage their team players
CREATE POLICY "Team coaches can view their players" ON players FOR SELECT USING (
    id IN (
        SELECT player_id FROM team_players 
        WHERE team_id IN (
            SELECT team_id FROM team_coaches 
            WHERE coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
        )
    )
);
CREATE POLICY "Team coaches can manage their players" ON players FOR ALL USING (
    id IN (
        SELECT player_id FROM team_players 
        WHERE team_id IN (
            SELECT team_id FROM team_coaches 
            WHERE coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
        )
    )
);

-- ================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to automatically create profile for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for automatic profile creation (drop first just in case)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Team and coach lookups
CREATE INDEX idx_team_coaches_team_id ON team_coaches(team_id);
CREATE INDEX idx_team_coaches_coach_id ON team_coaches(coach_id);
CREATE INDEX idx_team_players_team_id ON team_players(team_id);
CREATE INDEX idx_team_players_player_id ON team_players(player_id);

-- Match lookups
CREATE INDEX idx_matches_team_id ON matches(team_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_match_events_match_id ON match_events(match_id);
CREATE INDEX idx_match_events_player_id ON match_events(player_id);

-- Profile lookups
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Coach approval lookups
CREATE INDEX idx_coaches_user_id ON coaches(user_id);
CREATE INDEX idx_coaches_is_approved ON coaches(is_approved);
CREATE INDEX idx_coach_approvals_status ON coach_approvals(status);

-- Change log lookups
CREATE INDEX idx_change_log_table_name ON change_log(table_name);
CREATE INDEX idx_change_log_changed_at ON change_log(changed_at);
CREATE INDEX idx_change_log_changed_by ON change_log(changed_by);
CREATE INDEX idx_change_log_action ON change_log(action);

-- ================================================
-- SAMPLE DATA FOR TESTING
-- ================================================

-- Sample league
INSERT INTO leagues (name, short_name, season) VALUES
('DDSL Premier Division', 'DDSL-PREM', '2024-25'),
('Dublin District Schoolboys League', 'DDSL', '2024-25');

-- Sample opponents
INSERT INTO opponents (name, short_name) VALUES
('Swords Manor FC', 'SMFC'),
('Portmarnock FC', 'PFC'),
('Malahide United FC', 'MUFC'),
('Clontarf FC', 'CFC');

-- Note: Actual coaches, players, teams and matches will be created through the UI
-- To create an admin user, first sign up through the app, then run:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';