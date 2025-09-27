/**
 * Admin API - Page Maintenance Management
 * Handles updating page maintenance status
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
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, is_enabled, maintenance_reason, disabled_by } = req.body;

  if (!id || typeof is_enabled !== 'boolean') {
    return res.status(400).json({ error: 'Missing required fields: id, is_enabled' });
  }

  try {
    const updateData = {
      is_enabled,
      maintenance_reason: is_enabled ? null : maintenance_reason,
      disabled_at: is_enabled ? null : new Date().toISOString(),
      disabled_by: is_enabled ? null : (disabled_by || 'admin'),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabaseAdmin
      .from('page_maintenance')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating page maintenance:', error);
      return res.status(500).json({ error: 'Failed to update page maintenance status' });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Page ${is_enabled ? 'enabled' : 'disabled'} successfully`,
      data: updateData 
    });

  } catch (error) {
    console.error('Error processing page maintenance update:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}