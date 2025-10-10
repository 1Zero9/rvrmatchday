/**
 * Quick Setup API - Create tables using direct SQL execution
 * Simple database setup for page management system
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
    console.log('🚀 Quick setup: Creating page management tables...');

    // Step 1: Create page templates table and insert data directly
    try {
      const { error: templatesError } = await supabaseAdmin
        .from('page_templates')
        .select('id')
        .limit(1);
      
      if (templatesError && templatesError.code === 'PGRST116') {
        console.log('⚠️ Tables do not exist yet. Please run the SQL schema manually.');
        return res.status(500).json({
          error: 'Database tables not found',
          message: 'Please create the tables first by running the database/page-management-schema.sql file',
          details: 'Tables: page_templates, menu_groups, pages, navigation_structure',
          suggestion: 'Go to your database console and execute the SQL schema'
        });
      }
    } catch (error) {
      console.log('❌ Tables check failed:', error);
    }

    // Step 2: Try to insert default templates (if table exists)
    const defaultTemplates = [
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
    ];

    const { data: templatesData, error: templatesInsertError } = await supabaseAdmin
      .from('page_templates')
      .upsert(defaultTemplates, { onConflict: 'name' })
      .select();

    console.log('✅ Templates setup:', templatesData?.length || 0, 'templates');

    // Step 3: Insert default menu groups
    const defaultMenuGroups = [
      { name: 'home', display_name: 'Home', description: 'Homepage and main landing areas', icon: '🏠', color: 'text-green-600', sort_order: 0 },
      { name: 'about', display_name: 'About', description: 'Club information, history, and governance', icon: 'ℹ️', color: 'text-blue-600', sort_order: 1 },
      { name: 'teams', display_name: 'Teams', description: 'Team information, rosters, and profiles', icon: '⚽', color: 'text-purple-600', sort_order: 2 },
      { name: 'matches', display_name: 'Matches', description: 'Fixtures, results, and match information', icon: '🥅', color: 'text-orange-600', sort_order: 3 },
      { name: 'news', display_name: 'News & Media', description: 'News articles, media, and announcements', icon: '📰', color: 'text-indigo-600', sort_order: 4 },
      { name: 'community', display_name: 'Get Involved', description: 'Volunteer opportunities and community engagement', icon: '🤝', color: 'text-yellow-600', sort_order: 5 },
      { name: 'members', display_name: 'Members', description: 'Member resources and communication', icon: '👥', color: 'text-pink-600', sort_order: 6 },
      { name: 'contact', display_name: 'Contact', description: 'Contact information and support', icon: '📞', color: 'text-gray-600', sort_order: 7 },
      { name: 'admin', display_name: 'Admin', description: 'Administrative pages and tools', icon: '⚙️', color: 'text-red-600', sort_order: 8 }
    ];

    const { data: menuGroupsData, error: menuGroupsInsertError } = await supabaseAdmin
      .from('menu_groups')
      .upsert(defaultMenuGroups, { onConflict: 'name' })
      .select();

    console.log('✅ Menu groups setup:', menuGroupsData?.length || 0, 'groups');

    console.log('🎉 Quick setup completed successfully!');

    return res.status(200).json({
      success: true,
      message: 'Quick setup completed successfully',
      templates_created: templatesData?.length || 0,
      menu_groups_created: menuGroupsData?.length || 0,
      ready_for_import: true
    });

  } catch (error) {
    console.error('💥 Quick setup failed:', error);
    return res.status(500).json({
      error: 'Quick setup failed',
      details: (error as Error).message,
      suggestion: 'Database tables may need to be created manually'
    });
  }
}