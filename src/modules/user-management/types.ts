/**
 * 👥 User Management Module - Type Definitions
 * 1Zero9.com - OneZeronine Studio
 */

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'coach' | 'manager' | 'editor' | 'parent' | 'volunteer';
  teams: string[];
  permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  last_ip_address?: string;
  login_count?: number;
  failed_login_attempts?: number;
}

export interface AccountRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  requested_role: string;
  team_interest: string[];
  experience?: string;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  legal_agreement_accepted: boolean;
  privacy_policy_accepted: boolean;
  data_usage_accepted: boolean;
  club_disclaimer_accepted: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  target_user?: string;
  target_user_email?: string;
  details: any;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
}

export interface SecurityEvent {
  id: string;
  event_type: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'PASSWORD_RESET' | 'ACCOUNT_LOCKED' | 'PERMISSION_DENIED';
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  details: any;
  timestamp: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface UserManagementStats {
  totalUsers: number;
  activeUsers: number;
  pendingRequests: number;
  securityAlerts: number;
  lastWeekLogins: number;
  failedLogins: number;
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
  category: 'admin' | 'content' | 'team' | 'match' | 'user';
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}