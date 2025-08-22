/**
 * Get Involved Hub - Community Engagement Landing Page
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Central hub for volunteering, sponsorship, and community involvement.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../../components/Glass';

export default function GetInvolvedIndex() {
  const quickActions = [
    {
      icon: "🙋",
      title: "Volunteer",
      description: "Help at matches & events",
      href: "/get-involved/volunteering",
      gradient: "blue" as const
    },
    {
      icon: "💰",
      title: "Fundraising",
      description: "Support club projects",
      href: "/get-involved/fundraising",
      gradient: "green" as const
    },
    {
      icon: "🤝",
      title: "Sponsorship",
      description: "Partner with us",
      href: "/get-involved/sponsorship",
      gradient: "purple" as const
    },
    {
      icon: "🧑‍🏫",
      title: "Become a Coach",
      description: "Share your expertise",
      href: "/coach",
      gradient: "orange" as const
    }
  ];

  const opportunities = [
    {
      title: "Match Day Volunteers",
      description: "Help create amazing match day experiences for players and families",
      icon: "⚽",
      roles: ["Referee Assistant", "Pitch Setup", "Refreshments", "Registration"],
      commitment: "2-3 hours per weekend",
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Coaching & Training",
      description: "Share your football knowledge and help develop the next generation",
      icon: "🧑‍🏫",
      roles: ["Assistant Coach", "Goalkeeper Coach", "Skills Training", "Match Analysis"],
      commitment: "4-6 hours per week",
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Administration & Events",
      description: "Keep the club running smoothly with essential behind-the-scenes work",
      icon: "📋",
      roles: ["Registration Help", "Social Media", "Event Planning", "Communications"],
      commitment: "2-4 hours per week",
      color: "from-purple-600 to-violet-600"
    },
    {
      title: "Fundraising & Sponsorship",
      description: "Help secure the club's future through community partnerships",
      icon: "💰",
      roles: ["Grant Applications", "Sponsor Relations", "Event Organization", "Marketing"],
      commitment: "Flexible",
      color: "from-orange-600 to-red-600"
    }
  ];

  const sponsorshipTiers = [
    {
      title: "Platinum Partner",
      price: "€5,000+",
      benefits: ["Logo on all kit", "Pitch-side advertising", "Website prominence", "Social media features"],
      color: "from-gray-400 to-gray-600"
    },
    {
      title: "Gold Sponsor",
      price: "€2,000+",
      benefits: ["Team sponsorship", "Match day advertising", "Newsletter features", "Event invitations"],
      color: "from-yellow-400 to-yellow-600"
    },
    {
      title: "Silver Supporter",
      price: "€500+",
      benefits: ["Website listing", "Social media mentions", "Community recognition", "Club events"],
      color: "from-gray-300 to-gray-500"
    },
    {
      title: "Bronze Friend",
      price: "€100+",
      benefits: ["Website recognition", "Newsletter listing", "Club membership", "Supporter events"],
      color: "from-orange-400 to-orange-600"
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Get Involved"
      heroSubtitle="Join our community and help make Rivervalley Rangers even stronger"
      heroIcon="🤝"
      quickActions={quickActions}
      sectionName="GET INVOLVED"
      imageSpecs="1920x1080px minimum, community volunteers and events preferred"
    >
      
      {/* Volunteer Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Volunteer Opportunities</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard intensity="medium" className="p-6 h-full bg-gradient-to-br from-white/80 to-gray-50/80">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{opportunity.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{opportunity.title}</h3>
                    <p className="text-gray-600 text-sm">{opportunity.commitment}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{opportunity.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Roles Available:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {opportunity.roles.map((role, roleIndex) => (
                      <span 
                        key={roleIndex}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link 
                  href="/get-involved/volunteering"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Learn More
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sponsorship Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-16"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sponsorship Opportunities</h2>
          <p className="text-lg text-gray-600">Partner with us to support grassroots football and build your brand in the community</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsorshipTiers.map((tier, index) => (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
              whileHover={{ y: -5 }}
            >
              <GlassCard intensity="medium" className="p-6 text-center h-full bg-gradient-to-br from-white/80 to-gray-50/80">
                <div className={`bg-gradient-to-r ${tier.color} text-white rounded-lg p-4 mb-4`}>
                  <h3 className="text-lg font-bold">{tier.title}</h3>
                  <p className="text-2xl font-bold">{tier.price}</p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="text-sm text-gray-700 flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/get-involved/sponsorship"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Get Started
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Community Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Your Impact Matters</h2>
        <p className="text-xl mb-8 opacity-90">
          Every volunteer hour, every euro donated, every partnership makes a real difference in our community
        </p>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="text-3xl font-bold text-green-400">250+</div>
            <div className="text-sm opacity-90">Active Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">15</div>
            <div className="text-sm opacity-90">Teams Supported</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">50+</div>
            <div className="text-sm opacity-90">Volunteers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-400">44</div>
            <div className="text-sm opacity-90">Years of Service</div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <GlassActionCard
            icon="🤝"
            title="Start Volunteering"
            description="Join our volunteer team today"
            href="/get-involved/volunteering"
            gradient="blue"
            size="lg"
          />
          <GlassActionCard
            icon="💼"
            title="Become a Sponsor"
            description="Partner with us for success"
            href="/get-involved/sponsorship"
            gradient="green"
            size="lg"
          />
        </div>
      </motion.div>

    </GlassPageTemplate>
  );
}