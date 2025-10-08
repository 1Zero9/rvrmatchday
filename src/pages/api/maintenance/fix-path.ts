/**
 * API endpoint to fix incorrect paths in maintenance table
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

  const { pageId, newPath } = req.body;

  if (!pageId || !newPath) {
    return res.status(400).json({ error: 'Missing required fields: pageId, newPath' });
  }

  try {
    console.log('🔧 Fixing path for page:', pageId, 'to:', newPath);

    const { data, error } = await supabaseAdmin
      .from('page_maintenance')
      .update({ 
        path: newPath,
        updated_at: new Date().toISOString()
      })
      .eq('id', pageId)
      .select()
      .single();

    if (error) {
      console.error('🚨 Path fix error:', error);
      return res.status(500).json({ 
        error: 'Database update failed', 
        details: error.message 
      });
    }

    console.log('✅ Path fixed successfully:', data);

    return res.status(200).json({
      success: true,
      data: data,
      message: `Path updated to ${newPath} successfully`
    });

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return res.status(500).json({
      error: 'Unexpected error',
      details: (error as Error).message
    });
  }
}