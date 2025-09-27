/**
 * API endpoint to check if a page is under maintenance
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
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

  const { path } = req.query;

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Page path is required' });
  }

  try {
    // Check database for maintenance status
    const { data, error } = await supabaseAdmin
      .from('page_maintenance')
      .select('*')
      .eq('path', path)
      .single();

    if (error) {
      // If table doesn't exist or page not found, assume it's enabled
      if (error.code === 'PGRST116' || error.details?.includes('does not exist')) {
        return res.status(200).json({
          is_enabled: true,
          path,
          maintenance_reason: null,
          disabled_at: null,
          disabled_by: null
        });
      }
      throw error;
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error checking maintenance status:', error);
    
    // Fallback: assume page is enabled if there's an error
    return res.status(200).json({
      is_enabled: true,
      path,
      maintenance_reason: null,
      disabled_at: null,
      disabled_by: null
    });
  }
}