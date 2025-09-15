/**
 * Club History Page - Detailed Club Heritage
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Comprehensive club history from 1981 to present.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../../components/Glass';
import InlineEditor from '../../components/InlineEditor';

export default function ClubHistory() {
  const quickActions = [
    {
      icon: "📜",
      title: "Our Story",
      description: "From humble beginnings",
      href: "#origins",
      gradient: "blue" as const
    },
    {
      icon: "🏆",
      title: "Achievements",
      description: "Trophies and milestones",
      href: "#achievements",
      gradient: "green" as const
    },
    {
      icon: "👥",
      title: "Club Legends",
      description: "People who made us great",
      href: "#legends",
      gradient: "purple" as const
    },
    {
      icon: "🏟️",
      title: "Our Grounds",
      description: "Facilities through the years",
      href: "#facilities",
      gradient: "orange" as const
    }
  ];

  const timelineEvents = [
    {
      year: "1981",
      title: "Foundation",
      description: "Rivervalley Rangers AFC was founded by a group of local football enthusiasts in Swords, Dublin 15.",
      icon: "🌱",
      color: "from-green-600 to-emerald-600"
    },
    {
      year: "1985",
      title: "First Trophy",
      description: "Won our first competitive trophy - the Dublin Schoolboys League Division 3 championship.",
      icon: "🏆",
      color: "from-yellow-600 to-orange-600"
    },
    {
      year: "1990",
      title: "Ground Acquisition",
      description: "Secured our permanent home at Rivervalley Park with the help of local council and community fundraising.",
      icon: "🏟️",
      color: "from-blue-600 to-cyan-600"
    },
    {
      year: "1995",
      title: "Youth Expansion",
      description: "Expanded to include multiple youth age groups, becoming a key development club in North Dublin.",
      icon: "⚽",
      color: "from-purple-600 to-violet-600"
    },
    {
      year: "2000",
      title: "New Millennium",
      description: "Celebrated our first two decades with over 200 active players across all age groups.",
      icon: "🎉",
      color: "from-pink-600 to-rose-600"
    },
    {
      year: "2005",
      title: "Facility Upgrades",
      description: "Major investment in pitch improvements, floodlights, and new changing room facilities.",
      icon: "🔧",
      color: "from-indigo-600 to-purple-600"
    },
    {
      year: "2010",
      title: "FAI Recognition",
      description: "Achieved FAI Club Mark accreditation, recognizing our commitment to best practices.",
      icon: "🎖️",
      color: "from-green-600 to-teal-600"
    },
    {
      year: "2015",
      title: "Digital Era",
      description: "Launched modern website and social media presence, connecting with our growing community.",
      icon: "💻",
      color: "from-blue-600 to-indigo-600"
    },
    {
      year: "2020",
      title: "Girls Football",
      description: "Introduced our first girls' teams, expanding opportunities for female players in the community.",
      icon: "🌟",
      color: "from-pink-600 to-purple-600"
    },
    {
      year: "2021",
      title: "40 Years Strong",
      description: "Celebrated four decades of community football with special anniversary events and matches.",
      icon: "🎂",
      color: "from-yellow-600 to-red-600"
    },
    {
      year: "2023",
      title: "Inclusive Football",
      description: "Launched our inclusive football programs, ensuring football truly is for everyone in our community.",
      icon: "🤝",
      color: "from-green-600 to-blue-600"
    },
    {
      year: "2025",
      title: "Modern Era",
      description: "Continuing our legacy with advanced facilities, professional coaching, and community focus.",
      icon: "🚀",
      color: "from-purple-600 to-pink-600"
    }
  ];

  const clubLegends = [
    {
      name: "Michael O'Sullivan",
      role: "Founding Chairman (1981-2000)",
      contribution: "Led the club from foundation through its first two decades, establishing many traditions that continue today.",
      icon: "👑"
    },
    {
      name: "Sarah Murphy",
      role: "Youth Development Pioneer",
      contribution: "Instrumental in expanding our youth programs in the 1990s, helping hundreds of children discover football.",
      icon: "⚽"
    },
    {
      name: "Tommy Walsh",
      role: "Groundskeeper Extraordinaire",
      contribution: "30 years maintaining our pitches to championship standard, earning respect throughout Dublin football.",
      icon: "🌱"
    },
    {
      name: "The 1985 Team",
      role: "First Champions",
      contribution: "Our first trophy winners who proved that community spirit and hard work could achieve great things.",
      icon: "🏆"
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Our Club History"
      heroSubtitle="44 Years of Community Football • From 1981 to Today"
      heroIcon="📚"
      backgroundImage="/images/hero/3balls-pitch.jpg"
      quickActions={quickActions}
      sectionName="HISTORY"
      imageSpecs="1920x1080px minimum, historic club photos and milestone moments preferred"
    >

      {/* Timeline Section */}
      <div id="origins" className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey Through Time</h2>
          <InlineEditor
            contentKey="club_history_intro"
            initialContent="From humble beginnings in 1981 to becoming a cornerstone of the Swords community, our story is one of passion, dedication, and the unifying power of football."
            type="textarea"
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            placeholder="History introduction..."
          />
        </motion.div>

        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
            >
              <div className="flex-1">
                <GlassCard 
                  intensity="medium" 
                  className={`p-6 bg-gradient-to-br ${event.color}/10 to-white/80 ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}
                >
                  <div className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'} mb-4`}>
                    <div className={`text-4xl ${index % 2 === 0 ? 'mr-4' : 'ml-4'}`}>{event.icon}</div>
                    <div className={index % 2 === 0 ? '' : 'text-right'}>
                      <div className="text-2xl font-bold text-gray-900">{event.year}</div>
                      <div className="text-lg font-semibold text-gray-700">{event.title}</div>
                    </div>
                  </div>
                  <p className={`text-gray-600 ${index % 2 === 0 ? '' : 'text-right'}`}>{event.description}</p>
                </GlassCard>
              </div>
              
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${event.color} shadow-lg`}></div>
                {index < timelineEvents.length - 1 && (
                  <div className="w-0.5 h-16 bg-gradient-to-b from-gray-300 to-transparent mt-2"></div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Club Legends Section */}
      <div id="legends" className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Club Legends</h2>
          <InlineEditor
            contentKey="club_legends_intro"
            initialContent="The people who built our club, shaped our culture, and created the foundation for future generations."
            type="textarea"
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            placeholder="Club legends introduction..."
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {clubLegends.map((legend, index) => (
            <motion.div
              key={legend.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
            >
              <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80 h-full">
                <div className="flex items-start mb-4">
                  <div className="text-4xl mr-4">{legend.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{legend.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{legend.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{legend.contribution}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div id="achievements" className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <GlassCard intensity="heavy" className="bg-gradient-to-br from-yellow-900/90 to-yellow-800/90 text-white p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Our Achievements</h2>
            
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-2xl font-bold mb-1">25+</div>
                <div className="text-yellow-200 text-sm">League Titles</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🥇</div>
                <div className="text-2xl font-bold mb-1">40+</div>
                <div className="text-yellow-200 text-sm">Cup Victories</div>
              </div>
              <div>
                <div className="text-4xl mb-2">⚽</div>
                <div className="text-2xl font-bold mb-1">500+</div>
                <div className="text-yellow-200 text-sm">Players Developed</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🌟</div>
                <div className="text-2xl font-bold mb-1">44</div>
                <div className="text-yellow-200 text-sm">Years of Excellence</div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-yellow-100/20 rounded-lg">
              <InlineEditor
                contentKey="club_achievements_quote"
                initialContent="More than trophies, we measure success by the friendships formed, skills developed, and the positive impact on our community."
                type="textarea"
                className="text-center text-yellow-100"
                placeholder="Achievements quote..."
              />
              <p className="text-center text-yellow-200 text-sm mt-2">— Club Mission Statement</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Be Part of Our Next Chapter</h2>
        <InlineEditor
          contentKey="club_history_cta_text"
          initialContent="Join the next generation of Rivervalley Rangers and help us write the future of community football"
          type="textarea"
          className="text-xl mb-8 opacity-90"
          placeholder="Call to action..."
        />
        
        <div className="grid md:grid-cols-3 gap-6">
          <GlassActionCard
            icon="👦"
            title="Join Our Teams"
            description="Become part of our story"
            href="/join"
            gradient="blue"
            size="lg"
          />
          <GlassActionCard
            icon="🤝"
            title="Volunteer"
            description="Help shape our future"
            href="/get-involved/volunteering"
            gradient="green"
            size="lg"
          />
          <GlassActionCard
            icon="📞"
            title="Get in Touch"
            description="Learn more about our history"
            href="/contact"
            gradient="purple"
            size="lg"
          />
        </div>
      </motion.div>

    </GlassPageTemplate>
  );
}