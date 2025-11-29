-- Page Management System Database Schema
-- Comprehensive CMS-like page management with drag-and-drop navigation

-- Page Templates Table
-- Defines available page templates (StandardLayout, GlassPageTemplate, etc.)
CREATE TABLE IF NOT EXISTS page_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) NOT NULL, -- 'standard', 'glass', 'custom'
    default_props JSONB DEFAULT '{}', -- Default props for the template
    component_path VARCHAR(255), -- Path to the React component
    preview_image VARCHAR(255), -- Preview image URL
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Groups Table  
-- Defines navigation menu categories (About, Teams, Contact, etc.)
CREATE TABLE IF NOT EXISTS menu_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- Icon class or emoji
    color VARCHAR(20), -- CSS color class
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pages Table
-- Core page content and metadata
CREATE TABLE IF NOT EXISTS pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE, -- URL path (e.g., '/about/history')
    description TEXT,
    content JSONB DEFAULT '{}', -- Page content as JSON
    template_id UUID REFERENCES page_templates(id),
    template_props JSONB DEFAULT '{}', -- Template-specific props (backgroundImage, etc.)
    meta_title VARCHAR(200), -- SEO title
    meta_description TEXT, -- SEO description
    meta_keywords VARCHAR(500), -- SEO keywords
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    is_featured BOOLEAN DEFAULT false,
    featured_image VARCHAR(255),
    author_id UUID, -- References auth.users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Navigation Structure Table
-- Manages hierarchical navigation and menu organization
CREATE TABLE IF NOT EXISTS navigation_structure (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    menu_group_id UUID REFERENCES menu_groups(id),
    parent_id UUID REFERENCES navigation_structure(id), -- For nested navigation
    sort_order INTEGER DEFAULT 0, -- Order within the group/parent
    is_visible BOOLEAN DEFAULT true, -- Show/hide in navigation
    is_external BOOLEAN DEFAULT false, -- External link
    external_url VARCHAR(500), -- If external link
    icon VARCHAR(50), -- Navigation icon
    css_classes VARCHAR(200), -- Custom CSS classes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default page templates
INSERT INTO page_templates (name, display_name, description, template_type, component_path) VALUES
('standard-layout', 'Standard Layout', 'Traditional page layout with header, content, and footer', 'standard', 'StandardLayout'),
('glass-page', 'Glass Morphism Page', 'Modern glass morphism design with hero section and cards', 'glass', 'GlassPageTemplate'),
('match-central', 'Match Central', 'Match-focused layout for fixtures, results, and match data', 'custom', 'MatchCentralLayout'),
('team-profile', 'Team Profile', 'Dedicated team page with roster, stats, and information', 'custom', 'TeamProfileLayout'),
('news-article', 'News Article', 'Article layout for news and blog posts', 'standard', 'NewsArticleLayout');

-- Insert default menu groups
INSERT INTO menu_groups (name, display_name, description, icon, color, sort_order) VALUES
('home', 'Home', 'Homepage and main landing areas', '🏠', 'text-green-600', 0),
('about', 'About', 'Club information, history, and governance', 'ℹ️', 'text-blue-600', 1),
('teams', 'Teams', 'Team information, rosters, and profiles', '⚽', 'text-purple-600', 2),
('matches', 'Matches', 'Fixtures, results, and match information', '🥅', 'text-orange-600', 3),
('news', 'News & Media', 'News articles, media, and announcements', '📰', 'text-indigo-600', 4),
('community', 'Get Involved', 'Volunteer opportunities and community engagement', '🤝', 'text-yellow-600', 5),
('members', 'Members', 'Member resources and communication', '👥', 'text-pink-600', 6),
('contact', 'Contact', 'Contact information and support', '📞', 'text-gray-600', 7),
('admin', 'Admin', 'Administrative pages and tools', '⚙️', 'text-red-600', 8);

-- Create indexes for performance
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_template_id ON pages(template_id);
CREATE INDEX idx_navigation_structure_menu_group ON navigation_structure(menu_group_id);
CREATE INDEX idx_navigation_structure_parent ON navigation_structure(parent_id);
CREATE INDEX idx_navigation_structure_sort ON navigation_structure(sort_order);
CREATE INDEX idx_navigation_structure_visible ON navigation_structure(is_visible);

-- Row Level Security (RLS) Policies
ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_structure ENABLE ROW LEVEL SECURITY;

-- Public read access for published pages
CREATE POLICY "Public can view published pages" ON pages
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view active templates" ON page_templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active menu groups" ON menu_groups
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view visible navigation" ON navigation_structure
    FOR SELECT USING (is_visible = true);

-- Admin full access policies
CREATE POLICY "Admin full access to pages" ON pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.raw_user_meta_data->>'role' = 'content_editor'
                 OR auth.users.raw_user_meta_data->>'role' = 'site_admin')
        )
    );

