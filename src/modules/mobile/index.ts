/**
 * 📱 MOBILE MODULE
 * Premium mobile experience and marketing tools
 * 
 * Business Module: €29-49/month
 * Target: Marketing teams, fans, mobile users
 */

// Core mobile components
export { default as MobileLayout } from '../../components/MobileLayout';
export { default as MobileHomePro } from '../../components/mobile/MobileHomePro';
export { default as MobileContactPro } from '../../components/mobile/MobileContactPro';
export { default as MobileAboutPro } from '../../components/mobile/MobileAboutPro';
export { default as MobileTeamsPro } from '../../components/mobile/MobileTeamsPro';
export { default as MobileNavigationPro } from '../../components/mobile/MobileNavigationPro';

// Design system components
export * from '../../design/MobileDesignSystem';

// Module configuration
export const MOBILE_MODULE_CONFIG = {
  id: 'mobile',
  name: 'Mobile Experience',
  version: '1.0.0',
  description: 'Premium mobile app and marketing tools',
  category: 'core' as const,
  
  // Business model
  pricing: {
    monthly: 29,
    annual: 299,
    currency: 'EUR'
  },
  
  // Features included
  features: [
    'Professional mobile interface',
    'Marketing-focused homepage', 
    'Social media integration',
    'Mobile-optimized contact forms',
    'Club branding and identity',
    'Fan engagement tools',
    'Progressive Web App (PWA) support',
    'Offline capabilities'
  ],
  
  // Target audience
  targetUsers: [
    'Club marketing teams',
    'Social media managers', 
    'Fans and supporters',
    'Mobile-first users'
  ],
  
  // Routes managed by this module
  routes: [
    '/', // Mobile homepage
    '/mobile',
    '/m/*' // Mobile-specific routes
  ],
  
  // Components provided
  components: [
    'MobileLayout',
    'MobileHomePro',
    'MobileContactPro', 
    'MobileAboutPro',
    'MobileTeamsPro',
    'MobileNavigationPro'
  ],
  
  // Dependencies
  dependencies: [],
  
  // Module status
  status: 'active',
  lastUpdated: new Date().toISOString()
};

// Mobile module utilities
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // md breakpoint
};

export const getMobileUserAgent = () => {
  if (typeof navigator === 'undefined') return null;
  return navigator.userAgent;
};

// Mobile analytics helpers
export const trackMobileEvent = (event: string, properties?: Record<string, any>) => {
  // TODO: Implement mobile-specific analytics
  console.log('Mobile Event:', event, properties);
};

// PWA utilities
export const installPWA = async () => {
  // TODO: Implement PWA installation prompt
  console.log('PWA installation requested');
};

// Module initialization
export const initializeMobileModule = (config?: Partial<typeof MOBILE_MODULE_CONFIG>) => {
  console.log('🚀 Mobile Module initialized:', MOBILE_MODULE_CONFIG.name);
  
  // Mobile-specific initialization
  if (typeof window !== 'undefined') {
    // Add mobile-specific CSS classes
    document.documentElement.classList.add('mobile-module-active');
    
    // Initialize PWA features
    if ('serviceWorker' in navigator) {
      // TODO: Register service worker for PWA
    }
    
    // Initialize mobile analytics
    trackMobileEvent('module_initialized', {
      version: MOBILE_MODULE_CONFIG.version,
      timestamp: new Date().toISOString()
    });
  }
  
  return MOBILE_MODULE_CONFIG;
};