/**
 * API endpoint to run SQL directly against the database
 * For testing and migrations
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ error: 'SQL query is required' });
  }

  try {
    console.log('🔧 Executing SQL:', sql);

    // Execute the SQL
    const { data, error } = await supabaseAdmin.rpc('execute_sql', { sql });

    if (error) {
      console.error('SQL execution error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ SQL executed successfully');
    res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message });
  }
}