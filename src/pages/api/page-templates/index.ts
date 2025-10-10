/**
 * Page Templates API - Manage available page templates
 * Provides CRUD operations for page templates (StandardLayout, GlassPageTemplate, etc.)
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
        return await getTemplates(req, res);
      case 'POST':
        return await createTemplate(req, res);
      case 'PUT':
        return await updateTemplate(req, res);
      case 'DELETE':
        return await deleteTemplate(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Page Templates API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: (error as Error).message
    });
  }
}

async function getTemplates(req: NextApiRequest, res: NextApiResponse) {
  const { template_type, active_only } = req.query;

  let query = supabaseAdmin
    .from('page_templates')
    .select('*');

  if (template_type && template_type !== 'all') {
    query = query.eq('template_type', template_type);
  }

  if (active_only === 'true') {
    query = query.eq('is_active', true);
  }

  query = query.order('display_name', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching templates:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    data: data || [],
    count: data?.length || 0
  });
}

async function createTemplate(req: NextApiRequest, res: NextApiResponse) {
  const {
    name,
    display_name,
    description,
    template_type,
    default_props,
    component_path,
    preview_image,
    is_active = true
  } = req.body;

  if (!name || !display_name || !template_type) {
    return res.status(400).json({
      error: 'Missing required fields: name, display_name, template_type'
    });
  }

  // Check if template name already exists
  const { data: existingTemplate } = await supabaseAdmin
    .from('page_templates')
    .select('id')
    .eq('name', name)
    .single();

  if (existingTemplate) {
    return res.status(400).json({
      error: 'Template with this name already exists'
    });
  }

  const { data, error } = await supabaseAdmin
    .from('page_templates')
    .insert({
      name,
      display_name,
      description,
      template_type,
      default_props: default_props || {},
      component_path,
      preview_image,
      is_active
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating template:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({
    success: true,
    data,
    message: 'Template created successfully'
  });
}

async function updateTemplate(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Template ID is required' });
  }

  const { data, error } = await supabaseAdmin
    .from('page_templates')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating template:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    data,
    message: 'Template updated successfully'
  });
}

async function deleteTemplate(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Template ID is required' });
  }

  // Check if template is in use
  const { data: pagesUsingTemplate } = await supabaseAdmin
    .from('pages')
    .select('id, title')
    .eq('template_id', id)
    .limit(5);

  if (pagesUsingTemplate && pagesUsingTemplate.length > 0) {
    return res.status(400).json({
      error: 'Cannot delete template that is in use by pages',
      pages_using: pagesUsingTemplate.map(p => p.title)
    });
  }

  const { error } = await supabaseAdmin
    .from('page_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting template:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    success: true,
    message: 'Template deleted successfully'
  });
}