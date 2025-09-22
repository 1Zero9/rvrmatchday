/**
 * 🎛️ MODULE CONFIGURATION
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: Central configuration for enabling/disabling modules
 * Edit this file to customize which features are included in your template
 */

// =====================================
// 📦 TEMPLATE PACKAGES  
// =====================================

export type TemplatePackage = "starter" | "standard" | "professional" | "business" | "enterprise" | "custom";

// Package definitions with included modules
export const TEMPLATE_PACKAGES: Record<TemplatePackage, string[]> = {
  // 🆓 STARTER ($0/month)
  // Perfect for basic community websites
  starter: [
    "core-website"  // Just the essentials
  ],
  
  // ⭐ STANDARD ($99/month) 
  // Great for active community organizations
  standard: [
    "core-website",
    "event-management"
  ],
  
  // 🚀 PROFESSIONAL ($299/month)
  // Ideal for sports clubs and competitive organizations  
  professional: [
    "core-website",
    "event-management", 
    "match-management",
    "admin-tools"
  ],
  
  // 💼 BUSINESS ($499/month)
  // Enterprise features for large organizations
  business: [
    "core-website",
    "event-management",
    "match-management", 
    "user-management",
    "admin-tools"
  ],
  
  // 🏢 ENTERPRISE ($999/month)
  // Everything + custom modules and priority support
  enterprise: [
    "core-website",
    "event-management",
    "match-management",
    "user-management",
    "admin-tools", 
    "analytics",
    "advanced-security",
    "api-access",
    "white-label"
  ],
  
  // 🛠️ CUSTOM (Contact for pricing)
  // Mix and match any modules
  custom: []  // Configured per client
};

// =====================================
// 🎯 CURRENT TEMPLATE CONFIGURATION
// =====================================

// EDIT THIS: Choose your template package or specify custom modules
export const CURRENT_PACKAGE: TemplatePackage = "business";

// EDIT THIS: For custom packages, specify exact modules
export const CUSTOM_MODULES: string[] = [
  "core-website",
  "match-management", 
  "user-management",
  "admin-tools"
  // Add/remove modules as needed
];

// Get enabled modules based on package selection
export const getEnabledModules = (): string[] => {
  if (CURRENT_PACKAGE === "custom") {
    return CUSTOM_MODULES;
  }
  
  return TEMPLATE_PACKAGES[CURRENT_PACKAGE] || TEMPLATE_PACKAGES.starter;
};

// =====================================
// 🔧 MODULE FEATURE FLAGS
// =====================================

export const FEATURE_FLAGS = {
  // Core website features (always enabled)
  publicPages: true,
  contactForms: true,
  newsletter: true,
  seo: true,
  
  // Event management features
  eventCreation: CURRENT_PACKAGE !== "starter",
  eventRegistration: CURRENT_PACKAGE !== "starter",
  volunteerManagement: CURRENT_PACKAGE !== "starter",
  
  // Match management features  
  matchRecording: ["professional", "business", "enterprise"].includes(CURRENT_PACKAGE),
  teamManagement: ["professional", "business", "enterprise"].includes(CURRENT_PACKAGE),
  statistics: ["professional", "business", "enterprise"].includes(CURRENT_PACKAGE),
  liveScoring: ["business", "enterprise"].includes(CURRENT_PACKAGE),
  
  // User management features
  userDirectory: ["business", "enterprise"].includes(CURRENT_PACKAGE),
  roleManagement: ["business", "enterprise"].includes(CURRENT_PACKAGE),
  auditLogs: ["business", "enterprise"].includes(CURRENT_PACKAGE),
  bulkOperations: ["enterprise"].includes(CURRENT_PACKAGE),
  
  // Analytics features
  basicAnalytics: ["professional", "business", "enterprise"].includes(CURRENT_PACKAGE),
  advancedAnalytics: ["enterprise"].includes(CURRENT_PACKAGE),
  customReports: ["enterprise"].includes(CURRENT_PACKAGE),
  
  // Security features
  twoFactor: ["enterprise"].includes(CURRENT_PACKAGE),
  ssoIntegration: ["enterprise"].includes(CURRENT_PACKAGE),
  advancedSecurity: ["enterprise"].includes(CURRENT_PACKAGE),
  
  // API and integrations
  apiAccess: ["business", "enterprise"].includes(CURRENT_PACKAGE),
  webhooks: ["enterprise"].includes(CURRENT_PACKAGE),
  thirdPartyIntegrations: ["enterprise"].includes(CURRENT_PACKAGE),
  
  // Branding and customization
  customBranding: ["professional", "business", "enterprise"].includes(CURRENT_PACKAGE),
  whiteLabel: ["enterprise"].includes(CURRENT_PACKAGE),
  customDomain: ["professional", "business", "enterprise"].includes(CURRENT_PACKAGE)
};

// =====================================
// 💰 PRICING INFORMATION
// =====================================

