-- Create page maintenance table for managing individual page status
-- This allows admins to enable/disable specific pages for maintenance

CREATE TABLE IF NOT EXISTS page_maintenance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  section VARCHAR(50) NOT NULL DEFAULT 'other',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  maintenance_reason TEXT,
  disabled_at TIMESTAMP WITH TIME ZONE,
  disabled_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraints
ALTER TABLE page_maintenance 
ADD CONSTRAINT check_section 
CHECK (section IN ('main', 'about', 'teams', 'contact', 'admin', 'other'));

ALTER TABLE page_maintenance 
ADD CONSTRAINT check_priority 
CHECK (priority IN ('low', 'medium', 'high'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_maintenance_path ON page_maintenance(path);
CREATE INDEX IF NOT EXISTS idx_page_maintenance_enabled ON page_maintenance(is_enabled);
CREATE INDEX IF NOT EXISTS idx_page_maintenance_section ON page_maintenance(section);
CREATE INDEX IF NOT EXISTS idx_page_maintenance_priority ON page_maintenance(priority);

-- Insert default pages - includes ALL submenu pages
INSERT INTO page_maintenance (path, title, description, section, priority, is_enabled) VALUES
-- Main Pages
('/home', 'Home', 'Main homepage with hero section and overview', 'main', 'high', true),
('/matches', 'Matches', 'Match fixtures and results', 'main', 'high', true),
('/volunteer', 'Volunteer', 'Volunteer opportunities', 'main', 'medium', true),
('/gallery', 'Gallery', 'Photo gallery', 'main', 'low', true),

-- About Section - All Submenu Pages
('/about', 'About Us', 'Main about page with club overview', 'about', 'high', true),
('/about/our-story', 'Our Story', 'Club history and founding story', 'about', 'medium', true),
('/club/values', 'Club Values', 'Our core values and principles', 'about', 'medium', true),
('/about/facilities', 'Facilities', 'Club facilities and grounds information', 'about', 'medium', true),
('/about/achievements', 'Achievements', 'Club trophies and achievements', 'about', 'low', true),

-- Teams Section - All Submenu Pages
('/teams', 'Teams Overview', 'General teams information and overview', 'teams', 'high', true),
('/teams/boys', 'Boys Teams', 'Boys team listings and information', 'teams', 'high', true),
('/teams/girls', 'Girls Teams', 'Girls team listings and information', 'teams', 'high', true),
('/teams/management', 'Team Management', 'Coaching staff and team management', 'teams', 'medium', true),
('/teams/academy', 'Academy', 'Youth academy programs', 'teams', 'medium', true),

-- Contact Section - All Submenu Pages
('/contact', 'Contact Us', 'Main contact page with form', 'contact', 'high', true),
('/contact/directions', 'Directions', 'How to find and get to the club', 'contact', 'medium', true),
('/join/trials', 'Join Trials', 'Player trial information and registration', 'contact', 'high', true),
('/join/inclusive', 'Inclusive Club', 'Inclusivity and accessibility information', 'contact', 'medium', true),
('/get-involved/coaching', 'Become a Coach', 'Coaching opportunities and requirements', 'contact', 'medium', true),

-- Get Involved Section
('/get-involved/events', 'Events', 'Upcoming club events and activities', 'other', 'medium', true),
('/fundraising', 'Fundraising', 'Club fundraising initiatives', 'other', 'medium', true),

-- Members Section
('/members', 'Members Area', 'Member login and main portal', 'other', 'medium', true),
('/members/parents', 'Parents Hub', 'Information and resources for parents', 'other', 'medium', true),
('/members/feedback', 'Member Feedback', 'Feedback forms and suggestions', 'other', 'low', true),
('/members/faq', 'FAQ', 'Frequently asked questions', 'other', 'low', true),

-- Shop and Other
('/shop', 'Club Shop', 'Merchandise and club shop', 'other', 'low', true),

-- Admin Pages (usually enabled by default)
('/admin', 'Admin Portal', 'Main admin dashboard', 'admin', 'high', true),
('/admin/dashboard', 'Admin Dashboard', 'Unified admin dashboard', 'admin', 'high', true)
ON CONFLICT (path) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE page_maintenance ENABLE ROW LEVEL SECURITY;

-- Create policies for different user roles
CREATE POLICY "Admin full access to page maintenance" ON page_maintenance
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Allow authenticated users to read page status (for maintenance checking)
CREATE POLICY "Authenticated users can read page status" ON page_maintenance
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_page_maintenance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_page_maintenance_updated_at_trigger ON page_maintenance;
CREATE TRIGGER update_page_maintenance_updated_at_trigger
  BEFORE UPDATE ON page_maintenance
  FOR EACH ROW
  EXECUTE FUNCTION update_page_maintenance_updated_at();

-- Grant permissions
GRANT ALL ON page_maintenance TO authenticated;
GRANT ALL ON page_maintenance TO service_role;

COMMENT ON TABLE page_maintenance IS 'Manages the maintenance status of individual pages on the site';
COMMENT ON COLUMN page_maintenance.path IS 'The URL path of the page (e.g., /home, /about)';
COMMENT ON COLUMN page_maintenance.is_enabled IS 'Whether the page is currently enabled (true) or under maintenance (false)';
COMMENT ON COLUMN page_maintenance.maintenance_reason IS 'The reason why the page is under maintenance';
COMMENT ON COLUMN page_maintenance.section IS 'The section category this page belongs to';
COMMENT ON COLUMN page_maintenance.priority IS 'The priority level of the page (affects order and importance)';