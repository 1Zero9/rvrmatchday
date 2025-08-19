import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  // Interactive content boxes for About page
  const aboutBoxes = [
    {
      id: 'history',
      title: '📜 Our Story',
      subtitle: 'Since 2009',
      color: 'from-blue-600 to-cyan-700',
      icon: '📜',
      description: 'Learn about our journey and heritage'
    },
    {
      id: 'values',
      title: '🤝 Our Values', 
      subtitle: 'Community • Development • Excellence',
      color: 'from-green-600 to-emerald-700',
      icon: '🤝',
      description: 'The principles that guide us'
    },
    {
      id: 'facilities',
      title: '🏟️ Our Facilities',
      subtitle: 'Training grounds & clubhouse',
      color: 'from-purple-600 to-violet-700',
      icon: '🏟️',
      description: 'Where the magic happens'
    },
    {
      id: 'coaches',
      title: '👨‍🏫 Our Team',
      subtitle: '25+ qualified coaches',
      color: 'from-amber-600 to-orange-700',
      icon: '👨‍🏫',
      description: 'Meet the people behind our success'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Clean Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl translate-x-40"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl translate-y-36"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
               backgroundSize: '30px 30px'
             }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Top Navigation - Minimal */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center p-6"
        >
          <div className="flex items-center space-x-4">
            <Image 
              src="/images/logo.png" 
              alt="Rivervalley Rangers AFC Logo" 
              width={75}
              height={75}
              className="drop-shadow-lg"
            />
            <div className="text-white">
              <h1 className="text-xl font-bold">Our Club</h1>
              <p className="text-sm text-blue-200">History, teams & community</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex space-x-4 text-sm">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              ← Home
            </Link>
          </div>
        </motion.div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl w-full">
            
            {/* Hero Title */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Rivervalley Rangers
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Building Community Through Football Since 2009 • More Than Just a Club
              </p>
            </motion.div>

            {/* About Boxes Grid */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {aboutBoxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <div className={`
                    bg-gradient-to-br ${box.color} 
                    rounded-3xl p-8 h-64
                    text-white shadow-2xl 
                    cursor-pointer 
                    border border-white/10
                    backdrop-blur-sm
                    relative overflow-hidden
                    transition-all duration-300
                    hover:shadow-3xl hover:border-white/30
                  `}>
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {box.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {box.title}
                        </h3>
                        <p className="text-sm opacity-90 mb-4">
                          {box.subtitle}
                        </p>
                      </div>
                      <div className="text-xs opacity-70">
                        {box.description}
                      </div>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Club Stats - Clean & Minimal */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8"
            >
              <h3 className="text-2xl font-bold text-white text-center mb-8">By the Numbers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                <div>
                  <p className="text-3xl font-bold text-blue-400 mb-1">250+</p>
                  <p className="text-sm text-blue-200">Active Players</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-400 mb-1">15</p>
                  <p className="text-sm text-blue-200">Teams</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400 mb-1">25+</p>
                  <p className="text-sm text-blue-200">Qualified Coaches</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400 mb-1">15</p>
                  <p className="text-sm text-blue-200">Years Excellence</p>
                </div>
              </div>
            </motion.div>

            {/* Core Values - Elegant Cards */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-white mb-3">Community</h3>
                <p className="text-blue-100 text-sm">
                  Football brings people together. We build strong community bonds and mutual support.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-3">Development</h3>
                <p className="text-blue-100 text-sm">
                  Every player's journey is unique. We focus on individual growth and achievement.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-3">Excellence</h3>
                <p className="text-blue-100 text-sm">
                  We strive for excellence in training quality, community engagement, and player care.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}
