/**
 * 🚀 PROFESSIONAL MOBILE TEAMS PAGE
 * Premium teams showcase for football platform
 * 
 * Features: Team overview, quick filters, coach contacts, join CTAs
 */

import { motion } from 'framer-motion';
import { MobileHero, ActionCard, ContentCard } from '../../design/MobileDesignSystem';
import Link from 'next/link';

export default function MobileTeamsPro() {
  // Quick team actions
  const teamActions = [
    {
      icon: "⚽",
      title: "Boys Teams", 
      subtitle: "U8 to U18 squads",
      href: "/teams/boys",
      variant: "primary" as const
    },
    {
      icon: "🌟",
      title: "Girls Teams",
      subtitle: "U8 to U18 squads", 
      href: "/teams/girls",
      variant: "success" as const
    },
    {
      icon: "👨",
      title: "Senior Teams",
      subtitle: "Adult football",
      href: "/teams/senior", 
      variant: "secondary" as const
    },
    {
      icon: "🌈",
      title: "Inclusive",
      subtitle: "Football for all",
      href: "/teams/inclusive",
      variant: "warning" as const
    }
  ];

  // Featured teams
  const featuredTeams = [
    {
      name: "U16 Boys",
      league: "County Youth League Division 2",
      manager: "Sarah Mitchell", 
      players: 18,
      training: "Monday & Wednesday 6:30-8:00pm",
      achievements: ["County Cup Semi-finalists"],
      category: "Youth"
    },
    {
      name: "U12 Girls",
      league: "Girls Youth Development League",
      manager: "Emma Walsh",
      players: 16,
      training: "Tuesday & Thursday 5:30-7:00pm", 
      achievements: ["Most Improved Team 2023"],
      category: "Girls"
    },
    {
      name: "Senior Men",
      league: "Dublin Amateur League Division 3",
      manager: "David Thompson",
      players: 24,
      training: "Tuesday & Thursday 8:00-9:30pm",
      achievements: ["League Champions 2023"],
      category: "Senior"
    }
  ];

  // Key stats
  const teamStats = [
    { number: "18", label: "Total Teams", color: "text-blue-600" },
    { number: "350+", label: "Players", color: "text-green-600" },
    { number: "25", label: "Coaches", color: "text-purple-600" },
    { number: "12", label: "Age Groups", color: "text-orange-600" }
  ];

  // Age group overview
  const ageGroups = [
    { group: "U8-U10", teams: 4, description: "Fun & development focus" },
    { group: "U12-U14", teams: 6, description: "Skills & teamwork" },
    { group: "U16-U18", teams: 5, description: "Competitive football" },
    { group: "Senior", teams: 3, description: "Adult competitions" }
  ];

  return (
    <div className="pb-20">
      
      {/* Hero Section */}
      <MobileHero
        image="/images/hero/halftime2.jpg"
        title="Our Teams"
        subtitle="350+ players across 18 teams • All ages welcome"
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
            <span>Find Your Team</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </MobileHero>

      {/* Team Stats */}
      <section className="px-4 py-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Dublin's Largest Club</h2>
          <div className="grid grid-cols-4 gap-3">
            {teamStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + (index * 0.1), duration: 0.4 }}
                className="text-center bg-white rounded-xl p-3 shadow-sm"
              >
                <div className={`text-lg font-bold mb-1 ${stat.color}`}>{stat.number}</div>
                <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team Categories */}
      <section className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Explore Our Teams</h2>
          <div className="grid grid-cols-2 gap-4">
            {teamActions.map((action, index) => (
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

      {/* Age Groups Overview */}
      <section className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Age Groups</h2>
          <div className="space-y-3">
            {ageGroups.map((group, index) => (
              <motion.div
                key={group.group}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1), duration: 0.4 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{group.group}</div>
                  <div className="text-sm text-gray-600">{group.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">{group.teams}</div>
                  <div className="text-xs text-gray-500">teams</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Teams */}
      <section className="px-4 py-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Featured Teams</h2>
          <div className="space-y-4">
            {featuredTeams.map((team, index) => (
              <motion.div
                key={team.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.league}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                    {team.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="font-medium text-gray-700">Manager:</span>
                    <p className="text-gray-900">{team.manager}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Players:</span>
                    <p className="text-gray-900">{team.players}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Training:</span>
                    <p className="text-gray-900">{team.training}</p>
                  </div>
                </div>

                {team.achievements.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="font-medium text-gray-700 text-sm">Recent Achievements:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {team.achievements.map((achievement, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                          🏆 {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Coaching Staff Highlight */}
      <section className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center"
        >
          <h2 className="text-lg font-bold mb-3">Professional Coaching</h2>
          <p className="text-sm mb-4 opacity-90">
            All our teams are led by qualified coaches committed to player development and enjoyment.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div>
              <div className="font-bold text-lg">25</div>
              <div className="opacity-80">Qualified Coaches</div>
            </div>
            <div>
              <div className="font-bold text-lg">15</div>
              <div className="opacity-80">UEFA Certified</div>
            </div>
          </div>
          <Link
            href="/coach"
            className="inline-block mt-4 bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition-all border border-white/30"
          >
            Meet Our Coaches
          </Link>
        </motion.div>
      </section>

      {/* Join CTA */}
      <section className="px-4 py-8 bg-gradient-to-r from-green-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-3">Find Your Perfect Team</h2>
          <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
            From grassroots to competitive, we have a team for every player. All abilities welcome.
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
              Ask About Teams
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}