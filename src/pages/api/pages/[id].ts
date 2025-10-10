/**
 * Individual Page API - Update/Delete specific pages
 * Supports updating and deleting individual pages by ID
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
    return res.status(400).json({ error: 'Page ID is required' });
  }

  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    switch (req.method) {
      case 'GET':
        return await getPage(req, res, id);
      case 'PUT':
        return await updatePage(req, res, id);
      case 'DELETE':
        return await deletePage(req, res, id);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Page API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: (error as Error).message
    });
  }
}

async function getPage(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { data, error } = await supabaseAdmin
    .from('pages')
    .select(`
      *,
      page_templates:template_id (
        name,
        display_name,
        template_type
      ),
      navigation_structure (
        id,
        menu_group_id,
        sort_order,
        is_visible,
        icon,
        menu_groups:menu_group_id (
          name,
          display_name,
          icon,
          color
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching page:', error);
    return res.status(404).json({ error: 'Page not found' });
  }

  return res.status(200).json({
    success: true,
    data
  });
}

async function updatePage(req: NextApiRequest, res: NextApiResponse, id: string) {
  const {
    title,
    description,
    status,
    meta_title,
    meta_description,
    template_props,
    is_featured,
    featured_image
  } = req.body;

  // Check if page exists
  const { data: existingPage } = await supabaseAdmin
    .from('pages')
    .select('id, status')
    .eq('id', id)
    .single();

  if (!existingPage) {
    return res.status(404).json({ error: 'Page not found' });
  }

  // Prepare update data
  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) {
    updateData.status = status;
    // Handle publishing
    if (status === 'published' && existingPage.status !== 'published') {
      updateData.published_at = new Date().toISOString();
    }
  }
  if (meta_title !== undefined) updateData.meta_title = meta_title;
  if (meta_description !== undefined) updateData.meta_description = meta_description;
  if (template_props !== undefined) updateData.template_props = template_props;
  if (is_featured !== undefined) updateData.is_featured = is_featured;
  if (featured_image !== undefined) updateData.featured_image = featured_image;

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

async function deletePage(req: NextApiRequest, res: NextApiResponse, id: string) {
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