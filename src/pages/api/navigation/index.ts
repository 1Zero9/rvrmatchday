/**
 * Navigation API - Manage drag-and-drop navigation structure
 * Supports hierarchical organization and reordering of pages in menus
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

interface NavigationItem {
  id: string;
  page_id: string;
  menu_group_id: string;
  parent_id?: string;
  sort_order: number;
  is_visible: boolean;
  title?: string;
  slug?: string;
  children?: NavigationItem[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    switch (req.method) {
      case 'GET':
        return await getNavigationStructure(req, res);
      case 'POST':
        return await createNavigationItem(req, res);
      case 'PUT':
        return await updateNavigationStructure(req, res);
      case 'DELETE':
        return await deleteNavigationItem(req, res);
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

async function getNavigationStructure(req: NextApiRequest, res: NextApiResponse) {
  const { menu_group, include_hidden, flat } = req.query;

  let query = supabaseAdmin
    .from('page_navigation_view')
    .select('*');

  if (menu_group && menu_group !== 'all') {
    query = query.eq('menu_group_name', menu_group);
  }

  if (!include_hidden) {
    query = query.eq('is_visible', true);
  }

  query = query.order('sort_order', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching navigation:', error);
    return res.status(500).json({ error: error.message });
  }

  if (flat === 'true') {
    return res.status(200).json({
      success: true,
      data: data || []
    });
  }

  // Build hierarchical structure
  const hierarchical = buildNavigationTree(data || []);

  return res.status(200).json({
    success: true,
    data: hierarchical
  });
}

async function createNavigationItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    page_id,
    menu_group_id,
    parent_id,
    sort_order = 0,
    is_visible = true,
    is_external = false,
    external_url,
    icon,
    css_classes
  } = req.body;

  if (!page_id || !menu_group_id) {
    return res.status(400).json({
      error: 'Missing required fields: page_id, menu_group_id'
    });
  }

  const { data, error } = await supabaseAdmin
    .from('navigation_structure')
    .insert({
      page_id,
      menu_group_id,
      parent_id,
      sort_order,
      is_visible,
      is_external,
      external_url,
      icon,
      css_classes
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating navigation item:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({
    success: true,
    data,
    message: 'Navigation item created successfully'
  });
}

async function updateNavigationStructure(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  if (action === 'reorder') {
    return await reorderNavigation(req, res);
  } else if (action === 'move') {
    return await moveNavigationItem(req, res);
  } else {
    return await updateNavigationItem(req, res);
  }
}

async function updateNavigationItem(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Navigation item ID is required' });
  }

  const { data, error } = await supabaseAdmin
    .from('navigation_structure')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating navigation item:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    data,
    message: 'Navigation item updated successfully'
  });
}

async function reorderNavigation(req: NextApiRequest, res: NextApiResponse) {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items array is required' });
  }

  // Update sort order for all items
  const updates = items.map((item, index) => ({
    id: item.id,
    sort_order: index,
    parent_id: item.parent_id || null,
    menu_group_id: item.menu_group_id
  }));

  const { error } = await supabaseAdmin.rpc('update_navigation_order', {
    navigation_updates: updates
  });

  if (error) {
    console.error('Error reordering navigation:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    message: 'Navigation reordered successfully'
  });
}

async function moveNavigationItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    item_id,
    new_menu_group_id,
    new_parent_id,
    new_sort_order
  } = req.body;

  if (!item_id || !new_menu_group_id) {
    return res.status(400).json({
      error: 'Missing required fields: item_id, new_menu_group_id'
    });
  }

  const { data, error } = await supabaseAdmin
    .from('navigation_structure')
    .update({
      menu_group_id: new_menu_group_id,
      parent_id: new_parent_id,
      sort_order: new_sort_order || 0
    })
    .eq('id', item_id)
    .select()
    .single();

  if (error) {
    console.error('Error moving navigation item:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    data,
    message: 'Navigation item moved successfully'
  });
}

async function deleteNavigationItem(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Navigation item ID is required' });
  }

  const { error } = await supabaseAdmin
    .from('navigation_structure')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting navigation item:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    message: 'Navigation item deleted successfully'
  });
}

function buildNavigationTree(flatData: any[]): any[] {
  const itemsMap = new Map();
  const tree: any[] = [];

  // Create a map of all items
  flatData.forEach(item => {
    itemsMap.set(item.id, {
      ...item,
      children: []
    });
  });

  // Build the tree structure
  flatData.forEach(item => {
    const currentItem = itemsMap.get(item.id);
    
    if (item.parent_id) {
      const parent = itemsMap.get(item.parent_id);
      if (parent) {
        parent.children.push(currentItem);
      }
    } else {
      tree.push(currentItem);
    }
  });

  return tree;
}