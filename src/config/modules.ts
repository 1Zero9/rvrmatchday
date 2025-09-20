/**
 * Modular System Configuration
 * Defines which functional modules are enabled/disabled
 * 
 * This allows clubs to purchase only the functionality they need
 * and enables easy white-labeling and customization
 */

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  pages: string[];
  components: string[];
  price: number;
  category: 'essential' | 'functional' | 'premium';
  dependencies: string[];
}

export interface ClubConfig {
  clubName: string;
  clubId: string;
  plan: 'starter' | 'professional' | 'enterprise' | 'custom';
  modules: Record<string, boolean>;
  customization: {
    theme: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    logo: string;
    domain: string;
  };
}

// =================================
// MODULE DEFINITIONS
// =================================

export const MODULES: Record<string, ModuleConfig> = {
  // CORE WEBSITE (Always Enabled)
  'core-website': {
    id: 'core-website',
    name: 'Core Website',
    description: 'Essential club website with homepage, about, contact, teams showcase, and basic content management',
    enabled: true, // Always enabled
    pages: [
      '/',
      '/home',
      '/about', 
      '/contact',
      '/teams/*',
      '/club/*',
      '/join/*',
      '/news',
      '/gallery',
      '/fundraising',
      '/volunteering',
      '/shop',
      '/get-involved/*'
    ],
    components: [
      'StandardLayout',
      'Header',
      'Footer', 
      'ContactForm',
      'TeamCard',
      'NewsCard'
    ],
    price: 2500,
    category: 'essential',
    dependencies: []
  },

  // FUNCTIONAL MODULES (Optional Add-ons)
  'match-central': {
    id: 'match-central',
    name: 'Match Central Hub',
    description: 'Complete match management with live tracking, statistics, league tables, and mobile recording',
    enabled: true, // Currently enabled for RVR
    pages: [
      '/match-central',
      '/match-admin', 
      '/match-recorder',
      '/matchday',
      '/tracker',
      '/match-central/*',
      '/matches/*'
    ],
    components: [
      'MatchCentral',
      'MatchRecorder',
      'CelebrationResultCard',
      'AdvancedTeamFilter',
      'MatchTypeBadge'
    ],
    price: 2000,
    category: 'functional',
    dependencies: ['core-website']
  },

  'user-management': {
    id: 'user-management', 
    name: 'User Management System',
    description: 'Enterprise user accounts, role-based access, admin dashboard, and authentication workflows',
    enabled: true, // Currently enabled for RVR
    pages: [
      '/admin',
      '/user-management',
      '/account-admin',
      '/account-request', 
      '/admin-request',
      '/auth-login',
      '/login',
      '/register',
      '/reset-password',
      '/welcome'
    ],
    components: [
      'UnifiedAccountManagement',
      'SecureAuth',
      'AdminUserManagement', 
      'UserNotification',
      'AdminAuditLogs'
    ],
    price: 1500,
    category: 'functional',
    dependencies: ['core-website']
  },

  'boot-room': {
    id: 'boot-room',
    name: 'Boot Room Exchange', 
    description: 'Equipment trading platform for club members to buy/sell/exchange gear',
    enabled: true, // Currently enabled for RVR
    pages: ['/boot-room'],
    components: [
      'EquipmentCard',
      'EquipmentFilter',
      'EquipmentForm'
    ],
    price: 800,
    category: 'functional',
    dependencies: ['core-website', 'user-management']
  },

  'quick-tools': {
    id: 'quick-tools',
    name: 'Quick Tools Suite',
    description: 'Mobile-optimized quick access tools for match recording and facility booking',
    enabled: true, // Currently enabled for RVR
    pages: [
      '/quick-record',
      '/book-astro',
      '/dashboard'
    ],
    components: [
      'QuickRecorder',
      'FacilityBooking',
      'MobileOptimizedForm'
    ],
    price: 600,
    category: 'functional', 
    dependencies: ['core-website']
  },

  'secure-access': {
    id: 'secure-access',
    name: 'Secure Access Wrappers',
    description: 'Authentication wrappers for secure access to sensitive functionality',
    enabled: true, // Currently enabled for RVR
    pages: [
      '/secure-match-central',
      '/secure-match-recorder'
    ],
    components: [
      'SecureWrapper',
      'AuthenticationGuard'
    ],
    price: 400,
    category: 'functional',
    dependencies: ['core-website', 'user-management']
  },

  'analytics-pro': {
    id: 'analytics-pro',
    name: 'Advanced Analytics',
    description: 'Detailed performance analytics, trends, and reporting for teams and players',
    enabled: false, // Future module
    pages: ['/analytics', '/reports', '/insights'],
    components: [
      'AdvancedCharts',
      'PerformanceReports', 
      'TrendAnalysis'
    ],
    price: 1800,
    category: 'premium',
    dependencies: ['core-website', 'match-central']
  },

  'academy-pro': {
    id: 'academy-pro',
    name: 'Academy Management',
    description: 'Player development tracking, coaching tools, and parent communication portal',
    enabled: false, // Future module
    pages: ['/academy', '/development', '/coaching-tools'],
    components: [
      'PlayerDevelopment',
      'CoachingTools',
      'ParentPortal'
    ],
    price: 2500,
    category: 'premium', 
    dependencies: ['core-website', 'user-management']
  }
};

