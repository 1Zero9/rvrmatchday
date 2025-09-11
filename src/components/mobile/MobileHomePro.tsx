/**
 * 🚀 PROFESSIONAL MOBILE HOMEPAGE
 * Premium football club mobile experience
 * 
 * Purpose: Marketing tool + Coaching gateway
 * Target: Convert visitors to players/fans, provide coach access
 */

import { motion } from 'framer-motion';
import { MobileHero, ActionCard, ContentCard } from '../../design/MobileDesignSystem';
import Link from 'next/link';

export default function MobileHomePro() {
  // Core Actions - Marketing + Coaching Focus
  const coreActions = [
    {
      icon: "⚽",
      title: "MatchDay", 
      subtitle: "Live scores & fixtures",
      href: "/matchday",
      variant: "success" as const
    },
    {
      icon: "🎯", 
      title: "Join Club",
      subtitle: "Book your trial today", 
      href: "/join/trials",
      variant: "primary" as const
    },
    {
      icon: "👥",
      title: "Our Teams", 
      subtitle: "All squads & ages",
      href: "/teams",
      variant: "secondary" as const  
    },
    {
      icon: "🔒",
      title: "Coaches",
      subtitle: "Professional tools",
      href: "/match-central/login", 
      variant: "warning" as const
    }
  ];

  // Latest Updates - Real Content
  const latestUpdates = [
    {
      title: "U16s Reach County Final",
      content: "Brilliant 3-2 victory secures final spot against Milltown United this Saturday.",
      category: "Match Result",
      date: "2 days ago",
      href: "/news/u16-county-final"
    },
    {
      title: "New Season Registration Open", 
      content: "2025 season now open for all age groups. Early bird pricing until March 31st.",
      category: "Registration",
      date: "1 week ago", 
      href: "/join/trials"
    },
    {
      title: "Training Facility Upgrade",
      content: "New floodlights installed on pitch 2. Extended evening training now available.",
      category: "Facilities",
      date: "2 weeks ago",
      href: "/club/facilities"
    }
  ];

  // Club Stats - Marketing Focus
  const clubStats = [
    { number: "42", label: "Years Est.", color: "text-blue-600" },
    { number: "18", label: "Teams", color: "text-green-600" }, 
    { number: "350+", label: "Players", color: "text-purple-600" },
    { number: "25", label: "Coaches", color: "text-orange-600" }
  ];

  return (
    <div className="pb-20"> {/* Bottom padding for mobile navigation */}
      
      {/* Hero Section - Primary Brand Experience */}
      <MobileHero
        image="/images/hero/halftime2.jpg"
        title="Rivervalley Rangers AFC"
        subtitle="Est. 1981 • Dublin's Community Club"
        height="xl"
        overlay="gradient"
      >
        {/* Optional CTA in hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-4"
        >
          <Link
            href="/join/trials"
            className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all border border-white/30"
          >
            <span>Join Our Club</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </MobileHero>

      {/* Core Actions Grid - Marketing + Coaching */}
      <section className="px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {coreActions.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
            >
              <ActionCard
                icon={action.icon}
                title={action.title}
                subtitle={action.subtitle}
                href={action.href}
                variant={action.variant}
                size="lg"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Club Stats - Social Proof */}
      <section className="px-4 py-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Our Community</h2>
          <div className="grid grid-cols-4 gap-4">
            {clubStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.4 }}
                className="text-center bg-white rounded-xl p-4 shadow-sm"
              >
                <div className={`text-xl font-bold mb-1 ${stat.color}`}>{stat.number}</div>
                <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Latest Updates - Fresh Content */}
      <section className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Latest Updates</h2>
            <Link href="/news" className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {latestUpdates.map((update, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + (index * 0.1), duration: 0.4 }}
              >
                <ContentCard
                  title={update.title}
                  content={update.content}
                  category={update.category}
                  date={update.date}
                  href={update.href}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social Proof - Trust Building */}
      <section className="px-4 py-8 bg-gradient-to-r from-blue-50 to-green-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-3">Join Dublin's Premier Club</h2>
          <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
            Over 350 players across 18 teams. From grassroots to competitive football.
          </p>
          
          <div className="flex items-center justify-center space-x-6">
            <Link
              href="/join/trials" 
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Book Trial
            </Link>
            <Link
              href="/about"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Quick Links - Easy Access */}
      <section className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/contact"
            className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all"
          >
            <span className="text-lg mr-2">📞</span>
            <span className="font-medium text-sm">Contact Us</span>
          </Link>
          <Link
            href="/gallery"
            className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all"
          >
            <span className="text-lg mr-2">📸</span>
            <span className="font-medium text-sm">Gallery</span>
          </Link>
        </div>
      </section>

    </div>
  );
}