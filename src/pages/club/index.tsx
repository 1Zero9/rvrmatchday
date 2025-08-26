/**
 * Club Hub - Main Club Information Landing Page
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Central hub for club information, history, facilities, and governance.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../../components/Glass';

export default function ClubIndex() {
  const quickActions = [
    {
      icon: "📜",
      title: "Club History",
      description: "44 years of football tradition",
      href: "/club/history",
      gradient: "blue" as const
    },
    {
      icon: "👥",
      title: "Committee",
      description: "Meet our leadership team",
      href: "/club/committee",
      gradient: "green" as const
    },
    {
      icon: "🏟️",
      title: "Facilities",
      description: "Our grounds and amenities",
      href: "/club/facilities",
      gradient: "purple" as const
    },
    {
      icon: "📋",
      title: "Policies",
      description: "Rules and governance",
      href: "/club/policies",
      gradient: "orange" as const
    }
  ];

  const clubSections = [
    {
      title: "Our Heritage",
      description: "Founded in 1981, Rivervalley Rangers has been at the heart of grassroots football for over four decades",
      icon: "🏆",
      color: "from-blue-600 to-indigo-600",
      highlights: [
        "Founded in 1981",
        "44+ years of community service", 
        "Hundreds of players developed",
        "Multiple championship wins"
      ],
      ctaText: "Learn Our History",
      ctaLink: "/club/history"
    },
    {
      title: "Leadership & Governance",
      description: "Our dedicated committee and volunteers ensure the club operates with transparency and community focus",
      icon: "🤝",
      color: "from-green-600 to-emerald-600",
      highlights: [
        "Elected committee members",
        "Transparent governance",
        "Community representation",
        "Volunteer-driven organization"
      ],
      ctaText: "Meet the Committee",
      ctaLink: "/club/committee"
    },
    {
      title: "Facilities & Grounds",
      description: "Modern training facilities and well-maintained pitches provide the perfect environment for football development",
      icon: "🏟️",
      color: "from-purple-600 to-violet-600",
      highlights: [
        "Multiple training pitches",
        "Modern changing facilities",
        "Equipment storage",
        "Community clubhouse"
      ],
      ctaText: "Explore Facilities", 
      ctaLink: "/club/facilities"
    }
  ];

  const quickStats = [
    { value: "1981", label: "Founded", icon: "📅" },
    { value: "250+", label: "Active Members", icon: "👥" },
    { value: "15", label: "Teams", icon: "⚽" },
    { value: "50+", label: "Volunteers", icon: "🙋" }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Our Club"
      heroSubtitle="Discover the heart and heritage of Rivervalley Rangers Football Club"
      heroIcon="🏆"
      backgroundImage="/images/club-hero.jpg"
      quickActions={quickActions}
      sectionName="CLUB"
      imageSpecs="1920x1080px minimum, club history and facilities preferred"
    >
      
      {/* Club Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="grid md:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard intensity="medium" className="p-6 text-center bg-gradient-to-br from-white/80 to-gray-50/80">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Club Sections */}
      <div className="space-y-12">
        {clubSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + (index * 0.2) }}
          >
            <GlassCard intensity="medium" className="overflow-hidden bg-gradient-to-br from-white/80 to-gray-50/80">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Content */}
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{section.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">{section.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {section.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    href={section.ctaLink}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {section.ctaText}
                  </Link>
                </div>
                
                {/* Visual Element */}
                <div className={`bg-gradient-to-br ${section.color} p-8 flex items-center justify-center text-white`}>
                  {/* 
                  ===================================================================
                  🏟️ CLUB SECTION IMAGE REPLACEMENT INSTRUCTIONS
                  ===================================================================
                  
                  TO ADD CLUB SECTION IMAGES:
                  1. Save your image as: /public/images/club/section-name.jpg
                  2. Replace this gradient div with an img element
                  
                  BEST CLUB IMAGES:
                  - Historic club moments and celebrations
                  - Committee meetings and leadership
                  - Facility and ground improvements
                  - Community events and gatherings
                  
                  IMAGE SPECS: 600x400px minimum, square/portrait orientation
                  ===================================================================
                  */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">{section.icon}</div>
                    <p className="text-lg font-bold opacity-90">CLUB PHOTO PLACEHOLDER</p>
                    <p className="text-sm opacity-75">Replace with actual image</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-16 bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-xl mb-8 opacity-90 max-w-4xl mx-auto">
          To provide a welcoming, inclusive environment where players of all ages and abilities can enjoy football, 
          develop their skills, and build lasting friendships within our community.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <GlassActionCard
            icon="📞"
            title="Contact the Club"
            description="Get in touch with questions"
            href="/contact"
            gradient="blue"
            size="lg"
          />
          <GlassActionCard
            icon="🤝"
            title="Get Involved"
            description="Join our community"
            href="/get-involved"
            gradient="green"
            size="lg"
          />
        </div>
      </motion.div>

    </GlassPageTemplate>
  );
}