/**
 * Individual Navigation API - Update navigation properties
 * Supports updating navigation visibility, menu group, etc.
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
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Navigation ID is required' });
  }

  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    switch (req.method) {
      case 'PUT':
        return await updateNavigation(req, res, id);
      case 'DELETE':
        return await deleteNavigation(req, res, id);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Navigation API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: (error as Error).message
    });
  }
}

async function updateNavigation(req: NextApiRequest, res: NextApiResponse, id: string) {
  const {
    is_visible,
    menu_group_id,
    sort_order,
    icon,
    parent_id
  } = req.body;

  // Prepare update data
  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  if (is_visible !== undefined) updateData.is_visible = is_visible;
  if (menu_group_id !== undefined) updateData.menu_group_id = menu_group_id;
  if (sort_order !== undefined) updateData.sort_order = sort_order;
  if (icon !== undefined) updateData.icon = icon;
  if (parent_id !== undefined) updateData.parent_id = parent_id;

  const { data: updatedNav, error } = await supabaseAdmin
    .from('navigation_structure')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating navigation:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    data: updatedNav,
    message: 'Navigation updated successfully'
  });
}

async function deleteNavigation(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { error } = await supabaseAdmin
    .from('navigation_structure')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting navigation:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    message: 'Navigation item deleted successfully'
  });
}