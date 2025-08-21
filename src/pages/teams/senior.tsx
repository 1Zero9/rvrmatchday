import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../../components/StandardLayout';

export default function SeniorTeams() {
  const seniorTeams = [
    {
      id: 'first-team',
      name: 'Rivervalley FC',
      league: 'County Premier League',
      division: 'Premier Division',
      manager: 'Michael O\'Sullivan',
      assistantManager: 'Patrick Ryan',
      trainingDays: 'Tuesday & Thursday 7:30-9:00pm',
      homeGround: 'Main Pitch',
      season: '2024/25',
      players: 23,
      founded: 1981,
      achievements: ['Premier League Champions 2022', 'County Cup Winners 2021', 'Promotion Winners 2020'],
      captain: 'Liam McCarthy',
      topScorer: 'Sean O\'Brien (12 goals)'
    },
    {
      id: 'reserves',
      name: 'Rivervalley Reserves',
      league: 'County League Division 1',
      division: 'Division 1',
      manager: 'Tommy Walsh',
      assistantManager: 'Kevin Murphy',
      trainingDays: 'Monday & Wednesday 7:30-9:00pm',
      homeGround: 'Main Pitch',
      season: '2024/25',
      players: 20,
      founded: 2011,
      achievements: ['Division 1 Champions 2023', 'Reserve Cup Winners 2022'],
      captain: 'David Kelly',
      topScorer: 'Mark Collins (8 goals)'
    },
    {
      id: 'veterans',
      name: 'Rivervalley Veterans',
      league: 'Over 35s League',
      division: 'Division A',
      manager: 'John Fitzgerald',
      assistantManager: 'Paddy O\'Connor',
      trainingDays: 'Thursday 8:00-9:30pm',
      homeGround: 'Youth Pitch 1',
      season: '2024/25',
      players: 18,
      founded: 2015,
      achievements: ['Over 35s Champions 2023', 'Fair Play Award 2022'],
      captain: 'Mick O\'Leary',
      topScorer: 'Jimmy Ryan (6 goals)'
    }
  ];

  const currentForm = {
    'first-team': ['W', 'W', 'D', 'W', 'L'],
    'reserves': ['W', 'D', 'W', 'W', 'D'],
    'veterans': ['W', 'W', 'W', 'D', 'W']
  };

  const leaguePositions = {
    'first-team': { position: 3, points: 42, played: 18 },
    'reserves': { position: 2, points: 38, played: 16 },
    'veterans': { position: 1, points: 45, played: 17 }
  };

  return (
    <StandardLayout title="Senior Teams">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Senior Teams</span>
          </div>
        </nav>

        {/* Teams Section Navigation */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Teams</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/teams/youth" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Youth Teams</h3>
                  <p className="text-sm text-gray-600">Ages 7-18, development focused</p>
                </div>
              </Link>
              
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="font-medium text-green-900 mb-2">Senior Teams</h3>
                <p className="text-sm text-green-700">Adult competitive football</p>
              </div>
              
              <Link href="/contact" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Contact Coaches</h3>
                  <p className="text-sm text-gray-600">Get in touch with our coaching staff</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Senior Football</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-6">
                  Rivervalley Rangers AFC fields three senior teams competing at various levels of local football. Our senior teams represent the pinnacle of our club's competitive structure, providing pathways for both aspiring young players and experienced footballers to compete at their appropriate level.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">61</div>
                    <div className="text-sm text-green-800">Senior Players</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                    <div className="text-sm text-blue-800">Senior Teams</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-1">15</div>
                    <div className="text-sm text-amber-800">Years Established</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Senior Teams */}
            <div className="space-y-8">
              {seniorTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{team.name}</h3>
                      <p className="text-green-600 font-medium text-lg mb-2">{team.league} - {team.division}</p>
                      <p className="text-gray-600 text-sm">Founded: {team.founded}</p>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 flex flex-col items-start lg:items-end space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Position</div>
                          <div className="text-xl font-bold text-green-600">{leaguePositions[team.id].position}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Points</div>
                          <div className="text-xl font-bold text-blue-600">{leaguePositions[team.id].points}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Played</div>
                          <div className="text-xl font-bold text-gray-600">{leaguePositions[team.id].played}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Form:</span>
                        <div className="flex space-x-1">
                          {currentForm[team.id].map((result, idx) => (
                            <span
                              key={idx}
                              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                                result === 'W' ? 'bg-green-500' :
                                result === 'D' ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Manager</h4>
                      <p className="text-gray-600 text-sm">{team.manager}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Assistant</h4>
                      <p className="text-gray-600 text-sm">{team.assistantManager}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Captain</h4>
                      <p className="text-gray-600 text-sm">{team.captain}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Squad Size</h4>
                      <p className="text-gray-600 text-sm">{team.players} players</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Training</h4>
                      <p className="text-gray-600 text-sm">{team.trainingDays}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Home Ground</h4>
                      <p className="text-gray-600 text-sm">{team.homeGround}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">Top Scorer</h4>
                    <p className="text-gray-600 text-sm">{team.topScorer}</p>
                  </div>
                  
                  {team.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-2">Major Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {team.achievements.map((achievement, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs border border-amber-200 font-medium"
                          >
                            🏆 {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Join Senior Teams */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-green-50 rounded-lg border border-green-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <h3 className="text-lg font-semibold text-green-900">Join Our Senior Teams</h3>
              </div>
              <p className="text-green-700 text-sm leading-relaxed mb-4">
                We're always looking for committed players who want to compete at senior level. Trials are held throughout the season.
              </p>
              <div className="space-y-2">
                <Link href="/join/senior" className="block bg-green-600 text-white text-center py-2 px-4 rounded text-sm font-medium hover:bg-green-700 transition-colors">
                  Senior Registration
                </Link>
                <Link href="/join/trials" className="block bg-white text-green-600 text-center py-2 px-4 rounded border border-green-600 text-sm font-medium hover:bg-green-50 transition-colors">
                  Trial Information
                </Link>
              </div>
            </motion.div>

            {/* Next Fixtures */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Fixtures</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-medium text-gray-900">First Team</div>
                  <div className="text-sm text-gray-600">vs Blackwater United</div>
                  <div className="text-xs text-gray-500">Sat 23 Aug, 3:00pm</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-medium text-gray-900">Reserves</div>
                  <div className="text-sm text-gray-600">vs Millfield FC</div>
                  <div className="text-xs text-gray-500">Sun 24 Aug, 2:00pm</div>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <div className="font-medium text-gray-900">Veterans</div>
                  <div className="text-sm text-gray-600">vs Greenfield Veterans</div>
                  <div className="text-xs text-gray-500">Thu 28 Aug, 7:30pm</div>
                </div>
              </div>
              <Link href="/match-central/fixtures" className="block mt-4 text-center bg-gray-100 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-200 transition-colors">
                View All Fixtures
              </Link>
            </motion.div>

            {/* Season Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-blue-50 rounded-lg border border-blue-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-900">Season Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800">Total Games</span>
                  <span className="font-semibold text-blue-900">51</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800">Goals Scored</span>
                  <span className="font-semibold text-blue-900">87</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800">Clean Sheets</span>
                  <span className="font-semibold text-blue-900">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800">Win Rate</span>
                  <span className="font-semibold text-blue-900">67%</span>
                </div>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Pages</h3>
              <div className="space-y-2">
                <Link href="/teams/youth" className="block text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  → Youth Teams
                </Link>
                <Link href="/contact" className="block text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  → Contact Coaches
                </Link>
                <Link href="/join/senior" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Join Senior Teams
                </Link>
                <Link href="/match-central/results" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Latest Results
                </Link>
                <Link href="/match-central/tables" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → League Tables
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </StandardLayout>
  );
}