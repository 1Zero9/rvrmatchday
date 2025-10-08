/**
 * Enhanced Admin Changelog Component
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Comprehensive changelog system with filtering, search, and detailed metrics.
 * Displays version history and changes for admin users only.
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { GlassCard } from './Glass';

interface ChangelogEntry {
  version: string;
  title: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: {
    category: string;
    items: string[];
    icon: string;
    color: string;
  }[];
  impact: 'breaking' | 'feature' | 'improvement' | 'fix';
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
}

const changelogData: ChangelogEntry[] = [
  {
    version: "11.0.2",
    title: "Comprehensive Page Maintenance System Overhaul",
    date: new Date().toISOString().split('T')[0], // Today's date
    type: "major",
    impact: "feature",
    filesChanged: 19,
    linesAdded: 1132,
    linesRemoved: 100,
    changes: [
      {
        category: "Page Maintenance Management",
        icon: "🚧",
        color: "text-orange-600",
        items: [
          "Enhanced PageMaintenanceManager with hierarchical section controls",
          "Added one-click section disable/enable for entire navigation groups (About, Teams, Contact, etc.)",
          "Fixed database permissions issues using secure API endpoints with service role authentication",
          "Created comprehensive maintenance banner system with admin bypass functionality",
          "Implemented path correction system to fix database/file path mismatches"
        ]
      },
      {
        category: "Role-Based Maintenance Notifications",
        icon: "🔔",
        color: "text-blue-600",
        items: [
          "Added role-based MaintenanceStatusBar visible only to admin/content editor users",
          "Removed maintenance notifications completely for standard users",
          "Created clean grayed-out navigation styling for disabled pages",
          "Implemented MaintenanceWrapper component for page-level maintenance display",
          "Admin users see maintenance banner but can still access page content"
        ]
      },
      {
        category: "Navigation & User Experience",
        icon: "🧭",
        color: "text-purple-600",
        items: [
          "Updated all dropdown menus to use NavItem components for maintenance awareness",
          "Simplified maintenance styling to clean grayed-out approach without visual clutter",
          "Fixed dropdown navigation components in StandardLayout for Teams, Contact, and More menus",
          "Implemented MaintenanceAwareLink component for consistent disabled page styling",
          "Removed maintenance icons and tooltips based on user feedback for cleaner interface"
        ]
      },
      {
        category: "API & Database Infrastructure",
        icon: "🔧",
        color: "text-green-600",
        items: [
          "Created secure maintenance API endpoints (/api/maintenance/update, /api/maintenance/list-all)",
          "Fixed Row Level Security permissions by using service role key for database operations",
          "Added cache prevention headers to maintenance APIs for real-time status updates",
          "Implemented path correction API to resolve database/file path mismatches",
          "Enhanced maintenance check API with proper error handling and validation"
        ]
      },
      {
        category: "Admin Dashboard Integration",
        icon: "📊",
        color: "text-indigo-600",
        items: [
          "Added maintenance statistics to admin dashboard stats grid",
          "Created 'Disabled Pages' section showing real-time list of pages under maintenance",
          "Integrated maintenance data with dashboard overview for immediate visibility",
          "Added section-grouped maintenance display with bulk operation controls",
          "Implemented real-time maintenance status monitoring in admin interface"
        ]
      },
      {
        category: "Performance & Technical Improvements",
        icon: "⚡",
        color: "text-yellow-600",
        items: [
          "Resolved caching issues preventing real-time maintenance status updates",
          "Added proper TypeScript types for all maintenance-related components",
          "Implemented efficient bulk operations for section-level maintenance control",
          "Enhanced error handling and user feedback throughout maintenance system",
          "Optimized database queries for maintenance status checking across navigation"
        ]
      }
    ]
  },
  {
    version: "6.2.1",
    title: "Navigation & UX Improvements",
    date: "2025-09-21",
    type: "minor",
    impact: "improvement",
    filesChanged: 3,
    linesAdded: 125,
    linesRemoved: 85,
    changes: [
      {
        category: "Navigation Enhancement",
        icon: "🧭",
        color: "text-blue-600",
        items: [
          "Merged Match Central and Login buttons into single smart button",
          "Role-based button behavior: Admin → Admin Dashboard, Coach/Manager/Editor → Match Central",
          "Public users see clean 'Match Central' entry point with login flow",
          "Removed redundant navigation buttons for cleaner interface",
          "Context-aware tooltips and dynamic button styling"
        ]
      },
      {
        category: "Admin Experience",
        icon: "🛡️",
        color: "text-orange-600",
        items: [
          "Added authentication controls for admin tools visibility",
          "Admin tools and notifications only show for logged-in admins",
          "Clean public view without admin clutter",
          "Bright yellow pulsing admin tools CTA positioned in top-left",
          "Professional club-first experience with hidden enterprise tools"
        ]
      },
      {
        category: "Menu Structure",
        icon: "📋",
        color: "text-purple-600",
        items: [
          "Removed 'Fixtures & Results' from Teams dropdown menu",
          "Cleaned up both desktop and mobile navigation menus",
          "Streamlined Teams menu focuses on team information only",
          "Improved navigation hierarchy and user flow"
        ]
      }
    ]
  },
  {
    version: "6.2.0",
    title: "Enterprise User Management System",
    date: "2025-09-21",
    type: "major",
    impact: "feature",
    filesChanged: 12,
    linesAdded: 850,
    linesRemoved: 150,
    changes: [
      {
        category: "User Management",
        icon: "👥",
        color: "text-purple-600",
        items: [
          "Created comprehensive enterprise-grade user management system",
          "Added table-based user directory with role indicators and status columns",
          "Implemented click-to-edit user detail modals with full profile management",
          "Added role management with dropdown selection (admin, coach, manager, parent, volunteer)",
          "Built account enable/disable functionality with status toggles",
          "Integrated password management (reset email, temporary password generation)",
          "Added user search and filtering by role with quick filter buttons",
          "Created audit trail and security event tracking per user"
        ]
      },
      {
        category: "User Interface",
        icon: "🎨",
        color: "text-blue-600",
        items: [
          "Designed professional table layout for user listing",
          "Added role-specific avatar colors and admin crown badges",
          "Implemented hover effects and row selection highlighting",
          "Created comprehensive edit forms with save/cancel actions",
          "Added pending account requests management table",
          "Built responsive modal design with clean professional styling"
        ]
      },
      {
        category: "Security & Administration",
        icon: "🔒",
        color: "text-red-600",
        items: [
          "Added user-specific audit logging and activity tracking",
          "Implemented security event monitoring with risk level indicators",
          "Created account status management with activation controls",
          "Added permission-based access control for user management",
          "Built comprehensive user profile viewing and editing system"
        ]
      },
      {
        category: "Data Management",
        icon: "📊",
        color: "text-green-600",
        items: [
          "Enhanced user data structure with teams, permissions, and activity stats",
          "Added login tracking and failed attempt monitoring",
          "Implemented user statistics dashboard with real-time counts",
          "Created filtering and search capabilities across user directory"
        ]
      }
    ]
  },
  {
    version: "6.1.0",
    title: "Marketing Panel & Modular Architecture Demo",
    date: "2025-09-19",
    type: "major",
    impact: "feature",
    filesChanged: 8,
    linesAdded: 650,
    linesRemoved: 25,
    changes: [
      {
        category: "Marketing & Sales Tools",
        icon: "🎯",
        color: "text-blue-600",
        items: [
          "Created interactive Marketing Panel with module simulator",
          "Built Modular Demo page showcasing Lego-like architecture",
          "Added admin quick links to marketing tools",
          "Implemented price-free feature demonstration",
          "Real-time module configuration preview"
        ]
      },
      {
        category: "Modular System Implementation",
        icon: "🧩",
        color: "text-purple-600",
        items: [
          "Complete module configuration system (modules.ts)",
          "ModuleManager class for controlling features",
          "Modular navigation with dynamic menu updates",
          "Module admin panel with dependency management",
          "Higher-order component for page protection"
        ]
      },
      {
        category: "Business Architecture",
        icon: "💼",
        color: "text-green-600",
        items: [
          "Defined 7 core business modules",
          "Package tiers: Starter, Professional, Enterprise",
          "Dependency validation and management",
          "White-label customization framework",
          "Revenue optimization through modular pricing"
        ]
      }
    ]
  },
  {
    version: "3.2.0",
    title: "Unified Account Management System",
    date: "2025-09-19",
    type: "major",
    impact: "feature",
    filesChanged: 15,
    linesAdded: 850,
    linesRemoved: 120,
    changes: [
      {
        category: "Account Management",
        icon: "👥",
        color: "text-blue-600",
        items: [
          "Created unified account management combining requests and user management",
          "Built comprehensive Active Directory-like user management system",
          "Added statistics dashboard with real-time user counts",
          "Implemented user actions: activate, deactivate, password reset",
          "Created toggle view between account requests and existing users"
        ]
      },
      {
        category: "Navigation Enhancement",
        icon: "⚙️",
        color: "text-orange-600",
        items: [
          "Consolidated redundant Admin/Login buttons into single smart button",
          "Smart button changes based on user role and login status",
          "Admin users see 'Admin' button that goes to dashboard",
          "Non-admin users see role-specific logout buttons",
          "Improved navigation UX and reduced confusion"
        ]
      },
      {
        category: "API & Database",
        icon: "🔧",
        color: "text-green-600",
        items: [
          "Fixed Row Level Security issues with admin client implementation",
          "Enhanced error handling for user management operations",
          "Added comprehensive user existence checking",
          "Implemented secure password reset with temporary passwords",
          "Created audit logging framework (ready for enhanced schema)"
        ]
      },
      {
        category: "Security & Admin Tools",
        icon: "🛡️",
        color: "text-red-600",
        items: [
          "Built enterprise-grade user management interface",
          "Added visual status indicators and security alerts",
          "Implemented role-based action controls",
          "Created test user management system",
          "Enhanced admin access patterns and security"
        ]
      }
    ]
  },
  {
    version: "3.1.0",
    title: "Complete Authentication System Restructure",
    date: new Date().toISOString().split('T')[0], // Today's date
    type: "major",
    impact: "feature",
    filesChanged: 8,
    linesAdded: 450,
    linesRemoved: 89,
    changes: [
      {
        category: "Authentication System",
        icon: "🔐",
        color: "text-red-600",
        items: [
          "Restructured Match Central to simple username/password login system",
          "Created unified registration page with role selection and disclaimers",
          "Fixed admin authentication to work with Match Central login system",
          "Added admin-only user setup interface for manual account creation",
          "Removed conflicting OneZeroNine popup button from bottom right corner"
        ]
      },
      {
        category: "User Management",
        icon: "👥",
        color: "text-green-600",
        items: [
          "Created comprehensive account registration workflow",
          "Added role-based form validation with mandatory fields",
          "Implemented admin manual user creation with email notifications",
          "Fixed database RLS policies for public account requests",
          "Enhanced account admin interface with better error handling"
        ]
      },
      {
        category: "Database & Infrastructure",
        icon: "🗄️",
        color: "text-blue-600",
        items: [
          "Organized SQL scripts into structured database folder",
          "Created database migration scripts for account requests schema",
          "Fixed Row Level Security policies for account submissions",
          "Updated role constraints to include admin and editor roles"
        ]
      },
      {
        category: "Code Quality & Bug Fixes",
        icon: "🐛", 
        color: "text-red-600",
        items: [
          "Fixed syntax errors in join page caused by color palette updates (missing closing tags)",
          "Cleaned up duplicate Footer imports and calls in home.tsx",
          "Standardized footer implementation reduces maintenance overhead",
          "Improved site-wide navigation consistency and user experience"
        ]
      }
    ]
  },
  {
    version: "2.5.0", 
    title: "Enhanced Club Branding & Database Integration",
    date: "2025-01-26",
    type: "major",
    impact: "feature", 
    filesChanged: 12,
    linesAdded: 456,
    linesRemoved: 67,
    changes: [
      {
        category: "Site-wide Branding Enhancement",
        icon: "🏆",
        color: "text-purple-600",
        items: [
          "Applied club color palette throughout all key pages - replaced generic green/blue colors with Burgundy/Blue-Gray theme",
          "Enhanced Footer component with full club branding - primary colors for bars and backgrounds",
          "Updated Home page hero actions and CTAs with club primary/accent colors for consistent brand identity",
          "Join page registration buttons and highlights now use club color scheme",
          "Contact page icons and elements updated to reflect club branding standards"
        ]
      },
      {
        category: "Database Integration & Task Management",
        icon: "🗄️", 
        color: "text-green-600",
        items: [
          "Full Supabase database integration implemented with live connection testing",
          "Created tasks and task_changes tables with complete CRUD API endpoints",
          "Real-time task management system with priority levels, categories, and change tracking",
          "Multi-user task assignment system ready for team collaboration",
          "Database test integration successful - Task ID #1 created and verified"
        ]
      },
      {
        category: "Admin System Improvements", 
        icon: "⚙️",
        color: "text-blue-600",
        items: [
          "Fixed sitemap iframe issue - replaced nested iframe with dedicated AdminSiteMap component",
          "Environment configuration system updated with real Supabase credentials",
          "Admin dashboard now displays proper task management interface",
          "Enhanced sitemap display without nested layout rendering issues"
        ]
      }
    ]
  },
  {
    version: "2.4.0",
    title: "Club Brand Color System",
    date: "2025-01-26",
    type: "major",
    impact: "feature",
    filesChanged: 6,
    linesAdded: 284,
    linesRemoved: 45,
    changes: [
      {
        category: "Brand Color Implementation",
        icon: "🎨",
        color: "text-red-600",
        items: [
          "Complete club brand color palette implementation: Primary Burgundy (#972A4C), Secondary Blue-Gray (#5E7794), Accent Light Blue (#98C0F0), Neutral Gray (#B6B7B6)",
          "Tailwind CSS integration with full color variants (light, dark, lighter, darker) for each club color",
          "CSS Custom Properties system with gradient definitions for consistent brand application",
          "Fixed CSS class resolution issue - changed from bg-gradient-hero to gradient-hero for proper rendering"
        ]
      },
      {
        category: "Header & Navigation",
        icon: "🧭",
        color: "text-blue-600",
        items: [
          "Updated header with new club color gradient (burgundy → blue-gray → light blue)",
          "All navigation hover states now use club colors instead of generic green/blue",
          "Glass component integration with club color variants",
          "Border and accent colors updated throughout navigation system"
        ]
      },
      {
        category: "Design System Enhancement",
        icon: "🛠️",
        color: "text-purple-600",
        items: [
          "Glass morphism components updated to support club-primary, club-secondary, club-accent variants",
          "Color preview page created for design validation and client approval",
          "Comprehensive UX analysis included with color strengths and considerations",
          "Mobile responsiveness maintained with lighter color variants for better readability"
        ]
      },
      {
        category: "Technical Implementation",
        icon: "⚙️",
        color: "text-green-600",
        items: [
          "Resolved CSS loading order issues with proper Tailwind configuration",
          "Custom background gradients added to Tailwind config",
          "Updated global styles with color.css import and CSS variable definitions",
          "Verified cross-browser compatibility and rendering consistency"
        ]
      }
    ]
  },
  {
    version: "2.3.0",
    title: "Glass Template System",
    date: "2025-01-22",
    type: "major",
    impact: "feature",
    filesChanged: 15,
    linesAdded: 2847,
    linesRemoved: 1205,
    changes: [
      {
        category: "Major System Overhaul",
        icon: "🎯",
        color: "text-red-600",
        items: [
          "Standardized Glass Template System - Complete replacement of white title banners across ALL major landing pages",
          "GlassPageTemplate Component - Centralized template system with consistent hero sections and quick actions",
          "Landing Page Architecture - Created comprehensive index pages for Teams, News & Media, Get Involved, Club, Members",
          "Site-Wide Consistency - Every major page now follows the same premium glass morphism standard"
        ]
      },
      {
        category: "Glass Morphism Enhancement",
        icon: "🎨",
        color: "text-purple-600",
        items: [
          "Advanced Hero Customization - Detailed, non-coder-friendly instructions for background image/video replacement",
          "Color-Coded Quick Actions - Standardized gradient system: Blue (info), Green (action), Purple (special), Orange (community)",
          "Glass Component Expansion - Enhanced GlassCard system with multiple intensity levels and hover effects",
          "Mobile-First Responsive - All glass effects optimized for mobile performance and touch interactions"
        ]
      },
      {
        category: "Major Page Conversions",
        icon: "📄",
        color: "text-green-600",
        items: [
          "Teams Hub (/teams/index.tsx) - Complete team overview with registration CTAs and team categories",
          "News & Media Hub (/news-media/index.tsx) - Featured articles, social media integration, newsletter signup",
          "Get Involved Hub (/get-involved/index.tsx) - Volunteer opportunities, sponsorship tiers, community impact metrics",
          "Club Hub (/club/index.tsx) - Club history, governance, facilities overview with heritage storytelling",
          "Members Hub (/members/index.tsx) - Member resources, communication channels, family support systems",
          "About Page (/about.tsx) - Club story & heritage completely redesigned with glass components",
          "Contact Page (/contact.tsx) - Contact form, location info, key contacts with glass card layout",
          "Shop Page (/shop.tsx) - Merchandise catalog with category filtering and glass product cards"
        ]
      },
      {
        category: "Template System Features",
        icon: "🛠️",
        color: "text-blue-600",
        items: [
          "Comprehensive Instructions - Each page includes detailed customization guides for background replacement",
          "Image Specifications - Tailored specs for each section (1920x1080px minimum with content-specific recommendations)",
          "Video Background Support - Instructions for adding dynamic video backgrounds to hero sections",
          "Quick Actions Configuration - Easy-to-modify action grids with consistent icon and color systems"
        ]
      },
      {
        category: "Developer Experience",
        icon: "📖",
        color: "text-indigo-600",
        items: [
          "OneZeroNine Branding - Consistent copyright and developer credit system across all new pages",
          "Code Documentation - Extensive comments and instructions embedded in template code",
          "TypeScript Integration - Full type safety across the glass template system",
          "Performance Optimization - Efficient backdrop-blur implementation across all glass components"
        ]
      }
    ]
  },
  {
    version: "2.2.0",
    title: "Glass Morphism Pro",
    date: "2025-01-21",
    type: "major",
    impact: "feature",
    filesChanged: 12,
    linesAdded: 1845,
    linesRemoved: 342,
    changes: [
      {
        category: "Major Features",
        icon: "🌟",
        color: "text-yellow-600",
        items: [
          "Complete Glass Morphism Design System with 8 reusable components",
          "GlassHero component with background image/video support",
          "GlassActionCard interactive grid system",
          "Enhanced Dashboard and Join pages with glass theme"
        ]
      },
      {
        category: "Design Enhancements", 
        icon: "🎨",
        color: "text-purple-600",
        items: [
          "Modern premium aesthetic with depth and sophistication",
          "Color-coded gradient system (blue/green/purple/orange)",
          "Advanced hover animations and scale transitions",
          "Mobile-optimized glass effects"
        ]
      },
      {
        category: "OneZeroNine Branding",
        icon: "⚡",
        color: "text-blue-600", 
        items: [
          "Developer credits component with floating badge",
          "Professional copyright footer system",
          "Product-ready licensing with contact info",
          "Comprehensive template documentation"
        ]
      }
    ]
  },
  {
    version: "2.1.0",
    title: "Community Design",
    date: "2025-01-21", 
    type: "minor",
    impact: "improvement",
    filesChanged: 8,
    linesAdded: 967,
    linesRemoved: 234,
    changes: [
      {
        category: "Home Page Transformation",
        icon: "🏠",
        color: "text-green-600",
        items: [
          "Glass morphism hero with action grid CTAs",
          "Enhanced visual hierarchy and UX flow",
          "Reduced hero height for better content flow",
          "Template instructions for club customization"
        ]
      },
      {
        category: "New Pages",
        icon: "👥", 
        color: "text-orange-600",
        items: [
          "Coach recruitment page with qualifications",
          "Admin dashboard with read-only monitoring",
          "Complete template customization system"
        ]
      }
    ]
  },
  {
    version: "2.0.0",
    title: "Modern Foundation",
    date: "2025-01-20",
    type: "major", 
    impact: "breaking",
    filesChanged: 25,
    linesAdded: 3254,
    linesRemoved: 1567,
    changes: [
      {
        category: "Design System Overhaul",
        icon: "🎨",
        color: "text-purple-600",
        items: [
          "Vibrant color palette replacing clinical design",
          "Enhanced navigation with mega menus",
          "Component standardization across pages",
          "Mobile-first responsive grid system"
        ]
      },
      {
        category: "Football Club Features",
        icon: "⚽",
        color: "text-green-600",
        items: [
          "Complete team pages structure",
          "Match Central hub with dashboard",
          "Registration system for all age groups",
          "Community integration features"
        ]
      }
    ]
  },
  {
    version: "1.1.0",
    title: "Content Expansion",
    date: "2025-01-19",
    type: "minor",
    impact: "feature",
    filesChanged: 15,
    linesAdded: 1823,
    linesRemoved: 145,
    changes: [
      {
        category: "Content Management",
        icon: "📝",
        color: "text-blue-600",
        items: [
          "News & Events System with dynamic content",
          "Photo Gallery for community moments",
          "Shop Integration for club merchandise",
          "Boot Room equipment exchange system"
        ]
      },
      {
        category: "Member Features",
        icon: "👥",
        color: "text-green-600",
        items: [
          "Parent Portal communication hub",
          "Coach Contact System for direct communication",
          "Member Dashboard with personalized experience"
        ]
      }
    ]
  },
  {
    version: "1.0.0",
    title: "Initial Launch",
    date: "2025-01-18",
    type: "major",
    impact: "feature",
    filesChanged: 45,
    linesAdded: 4567,
    linesRemoved: 0,
    changes: [
      {
        category: "Core Features",
        icon: "🚀",
        color: "text-blue-600",
        items: [
          "Basic Website Structure with standard pages and navigation",
          "Club Information pages (about, facilities, committee)",
          "Contact System for basic inquiry and communication",
          "Responsive Design with mobile-friendly layout"
        ]
      },
      {
        category: "Foundation",
        icon: "🏛️",
        color: "text-gray-600",
        items: [
          "Brand Identity for Rivervalley Rangers AFC template",
          "Basic Styling and initial design system",
          "Content Framework with page structure and organization"
        ]
      }
    ]
  }
];

interface AdminChangelogProps {
  className?: string;
}

export default function AdminChangelog({ className = '' }: AdminChangelogProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showStats, setShowStats] = useState<boolean>(true);

  const getVersionBadgeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'minor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'patch':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'breaking':
        return 'bg-red-500 text-white';
      case 'feature':
        return 'bg-green-500 text-white';
      case 'improvement':
        return 'bg-blue-500 text-white';
      case 'fix':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredChangelog = changelogData.filter(entry => {
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    const matchesImpact = selectedImpact === 'all' || entry.impact === selectedImpact;
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.version.includes(searchTerm) ||
      entry.changes.some(change => 
        change.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        change.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    return matchesType && matchesImpact && matchesSearch;
  });

  const totalStats = changelogData.reduce((acc, entry) => ({
    filesChanged: acc.filesChanged + entry.filesChanged,
    linesAdded: acc.linesAdded + entry.linesAdded,
    linesRemoved: acc.linesRemoved + entry.linesRemoved,
    totalChanges: acc.totalChanges + entry.changes.reduce((sum, group) => sum + group.items.length, 0)
  }), { filesChanged: 0, linesAdded: 0, linesRemoved: 0, totalChanges: 0 });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Development Changelog</h2>
          <p className="text-sm text-gray-500 mt-1">Comprehensive change tracking and version control</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full border border-red-200">Admin Only</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">v2.3.0</span>
        </div>
      </div>

      {/* Controls */}
      <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search versions, features..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Version Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value="major">Major (x.0.0)</option>
              <option value="minor">Minor (x.y.0)</option>
              <option value="patch">Patch (x.y.z)</option>
            </select>
          </div>

          {/* Impact Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Impact Level</label>
            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Impacts</option>
              <option value="breaking">Breaking Changes</option>
              <option value="feature">New Features</option>
              <option value="improvement">Improvements</option>
              <option value="fix">Bug Fixes</option>
            </select>
          </div>

          {/* Stats Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                showStats 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Statistics */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-blue-50/80 to-green-50/80">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Statistics</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{changelogData.length}</div>
                <div className="text-sm text-gray-600">Total Versions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalStats.filesChanged}</div>
                <div className="text-sm text-gray-600">Files Changed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalStats.linesAdded.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Lines Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalStats.totalChanges}</div>
                <div className="text-sm text-gray-600">Total Changes</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredChangelog.length} of {changelogData.length} versions
      </div>

      {/* Changelog Entries */}
      <div className="space-y-6">
        {filteredChangelog.map((entry, index) => (
          <motion.div
            key={entry.version}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
              {/* Version Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      v{entry.version} - {entry.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getVersionBadgeColor(entry.type)}`}>
                      {entry.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getImpactBadgeColor(entry.impact)}`}>
                      {entry.impact.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                </div>
                
                {/* Code Stats */}
                <div className="text-right text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <span>📁 {entry.filesChanged} files</span>
                    <span className="text-green-600">+{entry.linesAdded}</span>
                    <span className="text-red-600">-{entry.linesRemoved}</span>
                  </div>
                </div>
              </div>

              {/* Changes */}
              <div className="space-y-6">
                {entry.changes.map((changeGroup, groupIndex) => (
                  <div key={groupIndex} className="border-l-4 border-gray-200 pl-6">
                    <h4 className={`font-semibold mb-3 flex items-center ${changeGroup.color}`}>
                      <span className="text-xl mr-3">{changeGroup.icon}</span>
                      {changeGroup.category}
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {changeGroup.items.length} items
                      </span>
                    </h4>
                    <ul className="space-y-2">
                      {changeGroup.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-700 flex items-start">
                          <span className="text-gray-400 mr-3 mt-1 flex-shrink-0">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Entry Statistics */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex space-x-6">
                    <span>
                      <strong>{entry.changes.reduce((acc, group) => acc + group.items.length, 0)}</strong> total changes
                    </span>
                    <span>
                      <strong>{entry.changes.length}</strong> categories
                    </span>
                  </div>
                  <div className="text-xs">
                    Net: <span className="text-green-600">+{entry.linesAdded - entry.linesRemoved}</span> lines
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredChangelog.length === 0 && (
        <GlassCard intensity="light" className="p-8 text-center bg-gradient-to-br from-gray-50/80 to-gray-100/80">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedImpact('all');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </GlassCard>
      )}

      {/* Footer */}
      <GlassCard intensity="light" className="p-4 text-center bg-gradient-to-br from-blue-50/80 to-purple-50/80">
        <div className="text-sm text-gray-600">
          <p className="mb-1">
            <strong>OneZeroNine Premium Template</strong> - Professional Change Management
          </p>
          <p className="text-xs text-gray-500">
            Built by OneZeroNine × Claude AI • onezeronine@gmail.com • Last Updated: January 22, 2025
          </p>
        </div>
      </GlassCard>
    </div>
  );
}