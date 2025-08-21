import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../../components/StandardLayout';

export default function YouthTeams() {
  const boysTeams = [
    {
      id: 'u18-boys',
      name: 'U18 Boys Rangers',
      league: 'County Youth League Division 1',
      ageGroup: 'Under 18',
      manager: 'David Thompson',
      trainingDays: 'Tuesday & Thursday 7:00-8:30pm',
      homeGround: 'Main Pitch',
      season: '2024/25',
      players: 22,
      achievements: ['League Champions 2023', 'County Cup Semi-finalists']
    },
    {
      id: 'u16-boys',
      name: 'U16 Boys Rangers',
      league: 'County Youth League Division 2',
      ageGroup: 'Under 16',
      manager: 'Sarah Mitchell',
      trainingDays: 'Monday & Wednesday 6:30-8:00pm',
      homeGround: 'Youth Pitch 1',
      season: '2024/25',
      players: 18,
      achievements: ['Most Improved Team 2023', 'Fair Play Award']
    },
    {
      id: 'u14-boys',
      name: 'U14 Boys Rangers',
      league: 'Regional Youth Development League',
      ageGroup: 'Under 14',
      manager: 'Mark O\'Connor',
      trainingDays: 'Tuesday & Thursday 6:00-7:30pm',
      homeGround: 'Youth Pitch 2',
      season: '2024/25',
      players: 20,
      achievements: ['Development League Winners 2023']
    },
    {
      id: 'u12-boys',
      name: 'U12 Boys Rangers',
      league: 'Local Youth League',
      ageGroup: 'Under 12',
      manager: 'Emma Walsh',
      trainingDays: 'Saturday 10:00-11:30am',
      homeGround: 'Youth Pitch 3',
      season: '2024/25',
      players: 16,
      achievements: ['Best Newcomers 2023']
    },
    {
      id: 'u10-boys',
      name: 'U10 Boys Rangers',
      league: 'Mini Football League',
      ageGroup: 'Under 10',
      manager: 'James Kelly',
      trainingDays: 'Saturday 9:00-10:00am',
      homeGround: 'Training Area',
      season: '2024/25',
      players: 14,
      achievements: ['Participation Award 2023']
    }
  ];

  const girlsTeams = [
    {
      id: 'u16-girls',
      name: 'U16 Girls Rangers',
      league: 'County Girls League Division 1',
      ageGroup: 'Under 16',
      manager: 'Lisa Murphy',
      trainingDays: 'Wednesday & Friday 6:30-8:00pm',
      homeGround: 'Main Pitch',
      season: '2024/25',
      players: 16,
      achievements: ['New Team - Building Strong Foundation']
    },
    {
      id: 'u14-girls',
      name: 'U14 Girls Rangers',
      league: 'Regional Girls Development League',
      ageGroup: 'Under 14',
      manager: 'Rachel O\'Brien',
      trainingDays: 'Tuesday & Thursday 6:00-7:30pm',
      homeGround: 'Youth Pitch 1',
      season: '2024/25',
      players: 14,
      achievements: ['Fastest Growing Team 2024']
    },
    {
      id: 'u12-girls',
      name: 'U12 Girls Rangers',
      league: 'Local Girls Youth League',
      ageGroup: 'Under 12',
      manager: 'Karen Walsh',
      trainingDays: 'Saturday 11:30am-1:00pm',
      homeGround: 'Youth Pitch 2',
      season: '2024/25',
      players: 12,
      achievements: ['Team Spirit Award 2024']
    }
  ];

  const inclusiveTeams = [
    {
      id: 'football-for-all-u16',
      name: 'Football for All U16',
      league: 'Inclusive Sports League',
      ageGroup: 'Under 16 (Special Needs)',
      manager: 'Tom Bradley & Support Team',
      trainingDays: 'Saturday 2:00-3:30pm',
      homeGround: 'Training Area',
      season: '2024/25',
      players: 10,
      achievements: ['Participation & Joy in Football']
    },
    {
      id: 'football-for-all-u12',
      name: 'Football for All U12',
      league: 'Inclusive Sports League',
      ageGroup: 'Under 12 (Special Needs)',
      manager: 'Amy Collins & Support Team',
      trainingDays: 'Saturday 3:30-5:00pm',
      homeGround: 'Training Area',
      season: '2024/25',
      players: 8,
      achievements: ['Building Confidence Through Sport']
    }
  ];

  return (
    <StandardLayout title="Youth Teams">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Youth Teams</span>
          </div>
        </nav>

        {/* Teams Section Navigation */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Teams</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-900 mb-2">Youth Teams</h3>
                <p className="text-sm text-blue-700">Ages 7-18, development focused</p>
              </div>
              
              <Link href="/teams/senior" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Senior Teams</h3>
                  <p className="text-sm text-gray-600">Adult competitive football</p>
                </div>
              </Link>
              
              <Link href="/teams/coaching" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Coaching Staff</h3>
                  <p className="text-sm text-gray-600">Meet our qualified coaches</p>
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
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Youth Development Program</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our Youth Development Program is the foundation of Rivervalley Rangers AFC. We believe in nurturing young talent through structured training, competitive matches, and character development. With over 90 young players across five age groups, we provide pathways from grassroots to elite level football.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">90+</div>
                    <div className="text-sm text-blue-800">Youth Players</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">5</div>
                    <div className="text-sm text-green-800">Age Groups</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-1">12</div>
                    <div className="text-sm text-amber-800">Youth Coaches</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Boys Teams Section */}
            <div id="boys" className="mb-12">
              <div className="bg-blue-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
                <h3 className="text-2xl font-bold text-blue-900 mb-2 flex items-center">
                  <span className="text-3xl mr-3">⚽</span>
                  Boys Teams
                </h3>
                <p className="text-blue-700">Traditional football development across all age groups</p>
              </div>
              <div className="space-y-6">
                {boysTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
                      <p className="text-blue-600 font-medium">{team.league}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {team.ageGroup}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Manager</h4>
                      <p className="text-gray-600 text-sm">{team.manager}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Training</h4>
                      <p className="text-gray-600 text-sm">{team.trainingDays}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Home Ground</h4>
                      <p className="text-gray-600 text-sm">{team.homeGround}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Squad Size</h4>
                      <p className="text-gray-600 text-sm">{team.players} players</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">Season</h4>
                      <p className="text-gray-600 text-sm">{team.season}</p>
                    </div>
                  </div>
                  
                  {team.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm mb-2">Recent Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {team.achievements.map((achievement, idx) => (
                          <span
                            key={idx}
                            className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs border border-green-200"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              </div>
            </div>

            {/* Girls Teams Section */}
            <div id="girls" className="mb-12">
              <div className="bg-pink-50 rounded-lg p-6 mb-6 border-l-4 border-pink-500">
                <h3 className="text-2xl font-bold text-pink-900 mb-2 flex items-center">
                  <span className="text-3xl mr-3">🌟</span>
                  Girls Teams
                </h3>
                <p className="text-pink-700">Expanding opportunities for female players - our newest and fastest growing section</p>
              </div>
              <div className="space-y-6">
                {girlsTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                    className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
                        <p className="text-pink-600 font-medium">{team.league}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                          {team.ageGroup}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Manager</h4>
                        <p className="text-gray-600 text-sm">{team.manager}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Training</h4>
                        <p className="text-gray-600 text-sm">{team.trainingDays}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Home Ground</h4>
                        <p className="text-gray-600 text-sm">{team.homeGround}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Squad Size</h4>
                        <p className="text-gray-600 text-sm">{team.players} players</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Season</h4>
                        <p className="text-gray-600 text-sm">{team.season}</p>
                      </div>
                    </div>
                    
                    {team.achievements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">Recent Achievements</h4>
                        <div className="flex flex-wrap gap-2">
                          {team.achievements.map((achievement, idx) => (
                            <span
                              key={idx}
                              className="bg-pink-50 text-pink-700 px-2 py-1 rounded text-xs border border-pink-200"
                            >
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Inclusive Teams Section */}
            <div id="inclusive" className="mb-12">
              <div className="bg-purple-50 rounded-lg p-6 mb-6 border-l-4 border-purple-500">
                <h3 className="text-2xl font-bold text-purple-900 mb-2 flex items-center">
                  <span className="text-3xl mr-3">🤝</span>
                  Football for All
                </h3>
                <p className="text-purple-700">Inclusive programs for children with special needs - building confidence through sport</p>
              </div>
              <div className="space-y-6">
                {inclusiveTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                    className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
                        <p className="text-purple-600 font-medium">{team.league}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {team.ageGroup}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Manager</h4>
                        <p className="text-gray-600 text-sm">{team.manager}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Training</h4>
                        <p className="text-gray-600 text-sm">{team.trainingDays}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Home Ground</h4>
                        <p className="text-gray-600 text-sm">{team.homeGround}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Squad Size</h4>
                        <p className="text-gray-600 text-sm">{team.players} players</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Season</h4>
                        <p className="text-gray-600 text-sm">{team.season}</p>
                      </div>
                    </div>
                    
                    {team.achievements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">Program Focus</h4>
                        <div className="flex flex-wrap gap-2">
                          {team.achievements.map((achievement, idx) => (
                            <span
                              key={idx}
                              className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs border border-purple-200"
                            >
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Join Youth Program */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-green-50 rounded-lg border border-green-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="text-lg font-semibold text-green-900">Join Our Youth Program</h3>
              </div>
              <p className="text-green-700 text-sm leading-relaxed mb-4">
                We welcome new players throughout the season. Registration is currently open for all age groups.
              </p>
              <div className="space-y-2">
                <Link href="/join/youth" className="block bg-green-600 text-white text-center py-2 px-4 rounded text-sm font-medium hover:bg-green-700 transition-colors">
                  Register Now
                </Link>
                <Link href="/join/trials" className="block bg-white text-green-600 text-center py-2 px-4 rounded border border-green-600 text-sm font-medium hover:bg-green-50 transition-colors">
                  Trial Information
                </Link>
              </div>
            </motion.div>

            {/* Training Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Schedule</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">U18 Rangers</span>
                  <span className="text-gray-600">Tue/Thu 7-8:30pm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">U16 Rangers</span>
                  <span className="text-gray-600">Mon/Wed 6:30-8pm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">U14 Rangers</span>
                  <span className="text-gray-600">Tue/Thu 6-7:30pm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">U12 Rangers</span>
                  <span className="text-gray-600">Sat 10-11:30am</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">U10 Rangers</span>
                  <span className="text-gray-600">Sat 9-10am</span>
                </div>
              </div>
            </motion.div>

            {/* Development Philosophy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-blue-50 rounded-lg border border-blue-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-900">Our Approach</h3>
              </div>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-200 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg className="w-2 h-2 text-blue-600" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                  <span>Player-centered development focusing on individual growth</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-200 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg className="w-2 h-2 text-blue-600" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                  <span>Equal playing time philosophy for U12 and below</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-200 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg className="w-2 h-2 text-blue-600" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                  <span>Emphasis on technical skills and football intelligence</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-200 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg className="w-2 h-2 text-blue-600" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                  <span>Character development alongside football skills</span>
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
                <Link href="/teams/senior" className="block text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  → Senior Teams
                </Link>
                <Link href="/teams/coaching" className="block text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  → Coaching Staff
                </Link>
                <Link href="/join/youth" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Join Youth Program
                </Link>
                <Link href="/join/academy" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Youth Academy
                </Link>
                <Link href="/match-central/fixtures" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Fixtures & Results
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </StandardLayout>
  );
}