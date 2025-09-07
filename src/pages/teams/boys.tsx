import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../../components/StandardLayout';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard } from '../../components/Glass';

export default function BoysTeams() {
  const boysTeams = [
    {
      id: 'u18-boys',
      name: 'U18 Boys',
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
      name: 'U16 Boys',
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
      name: 'U14 Boys',
      league: 'Regional Youth Development League',
      ageGroup: 'Under 14',
      manager: "Mark O'Connor",
      trainingDays: 'Tuesday & Thursday 6:00-7:30pm',
      homeGround: 'Youth Pitch 2',
      season: '2024/25',
      players: 20,
      achievements: ['Development League Winners 2023']
    },
    {
      id: 'u12-boys',
      name: 'U12 Boys',
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
      name: 'U10 Boys',
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

  const quickActions = [
    {
      icon: "⚽",
      title: "Join a Team",
      description: "Register for trials",
      href: "/join/youth",
      gradient: "blue" as const
    },
    {
      icon: "📅",
      title: "Training Times",
      description: "When we train",
      href: "#training",
      gradient: "green" as const
    },
    {
      icon: "🏆",
      title: "Our Achievements",
      description: "Recent successes",
      href: "#achievements",
      gradient: "purple" as const
    },
    {
      icon: "👨",
      title: "Meet the Coaches",
      description: "Our coaching team",
      href: "#coaches",
      gradient: "orange" as const
    }
  ];

  return (
    <div>
      {/* Mobile Version */}
      <div className="block md:hidden">
        <StandardLayout>
          {/* Mobile Header */}
          <div className="p-6 shadow-lg text-white" style={{background: 'linear-gradient(to right, #972A4C, #7A2240)'}}>
            <div className="text-center">
              <h1 className="font-bold text-2xl text-white mb-1">Boys Teams</h1>
              <p className="text-pink-200">From U8 to U18 - developing young talent</p>
            </div>
          </div>

          {/* Mobile Team Cards */}
          <div className="p-4 bg-gray-50">
            <h2 className="font-bold text-lg text-gray-900 mb-4 text-center">Our Teams</h2>
            <div className="space-y-4">
              {boysTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="mb-3">
                    <h3 className="font-bold text-lg" style={{color: '#972A4C'}}>{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.league}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
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
                      <p className="text-gray-900">{team.trainingDays}</p>
                    </div>
                  </div>

                  {team.achievements && team.achievements.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="font-medium text-gray-700 text-sm">Recent Achievements:</span>
                      <div className="mt-1">
                        {team.achievements.map((achievement, idx) => (
                          <span key={idx} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mt-1">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Join CTA */}
            <div className="mt-8 text-center">
              <Link 
                href="/join/trials"
                className="inline-block text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{background: 'linear-gradient(to right, #972A4C, #7A2240)'}}
              >
                Join Our Boys Teams
              </Link>
            </div>
          </div>
        </StandardLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <GlassPageTemplate
          heroTitle="Boys Teams"
          heroSubtitle="From U8 to U18 - developing young talent with fun, friendship and football"
          heroIcon="⚽"
          backgroundImage="/images/boys-teams-hero.jpg"
          quickActions={quickActions}
          sectionName="BOYS TEAMS"
          imageSpecs="Boys football teams and training activities"
    >
      {/* Teams Section Navigation */}
      <div className="mb-12">
        <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Teams</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                <span className="text-xl mr-2">⚽</span>
                Boys Teams
              </h3>
              <p className="text-sm text-blue-700">Traditional football development</p>
            </div>
            
            <Link href="/teams/girls" className="group">
              <div className="bg-gray-50 hover:bg-pink-50 rounded-lg p-4 border-l-4 border-gray-300 hover:border-pink-500 transition-all duration-200">
                <h3 className="font-medium text-gray-900 mb-2 group-hover:text-pink-700 flex items-center">
                  <span className="text-xl mr-2">🌟</span>
                  Girls Teams
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-pink-600">Our fastest growing section</p>
              </div>
            </Link>
            
            <Link href="/teams/inclusive" className="group">
              <div className="bg-gray-50 hover:bg-purple-50 rounded-lg p-4 border-l-4 border-gray-300 hover:border-purple-500 transition-all duration-200">
                <h3 className="font-medium text-gray-900 mb-2 group-hover:text-purple-700 flex items-center">
                  <span className="text-xl mr-2">🤝</span>
                  Football for All
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-purple-600">Inclusive programs</p>
              </div>
            </Link>
          </div>
        </GlassCard>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-6">⚽</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Boys Teams</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Traditional football development across all age groups, building skills, character, and friendships
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
            className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="text-center text-white z-10">
              <div className="text-8xl mb-4">⚽</div>
              <h2 className="text-3xl font-bold mb-2">Boys Football</h2>
              <p className="text-xl">Building Champions Since 1981</p>
            </div>
          </motion.div>

          {/* Teams Grid */}
          <div className="space-y-6">
            {boysTeams.map((team, index) => (
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
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg h-48 flex items-center justify-center">
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
                        <p className="text-blue-600 font-medium">{team.league}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
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
                              className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs border border-green-200"
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
          {/* Join Boys Teams */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-blue-50 rounded-lg border border-blue-200 p-6"
          >
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">⚽</div>
              <h3 className="text-lg font-semibold text-blue-900">Join Boys Teams</h3>
            </div>
            <p className="text-blue-700 text-sm mb-4 leading-relaxed">
              Open trials held throughout the season. All skill levels welcome - we focus on development and fun!
            </p>
            <Link href="/join/trials" className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Join Trials
            </Link>
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
              <div className="flex justify-between">
                <span className="text-gray-600">Monday:</span>
                <span className="font-medium text-gray-900">U16 (6:30-8:00pm)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tuesday:</span>
                <span className="font-medium text-gray-900">U18, U14 (6:00-8:30pm)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thursday:</span>
                <span className="font-medium text-gray-900">U18, U14 (6:00-8:30pm)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday:</span>
                <span className="font-medium text-gray-900">U12, U10 (9:00-11:30am)</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Head Coach</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">David Thompson</p>
              <p className="text-gray-600">Head of Boys Development</p>
              <p className="text-blue-600">david@rvrfc.com</p>
              <p className="text-gray-500">+353 87 123 4567</p>
            </div>
          </motion.div>
        </div>
      </div>
    </GlassPageTemplate>
      </div>
    </div>
  );
}