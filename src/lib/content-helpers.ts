/**
 * 🛠️ CONTENT HELPER UTILITIES
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: Easy-to-use functions for accessing template content
 * Usage: Import these helpers instead of directly accessing config
 */

import {
  ORGANIZATION,
  HERO_CONTENT,
  PAGE_CONTENT,
  COMPONENTS,
  SEO_CONFIG,
  FEATURES,
  MOBILE_CONFIG
} from '../config/content';

// =====================================
// 🏢 ORGANIZATION HELPERS
// =====================================

export const getOrganization = () => ORGANIZATION;

export const getContactInfo = () => ({
  email: ORGANIZATION.email,
  phone: ORGANIZATION.phone,
  address: `${ORGANIZATION.location.address}, ${ORGANIZATION.location.city}, ${ORGANIZATION.location.state} ${ORGANIZATION.location.zip}`,
  fullLocation: ORGANIZATION.location
});

export const getSocialLinks = () => ORGANIZATION.social;

// =====================================
// 🎨 HERO CONTENT HELPERS
// =====================================

export const getHeroContent = (page: keyof typeof HERO_CONTENT) => {
  const hero = HERO_CONTENT[page];
  if (!hero) {
    console.warn(`Hero content for page "${page}" not found`);
    return HERO_CONTENT.home; // Fallback to home
  }
  return hero;
};

export const getPageHero = (page: string) => {
  return getHeroContent(page as keyof typeof HERO_CONTENT);
};

// =====================================
// 📝 PAGE CONTENT HELPERS
// =====================================

export const getPageContent = (page: keyof typeof PAGE_CONTENT) => {
  const content = PAGE_CONTENT[page];
  if (!content) {
    console.warn(`Page content for "${page}" not found`);
    return {};
  }
  return content;
};

export const getHomeContent = () => PAGE_CONTENT.home;
export const getEventsContent = () => PAGE_CONTENT.events;

// =====================================
// 🧩 COMPONENT HELPERS
// =====================================

export const getNavigationItems = () => COMPONENTS.navigation.mainMenuItems;
export const getFooterLinks = () => COMPONENTS.navigation.footerLinks;

export const getQuickActions = (page: keyof typeof COMPONENTS.quickActions) => {
  const actions = COMPONENTS.quickActions[page];
  if (!actions) {
    console.warn(`Quick actions for page "${page}" not found`);
    return COMPONENTS.quickActions.home; // Fallback
  }
  return actions;
};

// =====================================
// 🎯 SEO HELPERS
// =====================================

export const getSEOConfig = (page?: keyof typeof SEO_CONFIG.pages) => {
  const base = {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    keywords: SEO_CONFIG.defaultKeywords,
    image: SEO_CONFIG.defaultImage
  };

  if (page && SEO_CONFIG.pages[page]) {
    return {
      ...base,
      ...SEO_CONFIG.pages[page]
    };
  }

  return base;
};

export const getPageTitle = (page: string, customTitle?: string) => {
  if (customTitle) {
    return `${customTitle} - ${ORGANIZATION.name}`;
  }
  
  const seoConfig = getSEOConfig(page as keyof typeof SEO_CONFIG.pages);
  return seoConfig.title;
};

// =====================================
// 🔧 FEATURE HELPERS
// =====================================

export const isFeatureEnabled = (feature: keyof typeof FEATURES) => {
  return FEATURES[feature];
};

export const getEnabledFeatures = () => {
  return Object.entries(FEATURES)
    .filter(([_, enabled]) => enabled)
    .map(([feature, _]) => feature);
};

export const shouldShowAuthFeatures = () => {
  return FEATURES.auth.enabled;
};

export const shouldShowRegistration = () => {
  return FEATURES.auth.enabled && FEATURES.auth.registration;
};

// =====================================
// 📱 MOBILE HELPERS
// =====================================

export const getMobileConfig = () => MOBILE_CONFIG;

export const isPWAEnabled = () => MOBILE_CONFIG.pwa.enabled;

export const getMobileFeatures = () => MOBILE_CONFIG.features;

