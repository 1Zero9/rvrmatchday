/**
 * League Tables Landing Page
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Complete league tables overview with glass morphism design
 */

import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../../components/Glass';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Tables() {
  const quickActions = [
    {
      title: "Senior Tables",
      description: "First & Reserve teams",
      href: "#senior",
      icon: "👨",
      gradient: "blue"
    },
    {
      title: "Youth League", 
      description: "Boys age groups",
      href: "#youth",
      icon: "👦",
      gradient: "green"
    },
    {
      title: "Girls League",
      description: "Girls teams standings",
      href: "#girls",
      icon: "👧",
      gradient: "pink"
    },
    {
      title: "Cup Competitions",
      description: "Tournament progress",
      href: "#cups",
      icon: "🏆",
      gradient: "orange"
    }
  ];

  const seniorTable = [
    { position: 1, team: 'Riverside United', played: 18, won: 14, drawn: 3, lost: 1, gf: 42, ga: 12, gd: 30, points: 45, form: ['W','W','W','D','W'] },
    { position: 2, team: 'Rivervalley Rangers', played: 18, won: 12, drawn: 4, lost: 2, gf: 38, ga: 16, gd: 22, points: 40, form: ['W','W','L','W','W'] },
    { position: 3, team: 'Greenfield FC', played: 18, won: 11, drawn: 2, lost: 5, gf: 35, ga: 24, gd: 11, points: 35, form: ['L','W','W','D','L'] },
    { position: 4, team: 'Hillside Rovers', played: 18, won: 9, drawn: 4, lost: 5, gf: 28, ga: 22, gd: 6, points: 31, form: ['W','D','W','W','D'] },
    { position: 5, team: 'Oakwood Athletic', played: 18, won: 8, drawn: 3, lost: 7, gf: 25, ga: 28, gd: -3, points: 27, form: ['L','L','W','D','L'] }
  ];

  const youthTable = [
    { position: 1, team: 'Rivervalley Rangers U16', played: 15, won: 12, drawn: 2, lost: 1, gf: 45, ga: 12, gd: 33, points: 38, form: ['W','W','W','D','W'] },
    { position: 2, team: 'Milltown FC U16', played: 15, won: 10, drawn: 3, lost: 2, gf: 32, ga: 15, gd: 17, points: 33, form: ['W','D','W','W','L'] },
    { position: 3, team: 'Greenfield Youth', played: 15, won: 8, drawn: 4, lost: 3, gf: 28, ga: 20, gd: 8, points: 28, form: ['D','W','W','L','W'] },
    { position: 4, team: 'Hillside Youth', played: 15, won: 6, drawn: 3, lost: 6, gf: 22, ga: 25, gd: -3, points: 21, form: ['L','D','W','L','D'] },
    { position: 5, team: 'Valley United U16', played: 15, won: 2, drawn: 2, lost: 11, gf: 14, ga: 42, gd: -28, points: 8, form: ['L','L','L','D','L'] }
  ];

  const girlsTable = [
    { position: 1, team: 'Rivervalley Rangers U16 Girls', played: 12, won: 9, drawn: 2, lost: 1, gf: 28, ga: 8, gd: 20, points: 29, form: ['W','W','D','W','W'] },
    { position: 2, team: 'Greenfield Girls', played: 12, won: 8, drawn: 1, lost: 3, gf: 24, ga: 14, gd: 10, points: 25, form: ['W','L','W','W','D'] },
    { position: 3, team: 'Hillside Girls', played: 12, won: 6, drawn: 2, lost: 4, gf: 19, ga: 18, gd: 1, points: 20, form: ['D','W','L','W','W'] },
    { position: 4, team: 'Oakwood Girls', played: 12, won: 3, drawn: 3, lost: 6, gf: 15, ga: 22, gd: -7, points: 12, form: ['L','D','L','W','L'] }
  ];

  const getFormIcon = (result: string) => {
    switch (result) {
      case 'W': return <span className="bg-green-500 text-white text-xs px-1 rounded">W</span>;
      case 'D': return <span className="bg-yellow-500 text-white text-xs px-1 rounded">D</span>;
      case 'L': return <span className="bg-red-500 text-white text-xs px-1 rounded">L</span>;
      default: return null;
    }
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-yellow-100 border-l-4 border-yellow-500';
    if (position <= 3) return 'bg-green-100 border-l-4 border-green-500';
    if (position >= 5) return 'bg-red-100 border-l-4 border-red-500';
    return 'bg-gray-50';
  };

  return (
    <GlassPageTemplate
      heroTitle="League Tables & Standings"
      heroSubtitle="Current league positions and statistics for all our teams"
      heroIcon="📊"
      backgroundImage="/images/homepg-image1.jpg"
      quickActions={quickActions}
      sectionName="TABLES"
    >
      <div className="space-y-12">
        
        {/* Senior Division Table */}
        <section id="senior">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-blue-50/80 to-white/80">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">👨</span>
                Division 1A - Senior Table
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Pos</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Team</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">P</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">W</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">D</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">L</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">GF</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">GA</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">GD</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">Pts</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seniorTable.map((team, index) => (
                      <motion.tr
                        key={team.team}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`${getPositionColor(team.position)} hover:bg-white/60 transition-colors`}
                      >
                        <td className="py-3 px-2 font-bold text-gray-900">{team.position}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${team.team.includes('Rivervalley') ? 'text-blue-600' : 'text-gray-900'}`}>
                            {team.team}
                          </span>
                        </td>
                        <td className="text-center py-3 px-2">{team.played}</td>
                        <td className="text-center py-3 px-2">{team.won}</td>
                        <td className="text-center py-3 px-2">{team.drawn}</td>
                        <td className="text-center py-3 px-2">{team.lost}</td>
                        <td className="text-center py-3 px-2">{team.gf}</td>
                        <td className="text-center py-3 px-2">{team.ga}</td>
                        <td className="text-center py-3 px-2 font-semibold">{team.gd > 0 ? '+' : ''}{team.gd}</td>
                        <td className="text-center py-3 px-2 font-bold">{team.points}</td>
                        <td className="text-center py-3 px-4">
                          <div className="flex space-x-1 justify-center">
                            {team.form.map((result, idx) => (
                              <span key={idx}>{getFormIcon(result)}</span>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                  <span>Champion</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span>Promotion/Cup Qualification</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span>Relegation Zone</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Youth League Table */}
        <section id="youth">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-green-50/80 to-white/80">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">👦</span>
                Youth League - U16 Boys
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Pos</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Team</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">P</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">W</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">D</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">L</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">GF</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">GA</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">GD</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">Pts</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {youthTable.map((team, index) => (
                      <motion.tr
                        key={team.team}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                        className={`${getPositionColor(team.position)} hover:bg-white/60 transition-colors`}
                      >
                        <td className="py-3 px-2 font-bold text-gray-900">{team.position}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${team.team.includes('Rivervalley') ? 'text-blue-600' : 'text-gray-900'}`}>
                            {team.team}
                          </span>
                        </td>
                        <td className="text-center py-3 px-2">{team.played}</td>
                        <td className="text-center py-3 px-2">{team.won}</td>
                        <td className="text-center py-3 px-2">{team.drawn}</td>
                        <td className="text-center py-3 px-2">{team.lost}</td>
                        <td className="text-center py-3 px-2">{team.gf}</td>
                        <td className="text-center py-3 px-2">{team.ga}</td>
                        <td className="text-center py-3 px-2 font-semibold">{team.gd > 0 ? '+' : ''}{team.gd}</td>
                        <td className="text-center py-3 px-2 font-bold">{team.points}</td>
                        <td className="text-center py-3 px-4">
                          <div className="flex space-x-1 justify-center">
                            {team.form.map((result, idx) => (
                              <span key={idx}>{getFormIcon(result)}</span>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Girls League Table */}
        <section id="girls">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-pink-50/80 to-white/80">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">👧</span>
                Girls League - U16 Division
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Pos</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Team</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">P</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">W</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">D</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">L</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">GF</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">GA</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">GD</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900">Pts</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {girlsTable.map((team, index) => (
                      <motion.tr
                        key={team.team}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                        className={`${getPositionColor(team.position)} hover:bg-white/60 transition-colors`}
                      >
                        <td className="py-3 px-2 font-bold text-gray-900">{team.position}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${team.team.includes('Rivervalley') ? 'text-pink-600' : 'text-gray-900'}`}>
                            {team.team}
                          </span>
                        </td>
                        <td className="text-center py-3 px-2">{team.played}</td>
                        <td className="text-center py-3 px-2">{team.won}</td>
                        <td className="text-center py-3 px-2">{team.drawn}</td>
                        <td className="text-center py-3 px-2">{team.lost}</td>
                        <td className="text-center py-3 px-2">{team.gf}</td>
                        <td className="text-center py-3 px-2">{team.ga}</td>
                        <td className="text-center py-3 px-2 font-semibold">{team.gd > 0 ? '+' : ''}{team.gd}</td>
                        <td className="text-center py-3 px-2 font-bold">{team.points}</td>
                        <td className="text-center py-3 px-4">
                          <div className="flex space-x-1 justify-center">
                            {team.form.map((result, idx) => (
                              <span key={idx}>{getFormIcon(result)}</span>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Cup Competitions */}
        <section id="cups">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Cup Competitions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* County Cup */}
              <GlassCard intensity="light" className="p-6 bg-gradient-to-br from-orange-50/80 to-white/80">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-xl font-bold text-gray-900">County Cup</h3>
                  <p className="text-orange-600 font-semibold">Quarter Finals</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-600">Rivervalley Rangers U18</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Qualified</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Beat Milltown FC 3-2</p>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 mb-2">Next Match:</p>
                    <p className="font-semibold">vs Greenfield Youth</p>
                    <p className="text-xs text-gray-500">February 2nd • 14:30</p>
                  </div>
                </div>
              </GlassCard>

              {/* League Cup */}
              <GlassCard intensity="light" className="p-6 bg-gradient-to-br from-purple-50/80 to-white/80">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🏅</div>
                  <h3 className="text-xl font-bold text-gray-900">League Cup</h3>
                  <p className="text-purple-600 font-semibold">Round of 16</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-600">Rivervalley Rangers First Team</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">In Progress</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Progressed from Group A</p>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 mb-2">Next Match:</p>
                    <p className="font-semibold">vs Hillside Rovers</p>
                    <p className="text-xs text-gray-500">January 30th • 19:30</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </section>

        {/* Additional Tables */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <GlassCard intensity="medium" className="p-8 text-center bg-gradient-to-br from-blue-50/80 to-white/80">
              <div className="text-6xl mb-6">📋</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">More League Tables</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                View complete tables for all age groups and divisions across our club.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "U18 Boys", division: "Division 1" },
                  { name: "U14 Boys", division: "Youth League" },
                  { name: "U12 Boys", division: "Mini League" },
                  { name: "U14 Girls", division: "Girls League" },
                  { name: "U12 Girls", division: "Mini Girls" },
                  { name: "Reserve Team", division: "Division 3B" },
                  { name: "Veterans", division: "Over 35s" },
                  { name: "Walking Football", division: "Community" }
                ].map((team, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 + (index * 0.05) }}
                  >
                    <GlassActionCard
                      title={team.name}
                      description={team.division}
                      href={`#${team.name.toLowerCase().replace(' ', '-')}`}
                      icon="📊"
                      gradient="blue"
                      size="sm"
                    />
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </section>

      </div>
    </GlassPageTemplate>
  );
}