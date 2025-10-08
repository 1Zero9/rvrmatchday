/**
 * Debug API endpoint for page maintenance
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

  try {
    // Check if table exists and get all records
    const { data, error, count } = await supabaseAdmin
      .from('page_maintenance')
      .select('*', { count: 'exact' });

    if (error) {
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message,
        code: error.code,
        hint: error.hint 
      });
    }

    // Check specific page
    const { data: trialPage, error: trialError } = await supabaseAdmin
      .from('page_maintenance')
      .select('*')
      .eq('path', '/join/trials')
      .single();

    return res.status(200).json({
      success: true,
      totalRecords: count,
      sampleData: data?.slice(0, 5) || [],
      trialPage: trialPage || null,
      trialError: trialError || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return res.status(500).json({
      error: 'Unexpected error',
      details: (error as Error).message
    });
  }
}