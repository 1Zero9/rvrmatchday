/**
 * Pages API - CRUD operations for dynamic page management
 * Supports create, read, update, delete operations for pages
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
        return await getPages(req, res);
      case 'POST':
        return await createPage(req, res);
      case 'PUT':
        return await updatePage(req, res);
      case 'DELETE':
        return await deletePage(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Pages API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: (error as Error).message
    });
  }
}

async function getPages(req: NextApiRequest, res: NextApiResponse) {
  const { status, template_id, menu_group, search, include_navigation } = req.query;

  let query = supabaseAdmin
    .from(include_navigation ? 'page_navigation_view' : 'pages')
    .select('*');

  // Apply filters
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (template_id) {
    query = query.eq('template_id', template_id);
  }

  if (menu_group) {
    query = query.eq('menu_group_name', menu_group);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  query = query.order('updated_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pages:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    data: data || [],
    count: data?.length || 0
  });
}

async function createPage(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    slug,
    description,
    content,
    template_id,
    template_props,
    meta_title,
    meta_description,
    meta_keywords,
    status = 'draft',
    is_featured = false,
    featured_image,
    author_id,
    menu_group_id,
    parent_id,
    sort_order = 0,
    is_visible = true,
    icon,
    css_classes
  } = req.body;

  if (!title || !slug || !template_id) {
    return res.status(400).json({
      error: 'Missing required fields: title, slug, template_id'
    });
  }

  // Check if slug already exists
  const { data: existingPage } = await supabaseAdmin
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existingPage) {
    return res.status(400).json({
      error: 'Page with this slug already exists'
    });
  }

  // Create the page
  const { data: newPage, error: pageError } = await supabaseAdmin
    .from('pages')
    .insert({
      title,
      slug,
      description,
      content: content || {},
      template_id,
      template_props: template_props || {},
      meta_title: meta_title || title,
      meta_description: meta_description || description,
      meta_keywords,
      status,
      is_featured,
      featured_image,
      author_id,
      published_at: status === 'published' ? new Date().toISOString() : null
    })
    .select()
    .single();

  if (pageError) {
    console.error('Error creating page:', pageError);
    return res.status(500).json({ error: pageError.message });
  }

  // Create navigation structure if menu_group_id provided
  if (menu_group_id && newPage) {
    const { error: navError } = await supabaseAdmin
      .from('navigation_structure')
      .insert({
        page_id: newPage.id,
        menu_group_id,
        parent_id,
        sort_order,
        is_visible,
        icon,
        css_classes
      });

    if (navError) {
      console.error('Error creating navigation structure:', navError);
      // Don't fail the entire operation, just log the error
    }
  }

  return res.status(201).json({
    success: true,
    data: newPage,
    message: 'Page created successfully'
  });
}

async function updatePage(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Page ID is required' });
  }

  // Check if page exists
  const { data: existingPage } = await supabaseAdmin
    .from('pages')
    .select('id, status')
    .eq('id', id)
    .single();

  if (!existingPage) {
    return res.status(404).json({ error: 'Page not found' });
  }

  // Handle publishing
  if (updateData.status === 'published' && existingPage.status !== 'published') {
    updateData.published_at = new Date().toISOString();
  }

  const { data: updatedPage, error } = await supabaseAdmin
    .from('pages')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating page:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    data: updatedPage,
    message: 'Page updated successfully'
  });
}

async function deletePage(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Page ID is required' });
  }

  // Get page info before deletion
  const { data: page } = await supabaseAdmin
    .from('pages')
    .select('title, slug')
    .eq('id', id)
    .single();

  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }

  // Delete the page (navigation structure will be deleted via CASCADE)
  const { error } = await supabaseAdmin
    .from('pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting page:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    message: `Page "${page.title}" deleted successfully`
  });
}