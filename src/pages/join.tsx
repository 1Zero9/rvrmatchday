import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Join() {
  // Interactive join boxes
  const joinBoxes = [
    {
      id: 'youth',
      title: '⚽ Youth Players',
      subtitle: 'Ages 6-17 • €120/season',
      color: 'from-blue-600 to-cyan-700',
      icon: '⚽',
      description: 'All skill levels welcome • Training & matches included'
    },
    {
      id: 'senior',
      title: '🏆 Senior Players', 
      subtitle: '18+ • €200/season',
      color: 'from-green-600 to-emerald-700',
      icon: '🏆',
      description: 'Competitive league football • All fees included'
    },
    {
      id: 'family',
      title: '👥 Family Package',
      subtitle: '2+ children • €180/season',
      color: 'from-purple-600 to-violet-700',
      icon: '👥',
      description: 'Save €60+ per child • Same family discount'
    },
    {
      id: 'coach',
      title: '👨‍🏫 Want to Coach?',
      subtitle: 'Join our coaching team',
      color: 'from-amber-600 to-orange-700',
      icon: '👨‍🏫',
      description: 'Help develop the next generation'
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
              <h1 className="text-xl font-bold">Join Us</h1>
              <p className="text-sm text-blue-200">Registration & membership</p>
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
                  Join Our Family
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Start Your Football Journey • All Ages & Skill Levels Welcome
              </p>
            </motion.div>

            {/* Join Options Boxes Grid */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {joinBoxes.map((box, index) => (
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
                  <div 
                    className={`
                      bg-gradient-to-br ${box.color} 
                      rounded-3xl p-8 h-64
                      text-white shadow-2xl 
                      cursor-pointer 
                      border border-white/10
                      backdrop-blur-sm
                      relative overflow-hidden
                      transition-all duration-300
                      hover:shadow-3xl hover:border-white/30
                    `}
                    onClick={() => {
                      if (box.id === 'coach') {
                        window.location.href = '/coach/register';
                      }
                    }}
                  >
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

            {/* What's Included - Clean Cards */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="grid md:grid-cols-2 gap-8 mb-8"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-3">✨</span>
                  What's Included
                </h3>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3 text-lg">✓</span>
                    Weekly training sessions
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3 text-lg">✓</span>
                    League match participation
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3 text-lg">✓</span>
                    Qualified coaching staff
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3 text-lg">✓</span>
                    Club social events
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3 text-lg">✓</span>
                    Player development tracking
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3 text-lg">✓</span>
                    Access to club facilities
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-3">🚀</span>
                  Next Steps
                </h3>
                <ol className="space-y-4 text-blue-100">
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">1</span>
                    <span>Complete registration process</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">2</span>
                    <span>Attend welcome session & trial</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">3</span>
                    <span>Complete medical & contact forms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">4</span>
                    <span>Start training with your team!</span>
                  </li>
                </ol>
              </div>
            </motion.div>

            {/* Quick Contact - Elegant */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Questions?</h3>
              <p className="text-blue-100 mb-6">
                Our friendly team is here to help with any questions about joining the club.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/contact" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Contact Us
                </Link>
                <span className="text-white/40">•</span>
                <a href="mailto:info@rvrfc.com" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  info@rvrfc.com
                </a>
                <span className="text-white/40">•</span>
                <a href="tel:+353123456789" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  +353 123 456 789
                </a>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}