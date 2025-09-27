/**
 * Universal Admin Event Logger
 * Centralized logging utility for all admin operations across the platform
 */

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

// Event types for categorization
export const EVENT_TYPES = {
  USER_MANAGEMENT: 'user_management',
  CONTENT_MANAGEMENT: 'content_management',
  SYSTEM_MANAGEMENT: 'system_management',
  MATCH_MANAGEMENT: 'match_management',
  SECURITY: 'security',
  MAINTENANCE: 'maintenance'
} as const;

// Target types for affected resources
export const TARGET_TYPES = {
  USER: 'user',
  MATCH: 'match',
  TEAM: 'team',
  PLAYER: 'player',
  CONTENT: 'content',
  SYSTEM: 'system',
  SETTINGS: 'settings',
  PAGE: 'page',
  CARD: 'card',
  EVENT: 'event'
} as const;

// Common actions
export const ACTIONS = {
  // User Management
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  ACTIVATE_USER: 'activate_user',
  DEACTIVATE_USER: 'deactivate_user',
  RESET_PASSWORD: 'reset_password',
  CHANGE_ROLE: 'change_role',
  
  // Content Management
  CREATE_CONTENT: 'create_content',
  UPDATE_CONTENT: 'update_content',
  DELETE_CONTENT: 'delete_content',
  PUBLISH_CONTENT: 'publish_content',
  UNPUBLISH_CONTENT: 'unpublish_content',
  
  // Match Management
  CREATE_MATCH: 'create_match',
  UPDATE_MATCH: 'update_match',
  DELETE_MATCH: 'delete_match',
  RECORD_EVENT: 'record_event',
  UPDATE_SCORE: 'update_score',
  ADD_CARD: 'add_card',
  REMOVE_CARD: 'remove_card',
  
  // System Management
  BACKUP_DATA: 'backup_data',
  RESTORE_DATA: 'restore_data',
  UPDATE_SETTINGS: 'update_settings',
  MAINTENANCE_MODE: 'maintenance_mode',
  SYSTEM_UPDATE: 'system_update',
  
  // Security
  LOGIN_ATTEMPT: 'login_attempt',
  FAILED_LOGIN: 'failed_login',
  PERMISSION_DENIED: 'permission_denied',
  SECURITY_BREACH: 'security_breach'
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
export type TargetType = typeof TARGET_TYPES[keyof typeof TARGET_TYPES];
export type Action = typeof ACTIONS[keyof typeof ACTIONS];

interface AdminEventLogData {
  // Required fields
  adminUserId: string;
  eventType: EventType;
  action: Action | string; // Allow custom actions
  
  // Optional target information
  targetType?: TargetType;
  targetId?: string;
  targetIdentifier?: string; // Name, title, or readable identifier
  
  // Event details
  description?: string;
  details?: Record<string, any>;
  
  // Context (automatically captured if available)
  ipAddress?: string;
  userAgent?: string;
  requestPath?: string;
  
  // Status
  status?: 'success' | 'failed' | 'partial';
  errorMessage?: string;
}

export class AdminEventLogger {
  /**
   * Log an admin event to the comprehensive audit system
   */
  static async logEvent(eventData: AdminEventLogData): Promise<boolean> {
    try {
      console.log('🔍 Admin Event Logger - Received event data:', { 
        eventType: eventData.eventType, 
        action: eventData.action, 
        adminUserId: eventData.adminUserId,
        targetType: eventData.targetType,
        targetIdentifier: eventData.targetIdentifier,
        description: eventData.description
      });

      // For now, just log to console to verify the client-to-server architecture works
      // TODO: Once the comprehensive admin_event_log table is created, this will log to the database
      
      const eventSummary = {
        timestamp: new Date().toISOString(),
        admin_user_id: eventData.adminUserId,
        event_type: eventData.eventType,
        action: eventData.action,
        target_type: eventData.targetType,
        target_id: eventData.targetId,
        target_identifier: eventData.targetIdentifier,
        description: eventData.description || this.generateDescription(eventData),
        details: eventData.details || {},
        ip_address: eventData.ipAddress,
        user_agent: eventData.userAgent,
        request_path: eventData.requestPath,
        status: eventData.status || 'success',
        error_message: eventData.errorMessage
      };

      console.log('✅ Admin Event Successfully Logged (Console Mode):', JSON.stringify(eventSummary, null, 2));
      
      // Also try to store in the existing user_management_log table for dashboard visibility
      try {
        const userMgmtEntry = {
          admin_user_id: eventData.adminUserId,
          target_user_id: eventData.targetType === TARGET_TYPES.USER ? eventData.targetId : null,
          action: eventData.action,
          details: {
            event_type: eventData.eventType,
            target_type: eventData.targetType,
            target_id: eventData.targetId,
            target_identifier: eventData.targetIdentifier,
            description: eventData.description || this.generateDescription(eventData),
            request_path: eventData.requestPath,
            status: eventData.status || 'success',
            error_message: eventData.errorMessage,
            comprehensive_event_data: eventData.details || {},
            logged_via: 'comprehensive_system'
          },
          ip_address: eventData.ipAddress,
          user_agent: eventData.userAgent,
          created_at: new Date().toISOString()
        };

        const { error: userMgmtError } = await supabaseAdmin
          .from('user_management_log')
          .insert([userMgmtEntry]);

        if (!userMgmtError) {
          console.log('✅ Also saved to user_management_log for dashboard visibility');
        } else {
          console.log('⚠️ Could not save to user_management_log:', userMgmtError.message);
        }
      } catch (dbError) {
        console.log('⚠️ Database storage attempt failed, console logging only');
      }
      
      // Return true to indicate successful logging
      return true;

    } catch (error) {
      console.error('❌ Admin event logging failed:', error);
      return false;
    }
  }

  /**
   * Generate a human-readable description for the event
   */
  private static generateDescription(eventData: AdminEventLogData): string {
    const action = eventData.action;
    const targetType = eventData.targetType;
    const targetIdentifier = eventData.targetIdentifier;

    if (targetType && targetIdentifier) {
      return `${action.replace(/_/g, ' ')} for ${targetType}: ${targetIdentifier}`;
    } else if (targetType) {
      return `${action.replace(/_/g, ' ')} ${targetType}`;
    } else {
      return action.replace(/_/g, ' ');
    }
  }

  /**
   * Helper method for user management events
   */
  static async logUserEvent(
    adminUserId: string,
    action: Action | string,
    targetUserId?: string,
    targetUserName?: string,
    details?: Record<string, any>,
    status: 'success' | 'failed' | 'partial' = 'success',
    errorMessage?: string
  ): Promise<boolean> {
    return this.logEvent({
      adminUserId,
      eventType: EVENT_TYPES.USER_MANAGEMENT,
      action,
      targetType: TARGET_TYPES.USER,
      targetId: targetUserId,
      targetIdentifier: targetUserName,
      details,
      status,
      errorMessage
    });
  }

  /**
   * Helper method for match management events
   */
  static async logMatchEvent(
    adminUserId: string,
    action: Action | string,
    matchId?: string,
    matchTitle?: string,
    details?: Record<string, any>,
    status: 'success' | 'failed' | 'partial' = 'success'
  ): Promise<boolean> {
    return this.logEvent({
      adminUserId,
      eventType: EVENT_TYPES.MATCH_MANAGEMENT,
      action,
      targetType: TARGET_TYPES.MATCH,
      targetId: matchId,
      targetIdentifier: matchTitle,
      details,
      status
    });
  }

  /**
   * Helper method for system management events
   */
  static async logSystemEvent(
    adminUserId: string,
    action: Action | string,
    details?: Record<string, any>,
    status: 'success' | 'failed' | 'partial' = 'success'
  ): Promise<boolean> {
    return this.logEvent({
      adminUserId,
      eventType: EVENT_TYPES.SYSTEM_MANAGEMENT,
      action,
      targetType: TARGET_TYPES.SYSTEM,
      details,
      status
    });
  }

  /**
   * Helper method for content management events
   */
  static async logContentEvent(
    adminUserId: string,
    action: Action | string,
    contentId?: string,
    contentTitle?: string,
    details?: Record<string, any>,
    status: 'success' | 'failed' | 'partial' = 'success'
  ): Promise<boolean> {
    return this.logEvent({
      adminUserId,
      eventType: EVENT_TYPES.CONTENT_MANAGEMENT,
      action,
      targetType: TARGET_TYPES.CONTENT,
      targetId: contentId,
      targetIdentifier: contentTitle,
      details,
      status
    });
  }

  /**
   * Get event statistics for dashboard
   */
  static async getEventStats(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<{
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsByAction: Record<string, number>;
    recentEvents: any[];
  }> {
    try {
      const timeframeHours = timeframe === 'day' ? 24 : timeframe === 'week' ? 168 : 720;
      const since = new Date(Date.now() - timeframeHours * 60 * 60 * 1000).toISOString();

      // Try comprehensive table first
      let query = supabaseAdmin
        .from('admin_event_log')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false });

      let { data: events, error } = await query;

      // Fall back to legacy tables if needed
      if (error && error.message.includes('does not exist')) {
        console.log('Using legacy audit tables for statistics');
        const { data: legacyEvents } = await supabaseAdmin
          .from('admin_audit_log')
          .select('*, admin_user:admin_user_id(full_name, username)')
          .gte('timestamp', since)
          .order('timestamp', { ascending: false });

        events = legacyEvents?.map(event => ({
          ...event,
          event_type: 'user_management',
          created_at: event.timestamp,
          admin_username: event.admin_user?.username
        })) || [];
      }

      if (!events) events = [];

      // Calculate statistics
      const totalEvents = events.length;
      
      const eventsByType = events.reduce((acc: Record<string, number>, event) => {
        const type = event.event_type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const eventsByAction = events.reduce((acc: Record<string, number>, event) => {
        const action = event.action || 'unknown';
        acc[action] = (acc[action] || 0) + 1;
        return acc;
      }, {});

      const recentEvents = events.slice(0, 10);

      return {
        totalEvents,
        eventsByType,
        eventsByAction,
        recentEvents
      };

    } catch (error) {
      console.error('Failed to get event statistics:', error);
      return {
        totalEvents: 0,
        eventsByType: {},
        eventsByAction: {},
        recentEvents: []
      };
    }
  }
}