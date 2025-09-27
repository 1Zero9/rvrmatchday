/**
 * Admin API - Undo Action
 * Handles reversing admin actions like delete, update, create
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

interface UndoRequest {
  actionType: 'delete_user' | 'update_user' | 'create_user' | 'delete_article' | 'delete_event' | 'delete_volunteer' | 'delete_signup' | 'toggle_page_maintenance';
  originalData: any;
  userId?: string;
  adminUserId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { actionType, originalData, userId, adminUserId }: UndoRequest = req.body;

    if (!actionType || !adminUserId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let success = false;
    let message = '';

    switch (actionType) {
      case 'delete_user':
        // Restore the deleted user
        const { error: restoreError } = await supabaseAdmin
          .from('tracker_users')
          .insert([originalData]);
        
        success = !restoreError;
        message = success ? 'User restored successfully' : `Failed to restore user: ${restoreError?.message}`;
        break;

      case 'delete_article':
        // Restore the deleted news article
        const { error: restoreArticleError } = await supabaseAdmin
          .from('news_articles')
          .insert([originalData]);
        
        success = !restoreArticleError;
        message = success ? 'Article restored successfully' : `Failed to restore article: ${restoreArticleError?.message}`;
        break;

      case 'delete_event':
        // Restore the deleted special event
        const { error: restoreEventError } = await supabaseAdmin
          .from('special_events')
          .insert([originalData]);
        
        success = !restoreEventError;
        message = success ? 'Event restored successfully' : `Failed to restore event: ${restoreEventError?.message}`;
        break;

      case 'delete_volunteer':
        // Restore the deleted volunteer opportunity
        const { error: restoreVolunteerError } = await supabaseAdmin
          .from('volunteer_opportunities')
          .insert([originalData]);
        
        success = !restoreVolunteerError;
        message = success ? 'Volunteer opportunity restored successfully' : `Failed to restore volunteer opportunity: ${restoreVolunteerError?.message}`;
        break;

      case 'delete_signup':
        // Restore the deleted volunteer signup
        const { error: restoreSignupError } = await supabaseAdmin
          .from('volunteer_signups')
          .insert([originalData]);
        
        success = !restoreSignupError;
        message = success ? 'Volunteer signup restored successfully' : `Failed to restore volunteer signup: ${restoreSignupError?.message}`;
        break;

      case 'toggle_page_maintenance':
        // Toggle page maintenance status back
        const { error: toggleMaintenanceError } = await supabaseAdmin
          .from('page_maintenance')
          .update({ 
            is_enabled: originalData.previous_status,
            maintenance_reason: originalData.previous_status ? null : originalData.maintenance_reason,
            disabled_at: originalData.previous_status ? null : originalData.disabled_at,
            disabled_by: originalData.previous_status ? null : originalData.disabled_by,
            updated_at: new Date().toISOString()
          })
          .eq('id', originalData.id);
        
        success = !toggleMaintenanceError;
        message = success ? `Page maintenance status reverted successfully` : `Failed to revert page maintenance status: ${toggleMaintenanceError?.message}`;
        break;

      case 'update_user':
        // Restore the previous user data
        if (!userId) {
          return res.status(400).json({ error: 'User ID required for update undo' });
        }
        
        const { error: updateError } = await supabaseAdmin
          .from('tracker_users')
          .update(originalData)
          .eq('id', userId);
        
        success = !updateError;
        message = success ? 'User update reverted successfully' : `Failed to revert user update: ${updateError?.message}`;
        break;

      case 'create_user':
        // Remove the created user
        if (!userId) {
          return res.status(400).json({ error: 'User ID required for create undo' });
        }
        
        const { error: deleteError } = await supabaseAdmin
          .from('tracker_users')
          .delete()
          .eq('id', userId);
        
        success = !deleteError;
        message = success ? 'User creation reverted successfully' : `Failed to revert user creation: ${deleteError?.message}`;
        break;

      default:
        return res.status(400).json({ error: 'Unsupported action type' });
    }

    if (success) {
      // Log the undo action
      try {
        await supabaseAdmin
          .from('user_management_log')
          .insert([{
            admin_user_id: adminUserId,
            target_user_id: userId || originalData?.id,
            action: `undo_${actionType}`,
            details: {
              original_action: actionType,
              restored_data: actionType === 'delete_user' ? originalData : null,
              timestamp: new Date().toISOString()
            }
          }]);
      } catch (logError) {
        console.log('Undo logging failed:', logError);
      }
    }

    res.status(success ? 200 : 500).json({
      success,
      message,
      actionType
    });

  } catch (error) {
    console.error('Error processing undo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}