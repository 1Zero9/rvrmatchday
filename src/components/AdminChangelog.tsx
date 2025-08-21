/**
 * Admin Changelog Component
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Displays version history and changes for admin users only.
 * Tracks development progress and feature releases.
 */

import { motion } from 'framer-motion';
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
}

const changelogData: ChangelogEntry[] = [
  {
    version: "2.2.0",
    title: "Glass Morphism Pro",
    date: "2025-01-21",
    type: "major",
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
  }
];

interface AdminChangelogProps {
  className?: string;
}

export default function AdminChangelog({ className = '' }: AdminChangelogProps) {
  const getVersionBadgeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-red-100 text-red-800';
      case 'minor':
        return 'bg-blue-100 text-blue-800';
      case 'patch':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Development Changelog</h2>
        <div className="text-sm text-gray-500">Admin Only</div>
      </div>

      <div className="space-y-6">
        {changelogData.map((entry, index) => (
          <motion.div
            key={entry.version}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard intensity="medium" className="p-6">
              {/* Version Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      v{entry.version} - {entry.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getVersionBadgeColor(entry.type)}`}>
                      {entry.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                </div>
              </div>

              {/* Changes */}
              <div className="space-y-4">
                {entry.changes.map((changeGroup, groupIndex) => (
                  <div key={groupIndex} className="border-l-4 border-gray-200 pl-4">
                    <h4 className={`font-semibold mb-2 flex items-center ${changeGroup.color}`}>
                      <span className="text-lg mr-2">{changeGroup.icon}</span>
                      {changeGroup.category}
                    </h4>
                    <ul className="space-y-1">
                      {changeGroup.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-600 flex items-start">
                          <span className="text-gray-400 mr-2 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Statistics */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-6 text-sm text-gray-500">
                  <span>
                    <strong>{entry.changes.reduce((acc, group) => acc + group.items.length, 0)}</strong> changes
                  </span>
                  <span>
                    <strong>{entry.changes.length}</strong> categories
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <GlassCard intensity="light" className="p-4 text-center">
        <div className="text-sm text-gray-600">
          <p className="mb-1">
            <strong>OneZeroNine Premium Template</strong> - Continuous Development
          </p>
          <p className="text-xs text-gray-500">
            Built by OneZeroNine × Claude AI • onezeronine@gmail.com
          </p>
        </div>
      </GlassCard>
    </div>
  );
}