export const PACKAGE_PRICING = {
  starter: { 
    monthly: 0, 
    yearly: 0, 
    setup: 0,
    description: "Perfect for getting started",
    maxUsers: 10,
    maxEvents: 5,
    support: "Community"
  },
  standard: { 
    monthly: 99, 
    yearly: 990, 
    setup: 99,
    description: "Great for active communities", 
    maxUsers: 100,
    maxEvents: 50,
    support: "Email"
  },
  professional: { 
    monthly: 299, 
    yearly: 2990, 
    setup: 199,
    description: "Ideal for sports organizations",
    maxUsers: 500,
    maxEvents: 200,
    support: "Priority Email"
  },
  business: { 
    monthly: 499, 
    yearly: 4990, 
    setup: 399,
    description: "Enterprise features included",
    maxUsers: 2000,
    maxEvents: 1000,
    support: "Phone + Email"
  },
  enterprise: { 
    monthly: 999, 
    yearly: 9990, 
    setup: 999,
    description: "Everything + custom development",
    maxUsers: "Unlimited",
    maxEvents: "Unlimited", 
    support: "Dedicated Manager"
  },
  custom: {
    monthly: "Contact",
    yearly: "Contact", 
    setup: "Contact",
    description: "Tailored to your exact needs",
    maxUsers: "Custom",
    maxEvents: "Custom",
    support: "Custom"
  }
};

// =====================================
// 🎨 THEME CUSTOMIZATION
// =====================================

export const THEME_CONFIG = {
  // Color scheme (edit these to match client branding)
  colors: {
    primary: "#1f2937",     // Dark gray
    secondary: "#3b82f6",   // Blue  
    accent: "#10b981",      // Green
    warning: "#f59e0b",     // Amber
    danger: "#ef4444",      // Red
    neutral: "#6b7280"      // Gray
  },
  
  // Typography
  fonts: {
    heading: "Inter",
    body: "Inter",
    mono: "JetBrains Mono"
  },
  
  // Layout
  layout: {
    maxWidth: "1200px",
    containerPadding: "1rem",
    borderRadius: "0.5rem"
  }
};

// =====================================
// 🌍 DEPLOYMENT CONFIGURATION
// =====================================

export const DEPLOYMENT_CONFIG = {
  // Environment detection
  environment: process.env.NODE_ENV || "development",
  
  // Feature flags based on environment
  developmentFeatures: {
    debugMode: process.env.NODE_ENV === "development",
    showModuleInfo: process.env.NODE_ENV === "development",
    mockData: process.env.NODE_ENV === "development"
  },
  
  // Production optimizations
  productionFeatures: {
    analytics: process.env.NODE_ENV === "production",
    errorTracking: process.env.NODE_ENV === "production", 
    performance: process.env.NODE_ENV === "production"
  }
};

// =====================================
// 📊 USAGE LIMITS
// =====================================

export const USAGE_LIMITS = {
  users: PACKAGE_PRICING[CURRENT_PACKAGE]?.maxUsers || 10,
  events: PACKAGE_PRICING[CURRENT_PACKAGE]?.maxEvents || 5,
  matches: CURRENT_PACKAGE === "starter" ? 0 : CURRENT_PACKAGE === "standard" ? 0 : 100,
  apiCalls: CURRENT_PACKAGE === "starter" ? 0 : 10000,
  storage: CURRENT_PACKAGE === "starter" ? "1GB" : "10GB",
  bandwidth: CURRENT_PACKAGE === "starter" ? "10GB" : "100GB"
};

// =====================================
// 🛠️ DEVELOPMENT UTILITIES
// =====================================

export const isDevelopment = () => process.env.NODE_ENV === "development";
export const isProduction = () => process.env.NODE_ENV === "production";
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => FEATURE_FLAGS[feature];
export const getCurrentPackage = (): TemplatePackage => CURRENT_PACKAGE;
export const getPackagePricing = () => PACKAGE_PRICING[CURRENT_PACKAGE];

// =====================================
// 📋 VALIDATION
// =====================================

export const validateConfiguration = () => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if package exists
  if (CURRENT_PACKAGE !== "custom" && !TEMPLATE_PACKAGES[CURRENT_PACKAGE]) {
    errors.push(`Invalid package: ${CURRENT_PACKAGE}`);
  }
  
  // Check custom modules
  if (CURRENT_PACKAGE === "custom" && CUSTOM_MODULES.length === 0) {
    warnings.push("Custom package selected but no modules specified");
  }
  
  // Check core module
  const enabledModules = getEnabledModules();
  if (!enabledModules.includes("core-website")) {
    errors.push("Core website module must be enabled");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    enabledModules,
    package: CURRENT_PACKAGE,
    pricing: PACKAGE_PRICING[CURRENT_PACKAGE]
  };
};

// =====================================
// 🚀 QUICK SETUP FUNCTION
// =====================================

export const setupTemplate = (packageName: TemplatePackage, customModules?: string[]) => {
  if (packageName === "custom" && !customModules) {
    throw new Error("Custom modules must be specified for custom package");
  }
  
  const config = {
    package: packageName,
    modules: packageName === "custom" ? customModules : TEMPLATE_PACKAGES[packageName],
    pricing: PACKAGE_PRICING[packageName],
    features: Object.entries(FEATURE_FLAGS).filter(([_, enabled]) => enabled),
    limits: USAGE_LIMITS
  };
  
  console.log("Template Configuration:", config);
  return config;
};

// Export everything for easy import
export default {
  TEMPLATE_PACKAGES,
  CURRENT_PACKAGE,
  CUSTOM_MODULES,
  getEnabledModules,
  FEATURE_FLAGS,
  PACKAGE_PRICING,
  THEME_CONFIG,
  DEPLOYMENT_CONFIG,
  USAGE_LIMITS,
  isFeatureEnabled,
  getCurrentPackage,
  getPackagePricing,
  validateConfiguration,
  setupTemplate
};