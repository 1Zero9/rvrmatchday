/**
 * Club Values Page - Our Core Values and Principles
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Values page with glass morphism design system.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard } from '../../components/Glass';

export default function ClubValues() {
  const quickActions = [
    {
      icon: "🤝",
      title: "Community",
      description: "Building connections",
      href: "#community",
      gradient: "blue" as const
    },
    {
      icon: "🏃‍♂️",
      title: "Development",
      description: "Growing together",
      href: "#development",
      gradient: "green" as const
    },
    {
      icon: "🏆",
      title: "Excellence",
      description: "Striving for our best",
      href: "#excellence",
      gradient: "purple" as const
    },
    {
      icon: "❤️",
      title: "Join Us",
      description: "Be part of our story",
      href: "/join",
      gradient: "orange" as const
    }
  ];

  const coreValues = [
    {
      icon: "🤝",
      title: "Community First",
      description: "We are more than a football club - we are a family that supports each other on and off the pitch.",
      principles: [
        "Welcoming players of all backgrounds and abilities",
        "Supporting local community initiatives",
        "Creating lasting friendships and connections",
        "Celebrating diversity and inclusion"
      ],
      color: "blue"
    },
    {
      icon: "🏃‍♂️",
      title: "Development Focus",
      description: "Every player's journey is unique. We nurture talent, build character, and develop life skills through football.",
      principles: [
        "Individual player development over winning at all costs",
        "Building confidence and self-esteem",
        "Teaching life skills through sport",
        "Continuous learning for players and coaches"
      ],
      color: "green"
    },
    {
      icon: "🏆",
      title: "Pursuit of Excellence",
      description: "We strive for excellence in everything we do, from training to match day to community engagement.",
      principles: [
        "Setting high standards while maintaining perspective",
        "Continuous improvement in all areas",
        "Professional approach to youth development",
        "Leading by example in sportsmanship"
      ],
      color: "purple"
    },
    {
      icon: "🎯",
      title: "Respect & Fair Play",
      description: "We treat everyone with respect and embody the spirit of fair play in all our activities.",
      principles: [
        "Respect for opponents, officials, and teammates",
        "Fair play and honest competition",
        "Positive sideline behavior from parents and supporters",
        "Zero tolerance for discrimination or bullying"
      ],
      color: "orange"
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Our Values"
      heroSubtitle="The principles that guide everything we do at Rivervalley Rangers AFC"
      heroIcon="🤝"
      quickActions={quickActions}
      sectionName="CLUB VALUES"
      imageSpecs="1920x1080px minimum, community and team activities preferred"
    >

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Stand For</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Since 1981, Rivervalley Rangers AFC has been built on strong values that shape our approach to football, 
            youth development, and community engagement. These values guide every decision we make and every interaction we have.
          </p>
        </GlassCard>
      </motion.div>

      {/* Core Values */}
      <div className="grid gap-8 mb-12">
        {coreValues.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
              <div className="flex items-start space-x-4">
                <div className={`text-6xl mb-4 p-4 rounded-full bg-${value.color}-50`}>
                  {value.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 mb-6 text-lg">{value.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {value.principles.map((principle, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-${value.color}-500 mt-2 flex-shrink-0`}></div>
                        <p className="text-gray-700 text-sm">{principle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Living Our Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-blue-50/80 to-green-50/80">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Living Our Values</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Code of Conduct for all members</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Regular values workshops for coaches</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Community outreach programs</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Fair play recognition awards</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Commitment</h3>
              <p className="text-gray-600 mb-6">
                These aren't just words on a page - they're principles we live by every day. From our youngest 
                players to our senior management, everyone at Rivervalley Rangers is committed to upholding these values.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/about"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                >
                  Learn More About Us
                </Link>
                <Link 
                  href="/join"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
                >
                  Join Our Community
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

    </GlassPageTemplate>
  );
}