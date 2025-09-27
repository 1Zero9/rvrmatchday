/**
 * Client-side Admin Event Logger
 * Makes API calls to server-side logging endpoints
 */

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
   * Log an admin event via API call to server
   */
  static async logEvent(eventData: AdminEventLogData): Promise<boolean> {
    try {
      // Prepare the log entry for API call
      const logEntry = {
        admin_user_id: eventData.adminUserId,
        event_type: eventData.eventType,
        action: eventData.action,
        target_type: eventData.targetType,
        target_id: eventData.targetId,
        target_identifier: eventData.targetIdentifier,
        description: eventData.description || this.generateDescription(eventData),
        details: eventData.details || {},
        ip_address: eventData.ipAddress,
        user_agent: eventData.userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : undefined),
        request_path: eventData.requestPath || (typeof window !== 'undefined' ? window.location.pathname : undefined),
        status: eventData.status || 'success',
        error_message: eventData.errorMessage
      };

      // Make API call to log the event
      const response = await fetch('/api/admin/log-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      });

      if (!response.ok) {
        console.error('Failed to log admin event:', response.statusText);
        return false;
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Admin event logged successfully');
        return true;
      } else {
        console.error('❌ Admin event logging failed:', result.error);
        return false;
      }

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
   * Helper method for maintenance events
   */
  static async logMaintenanceEvent(
    adminUserId: string,
    action: Action | string,
    targetId?: string,
    targetIdentifier?: string,
    details?: Record<string, any>,
    status: 'success' | 'failed' | 'partial' = 'success'
  ): Promise<boolean> {
    return this.logEvent({
      adminUserId,
      eventType: EVENT_TYPES.MAINTENANCE,
      action,
      targetType: TARGET_TYPES.PAGE,
      targetId,
      targetIdentifier,
      details,
      status
    });
  }
}