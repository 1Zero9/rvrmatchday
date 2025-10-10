/**
 * Update Page Menu API - Move pages between menu groups
 * Handles moving pages from one menu group to another
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

  const { page_id, menu_group_id, is_visible = true, parent_id = null } = req.body;

  if (!page_id || !menu_group_id) {
    return res.status(400).json({ 
      error: 'Missing required fields: page_id, menu_group_id' 
    });
  }

  try {
    // Check if navigation structure exists for this page
    const { data: existingNav } = await supabaseAdmin
      .from('navigation_structure')
      .select('id')
      .eq('page_id', page_id)
      .single();

    if (existingNav) {
      // Update existing navigation structure
      const { data, error } = await supabaseAdmin
        .from('navigation_structure')
        .update({
          menu_group_id,
          is_visible,
          parent_id,
          updated_at: new Date().toISOString()
        })
        .eq('page_id', page_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating navigation:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        data,
        message: 'Page moved to new menu group successfully'
      });
    } else {
      // Create new navigation structure
      const { data, error } = await supabaseAdmin
        .from('navigation_structure')
        .insert({
          page_id,
          menu_group_id,
          is_visible,
          parent_id,
          sort_order: 0 // Will be updated later for proper ordering
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating navigation:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({
        success: true,
        data,
        message: 'Page added to menu group successfully'
      });
    }

  } catch (error) {
    console.error('Update page menu error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: (error as Error).message
    });
  }
}