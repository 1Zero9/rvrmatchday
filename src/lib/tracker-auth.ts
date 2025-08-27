/**
 * Match Tracker Authentication System
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Authentication utilities for the match tracker system.
 */

export interface TrackerUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'coach' | 'manager' | 'parent' | 'player';
  teams: string[];
  permissions: string[];
}

export interface TrackerSession {
  user: TrackerUser;
  loginTime: string;
  lastActivity: string;
  sessionId: string;
}

/**
 * Check if user has a valid session
 */
export function getTrackerSession(): TrackerSession | null {
  try {
    const userStr = localStorage.getItem('tracker-user');
    const sessionStr = localStorage.getItem('tracker-session');
    
    if (!userStr || !sessionStr) {
      return null;
    }
    
    const user = JSON.parse(userStr);
    const loginTime = sessionStr;
    
    // Check if session is still valid (24 hours)
    const sessionAge = Date.now() - new Date(loginTime).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionAge > maxAge) {
      clearTrackerSession();
      return null;
    }
    
    return {
      user,
      loginTime,
      lastActivity: new Date().toISOString(),
      sessionId: `session-${user.id}-${loginTime}`
    };
  } catch (error) {
    console.error('Error getting tracker session:', error);
    clearTrackerSession();
    return null;
  }
}

/**
 * Clear the current session
 */
export function clearTrackerSession(): void {
  localStorage.removeItem('tracker-user');
  localStorage.removeItem('tracker-session');
}

/**
 * Update last activity timestamp
 */
export function updateTrackerActivity(): void {
  const session = getTrackerSession();
  if (session) {
    localStorage.setItem('tracker-last-activity', new Date().toISOString());
  }
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(permission: string): boolean {
  const session = getTrackerSession();
  if (!session) return false;
  
  // Admin has all permissions
  if (session.user.role === 'admin' || session.user.permissions.includes('*')) {
    return true;
  }
  
  return session.user.permissions.includes(permission);
}

/**
 * Check if user can access a specific team
 */
export function canAccessTeam(teamId: string): boolean {
  const session = getTrackerSession();
  if (!session) return false;
  
  // Admin or users with all teams access
  if (session.user.role === 'admin' || session.user.teams.includes('*')) {
    return true;
  }
  
  return session.user.teams.includes(teamId);
}

/**
 * Get user's accessible teams
 */
export function getAccessibleTeams(): string[] {
  const session = getTrackerSession();
  if (!session) return [];
  
  if (session.user.role === 'admin' || session.user.teams.includes('*')) {
    return ['*']; // All teams
  }
  
  return session.user.teams;
}

/**
 * Check if session needs refresh
 */
export function shouldRefreshSession(): boolean {
  const lastActivity = localStorage.getItem('tracker-last-activity');
  if (!lastActivity) return false;
  
  const timeSinceActivity = Date.now() - new Date(lastActivity).getTime();
  const refreshThreshold = 30 * 60 * 1000; // 30 minutes
  
  return timeSinceActivity > refreshThreshold;
}

/**
 * Get user display info
 */
export function getUserDisplayInfo(): { name: string; role: string; icon: string } | null {
  const session = getTrackerSession();
  if (!session) return null;
  
  const roleIcons = {
    admin: '👨‍💼',
    coach: '🏃‍♂️',
    manager: '📋',
    parent: '👨‍👩‍👧‍👦',
    player: '⚽'
  };
  
  return {
    name: session.user.name,
    role: session.user.role,
    icon: roleIcons[session.user.role] || '👤'
  };
}

/**
 * Log user activity for analytics
 */
export function logTrackerActivity(action: string, details?: any): void {
  const session = getTrackerSession();
  if (!session) return;
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId: session.user.id,
    username: session.user.username,
    role: session.user.role,
    action,
    details: details || {},
    sessionId: session.sessionId
  };
  
  // In development, log to console
  console.info('TRACKER_ACTIVITY:', JSON.stringify(logEntry));
  
  // Store recent activity in localStorage for debugging
  try {
    const recentActivity = JSON.parse(localStorage.getItem('tracker-activity-log') || '[]');
    recentActivity.push(logEntry);
    
    // Keep only last 50 entries
    if (recentActivity.length > 50) {
      recentActivity.splice(0, recentActivity.length - 50);
    }
    
    localStorage.setItem('tracker-activity-log', JSON.stringify(recentActivity));
  } catch (error) {
    console.warn('Could not store activity log:', error);
  }
}

/**
 * Permission constants
 */
export const PERMISSIONS = {
  VIEW_MATCHES: 'view_matches',
  CREATE_MATCHES: 'create_matches',
  RECORD_EVENTS: 'record_events',
  MANAGE_TEAMS: 'manage_teams',
  VIEW_STATS: 'view_stats',
  MANAGE_PLAYERS: 'manage_players',
  DELETE_MATCHES: 'delete_matches',
  EXPORT_DATA: 'export_data'
} as const;

/**
 * Role-based permission defaults
 */
export const ROLE_PERMISSIONS = {
  admin: ['*'],
  coach: [
    PERMISSIONS.VIEW_MATCHES,
    PERMISSIONS.CREATE_MATCHES,
    PERMISSIONS.RECORD_EVENTS,
    PERMISSIONS.MANAGE_TEAMS,
    PERMISSIONS.VIEW_STATS,
    PERMISSIONS.MANAGE_PLAYERS,
    PERMISSIONS.EXPORT_DATA
  ],
  manager: [
    PERMISSIONS.VIEW_MATCHES,
    PERMISSIONS.CREATE_MATCHES,
    PERMISSIONS.RECORD_EVENTS,
    PERMISSIONS.VIEW_STATS
  ],
  parent: [
    PERMISSIONS.VIEW_MATCHES,
    PERMISSIONS.VIEW_STATS
  ],
  player: [
    PERMISSIONS.VIEW_MATCHES,
    PERMISSIONS.VIEW_STATS
  ]
} as const;