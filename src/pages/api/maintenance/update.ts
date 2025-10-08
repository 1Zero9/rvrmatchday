/**
 * API endpoint to update page maintenance status
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

  const { pageId, isEnabled, maintenanceReason, disabledBy } = req.body;

  if (!pageId || typeof isEnabled !== 'boolean') {
    return res.status(400).json({ error: 'Missing required fields: pageId, isEnabled' });
  }

  try {
    const updateData = {
      is_enabled: isEnabled,
      maintenance_reason: isEnabled ? null : maintenanceReason,
      disabled_at: isEnabled ? null : new Date().toISOString(),
      disabled_by: isEnabled ? null : disabledBy || 'admin',
      updated_at: new Date().toISOString()
    };

    console.log('🔧 API: Updating page maintenance:', { pageId, updateData });

    const { data, error } = await supabaseAdmin
      .from('page_maintenance')
      .update(updateData)
      .eq('id', pageId)
      .select()
      .single();

    if (error) {
      console.error('🚨 API: Database update error:', error);
      return res.status(500).json({ 
        error: 'Database update failed', 
        details: error.message,
        code: error.code 
      });
    }

    console.log('✅ API: Page maintenance updated successfully:', data);

    return res.status(200).json({
      success: true,
      data: data,
      message: `Page ${isEnabled ? 'enabled' : 'disabled'} successfully`
    });

  } catch (error) {
    console.error('💥 API: Unexpected error:', error);
    return res.status(500).json({
      error: 'Unexpected error',
      details: (error as Error).message
    });
  }
}