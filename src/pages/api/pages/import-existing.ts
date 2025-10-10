/**
 * Import Existing Pages API
 * Scans the file system and imports all existing pages into the page management system
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

// Known page structure based on site analysis
const PAGE_STRUCTURE = [
  // Core Pages
  { path: '/home', title: 'Home', menu_group: 'home', template: 'standard-layout', icon: '🏠' },
  { path: '/', title: 'Landing Page', menu_group: 'home', template: 'glass-page', icon: '🚀' },
  { path: '/about', title: 'About Club', menu_group: 'about', template: 'glass-page', icon: 'ℹ️' },
  { path: '/contact', title: 'Contact Us', menu_group: 'contact', template: 'glass-page', icon: '📞' },
  { path: '/shop', title: 'Club Shop', menu_group: 'contact', template: 'glass-page', icon: '🛒' },
  
  // Club Pages
  { path: '/club', title: 'Club Hub', menu_group: 'about', template: 'glass-page', icon: '🏛️' },
  { path: '/club/history', title: 'Club History', menu_group: 'about', template: 'glass-page', icon: '📚', parent: '/club' },
  { path: '/club/committee', title: 'Committee', menu_group: 'about', template: 'glass-page', icon: '👥', parent: '/club' },
  { path: '/club/policies', title: 'Policies', menu_group: 'about', template: 'glass-page', icon: '📋', parent: '/club' },
  { path: '/club/values', title: 'Club Values', menu_group: 'about', template: 'glass-page', icon: '⭐', parent: '/club' },
  { path: '/club/facilities', title: 'Facilities', menu_group: 'about', template: 'glass-page', icon: '🏟️', parent: '/club' },
  
  // Teams Pages
  { path: '/teams', title: 'Teams Hub', menu_group: 'teams', template: 'glass-page', icon: '⚽' },
  { path: '/teams/boys', title: 'Boys Teams', menu_group: 'teams', template: 'glass-page', icon: '👦', parent: '/teams' },
  { path: '/teams/girls', title: 'Girls Teams', menu_group: 'teams', template: 'glass-page', icon: '👧', parent: '/teams' },
  { path: '/teams/youth', title: 'Youth Teams', menu_group: 'teams', template: 'glass-page', icon: '🧒', parent: '/teams' },
  { path: '/teams/senior', title: 'Senior Teams', menu_group: 'teams', template: 'glass-page', icon: '🏆', parent: '/teams' },
  { path: '/teams/inclusive', title: 'Inclusive Teams', menu_group: 'teams', template: 'glass-page', icon: '🤝', parent: '/teams' },
  
  // Match System
  { path: '/matchday', title: 'MatchDay Central', menu_group: 'matches', template: 'standard-layout', icon: '⚽' },
  { path: '/fixtures', title: 'Fixtures (Redirect)', menu_group: 'matches', template: 'standard-layout', icon: '📅' },
  { path: '/match-central', title: 'Match Central', menu_group: 'matches', template: 'standard-layout', icon: '🎯' },
  { path: '/match-central/fixtures', title: 'Fixtures', menu_group: 'matches', template: 'standard-layout', icon: '📅', parent: '/match-central' },
  { path: '/match-central/results', title: 'Results', menu_group: 'matches', template: 'standard-layout', icon: '📊', parent: '/match-central' },
  { path: '/match-central/tables', title: 'League Tables', menu_group: 'matches', template: 'standard-layout', icon: '📈', parent: '/match-central' },
  
  // News & Media
  { path: '/news-media', title: 'News & Media Hub', menu_group: 'news', template: 'glass-page', icon: '📰' },
  { path: '/news', title: 'News Articles', menu_group: 'news', template: 'standard-layout', icon: '📰', parent: '/news-media' },
  { path: '/news-media/events', title: 'Events', menu_group: 'news', template: 'glass-page', icon: '🎉', parent: '/news-media' },
  { path: '/gallery', title: 'Photo Gallery', menu_group: 'news', template: 'standard-layout', icon: '📸', parent: '/news-media' },
  
  // Get Involved
  { path: '/get-involved', title: 'Get Involved Hub', menu_group: 'community', template: 'glass-page', icon: '🤝' },
  { path: '/get-involved/events', title: 'Community Events', menu_group: 'community', template: 'glass-page', icon: '🎊', parent: '/get-involved' },
  { path: '/get-involved/sponsorship', title: 'Sponsorship', menu_group: 'community', template: 'glass-page', icon: '💰', parent: '/get-involved' },
  { path: '/volunteering', title: 'Volunteering', menu_group: 'community', template: 'standard-layout', icon: '🤝', parent: '/get-involved' },
  { path: '/fundraising', title: 'Fundraising', menu_group: 'community', template: 'glass-page', icon: '💰', parent: '/get-involved' },
  
  // Join Club
  { path: '/join', title: 'Join Club Hub', menu_group: 'contact', template: 'glass-page', icon: '🎯' },
  { path: '/join/youth', title: 'Youth Registration', menu_group: 'contact', template: 'glass-page', icon: '🧒', parent: '/join' },
  { path: '/join/senior', title: 'Senior Registration', menu_group: 'contact', template: 'glass-page', icon: '🏆', parent: '/join' },
  { path: '/join/academy', title: 'Academy Registration', menu_group: 'contact', template: 'glass-page', icon: '🎓', parent: '/join' },
  { path: '/join/family', title: 'Family Registration', menu_group: 'contact', template: 'glass-page', icon: '👨‍👩‍👧‍👦', parent: '/join' },
  { path: '/join/inclusive', title: 'Inclusive Registration', menu_group: 'contact', template: 'glass-page', icon: '🤝', parent: '/join' },
  { path: '/join/trials', title: 'Trials', menu_group: 'contact', template: 'glass-page', icon: '⚽', parent: '/join' },
  
  // Members Area
  { path: '/members', title: 'Members Hub', menu_group: 'members', template: 'glass-page', icon: '👥' },
  { path: '/members/parents', title: 'Parent Resources', menu_group: 'members', template: 'glass-page', icon: '👨‍👩‍👧‍👦', parent: '/members' },
  { path: '/members/faq', title: 'FAQ', menu_group: 'members', template: 'glass-page', icon: '❓', parent: '/members' },
  { path: '/members/feedback', title: 'Feedback', menu_group: 'members', template: 'glass-page', icon: '💬', parent: '/members' },
  
  // Special Pages
  { path: '/coach', title: 'Become a Coach', menu_group: 'contact', template: 'glass-page', icon: '⚽' },
  { path: '/boot-room', title: 'Boot Room', menu_group: 'community', template: 'standard-layout', icon: '👢' },
  { path: '/sitemap', title: 'Site Map', menu_group: 'admin', template: 'standard-layout', icon: '🗺️' },
  
  // Admin & System Pages
  { path: '/admin', title: 'Admin Dashboard', menu_group: 'admin', template: 'standard-layout', icon: '⚙️' },
  { path: '/admin/dashboard', title: 'Unified Dashboard', menu_group: 'admin', template: 'standard-layout', icon: '📊', parent: '/admin' },
  { path: '/login', title: 'Login', menu_group: 'admin', template: 'standard-layout', icon: '🔐' },
  { path: '/register', title: 'Register', menu_group: 'admin', template: 'standard-layout', icon: '📝' },
  { path: '/dashboard', title: 'User Dashboard', menu_group: 'admin', template: 'standard-layout', icon: '📊' },
  
  // Mobile Pages
  { path: '/mobile-app', title: 'Mobile App', menu_group: 'admin', template: 'standard-layout', icon: '📱' },
  { path: '/mobile-wow', title: 'Mobile Wow', menu_group: 'admin', template: 'standard-layout', icon: '🤩' },
  { path: '/mobile-join', title: 'Mobile Join', menu_group: 'admin', template: 'standard-layout', icon: '📱' },
  { path: '/mobile-login', title: 'Mobile Login', menu_group: 'admin', template: 'standard-layout', icon: '📱' },
  
  // Match Recording & Management
  { path: '/match-recorder', title: 'Match Recorder', menu_group: 'matches', template: 'standard-layout', icon: '📹' },
  { path: '/match-admin', title: 'Match Admin', menu_group: 'matches', template: 'standard-layout', icon: '⚙️' },
  { path: '/secure-match-recorder', title: 'Secure Match Recorder', menu_group: 'matches', template: 'standard-layout', icon: '🔒' },
  { path: '/quick-record', title: 'Quick Record', menu_group: 'matches', template: 'standard-layout', icon: '⚡' },
  
  // Utility Pages
  { path: '/book-astro', title: 'Book Astro', menu_group: 'community', template: 'standard-layout', icon: '🏟️' },
  { path: '/tracker', title: 'Tracker', menu_group: 'admin', template: 'standard-layout', icon: '📊' },
  { path: '/modules', title: 'Modules', menu_group: 'admin', template: 'standard-layout', icon: '🧩' },
  { path: '/modular-demo', title: 'Modular Demo', menu_group: 'admin', template: 'standard-layout', icon: '🎪' },
  { path: '/marketing-panel', title: 'Marketing Panel', menu_group: 'admin', template: 'standard-layout', icon: '📈' }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Starting import of existing pages...');
    
    // Get existing templates and menu groups
    const { data: templates } = await supabaseAdmin
      .from('page_templates')
      .select('*');
    
    const { data: menuGroups } = await supabaseAdmin
      .from('menu_groups')
      .select('*');

    if (!templates || !menuGroups) {
      return res.status(500).json({ 
        error: 'Failed to fetch templates and menu groups' 
      });
    }

    const templateMap = new Map(templates.map(t => [t.name, t.id]));
    const menuGroupMap = new Map(menuGroups.map(mg => [mg.name, mg.id]));
    
    let importedPages = 0;
    let errors = [];
    const pageMap = new Map(); // For parent-child relationships

    // First pass: Create all pages
    for (const pageInfo of PAGE_STRUCTURE) {
      try {
        const templateId = templateMap.get(pageInfo.template);
        const menuGroupId = menuGroupMap.get(pageInfo.menu_group);

        if (!templateId || !menuGroupId) {
          errors.push(`Missing template or menu group for ${pageInfo.path}`);
          continue;
        }

        // Check if page already exists
        const { data: existingPage } = await supabaseAdmin
          .from('pages')
          .select('id')
          .eq('slug', pageInfo.path)
          .single();

        if (existingPage) {
          console.log(`⏭️  Page ${pageInfo.path} already exists, skipping...`);
          pageMap.set(pageInfo.path, existingPage.id);
          continue;
        }

        // Create the page
        const { data: newPage, error: pageError } = await supabaseAdmin
          .from('pages')
          .insert({
            title: pageInfo.title,
            slug: pageInfo.path,
            description: `${pageInfo.title} - Imported from existing site`,
            template_id: templateId,
            template_props: {
              backgroundImage: pageInfo.template === 'glass-page' ? '' : undefined
            },
            status: 'published',
            meta_title: pageInfo.title,
            meta_description: `${pageInfo.title} - Rivervalley Rangers AFC`
          })
          .select()
          .single();

        if (pageError) {
          errors.push(`Failed to create page ${pageInfo.path}: ${pageError.message}`);
          continue;
        }

        pageMap.set(pageInfo.path, newPage.id);
        importedPages++;
        console.log(`✅ Created page: ${pageInfo.path}`);

      } catch (error) {
        errors.push(`Error processing ${pageInfo.path}: ${(error as Error).message}`);
      }
    }

    // Second pass: Create navigation structure
    let navigationItems = 0;
    
    for (const pageInfo of PAGE_STRUCTURE) {
      try {
        const pageId = pageMap.get(pageInfo.path);
        const menuGroupId = menuGroupMap.get(pageInfo.menu_group);
        
        if (!pageId || !menuGroupId) continue;

        // Check if navigation item already exists
        const { data: existingNav } = await supabaseAdmin
          .from('navigation_structure')
          .select('id')
          .eq('page_id', pageId)
          .single();

        if (existingNav) {
          console.log(`⏭️  Navigation for ${pageInfo.path} already exists, skipping...`);
          continue;
        }

        const parentPageId = pageInfo.parent ? pageMap.get(pageInfo.parent) : null;
        let parentNavId = null;

        if (parentPageId) {
          const { data: parentNav } = await supabaseAdmin
            .from('navigation_structure')
            .select('id')
            .eq('page_id', parentPageId)
            .single();
          
          if (parentNav) {
            parentNavId = parentNav.id;
          }
        }

        // Create navigation item
        const { error: navError } = await supabaseAdmin
          .from('navigation_structure')
          .insert({
            page_id: pageId,
            menu_group_id: menuGroupId,
            parent_id: parentNavId,
            sort_order: navigationItems,
            is_visible: !pageInfo.path.includes('admin') && !pageInfo.path.includes('mobile'),
            icon: pageInfo.icon
          });

        if (navError) {
          errors.push(`Failed to create navigation for ${pageInfo.path}: ${navError.message}`);
          continue;
        }

        navigationItems++;
        console.log(`🧭 Created navigation: ${pageInfo.path}`);

      } catch (error) {
        errors.push(`Error creating navigation for ${pageInfo.path}: ${(error as Error).message}`);
      }
    }

    console.log('🎉 Import completed!');
    
    return res.status(200).json({
      success: true,
      message: 'Import completed successfully',
      imported_pages: importedPages,
      navigation_items: navigationItems,
      errors: errors,
      total_processed: PAGE_STRUCTURE.length
    });

  } catch (error) {
    console.error('💥 Import failed:', error);
    return res.status(500).json({
      error: 'Import failed',
      details: (error as Error).message
    });
  }
}