CREATE POLICY "Admin full access to templates" ON page_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.raw_user_meta_data->>'role' = 'content_editor'
                 OR auth.users.raw_user_meta_data->>'role' = 'site_admin')
        )
    );

CREATE POLICY "Admin full access to menu groups" ON menu_groups
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.raw_user_meta_data->>'role' = 'content_editor'
                 OR auth.users.raw_user_meta_data->>'role' = 'site_admin')
        )
    );

CREATE POLICY "Admin full access to navigation" ON navigation_structure
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
                 OR auth.users.raw_user_meta_data->>'role' = 'content_editor'
                 OR auth.users.raw_user_meta_data->>'role' = 'site_admin')
        )
    );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_page_templates_updated_at BEFORE UPDATE ON page_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_groups_updated_at BEFORE UPDATE ON menu_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_navigation_structure_updated_at BEFORE UPDATE ON navigation_structure
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for complete page information with navigation context
CREATE OR REPLACE VIEW page_navigation_view AS
SELECT 
    p.id,
    p.title,
    p.slug,
    p.description,
    p.content,
    p.status,
    p.is_featured,
    p.featured_image,
    p.created_at,
    p.updated_at,
    p.published_at,
    pt.name as template_name,
    pt.display_name as template_display_name,
    pt.template_type,
    mg.name as menu_group_name,
    mg.display_name as menu_group_display_name,
    mg.icon as menu_group_icon,
    mg.color as menu_group_color,
    ns.sort_order,
    ns.is_visible,
    ns.is_external,
    ns.external_url,
    ns.icon as nav_icon,
    ns.parent_id
FROM pages p
LEFT JOIN page_templates pt ON p.template_id = pt.id
LEFT JOIN navigation_structure ns ON p.id = ns.page_id
LEFT JOIN menu_groups mg ON ns.menu_group_id = mg.id
WHERE p.status IN ('published', 'draft')
ORDER BY mg.sort_order, ns.sort_order;

-- Stored procedure for bulk navigation reordering
CREATE OR REPLACE FUNCTION update_navigation_order(navigation_updates JSONB)
RETURNS VOID AS $$
DECLARE
    update_item JSONB;
BEGIN
    -- Loop through each navigation update
    FOR update_item IN SELECT * FROM jsonb_array_elements(navigation_updates)
    LOOP
        UPDATE navigation_structure 
        SET 
            sort_order = (update_item->>'sort_order')::INTEGER,
            parent_id = CASE 
                WHEN update_item->>'parent_id' = 'null' OR update_item->>'parent_id' IS NULL 
                THEN NULL 
                ELSE (update_item->>'parent_id')::UUID 
            END,
            menu_group_id = (update_item->>'menu_group_id')::UUID,
            updated_at = NOW()
        WHERE id = (update_item->>'id')::UUID;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to get navigation tree for a specific menu group
