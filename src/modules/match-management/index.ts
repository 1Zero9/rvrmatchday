/**
 * ⚽ MATCH MANAGEMENT MODULE
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: Complete sports team and match management system
 * Can be added/removed independently from core website
 */

import { ModuleConfig } from '../../types/module-types';

export const MATCH_MANAGEMENT_CONFIG: ModuleConfig = {
  // Module Identity
  name: "match-management",
  displayName: "Match Management System",
  version: "1.2.0", 
  description: "Professional sports team and match management with live recording, statistics, and team administration",
  
  // Module Dependencies
  dependencies: ["core-website"],
  optionalDependencies: ["user-management", "analytics"],
  
  // Module Features
  features: {
    matchRecording: {
      name: "Live Match Recording",
      description: "Record matches in real-time with events, stats, and player tracking",
      enabled: true
    },
    teamManagement: {
      name: "Team Administration", 
      description: "Manage teams, players, coaches, and team information",
      enabled: true
    },
    fixtures: {
      name: "Fixtures & Results",
      description: "Schedule management and results tracking",
      enabled: true
    },
    statistics: {
      name: "Match Statistics",
      description: "Detailed match and player statistics and analytics",
      enabled: true
    },
    calendar: {
      name: "Match Calendar",
      description: "Calendar view of fixtures and events",
      enabled: true
    },
    notifications: {
      name: "Match Notifications",
      description: "Automated notifications for matches and events",
      enabled: false // Premium feature
    }
  },
  
  // Business Information
  tier: "professional",
  pricing: {
    monthly: 49,
    yearly: 490,
    setup: 99
  },
  targetAudience: ["Sports Clubs", "Teams", "Leagues", "Coaches"],
  
  // Navigation Integration
  navigation: [
    {
      label: "Match Central",
      href: "/match-central", 
      icon: "🔒",
      priority: 10,
      requiresAuth: true,
      roles: ["admin", "coach", "manager"]
    },
    {
      label: "Match Recorder", 
      href: "/match-recorder",
      icon: "📝",
      priority: 11,
      requiresAuth: true,
      roles: ["admin", "coach", "manager"]
    },
    {
      label: "Team Admin",
      href: "/match-admin", 
      icon: "👥",
      priority: 12,
      requiresAuth: true,
      roles: ["admin", "coach"]
    }
  ],
  
  // Quick Actions for dashboards
  quickActions: [
    {
      title: "Record Match",
      description: "Start recording a live match",
      href: "/match-recorder",
      icon: "⚽",
      color: "green",
      requiresAuth: true
    },
    {
      title: "View Fixtures", 
      description: "Check upcoming matches",
      href: "/match-central/fixtures",
      icon: "📅",
      color: "blue",
      requiresAuth: false
    },
    {
      title: "Team Stats",
      description: "View team performance",
      href: "/match-central/tables",
      icon: "📊", 
      color: "purple",
      requiresAuth: false
    }
  ],
  
  // Pages provided by this module
  pages: [
    {
      path: "/match-central",
      name: "Match Central Dashboard", 
      description: "Main match management hub",
      requiresAuth: true,
      roles: ["admin", "coach", "manager"]
    },
    {
      path: "/match-central-secure",
      name: "Secure Match Central",
      description: "Authentication-protected match central", 
      requiresAuth: true,
      roles: ["admin", "coach", "manager"]
    },
    {
      path: "/match-recorder",
      name: "Live Match Recorder",
      description: "Record live match events and statistics",
      requiresAuth: true,
      roles: ["admin", "coach", "manager"]
    },
    {
      path: "/secure-match-recorder", 
      name: "Secure Match Recorder",
      description: "Authentication-protected match recorder",
      requiresAuth: true,
      roles: ["admin", "coach"]
    },
    {
      path: "/match-admin",
      name: "Team Administration", 
      description: "Manage teams, players, and settings",
      requiresAuth: true,
      roles: ["admin", "coach"]
    },
    {
      path: "/tracker",
      name: "Match Tracker",
      description: "Match tracking and statistics dashboard",
      requiresAuth: true,
      roles: ["admin", "coach", "manager"]
    },
    {
      path: "/matchday",
      name: "Match Day Hub",
      description: "Public match day information and results",
      requiresAuth: false
    },
    {
      path: "/match-central/fixtures",
      name: "Fixtures", 
      description: "Upcoming match fixtures",
      requiresAuth: false
    },
    {
      path: "/match-central/results",
      name: "Results",
      description: "Match results and reports", 
      requiresAuth: false
    },
    {
      path: "/match-central/tables",
      name: "League Tables",
      description: "League standings and statistics",
      requiresAuth: false
    }
  ],
  
  // API routes provided
  apiRoutes: [
    "/api/matches/*",
    "/api/teams/*", 
    "/api/players/*",
    "/api/match-events/*",
    "/api/statistics/*",
    "/api/fixtures/*"
  ],
  
  // Database tables required
  tables: [
    "matches",
    "teams", 
    "players",
    "match_events",
    "match_stats", 
    "team_stats",
    "player_stats"
  ],
  
  // Permissions and roles
  permissions: [
    "match_admin",      // Full match management access
    "team_manager",     // Team management access
    "match_recorder",   // Can record matches
    "statistics_viewer" // Can view detailed statistics
  ],
  
  roles: [
    {
      name: "coach",
      permissions: ["match_admin", "team_manager", "match_recorder", "statistics_viewer"],
      description: "Full access to team and match management"
    },
    {
      name: "manager", 
      permissions: ["team_manager", "match_recorder", "statistics_viewer"],
      description: "Team management and match recording access"
    },
    {
      name: "statistician",
      permissions: ["statistics_viewer"],
      description: "Read-only access to statistics and reports"
    }
  ],
  
  // Configuration options
  settings: {
    matchDuration: {
      name: "Default Match Duration",
      type: "number",
      default: 90,
      description: "Default match length in minutes"
    },
    teamColors: {
      name: "Team Color Scheme",
      type: "object", 
      default: { primary: "#1f2937", secondary: "#3b82f6" },
      description: "Default team colors for displays"
    },
    statisticsEnabled: {
      name: "Enable Advanced Statistics",
      type: "boolean",
      default: true,
      description: "Enable detailed match and player statistics"
    },
    publicResults: {
      name: "Public Results Display",
      type: "boolean", 
      default: true,
      description: "Allow public viewing of match results"
    }
  },
  
  // Integration hooks
  hooks: {
    onInstall: "setupMatchManagementTables",
    onUninstall: "cleanupMatchData", 
    onUpgrade: "migrateMatchData",
    onConfigChange: "updateMatchSettings"
  },
  
  // Required environment variables
  env: [
    "MATCH_MANAGEMENT_ENABLED",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY"
  ],
  
  // Module health check
  healthCheck: {
    database: "checkMatchTables",
    authentication: "checkMatchPermissions", 
    features: "validateMatchFeatures"
  }
};

// Export module components
export { default as MatchCentralContent } from '../../components/MatchCentralContent';
export { default as SecureMatchRecorder } from '../../components/SecureMatchRecorder';
export { default as MatchDetailsForm } from '../../components/MatchDetailsForm';

// Export module utilities  
export * from './lib/match-utils';
export * from './lib/team-utils';
export * from './types/match-types';

// Export module hooks
export { useMatchData } from './hooks/useMatchData';
export { useTeamData } from './hooks/useTeamData';

export default MATCH_MANAGEMENT_CONFIG;