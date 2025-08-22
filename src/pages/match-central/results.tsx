/**
 * Results Landing Page
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Complete results overview with glass morphism design
 */

import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard, GlassStats } from '../../components/Glass';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Results() {
  const quickActions = [
    {
      title: "Latest Results",
      description: "Most recent matches",
      href: "#latest",
      icon: "🏆",
      gradient: "green"
    },
    {
      title: "Season Stats", 
      description: "Performance overview",
      href: "#stats",
      icon: "📊",
      gradient: "blue"
    },
    {
      title: "Top Performers",
      description: "Player highlights",
      href: "#players",
      icon: "⭐",
      gradient: "purple"
    },
    {
      title: "Match Reports",
      description: "Detailed analysis",
      href: "#reports",
      icon: "📝",
      gradient: "orange"
    }
  ];

  const latestResults = [
    {
      id: 1,
      date: '2025-01-22',
      team: 'First Team',
      opponent: 'Greenfield FC',
      homeScore: 2,
      awayScore: 1,
      venue: 'Home',
      status: 'won',
      league: 'Division 1A',
      highlights: ['Great comeback win', '2 goals in final 15 minutes']
    },
    {
      id: 2,
      date: '2025-01-20',
      team: 'U16 Boys',
      opponent: 'Hillside Rovers',
      homeScore: 1,
      awayScore: 1,
      venue: 'Away',
      status: 'draw',
      league: 'Youth League',
      highlights: ['Penalty save in 89th minute', 'Solid defensive display']
    },
    {
      id: 3,
      date: '2025-01-18',
      team: 'U18 Boys',
      opponent: 'Milltown FC',
      homeScore: 3,
      awayScore: 2,
      venue: 'Home',
      status: 'won',
      league: 'County Cup',
      highlights: ['County Cup QF win', 'Hat-trick by Jamie O\'Connor']
    },
    {
      id: 4,
      date: '2025-01-15',
      team: 'Reserve Team',
      opponent: 'Parkside United',
      homeScore: 0,
      awayScore: 2,
      venue: 'Away',
      status: 'lost',
      league: 'Division 3B',
      highlights: ['Goalkeeper injured', 'Played with 10 men from 60min']
    }
  ];

  const topPerformers = [
    {
      name: "Jamie O'Connor",
      position: "Forward",
      team: "U18 Boys",
      stat: "12 Goals",
      achievement: "Top Scorer"
    },
    {
      name: "Sarah Murphy",
      position: "Midfielder", 
      team: "U16 Girls",
      stat: "8 Assists",
      achievement: "Most Assists"
    },
    {
      name: "Michael Flynn",
      position: "Goalkeeper",
      team: "First Team",
      stat: "6 Clean Sheets",
      achievement: "Best Defence"
    },
    {
      name: "Emma Kelly",
      position: "Defender",
      team: "U14 Girls",
      stat: "95% Pass Rate",
      achievement: "Most Accurate"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'won':
        return { color: 'border-green-500 bg-green-50', badge: 'bg-green-100 text-green-800', icon: '🏆' };
      case 'lost':
        return { color: 'border-red-500 bg-red-50', badge: 'bg-red-100 text-red-800', icon: '😞' };
      case 'draw':
        return { color: 'border-yellow-500 bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800', icon: '🤝' };
      default:
        return { color: 'border-gray-500 bg-gray-50', badge: 'bg-gray-100 text-gray-800', icon: '⚽' };
    }
  };

  return (
    <GlassPageTemplate
      heroTitle="Results & Performance"
      heroSubtitle="Match results, statistics, and performance analysis for all our teams"
      heroIcon="🏆"
      backgroundImage="/images/homepg-image1.jpg"
      quickActions={quickActions}
      sectionName="RESULTS"
    >
      <div className="space-y-12">
        
        {/* Season Overview Stats */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Season Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassStats 
                  icon="🏆" 
                  value="18" 
                  label="Matches Won" 
                  gradient="green" 
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassStats 
                  icon="🤝" 
                  value="7" 
                  label="Draws" 
                  gradient="orange" 
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassStats 
                  icon="😞" 
                  value="5" 
                  label="Matches Lost" 
                  gradient="red" 
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <GlassStats 
                  icon="⚽" 
                  value="67" 
                  label="Goals Scored" 
                  gradient="blue" 
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Latest Results */}
        <section id="latest">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-green-50/80 to-white/80">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">🏆</span>
                Latest Results
              </h2>
              
              <div className="space-y-6">
                {latestResults.map((result, index) => {
                  const statusInfo = getStatusInfo(result.status);
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`border-l-4 ${statusInfo.color} bg-white/60 backdrop-blur-sm rounded-lg p-6 hover:shadow-md transition-all`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <h3 className="text-xl font-bold text-gray-900 mr-3">{result.team}</h3>
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                              {result.league}
                            </span>
                            <span className={`text-sm px-2 py-1 rounded-full font-medium ${statusInfo.badge}`}>
                              {statusInfo.icon} {result.status.toUpperCase()}
                            </span>
                          </div>
                          
                          {/* Score Display */}
                          <div className="flex items-center mb-3">
                            <div className="text-2xl font-bold text-gray-900 mr-6">
                              {result.venue === 'Home' ? (
                                <>
                                  <span className="text-blue-600">{result.homeScore}</span>
                                  <span className="mx-2">-</span>
                                  <span>{result.awayScore}</span>
                                </>
                              ) : (
                                <>
                                  <span>{result.awayScore}</span>
                                  <span className="mx-2">-</span>
                                  <span className="text-blue-600">{result.homeScore}</span>
                                </>
                              )}
                            </div>
                            <div>
                              <p className="text-lg text-gray-700">vs {result.opponent}</p>
                              <p className="text-sm text-gray-600">{result.venue}</p>
                            </div>
                          </div>
                          
                          {/* Highlights */}
                          <div className="mb-3">
                            {result.highlights.map((highlight, idx) => (
                              <span key={idx} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 lg:text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {new Date(result.date).toLocaleDateString('en-GB', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          <Link 
                            href={`#match-report-${result.id}`}
                            className="inline-block mt-2 bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded hover:bg-blue-700 transition-colors"
                          >
                            Match Report
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="text-center mt-8">
                <Link 
                  href="#full-results"
                  className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View All Results
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Top Performers */}
        <section id="players">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Top Performers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPerformers.map((performer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                >
                  <GlassCard intensity="light" className="p-6 h-full text-center bg-gradient-to-br from-purple-50/80 to-pink-50/80">
                    <div className="text-4xl mb-3">⭐</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{performer.name}</h3>
                    <p className="text-blue-600 font-semibold text-sm mb-1">{performer.team}</p>
                    <p className="text-gray-600 text-sm mb-3">{performer.position}</p>
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">{performer.stat}</p>
                      <p className="text-xs text-gray-600">{performer.achievement}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Team Performance Breakdown */}
        <section id="stats">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-blue-50/80 to-white/80">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Team Performance Breakdown</h2>
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Youth Teams */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">👦</span>
                    Youth Teams
                  </h3>
                  <div className="space-y-3">
                    {[
                      { team: 'U18 Boys', record: '8-2-1', points: 26 },
                      { team: 'U16 Boys', record: '6-3-2', points: 21 },
                      { team: 'U14 Boys', record: '7-1-3', points: 22 },
                      { team: 'U12 Boys', record: '9-2-0', points: 29 }
                    ].map((team, idx) => (
                      <div key={idx} className="bg-white/60 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{team.team}</p>
                          <p className="text-sm text-gray-600">W-D-L: {team.record}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{team.points}</p>
                          <p className="text-xs text-gray-600">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Girls Teams */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">👧</span>
                    Girls Teams
                  </h3>
                  <div className="space-y-3">
                    {[
                      { team: 'U16 Girls', record: '5-2-2', points: 17 },
                      { team: 'U14 Girls', record: '7-3-1', points: 24 },
                      { team: 'U12 Girls', record: '6-1-2', points: 19 }
                    ].map((team, idx) => (
                      <div key={idx} className="bg-white/60 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{team.team}</p>
                          <p className="text-sm text-gray-600">W-D-L: {team.record}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-pink-600">{team.points}</p>
                          <p className="text-xs text-gray-600">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Senior Teams */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">👨</span>
                    Senior Teams
                  </h3>
                  <div className="space-y-3">
                    {[
                      { team: 'First Team', record: '12-4-2', points: 40 },
                      { team: 'Reserve Team', record: '8-3-5', points: 27 }
                    ].map((team, idx) => (
                      <div key={idx} className="bg-white/60 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{team.team}</p>
                          <p className="text-sm text-gray-600">W-D-L: {team.record}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{team.points}</p>
                          <p className="text-xs text-gray-600">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Match Reports */}
        <section id="reports">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <GlassCard intensity="medium" className="p-8 text-center bg-gradient-to-br from-orange-50/80 to-white/80">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Match Reports & Analysis</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                Get detailed match reports, tactical analysis, and player ratings for every game.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/news-media/match-reports"
                  className="bg-orange-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  📝 Read Match Reports
                </Link>
                <Link 
                  href="/news-media/analysis"
                  className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📊 Tactical Analysis
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </section>

      </div>
    </GlassPageTemplate>
  );
}