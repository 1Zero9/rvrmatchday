/**
 * Teams Hub - Main Teams Landing Page
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Central hub for all team information with glass morphism design.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../../components/Glass';

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
      description: "Building the stars of tomorrow through structured development programs",
      icon: "⚽",
      color: "from-blue-600 to-cyan-600",
      teams: [
        { name: "U18 Boys", players: "22 players", coach: "Michael Walsh", href: "/teams/boys" },
        { name: "U16 Boys", players: "20 players", coach: "David Murphy", href: "/teams/boys" },
        { name: "U14 Boys", players: "24 players", coach: "John O'Connor", href: "/teams/boys" },
        { name: "U12 Boys", players: "18 players", coach: "Sarah Wilson", href: "/teams/boys" },
        { name: "U10 Boys", players: "16 players", coach: "Emma Kelly", href: "/teams/boys" }
      ]
    },
    {
      title: "Girls Football",
      description: "Rapidly growing girls section with dedicated coaching and development",
      icon: "🌟",
      color: "from-purple-600 to-pink-600",
      teams: [
        { name: "U16 Girls", players: "18 players", coach: "Lisa Murphy", href: "/teams/girls" },
        { name: "U14 Girls", players: "22 players", coach: "Rachel O'Brien", href: "/teams/girls" },
        { name: "U12 Girls", players: "20 players", coach: "Claire Walsh", href: "/teams/girls" }
      ]
    },
    {
      title: "Senior Football",
      description: "Competitive adult teams representing the club in local leagues",
      icon: "🏆",
      color: "from-green-600 to-emerald-600",
      teams: [
        { name: "First Team", players: "25 players", coach: "Michael Walsh", href: "/teams/senior" },
        { name: "Reserve Team", players: "22 players", coach: "David Murphy", href: "/teams/senior" },
        { name: "Veterans (O35)", players: "20 players", coach: "John Kelly", href: "/teams/senior" }
      ]
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Our Teams"
      heroSubtitle="From grassroots to competitive football - teams for every age and ability"
      heroIcon="👥"
      quickActions={quickActions}
      sectionName="TEAMS"
      imageSpecs="1920x1080px minimum, team photos and action shots preferred"
    >
      
      {/* Team Categories */}
      <div className="space-y-12">
        {teamCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{category.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.teams.map((team, teamIndex) => (
                  <motion.div
                    key={team.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: (index * 0.2) + (teamIndex * 0.1) }}
                    whileHover={{ y: -3 }}
                  >
                    <Link href={team.href}>
                      <GlassCard 
                        intensity="light" 
                        hover={true}
                        className="p-6 cursor-pointer bg-gradient-to-br from-white/70 to-gray-50/70"
                      >
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{team.name}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>👥 {team.players}</p>
                          <p>🧑‍🏫 Coach: {team.coach}</p>
                        </div>
                        <div className="mt-4 text-blue-600 text-sm font-medium">
                          Learn More →
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Join Our Teams CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Join a Team?</h2>
        <p className="text-xl mb-8 opacity-90">
          Find your place in our football family - from grassroots to competitive levels
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <GlassActionCard
            icon="👦"
            title="Youth Registration"
            description="Ages 6-17"
            href="/join/youth"
            gradient="blue"
            size="lg"
          />
          <GlassActionCard
            icon="👨"
            title="Senior Registration"
            description="Adult teams"
            href="/join/senior"
            gradient="green"
            size="lg"
          />
          <GlassActionCard
            icon="🎯"
            title="Trial Sessions"
            description="Try before you join"
            href="/join/trials"
            gradient="orange"
            size="lg"
          />
        </div>
      </motion.div>

    </GlassPageTemplate>
  );
}