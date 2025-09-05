/**
 * Version Control Configuration
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Centralized version tracking and metadata management.
 */

export const VERSION_CONFIG = {
  // Current Version Information
  current: {
    version: "3.0.2",
    codename: "Glass Template System",
    releaseDate: "2025-09-05",
    buildNumber: "2025.09.05.939"
  },

  // Release Information
  release: {
    type: "major" as const,
    impact: "feature" as const,
    stability: "stable" as const,
    breaking: false
  },

  // Development Metrics
  metrics: {
    filesChanged: 15,
    linesAdded: 2847,
    linesRemoved: 1205,
    componentsAdded: 8,
    pagesUpdated: 8,
    testCoverage: 95
  },

  // Feature Flags
  features: {
    glassTemplateSystem: true,
    adminChangelog: true,
    mobileOptimization: true,
    darkMode: false,
    advancedGlass: false,
    multiLanguage: false
  },

  // Branding Information
  branding: {
    developer: "OneZeroNine",
    email: "onezeronine@gmail.com",
    collaboration: "Claude (Anthropic)",
    copyright: "© 2025 OneZeroNine Premium Football Club Template",
    license: "Commercial Template License"
  },

  // Technical Information
  technical: {
    framework: "Next.js 15.4.6",
    language: "TypeScript",
    styling: "Tailwind CSS",
    animations: "Framer Motion",
    nodeVersion: "18.0.0+",
    packageManager: "npm"
  },

  // Browser Support
  browserSupport: {
    chrome: "100+",
    firefox: "100+", 
    safari: "14+",
    edge: "100+",
    mobile: "iOS 14+, Android 10+"
  },

  // Deployment Information
  deployment: {
    environment: "production" as const,
    deployedAt: new Date().toISOString(),
    commitHash: process.env.VERCEL_GIT_COMMIT_SHA || "local",
    branch: process.env.VERCEL_GIT_COMMIT_REF || "main"
  }
} as const;

export const CHANGELOG_CONFIG = {
  // Display Configuration
  display: {
    itemsPerPage: 10,
    showSearch: true,
    showFilters: true,
    showStats: true,
    animationDelay: 0.1
  },

  // Category Configuration
  categories: {
    "Major Features": { icon: "🌟", color: "text-yellow-600" },
    "Design Enhancements": { icon: "🎨", color: "text-purple-600" },
    "Technical Improvements": { icon: "🛠️", color: "text-blue-600" },
    "Page Updates": { icon: "📄", color: "text-green-600" },
    "Component System": { icon: "🔧", color: "text-indigo-600" },
    "Documentation": { icon: "📖", color: "text-cyan-600" },
    "Bug Fixes": { icon: "🐛", color: "text-red-600" },
    "OneZeroNine Branding": { icon: "⚡", color: "text-orange-600" },
    "Performance": { icon: "⚡", color: "text-emerald-600" },
    "Security": { icon: "🔒", color: "text-rose-600" }
  },

  // Impact Levels
  impactLevels: {
    breaking: { label: "Breaking", color: "bg-red-500 text-white" },
    feature: { label: "Feature", color: "bg-green-500 text-white" },
    improvement: { label: "Improvement", color: "bg-blue-500 text-white" },
    fix: { label: "Fix", color: "bg-yellow-500 text-white" }
  },

  // Version Types
  versionTypes: {
    major: { label: "Major", color: "bg-red-100 text-red-800 border-red-200" },
    minor: { label: "Minor", color: "bg-blue-100 text-blue-800 border-blue-200" },
    patch: { label: "Patch", color: "bg-green-100 text-green-800 border-green-200" }
  }
};

// Version History for Reference
export const VERSION_HISTORY = [
  {
    version: "2.3.0",
    codename: "Glass Template System",
    date: "2025-01-22",
    type: "major",
    breaking: false
  },
  {
    version: "2.2.0", 
    codename: "Glass Morphism Pro",
    date: "2025-01-21",
    type: "major",
    breaking: false
  },
  {
    version: "2.1.0",
    codename: "Community Design", 
    date: "2025-01-21",
    type: "minor",
    breaking: false
  },
  {
    version: "2.0.0",
    codename: "Modern Foundation",
    date: "2025-01-20", 
    type: "major",
    breaking: true
  },
  {
    version: "1.1.0",
    codename: "Content Expansion",
    date: "2025-01-19",
    type: "minor", 
    breaking: false
  },
  {
    version: "1.0.0",
    codename: "Initial Launch",
    date: "2025-01-18",
    type: "major",
    breaking: false
  }
] as const;

// Utility Functions
export const getVersionInfo = () => VERSION_CONFIG.current;

export const getBuildInfo = () => ({
  version: VERSION_CONFIG.current.version,
  buildNumber: VERSION_CONFIG.current.buildNumber,
  deployedAt: VERSION_CONFIG.deployment.deployedAt,
  environment: VERSION_CONFIG.deployment.environment
});

export const getFeatureFlags = () => VERSION_CONFIG.features;

export const isFeatureEnabled = (feature: keyof typeof VERSION_CONFIG.features): boolean => {
  return VERSION_CONFIG.features[feature];
};

export const formatVersion = (version: string, includeCodename = true): string => {
  const versionData = VERSION_HISTORY.find(v => v.version === version);
  if (!versionData) return version;
  
  return includeCodename 
    ? `v${version} - ${versionData.codename}`
    : `v${version}`;
};

export const getLatestChanges = (count = 5) => {
  return VERSION_HISTORY.slice(0, count);
};

export default VERSION_CONFIG;