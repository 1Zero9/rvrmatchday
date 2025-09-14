/**
 * About Page - Club Story & Heritage (Clean Professional Version)
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * About page converted to glass morphism design system with professional mobile.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import GlassPageTemplate from '../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../components/Glass';
import MobileLayout from '../components/MobileLayout';
import MobileAboutPro from '../components/mobile/MobileAboutPro';

export default function About() {
  const quickActions = [
    {
      icon: "📜",
      title: "Our Story",
      description: "44 years of football tradition",
      href: "/club/history",
      gradient: "blue" as const
    },
    {
      icon: "🤝",
      title: "Our Values",
      description: "Community • Development • Excellence",
      href: "/club/values",
      gradient: "green" as const
    },
    {
      icon: "🏟️",
      title: "Our Facilities",
      description: "Training grounds & clubhouse",
      href: "/club/facilities",
      gradient: "purple" as const
    },
    {
      icon: "👨‍🏫",
      title: "Our Team",
      description: "25+ qualified coaches",
      href: "/club/committee",
      gradient: "orange" as const
    }
  ];

  return (
    <div>
      {/* Mobile Version - Professional */}
      <div className="block md:hidden">
        <MobileLayout 
          currentPage="/about"
          clubData={{
            name: "RVR AFC", 
            logo: "/images/logo.png",
            established: "1981",
            colors: {
              primary: "#972A4C",
              secondary: "#5E7794",
              accent: "#98C0F0",
              neutral: "#B6B7B6"
            }
          }}
        >
          <MobileAboutPro />
        </MobileLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <GlassPageTemplate
          heroTitle="About Rivervalley Rangers"
          heroSubtitle="From Ancient Swords to Modern Football • A Thousand Years of Community Spirit"
          heroIcon="🏰"
          backgroundImage="/images/hero/cornerflag.png"
          quickActions={quickActions}
          sectionName="ABOUT"
          imageSpecs="1920x1080px minimum, club heritage and community activities preferred"
        >
          <div className="pb-16">
            {/* Our Story Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <GlassCard className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
                  <div className="w-20 h-1 bg-club-accent mx-auto rounded-full"></div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-white/90 leading-relaxed">
                    <p className="text-lg">
                      Founded in 1981, <strong className="text-white">Rivervalley Rangers AFC</strong> has been at the heart of our community for over 40 years. What started as a small local club has grown into one of the region's most respected football organizations.
                    </p>
                    <p>
                      We pride ourselves on developing not just great football players, but great people. Our commitment to community, development, and excellence drives everything we do.
                    </p>
                    <p>
                      Today, with over 350 active players across 18 teams, we continue to provide opportunities for players of all ages and abilities to experience the joy of football.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-3xl font-bold text-club-accent mb-2">350+</div>
                      <div className="text-white/80 text-sm">Active Players</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-3xl font-bold text-club-accent mb-2">18</div>
                      <div className="text-white/80 text-sm">Teams</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-3xl font-bold text-club-accent mb-2">25</div>
                      <div className="text-white/80 text-sm">Qualified Coaches</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-3xl font-bold text-club-accent mb-2">44</div>
                      <div className="text-white/80 text-sm">Years Experience</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Our Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <GlassCard className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
                  <div className="w-20 h-1 bg-club-accent mx-auto rounded-full"></div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  {[
                    {
                      icon: "🤝",
                      title: "Community",
                      description: "Building lasting friendships and connections through football",
                      color: "text-blue-400"
                    },
                    {
                      icon: "🌱",
                      title: "Development",
                      description: "Growing skills, confidence, and character in every player",
                      color: "text-green-400"
                    },
                    {
                      icon: "⭐",
                      title: "Excellence",
                      description: "Striving for our best in everything we do, on and off the pitch",
                      color: "text-yellow-400"
                    },
                    {
                      icon: "🎯",
                      title: "Respect",
                      description: "Treating everyone with dignity, fairness, and sportsmanship",
                      color: "text-red-400"
                    }
                  ].map((value, index) => (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + (index * 0.1), duration: 0.4 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex items-center mb-3">
                        <div className="text-3xl mr-4">{value.icon}</div>
                        <h3 className={`text-xl font-semibold ${value.color}`}>{value.title}</h3>
                      </div>
                      <p className="text-white/80 leading-relaxed">{value.description}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <GlassCard className="p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Story?</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                  Be part of Dublin's most welcoming football community. All ages and abilities welcome.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/join/trials"
                    className="bg-club-primary hover:bg-club-primary-dark text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Book a Trial
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
                  >
                    Get in Touch
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </GlassPageTemplate>
      </div>
    </div>
  );
}