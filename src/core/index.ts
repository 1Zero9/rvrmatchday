/**
 * 🏠 CORE WEBSITE SYSTEM
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: Base website functionality that's always included
 * This is the foundation that all modules build upon
 */

export const CORE_CONFIG = {
  name: "core-website",
  displayName: "Core Website",
  version: "1.0.0",
  description: "Essential website functionality - always included",
  
  // This module has no dependencies (it IS the foundation)
  dependencies: [],
  optionalDependencies: [],
  
  // Core features (always enabled)
  features: {
    publicPages: true,
    navigation: true,
    contentManagement: true,
    basicSEO: true,
    responsiveDesign: true,
    contactForms: true
  },
  
  // Core is always free (part of template base)
  tier: "free",
  pricing: {
    monthly: 0,
    yearly: 0
  },
  
  // Core navigation items (always present)
  navigation: [
    { label: "Home", href: "/", icon: "🏠", priority: 1 },
    { label: "About", href: "/about", icon: "🏛️", priority: 2 },
    { label: "Teams", href: "/teams", icon: "👥", priority: 3, hasDropdown: true },
    { label: "Events", href: "/events", icon: "🎊", priority: 4 },
    { label: "Contact", href: "/contact", icon: "📞", priority: 5, hasDropdown: true }
  ],
  
  // Core pages (always available)
  pages: [
    "/",
    "/home", 
    "/about",
    "/contact",
    "/teams",
    "/events",
    "/gallery",
    "/news",
    "/join",
    "/volunteering",
    "/fundraising",
    "/shop"
  ],
  
  // Core API routes
  apiRoutes: [
    "/api/contact",
    "/api/newsletter"
  ],
  
  // Core database tables (if any)
  tables: [],
  
  // No special permissions required for core
  permissions: []
};

// Export core components that modules can use
export { default as StandardLayout } from '../components/StandardLayout';
export { default as MobileLayout } from '../components/MobileLayout'; 
export { GlassCard } from '../components/Glass';
export { default as GlassPageTemplate } from '../components/GlassPageTemplate';
export { default as Footer } from '../components/Footer';

// Export core utilities
export * from '../lib/content-helpers';
export * from '../config/content';

// Export core hooks
export { useAuth } from '../components/SecureAuth';

export default CORE_CONFIG;