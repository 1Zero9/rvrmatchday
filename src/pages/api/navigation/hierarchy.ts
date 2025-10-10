/**
 * Navigation Hierarchy API - Get proper hierarchical structure for page manager
 * Returns pages with correct navigation relationships
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get pages with their navigation structure
    const { data: pageData, error: pageError } = await supabaseAdmin
      .from('pages')
      .select(`
        id,
        title,
        slug,
        status,
        navigation_structure (
          id,
          menu_group_id,
          parent_id,
          sort_order,
          is_visible,
          menu_groups (
            id,
            name,
            display_name,
            icon,
            color
          )
        )
      `)
      .in('status', ['published', 'draft', 'maintenance', 'archived'])
      .order('updated_at', { ascending: false });

    if (pageError) {
      console.error('Error fetching pages:', pageError);
      return res.status(500).json({ error: pageError.message });
    }

    // Transform the data to include navigation info at the page level
    const transformedPages = (pageData || []).map(page => {
      const nav = page.navigation_structure?.[0]; // Pages typically have one navigation entry
      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        nav_id: nav?.id,
        parent_id: nav?.parent_id,
        menu_group_id: nav?.menu_group_id,
        menu_group_name: nav?.menu_groups?.name,
        menu_group_display_name: nav?.menu_groups?.display_name,
        menu_group_icon: nav?.menu_groups?.icon,
        menu_group_color: nav?.menu_groups?.color,
        sort_order: nav?.sort_order,
        is_visible: nav?.is_visible
      };
    }).filter(page => page.menu_group_name); // Only include pages with navigation

    return res.status(200).json({
      success: true,
      data: transformedPages,
      count: transformedPages.length
    });

  } catch (error) {
    console.error('Navigation hierarchy API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: (error as Error).message
    });
  }
}