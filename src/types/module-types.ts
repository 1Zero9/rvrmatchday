/**
 * 🧩 MODULE TYPE DEFINITIONS
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: TypeScript definitions for the modular system
 * Ensures type safety across all modules
 */

// =====================================
// 🏗️ CORE MODULE TYPES
// =====================================

export interface ModuleConfig {
  // Module Identity
  name: string;
  displayName: string;
  version: string;
  description: string;
  
  // Dependencies
  dependencies: string[];
  optionalDependencies: string[];
  
  // Features
  features: Record<string, ModuleFeature>;
  
  // Business Information
  tier: ModuleTier;
  pricing: ModulePricing;
  targetAudience?: string[];
  
  // Navigation Integration
  navigation: NavigationItem[];
  quickActions?: QuickAction[];
  
  // Technical Information
  pages: PageDefinition[];
  apiRoutes: string[];
  tables: string[];
  permissions: string[];
  roles?: RoleDefinition[];
  
  // Configuration
  settings?: Record<string, SettingDefinition>;
  
  // Integration
  hooks?: ModuleHooks;
  env?: string[];
  healthCheck?: HealthCheckConfig;
  
  // Optional Extensions
  [key: string]: any;
}

export interface ModuleFeature {
  name: string;
  description: string;
  enabled: boolean;
  premium?: boolean;
}

export type ModuleTier = "free" | "starter" | "standard" | "professional" | "business" | "enterprise";

export interface ModulePricing {
  monthly: number;
  yearly: number;
  setup?: number;
  perUser?: number;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  priority: number;
  requiresAuth?: boolean;
  roles?: string[];
  hasDropdown?: boolean;
  children?: NavigationItem[];
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  requiresAuth?: boolean;
  roles?: string[];
}

export interface PageDefinition {
  path: string;
  name: string;
  description: string;
  requiresAuth?: boolean;
  roles?: string[];
  deprecated?: boolean;
}

export interface RoleDefinition {
  name: string;
  permissions: string[];
  description: string;
}

export interface SettingDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  default: any;
  description: string;
  validation?: any;
}

export interface ModuleHooks {
  onInstall?: string;
  onUninstall?: string;
  onUpgrade?: string;
  onConfigChange?: string;
  [key: string]: string | undefined;
}

export interface HealthCheckConfig {
  database?: string;
  authentication?: string;
  [key: string]: string | undefined;
}

// =====================================
// 🔧 MODULE MANAGEMENT TYPES  
// =====================================

export interface ModuleManager {
  // Module Registry
  getInstalledModules(): string[];
  getAvailableModules(): string[];
  getModuleConfig(name: string): ModuleConfig | null;
  
  // Module Operations
  installModule(name: string): Promise<boolean>;
  uninstallModule(name: string): Promise<boolean>;
  enableModule(name: string): Promise<boolean>;
  disableModule(name: string): Promise<boolean>;
  
  // Module Loading
  loadModule(name: string): Promise<any>;
  isModuleEnabled(name: string): boolean;
  checkDependencies(name: string): boolean;
  
  // Configuration
  updateModuleConfig(name: string, config: Partial<ModuleConfig>): Promise<boolean>;
  validateModule(name: string): ValidationResult;
}

