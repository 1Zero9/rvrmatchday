-- Create volunteer system tables
-- This includes volunteer opportunities and volunteer signups with verification workflow

-- 1. Volunteer Opportunities Table
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    excerpt TEXT,
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('coaching', 'events', 'administration', 'fundraising', 'facilities', 'youth', 'general')),
    location TEXT,
    date DATE,
    time TIME,
    end_date DATE,
    end_time TIME,
    duration_hours DECIMAL(4,1), -- e.g., 2.5 hours
    required_skills TEXT[],
    max_volunteers INTEGER DEFAULT 1,
    current_signups INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern TEXT, -- 'weekly', 'monthly', etc.
    contact_person TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    requirements TEXT, -- special requirements/qualifications
    benefits TEXT, -- what volunteers get from this
    image_url TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Volunteer Signups Table
CREATE TABLE IF NOT EXISTS volunteer_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
    volunteer_name TEXT NOT NULL,
    volunteer_email TEXT NOT NULL,
    volunteer_phone TEXT,
    age_group TEXT CHECK (age_group IN ('under_16', '16_25', '26_35', '36_50', '51_65', 'over_65')),
    previous_experience TEXT,
    availability_notes TEXT,
    motivation TEXT, -- why they want to volunteer
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
    admin_notes TEXT, -- notes from admin during verification
    verified_by UUID, -- admin who processed the signup
    verified_at TIMESTAMP WITH TIME ZONE,
    signed_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_category ON volunteer_opportunities(category);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_date ON volunteer_opportunities(date DESC);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_is_active ON volunteer_opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_priority ON volunteer_opportunities(priority);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_opportunity_id ON volunteer_signups(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_status ON volunteer_signups(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_email ON volunteer_signups(volunteer_email);

-- Enable RLS (Row Level Security)
ALTER TABLE volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_signups ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read active volunteer opportunities" ON volunteer_opportunities;
DROP POLICY IF EXISTS "Authenticated users can manage volunteer opportunities" ON volunteer_opportunities;
DROP POLICY IF EXISTS "Anyone can create volunteer signups" ON volunteer_signups;
DROP POLICY IF EXISTS "Authenticated users can manage volunteer signups" ON volunteer_signups;

-- Volunteer Opportunities Policies
-- Policy: Anyone can read active opportunities
CREATE POLICY "Anyone can read active volunteer opportunities" ON volunteer_opportunities
    FOR SELECT USING (is_active = TRUE);

-- Policy: Authenticated users can manage opportunities
CREATE POLICY "Authenticated users can manage volunteer opportunities" ON volunteer_opportunities
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Volunteer Signups Policies
-- Policy: Anyone can create signups (for public registration)
CREATE POLICY "Anyone can create volunteer signups" ON volunteer_signups
    FOR INSERT WITH CHECK (true);

-- Policy: Anyone can read their own signups by email
CREATE POLICY "Users can read their own signups" ON volunteer_signups
    FOR SELECT USING (true); -- We'll handle this in the application layer

-- Policy: Authenticated users (admins) can manage all signups
CREATE POLICY "Authenticated users can manage volunteer signups" ON volunteer_signups
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_volunteer_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_volunteer_opportunities_updated_at ON volunteer_opportunities;
CREATE TRIGGER update_volunteer_opportunities_updated_at BEFORE UPDATE ON volunteer_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_volunteer_updated_at_column();

DROP TRIGGER IF EXISTS update_volunteer_signups_updated_at ON volunteer_signups;
CREATE TRIGGER update_volunteer_signups_updated_at BEFORE UPDATE ON volunteer_signups
    FOR EACH ROW EXECUTE FUNCTION update_volunteer_updated_at_column();

-- Function to update current_signups count
CREATE OR REPLACE FUNCTION update_volunteer_signups_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the current_signups count for the opportunity
    UPDATE volunteer_opportunities 
    SET current_signups = (
        SELECT COUNT(*) 
        FROM volunteer_signups 
        WHERE opportunity_id = COALESCE(NEW.opportunity_id, OLD.opportunity_id)
        AND status = 'approved'
    )
    WHERE id = COALESCE(NEW.opportunity_id, OLD.opportunity_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger to auto-update signup counts
DROP TRIGGER IF EXISTS update_opportunity_signups_count ON volunteer_signups;
CREATE TRIGGER update_opportunity_signups_count 
    AFTER INSERT OR UPDATE OR DELETE ON volunteer_signups
    FOR EACH ROW EXECUTE FUNCTION update_volunteer_signups_count();

-- Insert sample volunteer opportunities
INSERT INTO volunteer_opportunities (
    title, description, excerpt, category, location, date, time, duration_hours, 
    required_skills, max_volunteers, contact_person, contact_email, requirements, 
    benefits, priority
) VALUES 
(
    'Match Day Assistant Coach',
    'Help our coaching staff during home matches by assisting with equipment setup, player coordination, and sideline support. Perfect for those interested in gaining coaching experience.',
    'Assist coaching staff during home matches with equipment and player support.',
    'coaching',
    'Home Ground',
    '2025-10-05',
    '13:00',
    4.0,
    ARRAY['basic football knowledge', 'communication skills'],
    2,
    'John Smith',
    'coaching@rvrafc.ie',
    'Must be over 18. Garda vetting required for youth matches.',
    'Coaching experience, match day meals provided, club training opportunities.',
    'high'
),
(
    'Fundraising Event Setup Crew',
    'Join our setup team for the annual fundraising race night. Help with venue preparation, table arrangement, decorations, and equipment setup. Great way to meet other volunteers and support the club.',
    'Help set up venue and equipment for annual fundraising race night.',
    'fundraising',
    'Club House Main Hall',
    '2025-11-15',
    '16:00',
    3.0,
    ARRAY['physical work', 'teamwork'],
    6,
    'Mary O''Connor',
    'events@rvrafc.ie',
    'Able to lift and move furniture. Safety briefing required.',
    'Free entry to event, volunteer appreciation dinner, club merchandise.',
    'medium'
),
(
    'Youth Academy Equipment Manager',
    'Ongoing role managing equipment for our youth academy sessions. Responsibilities include equipment setup, maintenance checks, inventory management, and ensuring safety standards.',
    'Manage equipment for youth academy training sessions on weekends.',
    'youth',
    'Training Ground',
    '2025-10-01',
    '09:00',
    3.0,
    ARRAY['organization', 'attention to detail'],
    1,
    'David Murphy',
    'youth@rvrafc.ie',
    'Garda vetting mandatory. Equipment handling training provided.',
    'Flexible scheduling, training certification, priority booking for club events.',
    'high'
),
(
    'Website Content Contributor',
    'Help maintain our club website by writing match reports, updating player profiles, creating social media content, and managing photo galleries. Work remotely with flexible hours.',
    'Create and manage digital content for club website and social media.',
    'administration',
    'Remote/Home',
    NULL,
    NULL,
    2.0,
    ARRAY['writing', 'social media', 'photography'],
    3,
    'Sarah Kelly',
    'admin@rvrafc.ie',
    'Basic computer skills, social media experience preferred.',
    'Flexible remote work, byline credit, press access to matches.',
    'medium'
),
(
    'Grounds Maintenance Volunteer',
    'Help maintain our playing surfaces and facilities. Tasks include pitch marking, goal post maintenance, general tidying, and seasonal ground care activities.',
    'Maintain playing surfaces and club facilities on weekends.',
    'facilities',
    'Club Grounds',
    '2025-09-28',
    '08:00',
    4.0,
    ARRAY['physical work', 'outdoor work', 'basic maintenance'],
    4,
    'Tom Wilson',
    'grounds@rvrafc.ie',
    'Must be available weekend mornings. Safety equipment provided.',
    'Fresh air, fitness, free club membership, end of season BBQ.',
    'medium'
);

-- Insert some sample signups for testing (mix of pending, approved, rejected)
INSERT INTO volunteer_signups (
    opportunity_id, volunteer_name, volunteer_email, volunteer_phone, age_group,
    previous_experience, motivation, status, admin_notes
) 
SELECT 
    o.id,
    'Test Volunteer ' || (row_number() OVER()),
    'volunteer' || (row_number() OVER()) || '@example.com',
    '+353 87 123 45' || (10 + row_number() OVER()),
    CASE (row_number() OVER() % 3)
        WHEN 0 THEN '26_35'
        WHEN 1 THEN '36_50'
        ELSE '16_25'
    END,
    'Previous coaching experience with local youth team',
    'Want to give back to the community and help develop young players',
    CASE (row_number() OVER() % 3)
        WHEN 0 THEN 'approved'
        WHEN 1 THEN 'pending'
        ELSE 'rejected'
    END,
    CASE (row_number() OVER() % 3)
        WHEN 0 THEN 'Great candidate, approved for trial period'
        WHEN 1 THEN NULL
        ELSE 'Unfortunately not suitable for this role at this time'
    END
FROM volunteer_opportunities o
LIMIT 8;