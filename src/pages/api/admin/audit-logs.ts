import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      page = '1', 
      limit = '50', 
      action_type, 
      admin_user_id, 
      target_user_id,
      date_from,
      date_to 
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build query
    let query = supabase
      .from('admin_audit_log')
      .select(`
        *,
        admin_user:admin_user_id(full_name, email),
        target_user:target_user_id(full_name, email)
      `)
      .order('timestamp', { ascending: false })
      .range(offset, offset + parseInt(limit as string) - 1);

    // Apply filters
    if (action_type) {
      query = query.eq('action_type', action_type);
    }
    if (admin_user_id) {
      query = query.eq('admin_user_id', admin_user_id);
    }
    if (target_user_id) {
      query = query.eq('target_user_id', target_user_id);
    }
    if (date_from) {
      query = query.gte('timestamp', date_from);
    }
    if (date_to) {
      query = query.lte('timestamp', date_to);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      return res.status(500).json({ error: 'Failed to fetch audit logs' });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('admin_audit_log')
      .select('*', { count: 'exact', head: true });

    if (action_type) countQuery = countQuery.eq('action_type', action_type);
    if (admin_user_id) countQuery = countQuery.eq('admin_user_id', admin_user_id);
    if (target_user_id) countQuery = countQuery.eq('target_user_id', target_user_id);
    if (date_from) countQuery = countQuery.gte('timestamp', date_from);
    if (date_to) countQuery = countQuery.lte('timestamp', date_to);

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting audit logs:', countError);
      return res.status(500).json({ error: 'Failed to count audit logs' });
    }

    // Get summary statistics
    const { data: actionStats } = await supabase
      .from('admin_audit_log')
      .select('action_type')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    const actionSummary = actionStats?.reduce((acc: Record<string, number>, log) => {
      acc[log.action_type] = (acc[log.action_type] || 0) + 1;
      return acc;
    }, {}) || {};

    return res.status(200).json({
      logs,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / parseInt(limit as string))
      },
      summary: {
        actionStats: actionSummary,
        totalActions: actionStats?.length || 0
      }
    });

  } catch (error) {
    console.error('Audit logs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}