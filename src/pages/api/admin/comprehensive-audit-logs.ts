/**
 * Admin API - Comprehensive Audit Logs
 * Enhanced audit log API that works with both legacy and new comprehensive tables
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

interface QueryFilters {
  page?: string;
  limit?: string;
  event_type?: string;
  action?: string;
  admin_user_id?: string;
  target_type?: string;
  target_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      page = '1',
      limit = '50',
      event_type,
      action,
      admin_user_id,
      target_type,
      target_id,
      status,
      date_from,
      date_to,
      search
    }: QueryFilters = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    // Try to query the new comprehensive table first
    let logs: any[] = [];
    let totalCount = 0;
    let usingComprehensiveTable = false;

    try {
      // Build comprehensive table query
      let query = supabaseAdmin
        .from('admin_event_log_with_users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limitNum - 1);

      // Apply filters
      if (event_type) query = query.eq('event_type', event_type);
      if (action) query = query.eq('action', action);
      if (admin_user_id) query = query.eq('admin_user_id', admin_user_id);
      if (target_type) query = query.eq('target_type', target_type);
      if (target_id) query = query.eq('target_id', target_id);
      if (status) query = query.eq('status', status);
      if (date_from) query = query.gte('created_at', date_from);
      if (date_to) query = query.lte('created_at', date_to);
      if (search) {
        query = query.or(`description.ilike.%${search}%,admin_full_name.ilike.%${search}%,target_identifier.ilike.%${search}%`);
      }

      const { data: comprehensiveLogs, error: comprehensiveError } = await query;

      if (!comprehensiveError && comprehensiveLogs) {
        logs = comprehensiveLogs;
        usingComprehensiveTable = true;

        // Get total count for pagination
        let countQuery = supabaseAdmin
          .from('admin_event_log')
          .select('*', { count: 'exact', head: true });

        if (event_type) countQuery = countQuery.eq('event_type', event_type);
        if (action) countQuery = countQuery.eq('action', action);
        if (admin_user_id) countQuery = countQuery.eq('admin_user_id', admin_user_id);
        if (target_type) countQuery = countQuery.eq('target_type', target_type);
        if (target_id) countQuery = countQuery.eq('target_id', target_id);
        if (status) countQuery = countQuery.eq('status', status);
        if (date_from) countQuery = countQuery.gte('created_at', date_from);
        if (date_to) countQuery = countQuery.lte('created_at', date_to);

        const { count } = await countQuery;
        totalCount = count || 0;
      }
    } catch (comprehensiveTableError) {
      console.log('Comprehensive table not available, using legacy tables');
    }

    // Fall back to legacy tables if comprehensive table is not available
    if (!usingComprehensiveTable) {
      console.log('Using legacy audit tables');
      
      let legacyLogs: any[] = [];
      let legacyError: any = null;
      
      // Try admin_audit_log first
      try {
        let legacyQuery = supabaseAdmin
          .from('admin_audit_log')
          .select(`
            *,
            admin_user:admin_user_id(full_name, email, username),
            target_user:target_user_id(full_name, email, username)
          `)
          .order('timestamp', { ascending: false })
          .range(offset, offset + limitNum - 1);

        // Apply legacy filters
        if (action) legacyQuery = legacyQuery.eq('action', action);
        if (admin_user_id) legacyQuery = legacyQuery.eq('admin_user_id', admin_user_id);
        if (target_id) legacyQuery = legacyQuery.eq('target_user_id', target_id);
        if (date_from) legacyQuery = legacyQuery.gte('timestamp', date_from);
        if (date_to) legacyQuery = legacyQuery.lte('timestamp', date_to);

        const { data: adminAuditLogs, error: adminAuditError } = await legacyQuery;
        
        if (!adminAuditError && adminAuditLogs) {
          legacyLogs = adminAuditLogs;
        } else if (adminAuditError && !adminAuditError.message.includes('does not exist')) {
          // If error is not about table not existing, throw it
          throw adminAuditError;
        }
      } catch (error: any) {
        console.log('admin_audit_log table not available, trying user_management_log');
      }
      
      // If admin_audit_log failed or is empty, try user_management_log
      if (legacyLogs.length === 0) {
        try {
          let userMgmtQuery = supabaseAdmin
            .from('user_management_log')
            .select(`
              *,
              admin_user:admin_user_id(full_name, email, username),
              target_user:target_user_id(full_name, email, username)
            `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limitNum - 1);

          // Apply filters for user_management_log
          if (action) userMgmtQuery = userMgmtQuery.eq('action', action);
          if (admin_user_id) userMgmtQuery = userMgmtQuery.eq('admin_user_id', admin_user_id);
          if (target_id) userMgmtQuery = userMgmtQuery.eq('target_user_id', target_id);
          if (date_from) userMgmtQuery = userMgmtQuery.gte('created_at', date_from);
          if (date_to) userMgmtQuery = userMgmtQuery.lte('created_at', date_to);

          const { data: userMgmtLogs, error: userMgmtError } = await userMgmtQuery;
          
          if (userMgmtError) {
            console.error('Error fetching user_management_log:', userMgmtError);
            legacyError = userMgmtError;
          } else {
            legacyLogs = userMgmtLogs || [];
            console.log(`Found ${legacyLogs.length} records in user_management_log`);
          }
        } catch (error) {
          console.error('Error accessing user_management_log:', error);
          legacyError = error;
        }
      }

      // If we still have errors and no logs, return error
      if (legacyError && legacyLogs.length === 0) {
        console.error('Error fetching from all legacy audit tables:', legacyError);
        return res.status(500).json({ error: 'Failed to fetch audit logs from any available table' });
      }

      // Transform legacy data to match new structure
      logs = (legacyLogs || []).map(log => {
        // Extract event details from the stored comprehensive data
        const details = log.details || {};
        const eventType = details.event_type || 'user_management';
        const targetType = details.target_type || (log.target_user_id ? 'user' : null);
        const targetIdentifier = details.target_identifier || log.target_user?.full_name;
        const description = details.description || `User management action: ${log.action}`;
        const status = details.status || 'success';

        return {
          id: log.id,
          admin_user_id: log.admin_user_id,
          admin_full_name: log.admin_user?.full_name,
          admin_username: log.admin_user?.username,
          admin_email: log.admin_user?.email,
          event_type: eventType,
          action: log.action,
          target_type: targetType,
          target_id: details.target_id || log.target_user_id,
          target_identifier: targetIdentifier,
          target_user_name: log.target_user?.full_name,
          target_user_email: log.target_user?.email,
          description: description,
          details: details.comprehensive_event_data || details,
          status: status,
          created_at: log.timestamp || log.created_at,
          ip_address: log.ip_address || null,
          user_agent: log.user_agent || null,
          request_path: details.request_path || null
        };
      });

      // Get count for whichever legacy table we're using
      let countQuery;
      let tableName = '';
      
      // Try to get count from admin_audit_log first
      try {
        countQuery = supabaseAdmin
          .from('admin_audit_log')
          .select('*', { count: 'exact', head: true });
        tableName = 'admin_audit_log';

        if (action) countQuery = countQuery.eq('action', action);
        if (admin_user_id) countQuery = countQuery.eq('admin_user_id', admin_user_id);
        if (target_id) countQuery = countQuery.eq('target_user_id', target_id);
        if (date_from) countQuery = countQuery.gte('timestamp', date_from);
        if (date_to) countQuery = countQuery.lte('timestamp', date_to);

        const { count, error: countError } = await countQuery;
        
        if (!countError) {
          totalCount = count || 0;
        } else {
          throw countError;
        }
      } catch (error) {
        // Fall back to user_management_log for count
        try {
          console.log('Using user_management_log for count');
          countQuery = supabaseAdmin
            .from('user_management_log')
            .select('*', { count: 'exact', head: true });
          tableName = 'user_management_log';

          if (action) countQuery = countQuery.eq('action', action);
          if (admin_user_id) countQuery = countQuery.eq('admin_user_id', admin_user_id);
          if (target_id) countQuery = countQuery.eq('target_user_id', target_id);
          if (date_from) countQuery = countQuery.gte('created_at', date_from);
          if (date_to) countQuery = countQuery.lte('created_at', date_to);

          const { count, error: countError } = await countQuery;
          
          if (countError) {
            console.error('Error counting from user_management_log:', countError);
            totalCount = logs.length; // Fallback to current results count
          } else {
            totalCount = count || 0;
          }
        } catch (fallbackError) {
          console.error('Error with fallback count:', fallbackError);
          totalCount = logs.length; // Ultimate fallback
        }
      }
      
      console.log(`Using table: ${tableName}, found ${totalCount} total records, showing ${logs.length} results`);
    }

    // Get system statistics
    const stats = await getSystemStats(usingComprehensiveTable);

    // Get available filter options
    const filterOptions = await getFilterOptions(usingComprehensiveTable);

    return res.status(200).json({
      logs,
      pagination: {
        page: parseInt(page as string),
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      },
      statistics: stats,
      filterOptions,
      meta: {
        usingComprehensiveTable,
        tableVersion: usingComprehensiveTable ? 'v2.0' : 'v1.0 (legacy)',
        capabilities: usingComprehensiveTable 
          ? ['full_audit', 'all_event_types', 'enhanced_search', 'status_tracking']
          : ['user_management_only', 'basic_search']
      }
    });

  } catch (error) {
    console.error('Comprehensive audit logs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getSystemStats(usingComprehensiveTable: boolean) {
  try {
    if (usingComprehensiveTable) {
      // Get stats from comprehensive table
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: recentEvents } = await supabaseAdmin
        .from('admin_event_log')
        .select('event_type, action, status')
        .gte('created_at', last30Days);

      const eventsByType = recentEvents?.reduce((acc: Record<string, number>, log) => {
        acc[log.event_type] = (acc[log.event_type] || 0) + 1;
        return acc;
      }, {}) || {};

      const eventsByAction = recentEvents?.reduce((acc: Record<string, number>, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {}) || {};

      const eventsByStatus = recentEvents?.reduce((acc: Record<string, number>, log) => {
        acc[log.status || 'unknown'] = (acc[log.status || 'unknown'] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalEvents: recentEvents?.length || 0,
        eventsByType,
        eventsByAction,
        eventsByStatus,
        timeframe: 'last_30_days'
      };
    } else {
      // Get stats from legacy tables with fallback
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      let legacyEvents: any[] = [];
      
      // Try admin_audit_log first
      try {
        const { data: adminAuditEvents } = await supabaseAdmin
          .from('admin_audit_log')
          .select('action')
          .gte('timestamp', last30Days);
        
        if (adminAuditEvents) {
          legacyEvents = adminAuditEvents;
        }
      } catch (error) {
        console.log('admin_audit_log not available for stats, trying user_management_log');
      }
      
      // If no results, try user_management_log
      if (legacyEvents.length === 0) {
        try {
          const { data: userMgmtEvents } = await supabaseAdmin
            .from('user_management_log')
            .select('action')
            .gte('created_at', last30Days);
          
          if (userMgmtEvents) {
            legacyEvents = userMgmtEvents;
          }
        } catch (error) {
          console.log('user_management_log not available for stats');
        }
      }

      const eventsByAction = legacyEvents?.reduce((acc: Record<string, number>, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalEvents: legacyEvents?.length || 0,
        eventsByType: { 'user_management': legacyEvents?.length || 0 },
        eventsByAction,
        eventsByStatus: { 'success': legacyEvents?.length || 0 },
        timeframe: 'last_30_days'
      };
    }
  } catch (error) {
    console.error('Error getting system stats:', error);
    return {
      totalEvents: 0,
      eventsByType: {},
      eventsByAction: {},
      eventsByStatus: {},
      timeframe: 'last_30_days'
    };
  }
}

async function getFilterOptions(usingComprehensiveTable: boolean) {
  try {
    if (usingComprehensiveTable) {
      // Get unique values for filters from comprehensive table
      const { data: events } = await supabaseAdmin
        .from('admin_event_log')
        .select('event_type, action, target_type, status')
        .limit(1000); // Reasonable limit for filter options

      const eventTypes = [...new Set(events?.map(e => e.event_type).filter(Boolean))] || [];
      const actions = [...new Set(events?.map(e => e.action).filter(Boolean))] || [];
      const targetTypes = [...new Set(events?.map(e => e.target_type).filter(Boolean))] || [];
      const statuses = [...new Set(events?.map(e => e.status).filter(Boolean))] || [];

      return { eventTypes, actions, targetTypes, statuses };
    } else {
      // Get unique values from legacy tables with fallback
      let actions: string[] = [];
      
      // Try admin_audit_log first
      try {
        const { data: adminAuditEvents } = await supabaseAdmin
          .from('admin_audit_log')
          .select('action')
          .limit(1000);

        if (adminAuditEvents && adminAuditEvents.length > 0) {
          actions = [...new Set(adminAuditEvents.map(e => e.action).filter(Boolean))];
        }
      } catch (error) {
        console.log('admin_audit_log not available for filter options, trying user_management_log');
      }

      // If no results, try user_management_log
      if (actions.length === 0) {
        try {
          const { data: userMgmtEvents } = await supabaseAdmin
            .from('user_management_log')
            .select('action')
            .limit(1000);

          if (userMgmtEvents) {
            actions = [...new Set(userMgmtEvents.map(e => e.action).filter(Boolean))];
          }
        } catch (error) {
          console.log('user_management_log not available for filter options');
        }
      }

      // Get event types from stored comprehensive data in details
      let eventTypes: string[] = ['user_management']; // Default fallback
      let targetTypes: string[] = ['user']; // Default fallback
      let statuses: string[] = ['success']; // Default fallback

      try {
        // Try to get comprehensive event types from user_management_log details
        const { data: detailedEvents } = await supabaseAdmin
          .from('user_management_log')
          .select('details')
          .limit(1000);

        if (detailedEvents) {
          const comprehensiveEventTypes = detailedEvents
            .map(e => e.details?.event_type)
            .filter(Boolean);
          
          const comprehensiveTargetTypes = detailedEvents
            .map(e => e.details?.target_type)
            .filter(Boolean);

          const comprehensiveStatuses = detailedEvents
            .map(e => e.details?.status)
            .filter(Boolean);

          if (comprehensiveEventTypes.length > 0) {
            eventTypes = [...new Set(['user_management', ...comprehensiveEventTypes])];
          }
          if (comprehensiveTargetTypes.length > 0) {
            targetTypes = [...new Set(['user', ...comprehensiveTargetTypes])];
          }
          if (comprehensiveStatuses.length > 0) {
            statuses = [...new Set(['success', ...comprehensiveStatuses])];
          }
        }
      } catch (error) {
        console.log('Could not get comprehensive event types from details');
      }

      return {
        eventTypes,
        actions,
        targetTypes,
        statuses
      };
    }
  } catch (error) {
    console.error('Error getting filter options:', error);
    return {
      eventTypes: [],
      actions: [],
      targetTypes: [],
      statuses: []
    };
  }
}