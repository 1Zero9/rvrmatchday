/**
 * API endpoint to list all pages in maintenance table
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
  // Prevent caching of maintenance status
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_maintenance')
      .select('id, path, title, is_enabled')
      .order('path');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: 'Unexpected error',
      details: (error as Error).message
    });
  }
}