/**
 * 🏗️ MODULAR PRODUCT SYSTEM
 * Business module management and configuration
 * 
 * Handles: Module loading, permissions, subscriptions, feature flags
 */

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'premium' | 'enterprise';
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  dependencies?: string[];
  routes: string[];
  components: string[];
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  modules: string[];
  features: string[];
  limits: {
    teams?: number;
    matches?: number;
    players?: number;
    storage?: string;
  };
}

// Available Product Modules
export const PRODUCT_MODULES: Record<string, ModuleConfig> = {
  mobile: {
    id: 'mobile',
    name: 'Mobile Experience',
    description: 'Premium mobile app and marketing tools',
    category: 'core',
    price: {
      monthly: 29,
      annual: 299
    },
    features: [
      'Professional mobile interface',
      'Marketing-focused homepage',
      'Social media integration',
      'Mobile-optimized forms',
      'Club branding system',
      'Fan engagement tools'
    ],
    routes: ['/mobile', '/'],
    components: ['MobileLayout', 'MobileHomePro', 'MobileContactPro', 'MobileTeamsPro']
  },

  desktop: {
    id: 'desktop',
    name: 'Desktop Management',
    description: 'Full-featured club website and admin tools',
    category: 'core', 
    price: {
      monthly: 49,
      annual: 499
    },
    features: [
      'Glass morphism design system',
      'Complete admin dashboard',
      'Content management system',
      'Member management',
      'News and announcements',
      'Advanced reporting'
    ],
    routes: ['/admin', '/news', '/gallery', '/club'],
    components: ['StandardLayout', 'GlassPageTemplate', 'AdminDashboard']
  },

  matchday: {
    id: 'matchday',
    name: 'MatchDay Live',
    description: 'Live match tracking and results management',
    category: 'premium',
    price: {
      monthly: 39,
      annual: 399
    },
    features: [
      'Live match scoring',
      'Fixture management',
      'Team lineups',
      'Match statistics',
      'Results display',
      'League tables'
    ],
    routes: ['/matchday', '/match-central', '/fixtures'],
    components: ['MatchTracker', 'LiveScore', 'FixtureManager']
  },

  tracker: {
    id: 'tracker',
    name: 'Match Tracker Pro',
    description: 'Advanced analytics and performance tracking',
    category: 'premium',
    price: {
      monthly: 99,
      annual: 999
    },
    features: [
      'Advanced match analytics',
      'Player performance tracking',
      'Heat maps and positioning',
      'Season statistics',
      'Coaching insights',
      'Video integration'
    ],
    dependencies: ['matchday'],
    routes: ['/tracker', '/analytics', '/performance'],
    components: ['AnalyticsDashboard', 'PlayerStats', 'HeatMap']
  },

  bootroom: {
    id: 'bootroom',
    name: 'Boot Room',
    description: 'Coaching tools and player development',
    category: 'premium',
    price: {
      monthly: 59,
      annual: 599
    },
    features: [
      'Training session planner',
      'Player development tracking',
      'Coaching resource library',
      'Communication tools',
      'Youth pathway management',
      'Certification tracking'
    ],
    routes: ['/boot-room', '/training', '/development'],
    components: ['TrainingPlanner', 'PlayerDevelopment', 'CoachingTools']
  }
};

// Subscription Tiers
export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small clubs starting their digital journey',
    price: {
      monthly: 79,
      annual: 799
    },
    modules: ['mobile', 'desktop', 'matchday'],
    features: [
      'Mobile experience',
      'Basic website',
      'Match results',
      'Up to 5 teams',
      '100 matches/season',
      'Email support'
    ],
    limits: {
      teams: 5,
      matches: 100,
      players: 150,
      storage: '5GB'
    }
  },

  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Complete solution for established clubs',
    price: {
      monthly: 149,
      annual: 1499
    },
    modules: ['mobile', 'desktop', 'matchday', 'tracker', 'bootroom'],
    features: [
      'All Starter features',
      'Advanced analytics',
      'Coaching tools',
      'Unlimited teams',
      'Unlimited matches',
      'Priority support'
    ],
    limits: {
      teams: -1, // Unlimited
      matches: -1,
      players: -1,
      storage: '50GB'
    }
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For federations and multi-club organizations',
    price: {
      monthly: 299,
      annual: 2999
    },
    modules: ['mobile', 'desktop', 'matchday', 'tracker', 'bootroom'],
    features: [
      'All Professional features',
      'Multi-club management',
      'Custom branding',
      'API access',
      'White-label options',
      'Dedicated support'
    ],
    limits: {
      teams: -1,
      matches: -1,
      players: -1,
      storage: '500GB'
    }
  }
};

// Module Permission System
export interface UserPermissions {
  modules: string[];
  tier: string;
  clubId: string;
  features: string[];
}

export class ModuleManager {
  private permissions: UserPermissions;

  constructor(permissions: UserPermissions) {
    this.permissions = permissions;
  }

  /**
   * Check if user has access to a specific module
   */
  hasModuleAccess(moduleId: string): boolean {
    return this.permissions.modules.includes(moduleId);
  }

  /**
   * Check if user has access to a specific route
   */
  hasRouteAccess(route: string): boolean {
    for (const moduleId of this.permissions.modules) {
      const module = PRODUCT_MODULES[moduleId];
      if (module && module.routes.some(r => route.startsWith(r))) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get all available modules for current subscription
   */
  getAvailableModules(): ModuleConfig[] {
    return this.permissions.modules
      .map(id => PRODUCT_MODULES[id])
      .filter(Boolean);
  }

  /**
   * Get current subscription tier details
   */
  getSubscriptionTier(): SubscriptionTier | null {
    return SUBSCRIPTION_TIERS[this.permissions.tier] || null;
  }

  /**
   * Check if user has reached usage limits
   */
  checkUsageLimits(usage: {
    teams?: number;
    matches?: number;
    players?: number;
    storage?: number;
  }): {
    teams: boolean;
    matches: boolean;
    players: boolean;
    storage: boolean;
  } {
    const tier = this.getSubscriptionTier();
    if (!tier) return { teams: false, matches: false, players: false, storage: false };

    return {
      teams: tier.limits.teams !== -1 && (usage.teams || 0) >= (tier.limits.teams || 0),
      matches: tier.limits.matches !== -1 && (usage.matches || 0) >= (tier.limits.matches || 0),
      players: tier.limits.players !== -1 && (usage.players || 0) >= (tier.limits.players || 0),
      storage: false // TODO: Implement storage checking
    };
  }
}

// Demo permissions for development
export const DEMO_PERMISSIONS: UserPermissions = {
  modules: ['mobile', 'desktop', 'matchday', 'tracker', 'bootroom'],
  tier: 'professional',
  clubId: 'rvrfc',
  features: ['all']
};

// Module loading utilities (for future use)
export const loadModule = async (moduleId: string) => {
  // TODO: Implement dynamic module loading when needed
  // For now, modules are statically imported where needed
  console.log(`Module loading requested: ${moduleId}`);
  return null;
};

// Revenue calculation utilities
export const calculateRevenue = (clubs: number, tierDistribution: Record<string, number>) => {
  let totalMonthly = 0;
  
  Object.entries(tierDistribution).forEach(([tier, count]) => {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (tierConfig) {
      totalMonthly += tierConfig.price.monthly * count;
    }
  });

  return {
    monthly: totalMonthly,
    annual: totalMonthly * 12 * 0.9, // 10% discount for annual
    clubs,
    avgPerClub: totalMonthly / clubs
  };
};