import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../../components/StandardLayout';

export default function GirlsTeams() {
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

  return (
    <StandardLayout title="Girls Teams">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/teams/youth" className="hover:text-pink-600 transition-colors">
              Teams
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Girls Teams</span>
          </div>
        </nav>

        {/* Teams Section Navigation */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Teams</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/teams/boys" className="group">
                <div className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 border-l-4 border-gray-300 hover:border-blue-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-700 flex items-center">
                    <span className="text-xl mr-2">⚽</span>
                    Boys Teams
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-blue-600">Traditional football development</p>
                </div>
              </Link>
              
              <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-500">
                <h3 className="font-medium text-pink-900 mb-2 flex items-center">
                  <span className="text-xl mr-2">🌟</span>
                  Girls Teams
                </h3>
                <p className="text-sm text-pink-700">Our fastest growing section</p>
              </div>
              
              <Link href="/teams/youth#inclusive" className="group">
                <div className="bg-gray-50 hover:bg-purple-50 rounded-lg p-4 border-l-4 border-gray-300 hover:border-purple-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-purple-700 flex items-center">
                    <span className="text-xl mr-2">🤝</span>
                    Football for All
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-purple-600">Inclusive programs</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🌟</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Girls Teams</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our newest and fastest growing section - empowering girls through football with skill development and confidence building
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="text-center text-white z-10">
                <div className="text-8xl mb-4">🌟</div>
                <h2 className="text-3xl font-bold mb-2">Girls Football</h2>
                <p className="text-xl">Empowering the Next Generation</p>
              </div>
            </motion.div>

            {/* New Section Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 border-l-4 border-pink-500"
            >
              <h3 className="text-xl font-bold text-pink-900 mb-3 flex items-center">
                <span className="text-2xl mr-3">🚀</span>
                Exciting New Section!
              </h3>
              <p className="text-pink-800 mb-3">
                Launched in 2023, our Girls section is experiencing incredible growth! We're building a supportive 
                environment where girls can develop their football skills, make lasting friendships, and gain confidence.
              </p>
              <div className="bg-pink-200 rounded-lg p-3">
                <p className="text-pink-900 text-sm font-medium text-center">
                  "Every girl deserves the chance to fall in love with football" - Club Philosophy
                </p>
              </div>
            </motion.div>

            {/* Teams Grid */}
            <div className="space-y-6">
              {girlsTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Team Image Placeholder */}
                    <div className="lg:w-1/3">
                      <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg h-48 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-4xl mb-2">📸</div>
                          <p className="text-sm">Team Photo</p>
                          <p className="text-xs opacity-75">{team.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Team Details */}
                    <div className="lg:w-2/3">
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
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Join Girls Teams */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-pink-50 rounded-lg border border-pink-200 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">🌟</div>
                <h3 className="text-lg font-semibold text-pink-900">Join Girls Teams</h3>
              </div>
              <p className="text-pink-700 text-sm mb-4 leading-relaxed">
                New players always welcome! We focus on fun, friendship, and skill development in a supportive environment.
              </p>
              <Link href="/join/trials" className="block w-full bg-pink-600 text-white text-center py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold">
                Join Girls Section
              </Link>
            </motion.div>

            {/* Training Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Girls Training Schedule</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tuesday:</span>
                  <span className="font-medium text-gray-900">U14 (6:00-7:30pm)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wednesday:</span>
                  <span className="font-medium text-gray-900">U16 (6:30-8:00pm)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thursday:</span>
                  <span className="font-medium text-gray-900">U14 (6:00-7:30pm)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Friday:</span>
                  <span className="font-medium text-gray-900">U16 (6:30-8:00pm)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-medium text-gray-900">U12 (11:30am-1:00pm)</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Coach */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Girls Coordinator</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">Lisa Murphy</p>
                <p className="text-gray-600">Girls Section Coordinator</p>
                <p className="text-pink-600">lisa@rvrfc.com</p>
                <p className="text-gray-500">+353 87 123 4568</p>
              </div>
            </motion.div>

            {/* Growth Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-purple-50 rounded-lg border border-purple-200 p-6"
            >
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Amazing Growth!</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xl font-bold text-purple-600">42</div>
                  <div className="text-xs text-gray-600">Girls Registered</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xl font-bold text-pink-600">3</div>
                  <div className="text-xs text-gray-600">Teams Formed</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xl font-bold text-green-600">150%</div>
                  <div className="text-xs text-gray-600">Growth in 2024</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xl font-bold text-blue-600">5</div>
                  <div className="text-xs text-gray-600">Female Coaches</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </StandardLayout>
  );
}