export interface ModuleRegistry {
  modules: Record<string, ModuleConfig>;
  enabled: string[];
  settings: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

// =====================================
// 🎨 UI & COMPONENT TYPES
// =====================================

export interface ModuleNavigation {
  items: NavigationItem[];
  quickActions: QuickAction[];
  userActions: QuickAction[];
}

export interface ModulePage {
  component: React.ComponentType;
  config: PageDefinition;
  module: string;
}

export interface ModuleComponent {
  name: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  module: string;
}

// =====================================
// 🔐 SECURITY & PERMISSIONS
// =====================================

export interface ModulePermission {
  name: string;
  description: string;
  module: string;
  level: PermissionLevel;
}

export type PermissionLevel = "read" | "write" | "admin" | "super_admin";

export interface ModuleRole {
  name: string;
  permissions: string[];
  modules: string[];
  description: string;
}

export interface SecurityContext {
  user: {
    id: string;
    roles: string[];
    permissions: string[];
  };
  modules: {
    enabled: string[];
    available: string[];
  };
}

// =====================================
// 📊 ANALYTICS & MONITORING
// =====================================

export interface ModuleMetrics {
  name: string;
  version: string;
  enabled: boolean;
  usage: {
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    totalPageViews: number;
    errorRate: number;
  };
  performance: {
    averageLoadTime: number;
    uptime: number;
  };
  health: {
    status: "healthy" | "warning" | "error";
    lastCheck: Date;
    issues: string[];
  };
}

export interface ModuleEvent {
  module: string;
  event: string;
  timestamp: Date;
  userId?: string;
  data?: Record<string, any>;
}

// =====================================
// 🗄️ DATABASE & STORAGE
// =====================================

export interface ModuleTable {
  name: string;
  module: string;
  schema: TableSchema;
  relationships?: TableRelationship[];
}

export interface TableSchema {
  columns: TableColumn[];
  indexes?: TableIndex[];
  constraints?: TableConstraint[];
}

export interface TableColumn {
  name: string;
  type: string;
  nullable?: boolean;
  default?: any;
  unique?: boolean;
}

export interface TableRelationship {
  type: "one-to-one" | "one-to-many" | "many-to-many";
  table: string;
  foreignKey: string;
  references: string;
}

export interface TableIndex {
  name: string;
  columns: string[];
  unique?: boolean;
}

export interface TableConstraint {
  name: string;
  type: "primary_key" | "foreign_key" | "unique" | "check";
  columns: string[];
  references?: {
    table: string;
    columns: string[];
  };
}

// =====================================
// 🔄 MIGRATION & UPDATES
// =====================================

export interface ModuleMigration {
  version: string;
  module: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

export interface ModuleUpdate {
  from: string;
  to: string;
  module: string;
  breaking: boolean;
  migrations: ModuleMigration[];
  changelog: string[];
}

// =====================================
// 💼 BUSINESS & PRICING
// =====================================

export interface ModulePackage {
  name: string;
  displayName: string;
  description: string;
  modules: string[];
  pricing: ModulePricing;
  features: string[];
  limitations?: Record<string, number>;
}

export interface ModuleLicense {
  module: string;
  type: "free" | "trial" | "paid" | "enterprise";
  validUntil?: Date;
  limitations?: Record<string, number>;
  features: string[];
}

// =====================================
// 🎯 MARKETPLACE TYPES
// =====================================

export interface ModuleMarketplace {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: string;
  category: ModuleCategory;
  tags: string[];
  pricing: ModulePricing;
  rating: number;
  downloads: number;
  screenshots: string[];
  documentation: string;
  compatibility: string[];
  lastUpdated: Date;
}

export type ModuleCategory = 
  | "core"
  | "admin-tools" 
  | "user-management"
  | "content-management"
  | "e-commerce"
  | "analytics"
  | "communication"
  | "security"
  | "integrations"
  | "custom";

// =====================================
// 🧪 TESTING & DEVELOPMENT
// =====================================

export interface ModuleTest {
  module: string;
  test: string;
  type: "unit" | "integration" | "e2e";
  status: "pass" | "fail" | "skip";
  duration: number;
  error?: string;
}

export interface ModuleDevelopment {
  module: string;
  isDevMode: boolean;
  hotReload: boolean;
  debugging: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
}

// =====================================
// 📦 EXPORT ALL TYPES
// =====================================

export default {
  ModuleConfig,
  ModuleFeature,
  ModuleTier,
  ModulePricing,
  NavigationItem,
  QuickAction,
  PageDefinition,
  RoleDefinition,
  SettingDefinition,
  ModuleHooks,
  HealthCheckConfig,
  ModuleManager,
  ModuleRegistry,
  ValidationResult,
  ModuleNavigation,
  ModulePage,
  ModuleComponent,
  ModulePermission,
  PermissionLevel,
  ModuleRole,
  SecurityContext,
  ModuleMetrics,
  ModuleEvent,
  ModuleTable,
  TableSchema,
  ModuleMigration,
  ModuleUpdate,
  ModulePackage,
  ModuleLicense,
  ModuleMarketplace,
  ModuleCategory,
  ModuleTest,
  ModuleDevelopment
};