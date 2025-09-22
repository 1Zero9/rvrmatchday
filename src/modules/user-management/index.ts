/**
 * 👥 USER MANAGEMENT MODULE  
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: Enterprise-grade user administration system
 * Can be added/removed independently from core website
 */

import { ModuleConfig } from '../../types/module-types';

export const USER_MANAGEMENT_CONFIG: ModuleConfig = {
  // Module Identity
  name: "user-management",
  displayName: "Enterprise User Management",
  version: "1.1.0",
  description: "Professional user administration with roles, permissions, audit trails, and enterprise security features",
  
  // Module Dependencies  
  dependencies: ["core-website"],
  optionalDependencies: ["analytics", "match-management"],
  
  // Module Features
  features: {
    userDirectory: {
      name: "User Directory",
      description: "Comprehensive user listing with search, filters, and management",
      enabled: true
    },
    roleManagement: {
      name: "Role-Based Access Control",
      description: "Advanced role and permission management system", 
      enabled: true
    },
    auditLogs: {
      name: "Audit Trail",
      description: "Complete audit logging of user actions and changes",
      enabled: true
    },
    bulkOperations: {
      name: "Bulk User Operations", 
      description: "Mass user import, export, and management operations",
      enabled: true
    },
    accountRequests: {
      name: "Account Request System",
      description: "Automated account request and approval workflow",
      enabled: true
    },
    securityEvents: {
      name: "Security Event Monitoring",
      description: "Track and monitor security-related user events",
      enabled: true
    },
    twoFactor: {
      name: "Two-Factor Authentication",
      description: "Enhanced security with 2FA support",
      enabled: false // Premium feature
    },
    ssoIntegration: {
      name: "Single Sign-On",
      description: "Integration with enterprise SSO providers",
      enabled: false // Enterprise feature
    }
  },
  
  // Business Information
  tier: "business",
  pricing: {
    monthly: 79,
    yearly: 790,
    setup: 199
  },
  targetAudience: ["Enterprises", "Large Organizations", "Admin Teams", "IT Departments"],
  
  // Navigation Integration
  navigation: [
    {
      label: "User Management",
      href: "/user-management",
      icon: "👥", 
      priority: 20,
      requiresAuth: true,
      roles: ["admin"]
    }
  ],
  
  // Quick Actions for admin dashboards
  quickActions: [
    {
      title: "User Directory",
      description: "Manage all users and accounts", 
      href: "/user-management",
      icon: "👥",
      color: "purple",
      requiresAuth: true,
      roles: ["admin"]
    },
    {
      title: "Account Requests",
      description: "Review pending account requests",
      href: "/user-management?tab=requests", 
      icon: "📝",
      color: "orange",
      requiresAuth: true,
      roles: ["admin"]
    },
    {
      title: "Audit Logs",
      description: "View user activity logs",
      href: "/user-management?tab=audit",
      icon: "📋",
      color: "blue", 
      requiresAuth: true,
      roles: ["admin"]
    }
  ],
  
  // Pages provided by this module
  pages: [
    {
      path: "/user-management",
      name: "User Management Dashboard",
      description: "Complete user administration interface",
      requiresAuth: true,
      roles: ["admin"]
    },
    {
      path: "/account-request", 
      name: "Account Request Form",
      description: "Public form for requesting new accounts",
      requiresAuth: false
    },
    {
      path: "/account-admin",
      name: "Account Administration", 
      description: "Legacy account management interface",
      requiresAuth: true,
      roles: ["admin"],
      deprecated: true
    }
  ],
  
  // API routes provided
  apiRoutes: [
    "/api/admin/user-management",
    "/api/admin/approve-account", 
    "/api/admin/create-test-user",
    "/api/admin/setup-test-data",
    "/api/admin/audit-logs",
    "/api/admin/debug-users",
    "/api/admin/reset-user-password"
  ],
  
  // Database tables required
  tables: [
    "users",
    "user_profiles",
    "account_requests",
    "user_roles", 
    "permissions",
    "role_permissions",
    "audit_logs",
    "security_events",
    "user_sessions"
  ],
  
  // Permissions and roles
  permissions: [
    "user_admin",        // Full user management access
    "user_viewer",       // Read-only user access  
    "account_approver",  // Can approve account requests
    "audit_viewer",      // Can view audit logs
    "security_admin",    // Security event management
    "bulk_operations"    // Can perform bulk operations
  ],
  
  roles: [
    {
      name: "admin",
      permissions: ["user_admin", "account_approver", "audit_viewer", "security_admin", "bulk_operations"],
      description: "Full administrative access to user management"
    },
    {
      name: "user_manager",
      permissions: ["user_viewer", "account_approver"],
      description: "Can view users and approve accounts"
    },
    {
      name: "auditor",
      permissions: ["user_viewer", "audit_viewer"],
      description: "Read-only access for auditing purposes"
    }
  ],
  
  // Configuration options
  settings: {
    requireApproval: {
      name: "Require Account Approval",
      type: "boolean",
      default: true,
      description: "New accounts require admin approval"
    },
    auditRetention: {
      name: "Audit Log Retention (days)",
      type: "number", 
      default: 365,
      description: "How long to keep audit logs"
    },
    passwordPolicy: {
      name: "Password Policy",
      type: "object",
      default: { minLength: 8, requireSpecial: true, requireNumbers: true },
      description: "Password complexity requirements"
    },
    maxLoginAttempts: {
      name: "Max Login Attempts",
      type: "number",
      default: 5,
      description: "Maximum failed login attempts before lockout"
    },
    sessionTimeout: {
      name: "Session Timeout (minutes)",
      type: "number",
      default: 30,
      description: "Automatic session timeout"
    }
  },
  
  // User management specific features
  userFeatures: {
    profileFields: [
      "first_name",
      "last_name", 
      "email",
      "phone",
      "role",
      "teams",
      "permissions",
      "status",
      "last_login",
      "created_at",
      "updated_at"
    ],
    
    roles: [
      { value: "admin", label: "Administrator", color: "red" },
      { value: "coach", label: "Coach", color: "green" },
      { value: "manager", label: "Manager", color: "blue" },
      { value: "editor", label: "Editor", color: "purple" },
      { value: "parent", label: "Parent", color: "yellow" },
      { value: "volunteer", label: "Volunteer", color: "gray" }
    ],
    
    statusOptions: [
      { value: "active", label: "Active", color: "green" },
      { value: "inactive", label: "Inactive", color: "gray" },
      { value: "pending", label: "Pending", color: "yellow" },
      { value: "suspended", label: "Suspended", color: "red" }
    ]
  },
  
  // Security Configuration
  security: {
    encryption: {
      sensitive_fields: ["password", "reset_token", "phone"],
      algorithm: "AES-256-GCM"
    },
    auditEvents: [
      "user_created",
      "user_updated", 
      "user_deleted",
      "password_changed",
      "role_changed",
      "login_success",
      "login_failure",
      "account_locked",
      "permission_granted",
      "permission_revoked"
    ],
    securityEvents: [
      "multiple_failed_logins",
      "unusual_login_location",
      "password_reset_requested", 
      "suspicious_activity",
      "privilege_escalation"
    ]
  },
  
  // Integration hooks
  hooks: {
    onInstall: "setupUserManagementTables",
    onUninstall: "cleanupUserData",
    onUpgrade: "migrateUserData", 
    onConfigChange: "updateUserSettings",
    onUserCreate: "triggerWelcomeEmail",
    onUserUpdate: "logUserChanges",
    onRoleChange: "updatePermissions"
  },
  
  // Required environment variables
  env: [
    "USER_MANAGEMENT_ENABLED",
    "JWT_SECRET",
    "ENCRYPTION_KEY", 
    "EMAIL_SERVICE_KEY"
  ],
  
  // Module health check
  healthCheck: {
    database: "checkUserTables",
    authentication: "checkUserPermissions",
    encryption: "validateEncryption",
    auditLogs: "checkAuditIntegrity"
  },
  
  // Data export/import capabilities
  dataManagement: {
    export: {
      formats: ["CSV", "JSON", "Excel"],
      includes: ["users", "roles", "audit_logs"],
      excludes: ["passwords", "tokens"]
    },
    import: {
      formats: ["CSV", "JSON"],
      validation: true,
      bulkCreate: true
    },
    backup: {
      automated: true,
      retention: 30,
      encryption: true
    }
  }
};

// Export module components
export { default as UnifiedAccountManagement } from '../../components/UnifiedAccountManagement';
export { default as AdminUserManagement } from '../../components/AdminUserManagement';
export { default as AdminAccountReview } from '../../components/AdminAccountReview';

// Export module utilities
export * from './lib/user-utils';
export * from './lib/role-utils';
export * from './lib/audit-utils';
export * from './types/user-types';

// Export module hooks  
export { useUserManagement } from './hooks/useUserManagement';
export { useRoleManagement } from './hooks/useRoleManagement';
export { useAuditLogs } from './hooks/useAuditLogs';

export default USER_MANAGEMENT_CONFIG;