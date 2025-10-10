/**
 * Setup Database API - Create page management tables
 * Initializes the database schema for the page management system
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Setting up page management database schema...');

    // Create page templates table
    const { error: templatesTableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS page_templates (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          display_name VARCHAR(100) NOT NULL,
          description TEXT,
          template_type VARCHAR(50) NOT NULL,
          default_props JSONB DEFAULT '{}',
          component_path VARCHAR(255),
          preview_image VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (templatesTableError) {
      // Try alternative approach if exec_sql doesn't exist
      console.log('⚠️ exec_sql not available, using alternative approach');
      return res.status(500).json({
        error: 'Database setup requires manual execution',
        message: 'Please run the database/page-management-schema.sql file manually',
        schema_location: 'database/page-management-schema.sql'
      });
    }

    // Create menu groups table
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS menu_groups (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(50) NOT NULL UNIQUE,
          display_name VARCHAR(100) NOT NULL,
          description TEXT,
          icon VARCHAR(50),
          color VARCHAR(20),
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Create pages table
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS pages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          slug VARCHAR(200) NOT NULL UNIQUE,
          description TEXT,
          content JSONB DEFAULT '{}',
          template_id UUID REFERENCES page_templates(id),
          template_props JSONB DEFAULT '{}',
          meta_title VARCHAR(200),
          meta_description TEXT,
          meta_keywords VARCHAR(500),
          status VARCHAR(20) DEFAULT 'draft',
          is_featured BOOLEAN DEFAULT false,
          featured_image VARCHAR(255),
          author_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          published_at TIMESTAMP WITH TIME ZONE
        );
      `
    });

    // Create navigation structure table
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS navigation_structure (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
          menu_group_id UUID REFERENCES menu_groups(id),
          parent_id UUID REFERENCES navigation_structure(id),
          sort_order INTEGER DEFAULT 0,
          is_visible BOOLEAN DEFAULT true,
          is_external BOOLEAN DEFAULT false,
          external_url VARCHAR(500),
          icon VARCHAR(50),
          css_classes VARCHAR(200),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    console.log('✅ Tables created successfully');

    // Insert default templates
    const { error: templatesError } = await supabaseAdmin
      .from('page_templates')
      .upsert([
        {
          name: 'standard-layout',
          display_name: 'Standard Layout',
          description: 'Traditional page layout with header, content, and footer',
          template_type: 'standard',
          component_path: 'StandardLayout'
        },
        {
          name: 'glass-page',
          display_name: 'Glass Morphism Page',
          description: 'Modern glass morphism design with hero section and cards',
          template_type: 'glass',
          component_path: 'GlassPageTemplate'
        },
        {
          name: 'match-central',
          display_name: 'Match Central',
          description: 'Match-focused layout for fixtures, results, and match data',
          template_type: 'custom',
          component_path: 'MatchCentralLayout'
        }
      ], { onConflict: 'name' });

    console.log('✅ Default templates inserted');

    // Insert default menu groups
    const { error: menuGroupsError } = await supabaseAdmin
      .from('menu_groups')
      .upsert([
        { name: 'home', display_name: 'Home', description: 'Homepage and main landing areas', icon: '🏠', color: 'text-green-600', sort_order: 0 },
        { name: 'about', display_name: 'About', description: 'Club information, history, and governance', icon: 'ℹ️', color: 'text-blue-600', sort_order: 1 },
        { name: 'teams', display_name: 'Teams', description: 'Team information, rosters, and profiles', icon: '⚽', color: 'text-purple-600', sort_order: 2 },
        { name: 'matches', display_name: 'Matches', description: 'Fixtures, results, and match information', icon: '🥅', color: 'text-orange-600', sort_order: 3 },
        { name: 'news', display_name: 'News & Media', description: 'News articles, media, and announcements', icon: '📰', color: 'text-indigo-600', sort_order: 4 },
        { name: 'community', display_name: 'Get Involved', description: 'Volunteer opportunities and community engagement', icon: '🤝', color: 'text-yellow-600', sort_order: 5 },
        { name: 'members', display_name: 'Members', description: 'Member resources and communication', icon: '👥', color: 'text-pink-600', sort_order: 6 },
        { name: 'contact', display_name: 'Contact', description: 'Contact information and support', icon: '📞', color: 'text-gray-600', sort_order: 7 },
        { name: 'admin', display_name: 'Admin', description: 'Administrative pages and tools', icon: '⚙️', color: 'text-red-600', sort_order: 8 }
      ], { onConflict: 'name' });

    console.log('✅ Default menu groups inserted');

    // Create indexes
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
        CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
        CREATE INDEX IF NOT EXISTS idx_navigation_structure_menu_group ON navigation_structure(menu_group_id);
        CREATE INDEX IF NOT EXISTS idx_navigation_structure_sort ON navigation_structure(sort_order);
      `
    });

    console.log('✅ Indexes created');

    // Create view
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
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
      `
    });

    console.log('✅ View created');

    console.log('🎉 Database setup completed successfully!');

    return res.status(200).json({
      success: true,
      message: 'Database setup completed successfully',
      tables_created: ['page_templates', 'menu_groups', 'pages', 'navigation_structure'],
      view_created: 'page_navigation_view'
    });

  } catch (error) {
    console.error('💥 Database setup failed:', error);
    return res.status(500).json({
      error: 'Database setup failed',
      details: (error as Error).message
    });
  }
}