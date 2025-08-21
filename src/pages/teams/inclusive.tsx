import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../../components/StandardLayout';
import Breadcrumb from '../../components/Breadcrumb';

export default function InclusiveTeams() {
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
      achievements: ['Participation & Joy in Football', 'Building Confidence Through Sport']
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
      achievements: ['Building Confidence Through Sport', 'Community Integration Award']
    },
    {
      id: 'adult-inclusive',
      name: 'Adult Inclusive Football',
      league: 'Community Inclusion League',
      ageGroup: 'Adult (18+ Special Needs)',
      manager: 'Michael Byrne & Support Team',
      trainingDays: 'Sunday 1:00-2:30pm',
      homeGround: 'Main Pitch',
      season: '2024/25',
      players: 12,
      achievements: ['Social Integration Excellence', 'Mental Health Awareness Champions']
    }
  ];

  return (
    <StandardLayout title="Football for All">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Breadcrumb items={[
          { label: "Teams", href: "/teams/youth" },
          { label: "Football for All" }
        ]} />

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
              
              <Link href="/teams/girls" className="group">
                <div className="bg-gray-50 hover:bg-pink-50 rounded-lg p-4 border-l-4 border-gray-300 hover:border-pink-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-pink-700 flex items-center">
                    <span className="text-xl mr-2">🌟</span>
                    Girls Teams
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-pink-600">Our fastest growing section</p>
                </div>
              </Link>
              
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-medium text-purple-900 mb-2 flex items-center">
                  <span className="text-xl mr-2">🤝</span>
                  Football for All
                </h3>
                <p className="text-sm text-purple-700">Inclusive programs for everyone</p>
              </div>
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
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Football for All</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Inclusive football programs where everyone belongs - building confidence, friendships, and joy through the beautiful game
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
              className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="text-center text-white z-10">
                <div className="text-8xl mb-4">🤝</div>
                <h2 className="text-3xl font-bold mb-2">Football for All</h2>
                <p className="text-xl">Where Everyone Belongs</p>
              </div>
            </motion.div>

            {/* Mission Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 border-l-4 border-purple-500"
            >
              <h3 className="text-xl font-bold text-purple-900 mb-3 flex items-center">
                <span className="text-2xl mr-3">💙</span>
                Our Inclusive Mission
              </h3>
              <p className="text-purple-800 mb-3">
                At Rivervalley Rangers, we believe football is for everyone. Our Football for All program provides a 
                safe, supportive environment where players with special needs can experience the joy of football, 
                build confidence, and make lasting friendships.
              </p>
              <div className="bg-purple-200 rounded-lg p-3">
                <p className="text-purple-900 text-sm font-medium text-center">
                  "Football is a universal language that brings people together" - Our Philosophy
                </p>
              </div>
            </motion.div>

            {/* Teams Grid */}
            <div className="space-y-6">
              {inclusiveTeams.map((team, index) => (
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
                      <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg h-48 flex items-center justify-center">
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
                          <p className="text-purple-600 font-medium">{team.league}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
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
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">Participants</h4>
                          <p className="text-gray-600 text-sm">{team.players} players</p>
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Join Program */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-purple-50 rounded-lg border border-purple-200 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">🤝</div>
                <h3 className="text-lg font-semibold text-purple-900">Join Our Program</h3>
              </div>
              <p className="text-purple-700 text-sm mb-4 leading-relaxed">
                All abilities welcome! Our trained coaches provide personalized support in a fun, inclusive environment.
              </p>
              <Link href="/join/inclusive" className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                Get Involved
              </Link>
            </motion.div>

            {/* Training Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inclusive Training Schedule</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-medium text-gray-900">U16 (2:00-3:30pm)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-medium text-gray-900">U12 (3:30-5:00pm)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="font-medium text-gray-900">Adult (1:00-2:30pm)</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700">
                  <span className="font-semibold">Special Note:</span> All sessions include qualified support staff and adapted equipment
                </p>
              </div>
            </motion.div>

            {/* Contact Coordinator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Coordinator</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">Tom Bradley</p>
                <p className="text-gray-600">Inclusive Football Coordinator</p>
                <p className="text-purple-600">tom@rvrfc.com</p>
                <p className="text-gray-500">+353 87 123 4569</p>
                <div className="mt-3 p-2 bg-green-50 rounded border-l-2 border-green-400">
                  <p className="text-xs text-green-700">
                    Qualified in Special Needs Coaching & First Aid
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Support Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-indigo-50 rounded-lg border border-indigo-200 p-6"
            >
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">Program Impact</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xl font-bold text-indigo-600">30</div>
                  <div className="text-xs text-gray-600">Participants</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xl font-bold text-purple-600">6</div>
                  <div className="text-xs text-gray-600">Support Staff</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xl font-bold text-green-600">100%</div>
                  <div className="text-xs text-gray-600">Smiles</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xl font-bold text-orange-600">3</div>
                  <div className="text-xs text-gray-600">Programs</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </StandardLayout>
  );
}