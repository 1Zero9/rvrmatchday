/**
 * Members Hub - Main Members Information Landing Page
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Central hub for member resources, communication, and support.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../../components/Glass';

export default function MembersIndex() {
  const quickActions = [
    {
      icon: "👪",
      title: "Parent Resources",
      description: "Guides and information for families",
      href: "/members/parents",
      gradient: "blue" as const
    },
    {
      icon: "📱",
      title: "Club Communications",
      description: "Stay connected with updates",
      href: "/members/communications",
      gradient: "green" as const
    },
    {
      icon: "📅",
      title: "Member Events",
      description: "Social calendar and activities",
      href: "/members/events",
      gradient: "purple" as const
    },
    {
      icon: "🎫",
      title: "Member Portal",
      description: "Login to your account",
      href: "/members/portal",
      gradient: "orange" as const
    }
  ];

  const memberResources = [
    {
      title: "Parent & Family Support",
      description: "Essential resources and guidance for football families navigating club life",
      icon: "👪",
      color: "from-blue-600 to-cyan-600",
      resources: [
        "New family welcome pack",
        "Match day guidelines",
        "Training schedules",
        "Communication preferences"
      ],
      ctaText: "Parent Resources",
      ctaLink: "/members/parents"
    },
    {
      title: "Player Development",
      description: "Track progress, access training materials, and stay informed about development pathways",
      icon: "📈",
      color: "from-green-600 to-emerald-600",
      resources: [
        "Skills development guides",
        "Progress tracking",
        "Training videos",
        "Pathway information"
      ],
      ctaText: "Development Hub",
      ctaLink: "/members/development"
    },
    {
      title: "Community & Events",
      description: "Connect with other families through social events, fundraisers, and club activities",
      icon: "🎉",
      color: "from-purple-600 to-violet-600",
      resources: [
        "Social event calendar",
        "Fundraising activities",
        "Family fun days",
        "Club celebrations"
      ],
      ctaText: "View Events",
      ctaLink: "/members/events"
    }
  ];

  const communicationChannels = [
    {
      title: "Club App",
      description: "Download our mobile app for instant updates and team communications",
      icon: "📱",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      features: ["Match schedules", "Team news", "Direct messaging", "Photo sharing"]
    },
    {
      title: "WhatsApp Groups",
      description: "Join your team's WhatsApp group for quick updates and coordination",
      icon: "💬",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      features: ["Team announcements", "Match updates", "Social coordination", "Quick questions"]
    },
    {
      title: "Email Newsletter",
      description: "Weekly newsletter with club news, fixtures, and important announcements",
      icon: "📧",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      features: ["Weekly updates", "Club news", "Fixture lists", "Important notices"]
    },
    {
      title: "Social Media",
      description: "Follow us on Instagram and Facebook for photos, celebrations, and community updates",
      icon: "📸",
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
      features: ["Match photos", "Celebrations", "Community highlights", "Live updates"]
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Members Hub"
      heroSubtitle="Your central resource for club communications, support, and community connection"
      heroIcon="👥"
      quickActions={quickActions}
      sectionName="MEMBERS"
      imageSpecs="1920x1080px minimum, family and community activities preferred"
    >
      
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <GlassCard intensity="medium" className="p-8 text-center bg-gradient-to-br from-white/80 to-gray-50/80">
          <div className="text-4xl mb-4">🤗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Our Football Family</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            As a member of Rivervalley Rangers, you're part of a community that spans over four decades. 
            Here you'll find everything you need to make the most of your club experience.
          </p>
        </GlassCard>
      </motion.div>

      {/* Member Resources */}
      <div className="space-y-12 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Member Resources</h2>
        
        {memberResources.map((resource, index) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <GlassCard intensity="medium" className="overflow-hidden bg-gradient-to-br from-white/80 to-gray-50/80">
              <div className="grid lg:grid-cols-3 gap-0">
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{resource.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900">{resource.title}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{resource.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {resource.resources.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    href={resource.ctaLink}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {resource.ctaText}
                  </Link>
                </div>
                
                <div className={`bg-gradient-to-br ${resource.color} p-8 flex items-center justify-center text-white`}>
                  {/* 
                  ===================================================================
                  👪 MEMBER SECTION IMAGE REPLACEMENT INSTRUCTIONS
                  ===================================================================
                  
                  TO ADD MEMBER SECTION IMAGES:
                  1. Save your image as: /public/images/members/section-name.jpg
                  2. Replace this gradient div with an img element
                  
                  BEST MEMBER IMAGES:
                  - Family involvement at matches and events
                  - Parent and player interactions
                  - Community gatherings and celebrations
                  - Club activities and social events
                  
                  IMAGE SPECS: 600x400px minimum, square/portrait orientation
                  ===================================================================
                  */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">{resource.icon}</div>
                    <p className="text-lg font-bold opacity-90">MEMBER PHOTO PLACEHOLDER</p>
                    <p className="text-sm opacity-75">Replace with actual image</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Communication Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Stay Connected</h2>
        <p className="text-lg text-gray-600 text-center mb-8">
          Choose how you'd like to receive club communications and stay up to date
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {communicationChannels.map((channel, index) => (
            <motion.div
              key={channel.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
            >
              <GlassCard intensity="medium" className="p-6 h-full bg-gradient-to-br from-white/80 to-gray-50/80">
                <div className={`${channel.color} text-white rounded-lg p-4 mb-4 text-center`}>
                  <div className="text-3xl mb-2">{channel.icon}</div>
                  <h3 className="text-lg font-bold">{channel.title}</h3>
                </div>
                
                <p className="text-gray-700 mb-4">{channel.description}</p>
                
                <div className="space-y-2">
                  {channel.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <span className="text-green-500 mr-2 text-sm">✓</span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Member Support CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Need Help or Support?</h2>
        <p className="text-xl mb-8 opacity-90">
          Our club is here to support you and your family throughout your football journey
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <GlassActionCard
            icon="📞"
            title="Contact Support"
            description="Get help with any questions"
            href="/contact"
            gradient="blue"
            size="lg"
          />
          <GlassActionCard
            icon="❓"
            title="FAQ"
            description="Find quick answers"
            href="/members/faq"
            gradient="green"
            size="lg"
          />
          <GlassActionCard
            icon="💬"
            title="Feedback"
            description="Share your thoughts"
            href="/members/feedback"
            gradient="purple"
            size="lg"
          />
        </div>
      </motion.div>

    </GlassPageTemplate>
  );
}