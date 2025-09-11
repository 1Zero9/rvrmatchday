/**
 * 🚀 PROFESSIONAL MOBILE ABOUT PAGE
 * Premium club story & values experience
 * 
 * Features: Club story, values, history, team showcase
 */

import { motion } from 'framer-motion';
import { MobileHero, ActionCard, ContentCard } from '../../design/MobileDesignSystem';
import Link from 'next/link';

export default function MobileAboutPro() {
  // Core about actions
  const aboutActions = [
    {
      icon: "📜",
      title: "Our Story", 
      subtitle: "44 years of tradition",
      href: "/club/history",
      variant: "primary" as const
    },
    {
      icon: "🤝",
      title: "Our Values",
      subtitle: "Community • Development",
      href: "/club/values", 
      variant: "success" as const
    },
    {
      icon: "🏟️",
      title: "Facilities",
      subtitle: "Modern training ground",
      href: "/club/facilities",
      variant: "secondary" as const
    },
    {
      icon: "👨‍🏫", 
      title: "Our Team",
      subtitle: "25+ qualified coaches",
      href: "/club/committee",
      variant: "warning" as const
    }
  ];

  // Club values
  const clubValues = [
    {
      icon: "🤝",
      title: "Community",
      description: "Building lasting friendships and connections through football",
      color: "text-blue-600"
    },
    {
      icon: "🌱",
      title: "Development", 
      description: "Growing skills, confidence, and character in every player",
      color: "text-green-600"
    },
    {
      icon: "⭐",
      title: "Excellence",
      description: "Striving for our best in everything we do, on and off the pitch",
      color: "text-purple-600"
    },
    {
      icon: "🎯",
      title: "Respect",
      description: "Treating everyone with dignity, fairness, and sportsmanship",
      color: "text-orange-600"
    }
  ];

  // Timeline highlights
  const timeline = [
    { year: "1981", event: "Club Founded", desc: "Established in the heart of Dublin" },
    { year: "1995", event: "First Championship", desc: "County Youth League winners" },
    { year: "2010", event: "Facilities Upgrade", desc: "New clubhouse & training pitches" },
    { year: "2023", event: "Girls Teams Launch", desc: "Expanded to include women's football" },
    { year: "2024", event: "350+ Members", desc: "Largest membership in club history" }
  ];

  // Key stats
  const keyStats = [
    { number: "350+", label: "Active Players", color: "text-blue-600" },
    { number: "18", label: "Teams", color: "text-green-600" },
    { number: "25", label: "Qualified Coaches", color: "text-purple-600" },
    { number: "44", label: "Years Experience", color: "text-orange-600" }
  ];

  return (
    <div className="pb-20">
      
      {/* Hero Section */}
      <MobileHero
        image="/images/hero/halftime2.jpg"
        title="About Our Club" 
        subtitle="Community spirit since 1981"
        height="lg"
        overlay="gradient"
      >
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
            <span>Join Our Family</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </MobileHero>

      {/* Key Stats - Social Proof */}
      <section className="px-4 py-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Dublin's Premier Club</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {keyStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + (index * 0.1), duration: 0.4 }}
                className="text-center bg-white rounded-xl p-4 shadow-sm"
              >
                <div className={`text-xl font-bold mb-1 ${stat.color}`}>{stat.number}</div>
                <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Learn More About Us</h2>
          <div className="grid grid-cols-2 gap-4">
            {aboutActions.map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
              >
                <ActionCard {...action} size="lg" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              Founded in 1981, Rivervalley Rangers AFC has been at the heart of Dublin's football 
              community for over four decades. What started as a small local club has grown into 
              one of the region's most respected football organizations.
            </p>
            <p>
              We pride ourselves on developing not just great football players, but great people. 
              Our commitment to community, development, and excellence drives everything we do.
            </p>
            <p>
              Today, with over 350 active players across 18 teams, we continue to provide opportunities 
              for players of all ages and abilities to experience the joy of football.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Our Values */}
      <section className="px-4 py-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">What We Stand For</h2>
          <div className="space-y-4">
            {clubValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-xl flex-shrink-0">{value.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${value.color}`}>{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Our Journey</h2>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + (index * 0.1), duration: 0.4 }}
                className="flex items-start space-x-4 bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{item.year}</span>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.event}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-8 bg-gradient-to-r from-blue-50 to-green-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-3">Ready to Join Our Story?</h2>
          <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
            Be part of Dublin's most welcoming football community. All ages and abilities welcome.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              href="/join/trials"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Book a Trial
            </Link>
            <Link
              href="/contact"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}