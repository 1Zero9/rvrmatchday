-- Create special_events table for the special events management system
-- Enhanced version with image support and improved structure

CREATE TABLE IF NOT EXISTS special_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    excerpt TEXT,
    date DATE NOT NULL,
    time TIME,
    end_date DATE,
    end_time TIME,
    venue TEXT,
    ticket_price DECIMAL(10,2),
    contact_info TEXT,
    image_url TEXT,
    event_type TEXT NOT NULL DEFAULT 'other' CHECK (event_type IN ('race_night', 'bingo', 'fundraiser', 'social', 'workshop', 'tournament', 'meeting', 'other')),
    is_active BOOLEAN DEFAULT TRUE,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    featured BOOLEAN DEFAULT FALSE,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_link TEXT,
    tags TEXT[], -- Array of tags
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_special_events_date ON special_events(date DESC);
CREATE INDEX IF NOT EXISTS idx_special_events_is_active ON special_events(is_active);
CREATE INDEX IF NOT EXISTS idx_special_events_event_type ON special_events(event_type);
CREATE INDEX IF NOT EXISTS idx_special_events_priority ON special_events(priority);
CREATE INDEX IF NOT EXISTS idx_special_events_featured ON special_events(featured);

-- Enable RLS (Row Level Security) 
ALTER TABLE special_events ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Anyone can read active special events" ON special_events;
DROP POLICY IF EXISTS "Authenticated users can manage special events" ON special_events;

-- Policy: Anyone can read active events
CREATE POLICY "Anyone can read active special events" ON special_events
    FOR SELECT USING (is_active = TRUE);

-- Policy: Authenticated users can manage all events
CREATE POLICY "Authenticated users can manage special events" ON special_events
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_special_events_updated_at ON special_events;
CREATE TRIGGER update_special_events_updated_at BEFORE UPDATE ON special_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample events (with auto-generated UUIDs)
INSERT INTO special_events (
    title, description, excerpt, date, time, venue, ticket_price, event_type, priority, featured, image_url, tags, views
) VALUES 
(
    'Annual Fundraising Race Night',
    'Join us for an exciting evening of horse racing entertainment! Place your bets on our virtual races while enjoying food, drinks, and great company. All proceeds support our youth academy programs.',
    'Virtual horse racing with food, drinks and prizes. Supporting youth academy programs.',
    '2025-11-15',
    '19:00',
    'Club House Main Hall',
    15.00,
    'race_night',
    'high',
    TRUE,
    '/images/homepg-image1.jpg',
    ARRAY['fundraising', 'racing', 'social', 'food'],
    89
),
(
    'Monthly Bingo Night',
    'Come join our monthly bingo session with fantastic prizes and refreshments available. All ages welcome for a fun family evening out.',
    'Monthly bingo with great prizes and refreshments. Family-friendly event.',
    '2025-10-12',
    '20:00',
    'Club House',
    8.00,
    'bingo',
    'medium',
    FALSE,
    '/images/homepage-hero.jpg',
    ARRAY['bingo', 'family', 'prizes', 'monthly'],
    156
),
(
    'Youth Academy Skills Workshop',
    'Professional coaching workshop for our youth academy players focusing on ball control, passing techniques, and tactical awareness. Open to all academy members aged 8-16.',
    'Professional coaching workshop for youth academy members aged 8-16.',
    '2025-10-05',
    '10:00',
    'Training Ground',
    NULL,
    'workshop',
    'high',
    FALSE,
    NULL,
    ARRAY['youth', 'coaching', 'skills', 'academy'],
    67
);