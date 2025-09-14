/**
 * Teams Hub - Main Teams Landing Page (Professional Version)
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Central hub for all team information with professional mobile and glass morphism design.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../../components/Glass';
import MobileLayout from '../../components/MobileLayout';
import MobileTeamsPro from '../../components/mobile/MobileTeamsPro';

export default function TeamsIndex() {
  const quickActions = [
    {
      icon: "⚽",
      title: "Boys Teams",
      description: "U18, U16, U14, U12, U10",
      href: "/teams/boys",
      gradient: "blue" as const
    },
    {
      icon: "🌟",
      title: "Girls Teams", 
      description: "U16, U14, U12 Girls",
      href: "/teams/girls",
      gradient: "purple" as const
    },
    {
      icon: "👨",
      title: "Senior Teams",
      description: "Adult competitive leagues",
      href: "/teams/senior",
      gradient: "green" as const
    },
    {
      icon: "🤝",
      title: "Inclusive Football",
      description: "Football for everyone",
      href: "/teams/inclusive",
      gradient: "orange" as const
    }
  ];

  const teamCategories = [
    {
      title: "Youth Development",
      description: "Building tomorrow's players through structured development programs",
      teams: ["U8 Boys", "U10 Boys", "U12 Boys", "U14 Boys"],
      focus: "Skills, fun, and fundamentals"
    },
    {
      title: "Competitive Youth",
      description: "League football for ambitious young players",
      teams: ["U16 Boys", "U18 Boys", "U14 Girls", "U16 Girls"],
      focus: "Tactical development and competition"
    },
    {
      title: "Adult Football",
      description: "Competitive leagues and social football for adults",
      teams: ["Senior Men", "Senior Women", "Veterans (35+)"],
      focus: "Competition and community"
    },
    {
      title: "Inclusive Programs",
      description: "Football opportunities for players of all abilities",
      teams: ["Mixed Ability", "Disability Football", "Walking Football"],
      focus: "Participation and enjoyment"
    }
  ];

  return (
    <div>
      {/* Mobile Version - Professional */}
      <div className="block md:hidden">
        <MobileLayout 
          currentPage="/teams"
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
          <MobileTeamsPro />
        </MobileLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <GlassPageTemplate
          heroTitle="Our Teams"
          heroSubtitle="From grassroots to competitive • 18 teams across all age groups"
          heroIcon="⚽"
          backgroundImage="/images/hero/teams.jpg"
          quickActions={quickActions}
          sectionName="TEAMS"
          imageSpecs="1920x1080px minimum, team action shots preferred"
        >
          <div className="pb-16">
            {/* Team Overview Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <GlassCard className="p-8 bg-gradient-to-br from-gray-900/80 to-black/70">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Dublin's Largest Club</h2>
                  <div className="w-20 h-1 bg-club-accent mx-auto rounded-full"></div>
                </div>
                
                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 text-center">
                  {[
                    { number: "18", label: "Total Teams", icon: "⚽" },
                    { number: "350+", label: "Active Players", icon: "👥" },
                    { number: "25", label: "Qualified Coaches", icon: "👨‍🏫" },
                    { number: "12", label: "Age Groups", icon: "🎯" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + (index * 0.1), duration: 0.4 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="text-4xl mb-3">{stat.icon}</div>
                      <div className="text-3xl font-bold text-club-accent mb-2">{stat.number}</div>
                      <div className="text-white/80 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Team Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <GlassCard className="p-8 bg-gradient-to-br from-gray-900/80 to-black/70">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Team Categories</h2>
                  <div className="w-20 h-1 bg-club-accent mx-auto rounded-full"></div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {teamCategories.map((category, index) => (
                    <motion.div
                      key={category.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + (index * 0.1), duration: 0.4 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                    >
                      <h3 className="text-xl font-bold text-white mb-3">{category.title}</h3>
                      <p className="text-white/80 mb-4 leading-relaxed">{category.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-club-accent mb-2 uppercase tracking-wide">Teams:</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.teams.map((team) => (
                            <span key={team} className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                              {team}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-semibold text-white">Focus: </span>
                        <span className="text-white/80">{category.focus}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Coaching Excellence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-16"
            >
              <GlassCard className="p-8 bg-gradient-to-br from-gray-900/80 to-black/70">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">Professional Coaching</h2>
                    <p className="text-white/80 leading-relaxed mb-6">
                      All our teams are led by qualified coaches committed to player development, 
                      safety, and enjoyment. Our coaching philosophy emphasizes technical skill 
                      development, tactical understanding, and personal growth.
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {[
                        "UEFA qualified coaching staff",
                        "Age-appropriate training methods", 
                        "Focus on player development over results",
                        "Regular coach education and development"
                      ].map((point, index) => (
                        <div key={index} className="flex items-center text-white/90">
                          <div className="w-2 h-2 bg-club-accent rounded-full mr-3"></div>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link
                      href="/coach"
                      className="inline-flex items-center bg-club-accent hover:bg-club-accent-dark text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Meet Our Coaches
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { number: "25", label: "Qualified Coaches" },
                      { number: "15", label: "UEFA Certified" },
                      { number: "5", label: "Years Avg Experience" },
                      { number: "100%", label: "Garda Vetted" }
                    ].map((stat, index) => (
                      <div key={stat.label} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-2xl font-bold text-club-accent mb-1">{stat.number}</div>
                        <div className="text-white/80 text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Join CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <GlassCard className="p-8 text-center bg-gradient-to-br from-gray-900/80 to-black/70">
                <h2 className="text-3xl font-bold text-white mb-4">Find Your Perfect Team</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                  Whether you're 5 or 50, just starting out or an experienced player, we have a team for you. 
                  Join Dublin's most welcoming football community.
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
                    Ask About Teams
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