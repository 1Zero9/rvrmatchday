-- Create news_articles table for the news management system
-- Fixed version with proper UUIDs

CREATE TABLE IF NOT EXISTS news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Admin',
    category TEXT NOT NULL DEFAULT 'club_news' CHECK (category IN ('match_report', 'club_news', 'player_news', 'community', 'announcement')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    tags TEXT[], -- Array of tags
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_publish_date ON news_articles(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_featured ON news_articles(featured);

-- Enable RLS (Row Level Security) 
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Anyone can read published news articles" ON news_articles;
DROP POLICY IF EXISTS "Authenticated users can read all news articles" ON news_articles;
DROP POLICY IF EXISTS "Authenticated users can insert news articles" ON news_articles;
DROP POLICY IF EXISTS "Authenticated users can update news articles" ON news_articles;
DROP POLICY IF EXISTS "Authenticated users can delete news articles" ON news_articles;

-- Policy: Anyone can read published articles
CREATE POLICY "Anyone can read published news articles" ON news_articles
    FOR SELECT USING (status = 'published');

-- Policy: Authenticated users can manage all articles
CREATE POLICY "Authenticated users can manage news articles" ON news_articles
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
DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample articles (with auto-generated UUIDs)
INSERT INTO news_articles (
    title, content, excerpt, author, category, status, featured, image_url, publish_date, tags, views
) VALUES 
(
    'Rivervalley Rangers Defeat Local Rivals 3-1',
    'In an exciting match at home, Rivervalley Rangers secured a convincing 3-1 victory against their local rivals. Goals from Smith, O''Connor, and Murphy sealed the win in what was a thrilling encounter for all fans present.',
    'Rangers secure convincing 3-1 victory in local derby with excellent team performance.',
    'Match Reporter',
    'match_report',
    'published',
    TRUE,
    '/images/homepg-image1.jpg',
    '2025-09-20',
    ARRAY['match', 'victory', 'derby'],
    156
),
(
    'New Training Facility Opens Next Month',
    'The club is excited to announce the opening of our new state-of-the-art training facility. The facility will include modern changing rooms, training pitches, and coaching facilities that will benefit all our teams.',
    'Modern training facility to boost player development with new facilities.',
    'Club Secretary',
    'club_news',
    'published',
    FALSE,
    '/images/homepage-hero.jpg',
    '2025-09-18',
    ARRAY['facility', 'training', 'development'],
    89
),
(
    'Youth Academy Registration Now Open',
    'Registration for our youth academy is now open for the 2025 season. We welcome players of all skill levels aged 6-16 to join our development programs.',
    'Youth academy registration open for ages 6-16. All skill levels welcome.',
    'Youth Coordinator',
    'club_news',
    'published',
    FALSE,
    NULL,
    '2025-09-15',
    ARRAY['youth', 'registration', 'academy'],
    234
);