/**
 * Menu Groups API - Manage navigation menu categories
 * Provides CRUD operations for menu groups (About, Teams, Contact, etc.)
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
  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    switch (req.method) {
      case 'GET':
        return await getMenuGroups(req, res);
      case 'POST':
        return await createMenuGroup(req, res);
      case 'PUT':
        return await updateMenuGroup(req, res);
      case 'DELETE':
        return await deleteMenuGroup(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Menu Groups API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: (error as Error).message
    });
  }
}

async function getMenuGroups(req: NextApiRequest, res: NextApiResponse) {
  const { active_only, include_page_count } = req.query;

  let query = supabaseAdmin
    .from('menu_groups')
    .select(include_page_count === 'true' 
      ? `*, page_count:navigation_structure(count)` 
      : '*'
    );

  if (active_only === 'true') {
    query = query.eq('is_active', true);
  }

  query = query.order('sort_order', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching menu groups:', error);
    return res.status(500).json({ error: error.message });
  }

  // If including page count, get actual counts
  if (include_page_count === 'true' && data) {
    const enrichedData = await Promise.all(
      data.map(async (group) => {
        const { count } = await supabaseAdmin
          .from('navigation_structure')
          .select('*', { count: 'exact', head: true })
          .eq('menu_group_id', group.id);

        return {
          ...group,
          page_count: count || 0
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enrichedData,
      count: enrichedData.length
    });
  }

  return res.status(200).json({
    success: true,
    data: data || [],
    count: data?.length || 0
  });
}

async function createMenuGroup(req: NextApiRequest, res: NextApiResponse) {
  const {
    name,
    display_name,
    description,
    icon,
    color,
    sort_order = 0,
    is_active = true
  } = req.body;

  if (!name || !display_name) {
    return res.status(400).json({
      error: 'Missing required fields: name, display_name'
    });
  }

  // Check if menu group name already exists
  const { data: existingGroup } = await supabaseAdmin
    .from('menu_groups')
    .select('id')
    .eq('name', name)
    .single();

  if (existingGroup) {
    return res.status(400).json({
      error: 'Menu group with this name already exists'
    });
  }

  const { data, error } = await supabaseAdmin
    .from('menu_groups')
    .insert({
      name,
      display_name,
      description,
      icon,
      color,
      sort_order,
      is_active
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating menu group:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({
    success: true,
    data,
    message: 'Menu group created successfully'
  });
}

async function updateMenuGroup(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Menu group ID is required' });
  }

  const { data, error } = await supabaseAdmin
    .from('menu_groups')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating menu group:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    data,
    message: 'Menu group updated successfully'
  });
}

async function deleteMenuGroup(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { force = false } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Menu group ID is required' });
  }

  // Check if menu group has pages
  const { data: pagesInGroup, count } = await supabaseAdmin
    .from('navigation_structure')
    .select('page_id', { count: 'exact' })
    .eq('menu_group_id', id);

  if (count && count > 0 && !force) {
    return res.status(400).json({
      error: 'Cannot delete menu group that contains pages',
      page_count: count,
      message: 'Move pages to another group or use force=true to delete all'
    });
  }

  // If force delete, remove all navigation items first
  if (force && count && count > 0) {
    const { error: navError } = await supabaseAdmin
      .from('navigation_structure')
      .delete()
      .eq('menu_group_id', id);

    if (navError) {
      console.error('Error deleting navigation items:', navError);
      return res.status(500).json({ 
        error: 'Failed to delete navigation items',
        details: navError.message 
      });
    }
  }

  const { error } = await supabaseAdmin
    .from('menu_groups')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu group:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    message: 'Menu group deleted successfully',
    pages_removed: count || 0
  });
}