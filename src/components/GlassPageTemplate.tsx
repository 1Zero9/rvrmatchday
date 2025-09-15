/**
 * Glass Page Template Component
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Standardized glass morphism page template with hero section,
 * customizable content areas, and consistent styling.
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import StandardLayout from './StandardLayout';
import { GlassHero, GlassActionCard } from './Glass';

interface QuickAction {
  icon: string;
  title: string;
  description: string;
  href: string;
  gradient: 'blue' | 'green' | 'purple' | 'orange';
  external?: boolean;
}

interface GlassPageTemplateProps {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroIcon?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  heroHeight?: string;
  
  // Quick Actions (optional)
  quickActions?: QuickAction[];
  
  // Content
  children: ReactNode;
  
  // Customization Instructions
  sectionName: string; // For instruction comments (e.g., "TEAMS", "NEWS", "GET INVOLVED")
  imageSpecs?: string; // Custom image specifications
}

export default function GlassPageTemplate({
  heroTitle,
  heroSubtitle,
  heroIcon = "⚽",
  backgroundImage = "/images/homepg-image1.jpg",
  backgroundVideo,
  heroHeight = "h-[50vh] min-h-[400px]",
  quickActions = [],
  children,
  sectionName,
  imageSpecs = "1920x1080px minimum, relevant to section content"
}: GlassPageTemplateProps) {

  return (
    <StandardLayout>
      {/* 
      ===================================================================
      🎬 ${sectionName} HERO CUSTOMIZATION (NON-CODER FRIENDLY)
      ===================================================================
      
      TO ADD ${sectionName} BACKGROUND IMAGE:
      1. Save your image as: /public/images/${sectionName.toLowerCase()}-hero.jpg
      2. Replace the backgroundImage path in the component
      
      TO ADD VIDEO BACKGROUND:
      1. Save video as: /public/videos/${sectionName.toLowerCase()}-hero.mp4
      2. Replace backgroundImage with backgroundVideo prop
      
      BEST ${sectionName} BACKGROUNDS:
      ${getBackgroundSuggestions(sectionName)}
      
      IMAGE SPECS: ${imageSpecs}
      ===================================================================
      */}
      <GlassHero 
        backgroundImage={backgroundImage}
        backgroundVideo={backgroundVideo}
        height={heroHeight}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white mb-8"
        >
          <div className="text-6xl mb-6">{heroIcon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            {heroSubtitle}
          </p>
        </motion.div>

        {/* Quick Actions Grid */}
        {quickActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`grid grid-cols-1 md:grid-cols-${Math.min(quickActions.length, 4)} gap-4 max-w-6xl mx-auto`}
          >
            {quickActions.map((action, index) => (
              <GlassActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                href={action.href}
                gradient={action.gradient}
                external={action.external}
              />
            ))}
          </motion.div>
        )}
      </GlassHero>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </div>
    </StandardLayout>
  );
}

/**
 * Helper function to provide background suggestions based on section
 */
function getBackgroundSuggestions(sectionName: string): string {
  const suggestions = {
    'TEAMS': `- Team group photos and action shots
      - Training sessions with multiple age groups
      - Players celebrating victories
      - Match action from different teams`,
    'NEWS': `- Recent match highlights and celebrations
      - Community events and gatherings
      - Award ceremonies and achievements
      - Club facilities and activities`,
    'GET INVOLVED': `- Volunteers in action at club events
      - Community fundraising activities
      - Supporters and families at matches
      - Club social events and gatherings`,
    'CLUB': `- Historic club moments and traditions
      - Club facilities and grounds
      - Committee members and staff
      - Heritage and milestone celebrations`,
    'MEMBERS': `- Parent and family involvement
      - Member events and activities
      - Communication and interaction
      - Community support and engagement`
  };

  return suggestions[sectionName as keyof typeof suggestions] || `- Relevant ${sectionName.toLowerCase()} content
      - Action shots and celebrations
      - Community and team activities
      - Club facilities and events`;
}