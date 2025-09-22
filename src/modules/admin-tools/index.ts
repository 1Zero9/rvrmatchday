/**
 * 🛠️ Admin Tools Module Configuration
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: Administrative tools and monitoring
 * Features: Changelog, event logs, task management, system statistics
 */

import { ModuleConfig } from '../../types/module-types';

export const ADMIN_TOOLS_CONFIG: ModuleConfig = {
  // Module Identity
  name: "admin-tools",
  displayName: "Admin Tools & Monitoring",
  version: "1.0.0",
  description: "Administrative tools for system monitoring, task management, and event tracking",
  
  // Dependencies
  dependencies: ["core-website"],
  optionalDependencies: ["user-management"],
  
  // Features
  features: {
    changelog: {
      name: "System Changelog",
      description: "Track and display system changes and updates",
      enabled: true
    },
    eventLogs: {
      name: "Event Log Monitoring",
      description: "Monitor and analyze system events and activities",
      enabled: true
    },
    taskManagement: {
      name: "Admin Task Management",
      description: "Track and manage administrative tasks",
      enabled: true
    },
    systemStats: {
      name: "System Statistics",
      description: "Comprehensive system performance and usage statistics",
      enabled: true
    },
    monitoring: {
      name: "Real-time Monitoring",
      description: "Live system monitoring and alerting",
      enabled: true,
      premium: true
    },
    reporting: {
      name: "Advanced Reporting",
      description: "Generate detailed system and usage reports",
      enabled: true,
      premium: true
    }
  },
  
  // Business Information
  tier: "professional",
  pricing: {
    monthly: 49,
    yearly: 490,
    setup: 99
  },
  targetAudience: ["system-administrators", "site-managers", "technical-teams"],
  
  // Navigation Integration
  navigation: [
    {
      label: "Admin Tools",
      href: "/admin-tools",
      icon: "🛠️",
      priority: 40,
      requiresAuth: true,
      roles: ["admin"],
      hasDropdown: true,
      children: [
        {
          label: "System Overview",
          href: "/admin-tools",
          icon: "📊",
          priority: 1,
          requiresAuth: true,
          roles: ["admin"]
        },
        {
          label: "Changelog",
          href: "/admin-tools/changelog",
          icon: "📝",
          priority: 2,
          requiresAuth: true,
          roles: ["admin"]
        },
        {
          label: "Event Logs",
          href: "/admin-tools/events",
          icon: "📋",
          priority: 3,
          requiresAuth: true,
          roles: ["admin"]
        },
        {
          label: "Task Manager",
          href: "/admin-tools/tasks",
          icon: "✅",
          priority: 4,
          requiresAuth: true,
          roles: ["admin"]
        }
      ]
    }
  ],
  
  quickActions: [
    {
      title: "System Status",
      description: "Check system health",
      href: "/admin-tools",
      icon: "🟢",
      color: "green",
      requiresAuth: true,
      roles: ["admin"]
    },
    {
      title: "View Logs",
      description: "Recent system events",
      href: "/admin-tools/events",
      icon: "📋",
      color: "blue",
      requiresAuth: true,
      roles: ["admin"]
    },
    {
      title: "Task List",
      description: "Pending admin tasks",
      href: "/admin-tools/tasks",
      icon: "✅",
      color: "purple",
      requiresAuth: true,
      roles: ["admin"]
    }
  ],
  
  // Technical Information  
  pages: [
    {
      path: "/admin-tools",
      name: "Admin Tools Dashboard",
      description: "Main administrative tools interface",
      requiresAuth: true,
      roles: ["admin"]
    },
    {
      path: "/admin-tools/changelog",
      name: "System Changelog",
      description: "View system changes and updates",
      requiresAuth: true,
      roles: ["admin"]
    },
    {
      path: "/admin-tools/events",
      name: "Event Log Viewer",
      description: "Monitor system events and activities",
      requiresAuth: true,
      roles: ["admin"]
    },
    {
      path: "/admin-tools/tasks",
      name: "Task Management",
      description: "Administrative task tracking and management",
      requiresAuth: true,
      roles: ["admin"]
    },
    {
      path: "/admin-tools/stats",
      name: "System Statistics",
      description: "System performance and usage statistics",
      requiresAuth: true,
      roles: ["admin"]
    }
  ],
  
  apiRoutes: [
    "/api/admin-tools/changelog",
    "/api/admin-tools/events",
    "/api/admin-tools/tasks",
    "/api/admin-tools/stats",
    "/api/admin-tools/system-health"
  ],
  
  tables: [
    "system_changelog",
    "system_events",
    "admin_tasks",
    "system_stats",
    "monitoring_alerts"
  ],
  
  permissions: [
    "admin:read",
    "admin:write",
    "system:monitor",
    "logs:view",
    "tasks:manage",
    "stats:view"
  ],
  
  roles: [
    {
      name: "system-admin",
      permissions: ["admin:read", "admin:write", "system:monitor", "logs:view", "tasks:manage", "stats:view"],
      description: "Full admin tools access"
    },
    {
      name: "monitor",
      permissions: ["admin:read", "logs:view", "stats:view"],
      description: "Read-only monitoring access"
    }
  ],
  
  // Configuration
  settings: {
    logRetention: {
      name: "Log Retention (days)",
      type: "number",
      default: 90,
      description: "How long to keep system logs"
    },
    alertThreshold: {
      name: "Alert Threshold (%)",
      type: "number",
      default: 80,
      description: "System resource usage alert threshold"
    },
    taskReminders: {
      name: "Enable Task Reminders",
      type: "boolean",
      default: true,
      description: "Send notifications for overdue tasks"
    }
  },
  
  // Integration
  hooks: {
    onInstall: "setupAdminToolsTables",
    onUninstall: "cleanupAdminToolsData",
    onUpgrade: "migrateAdminToolsSchema"
  },
  
  env: [
    "ADMIN_TOOLS_ENABLED",
    "MONITORING_API_KEY",
    "ALERT_WEBHOOK_URL"
  ],
  
  healthCheck: {
    database: "checkAdminToolsTables",
    monitoring: "validateMonitoringService"
  }
};

export default ADMIN_TOOLS_CONFIG;