CREATE OR REPLACE FUNCTION get_navigation_tree(p_menu_group_name TEXT DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    page_id UUID,
    title TEXT,
    slug TEXT,
    menu_group_name TEXT,
    parent_id UUID,
    sort_order INTEGER,
    is_visible BOOLEAN,
    icon TEXT,
    level INTEGER,
    path TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE nav_tree AS (
        -- Base case: root level items
        SELECT 
            ns.id,
            ns.page_id,
            p.title,
            p.slug,
            mg.name as menu_group_name,
            ns.parent_id,
            ns.sort_order,
            ns.is_visible,
            ns.icon,
            0 as level,
            p.title::TEXT as path
        FROM navigation_structure ns
        JOIN pages p ON ns.page_id = p.id
        JOIN menu_groups mg ON ns.menu_group_id = mg.id
        WHERE ns.parent_id IS NULL
        AND (p_menu_group_name IS NULL OR mg.name = p_menu_group_name)
        
        UNION ALL
        
        -- Recursive case: child items
        SELECT 
            ns.id,
            ns.page_id,
            p.title,
            p.slug,
            mg.name as menu_group_name,
            ns.parent_id,
            ns.sort_order,
            ns.is_visible,
            ns.icon,
            nt.level + 1,
            nt.path || ' > ' || p.title as path
        FROM navigation_structure ns
        JOIN pages p ON ns.page_id = p.id
        JOIN menu_groups mg ON ns.menu_group_id = mg.id
        JOIN nav_tree nt ON ns.parent_id = nt.id
        WHERE (p_menu_group_name IS NULL OR mg.name = p_menu_group_name)
    )
    SELECT * FROM nav_tree
    ORDER BY menu_group_name, level, sort_order;
END;
$$ LANGUAGE plpgsql;

-- Function to validate navigation structure integrity
CREATE OR REPLACE FUNCTION validate_navigation_structure()
RETURNS TABLE (
    issue_type TEXT,
    issue_description TEXT,
    affected_id UUID,
    affected_title TEXT
) AS $$
BEGIN
    -- Check for circular references
    RETURN QUERY
    WITH RECURSIVE circular_check AS (
        SELECT id, parent_id, ARRAY[id] as path
        FROM navigation_structure
        WHERE parent_id IS NOT NULL
        
        UNION ALL
        
        SELECT ns.id, ns.parent_id, cc.path || ns.id
        FROM navigation_structure ns
        JOIN circular_check cc ON ns.id = cc.parent_id
        WHERE ns.id = ANY(cc.path)
    )
    SELECT 
        'circular_reference'::TEXT,
        'Circular reference detected in navigation structure'::TEXT,
        cc.id,
        p.title
    FROM circular_check cc
    JOIN pages p ON cc.id = (
        SELECT page_id FROM navigation_structure WHERE id = cc.id
    );
    
    -- Check for orphaned navigation items
    RETURN QUERY
    SELECT 
        'orphaned_navigation'::TEXT,
        'Navigation item references non-existent page'::TEXT,
        ns.id,
        'N/A'::TEXT
    FROM navigation_structure ns
    LEFT JOIN pages p ON ns.page_id = p.id
    WHERE p.id IS NULL;
    
    -- Check for missing navigation items for published pages
    RETURN QUERY
    SELECT 
        'missing_navigation'::TEXT,
        'Published page has no navigation structure'::TEXT,
        p.id,
        p.title
    FROM pages p
    LEFT JOIN navigation_structure ns ON p.id = ns.page_id
    WHERE p.status = 'published' AND ns.id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE pages IS 'Core page content and metadata for dynamic page management';
COMMENT ON TABLE page_templates IS 'Available page templates (StandardLayout, GlassPageTemplate, etc.)';
COMMENT ON TABLE menu_groups IS 'Navigation menu categories (About, Teams, Contact, etc.)';
COMMENT ON TABLE navigation_structure IS 'Hierarchical navigation organization with drag-and-drop support';
COMMENT ON VIEW page_navigation_view IS 'Complete view of pages with navigation context for admin interface';
COMMENT ON FUNCTION update_navigation_order(JSONB) IS 'Bulk update navigation structure for drag-and-drop reordering';
COMMENT ON FUNCTION get_navigation_tree(TEXT) IS 'Get hierarchical navigation tree with level and path information';
COMMENT ON FUNCTION validate_navigation_structure() IS 'Validate navigation structure integrity and identify issues';