// =================================
// CURRENT CLUB CONFIGURATION (RVR)
// =================================

export const CLUB_CONFIG: ClubConfig = {
  clubName: 'Rivervalley Rangers AFC',
  clubId: 'rvr-afc',
  plan: 'enterprise',
  modules: {
    'core-website': true,
    'match-central': true,
    'user-management': true,
    'boot-room': true,
    'quick-tools': true,
    'secure-access': true,
    'analytics-pro': false,
    'academy-pro': false
  },
  customization: {
    theme: 'rvr-default',
    colors: {
      primary: '#972A4C',   // RVR Burgundy
      secondary: '#5E7794', // Professional Blue
      accent: '#E91E63'     // Girls Teams Pink
    },
    logo: '/images/rvr-logo.png',
    domain: 'rivervalleyrangers.ie'
  }
};

// =================================
// MODULE UTILITIES
// =================================

export class ModuleManager {
  static isModuleEnabled(moduleId: string): boolean {
    return CLUB_CONFIG.modules[moduleId] === true;
  }

  static getEnabledModules(): ModuleConfig[] {
    return Object.values(MODULES).filter(module => 
      this.isModuleEnabled(module.id)
    );
  }

  static getModulesByCategory(category: ModuleConfig['category']): ModuleConfig[] {
    return Object.values(MODULES).filter(module => 
      module.category === category
    );
  }

  static calculateTotalPrice(): number {
    return this.getEnabledModules().reduce((total, module) => 
      total + module.price, 0
    );
  }

  static getAvailablePages(): string[] {
    return this.getEnabledModules().flatMap(module => module.pages);
  }

  static canAccessPage(page: string): boolean {
    const availablePages = this.getAvailablePages();
    return availablePages.some(availablePage => {
      if (availablePage.endsWith('/*')) {
        const basePage = availablePage.slice(0, -2);
        return page.startsWith(basePage);
      }
      return page === availablePage;
    });
  }

  static validateDependencies(moduleId: string): boolean {
    const module = MODULES[moduleId];
    if (!module) return false;
    
    return module.dependencies.every(depId => 
      this.isModuleEnabled(depId)
    );
  }

  static enableModule(moduleId: string): boolean {
    if (!this.validateDependencies(moduleId)) {
      console.warn(`Cannot enable ${moduleId}: missing dependencies`);
      return false;
    }
    
    CLUB_CONFIG.modules[moduleId] = true;
    return true;
  }

  static disableModule(moduleId: string): boolean {
    // Check if other modules depend on this one
    const dependentModules = Object.values(MODULES).filter(module =>
      module.dependencies.includes(moduleId) && 
      this.isModuleEnabled(module.id)
    );

    if (dependentModules.length > 0) {
      console.warn(`Cannot disable ${moduleId}: required by ${dependentModules.map(m => m.name).join(', ')}`);
      return false;
    }

    CLUB_CONFIG.modules[moduleId] = false;
    return true;
  }
}

// =================================
// PRICING PACKAGES
// =================================

export const PRICING_PACKAGES = {
  starter: {
    name: 'Starter Package',
    price: 2500,
    modules: ['core-website'],
    description: 'Essential club website with basic functionality'
  },
  
  professional: {
    name: 'Professional Package', 
    price: 5500,
    modules: ['core-website', 'match-central', 'user-management', 'boot-room'],
    description: 'Complete club management with match tracking and user accounts'
  },

  enterprise: {
    name: 'Enterprise Package',
    price: 12500, 
    modules: ['core-website', 'match-central', 'user-management', 'boot-room', 'quick-tools', 'secure-access', 'analytics-pro', 'academy-pro'],
    description: 'Full-featured solution with all premium modules'
  }
};

export default ModuleManager;