// =====================================
// 🎨 STYLING HELPERS
// =====================================

export const getBrandColors = () => ORGANIZATION.colors;

export const getPrimaryColor = () => ORGANIZATION.colors.primary;
export const getSecondaryColor = () => ORGANIZATION.colors.secondary;
export const getAccentColor = () => ORGANIZATION.colors.accent;

// =====================================
// 📊 UTILITY HELPERS
// =====================================

export const replaceTemplatePlaceholders = (text: string, customData?: Record<string, string>) => {
  const replacements = {
    '{{ORGANIZATION_NAME}}': ORGANIZATION.name,
    '{{ORGANIZATION_SHORT}}': ORGANIZATION.shortName,
    '{{ORGANIZATION_EMAIL}}': ORGANIZATION.email,
    '{{ORGANIZATION_PHONE}}': ORGANIZATION.phone,
    '{{ORGANIZATION_WEBSITE}}': ORGANIZATION.website,
    '{{CURRENT_YEAR}}': new Date().getFullYear().toString(),
    ...customData
  };

  let result = text;
  Object.entries(replacements).forEach(([placeholder, value]) => {
    result = result.replace(new RegExp(placeholder, 'g'), value);
  });

  return result;
};

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(
    typeof date === 'string' ? new Date(date) : date
  );
};

// =====================================
// 🔍 TEMPLATE VALIDATION
// =====================================

export const validateTemplate = () => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required organization fields
  if (!ORGANIZATION.name || ORGANIZATION.name === "Your Club Name") {
    errors.push("Organization name must be customized");
  }

  if (!ORGANIZATION.email || ORGANIZATION.email === "hello@yourclub.com") {
    warnings.push("Organization email should be customized");
  }

  // Check hero images
  Object.entries(HERO_CONTENT).forEach(([page, hero]) => {
    if (hero.backgroundImage?.includes('unsplash.com')) {
      warnings.push(`Hero image for ${page} is using placeholder from Unsplash`);
    }
  });

  // Check for template placeholders in critical content
  const criticalText = JSON.stringify({ ORGANIZATION, HERO_CONTENT, PAGE_CONTENT });
  if (criticalText.includes('Your Club') || criticalText.includes('yourclub.com')) {
    warnings.push("Template contains placeholder text that should be customized");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
};

// =====================================
// 🚀 QUICK SETUP HELPER
// =====================================

export const generateQuickSetup = (organizationName: string, domain: string, email: string) => {
  return {
    ORGANIZATION: {
      ...ORGANIZATION,
      name: organizationName,
      shortName: organizationName.split(' ').map(word => word[0]).join(''),
      website: domain,
      email: email
    },
    
    HERO_CONTENT: {
      ...HERO_CONTENT,
      home: {
        ...HERO_CONTENT.home,
        title: `Welcome to ${organizationName}`,
        subtitle: `Join ${organizationName} and be part of our amazing community`
      }
    },
    
    SEO_CONFIG: {
      ...SEO_CONFIG,
      defaultTitle: `${organizationName} - Community Excellence`,
      defaultDescription: `Join ${organizationName}, a thriving community dedicated to excellence and growth.`
    }
  };
};

// =====================================
// 📦 EXPORT ALL HELPERS
// =====================================

export default {
  // Organization
  getOrganization,
  getContactInfo,
  getSocialLinks,
  
  // Content
  getHeroContent,
  getPageHero,
  getPageContent,
  getHomeContent,
  getEventsContent,
  
  // Components
  getNavigationItems,
  getFooterLinks,
  getQuickActions,
  
  // SEO
  getSEOConfig,
  getPageTitle,
  
  // Features
  isFeatureEnabled,
  getEnabledFeatures,
  shouldShowAuthFeatures,
  shouldShowRegistration,
  
  // Mobile
  getMobileConfig,
  isPWAEnabled,
  getMobileFeatures,
  
  // Styling
  getBrandColors,
  getPrimaryColor,
  getSecondaryColor,
  getAccentColor,
  
  // Utilities
  replaceTemplatePlaceholders,
  formatDate,
  validateTemplate,
  generateQuickSetup
};