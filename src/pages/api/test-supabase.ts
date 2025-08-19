import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test basic connection
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Try to connect and list tables
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      return res.status(500).json({ 
        success: false,
        message: 'Database connection failed',
        error: error.message,
        details: error
      });
    }

    // Test admin connection
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try admin operation
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1);

    res.status(200).json({ 
      success: true,
      message: 'Supabase connection successful',
      basicConnection: data !== null,
      adminConnection: adminData !== null,
      adminError: adminError?.message || null
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Supabase test error:', error);
    res.status(500).json({ 
      success: false,
      message: errorMessage,
      type: 'connection_error'
    });
  }
}