import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show logo for 2.5 seconds, then transition to main content
    const timer = setTimeout(() => {
      setShowLogo(false);
      setShowContent(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Interactive sections for the main experience
  const sections = [
    {
      id: 'dashboard',
      title: '⚽ Match Central',
      subtitle: 'Live matches, fixtures & results dashboard',
      color: 'from-green-600 to-emerald-700',
      icon: '⚽',
      description: 'Your complete matchday experience'
    },
    {
      id: 'about',
      title: '🏆 Our Club',
      subtitle: 'History, teams & community',
      color: 'from-blue-600 to-cyan-700',
      icon: '🏆',
      description: 'Learn about Rivervalley Rangers'
    },
    {
      id: 'join',
      title: '🚀 Join Us',
      subtitle: 'Registration & membership',
      color: 'from-purple-600 to-violet-700',
      icon: '🚀',
      description: 'Start your football journey'
    },
    {
      id: 'login',
      title: '👤 Member Area',
      subtitle: 'Players, parents & coaches',
      color: 'from-slate-600 to-slate-700',
      icon: '👤',
      description: 'Access your personalized area'
    },
    {
      id: 'news',
      title: '📰 News & Updates',
      subtitle: 'Latest club news & announcements',
      color: 'from-amber-600 to-orange-700',
      icon: '📰',
      description: 'Stay informed with club updates'
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

      <AnimatePresence mode="wait">
        {showLogo ? (
          /* Logo Entrance Sequence */
          <motion.div
            key="logo-entrance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.8, exit: { duration: 0.6 } }}
            className="relative z-10 min-h-screen flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="mb-8"
              >
                <Image 
                  src="/images/logo.png" 
                  alt="Rivervalley Rangers AFC Logo" 
                  width={300}
                  height={300}
                  className="mx-auto drop-shadow-2xl filter brightness-110"
                />
              </motion.div>
              
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider">
                  RIVERVALLEY RANGERS
                </h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "200px" }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-4"
                ></motion.div>
                <p className="text-xl text-blue-200 font-light">
                  AFC
                </p>
              </motion.div>

              {/* Subtle loading indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  ></motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-indigo-400 rounded-full"
                  ></motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          /* Main Content */
          <motion.div
            key="main-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 min-h-screen flex flex-col"
          >
        
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
              <h1 className="text-xl font-bold">Rivervalley Rangers</h1>
              <p className="text-sm text-blue-200">AFC</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex space-x-4 text-sm">
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/admin/login" className="text-white/60 hover:text-white transition-colors" title="Admin Access">
              🔒
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
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Welcome to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Rivervalley Rangers
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Building Community Through Football • Your Digital Matchday Experience
              </p>
            </motion.div>

            {/* Interactive Cards Grid */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16"
            >
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setActiveSection(index)}
                  className="group"
                >
                  <Link href={`/${section.id}`}>
                    <div className={`
                      bg-gradient-to-br ${section.color} 
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
                            {section.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {section.title}
                          </h3>
                          <p className="text-sm opacity-90 mb-4">
                            {section.subtitle}
                          </p>
                        </div>
                        <div className="text-xs opacity-70">
                          {section.description}
                        </div>
                      </div>
                      
                      {/* Hover Arrow */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Stats - Clean & Minimal */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                <div>
                  <p className="text-3xl font-bold text-blue-400 mb-1">15+</p>
                  <p className="text-sm text-blue-200">Active Teams</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-400 mb-1">250+</p>
                  <p className="text-sm text-blue-200">Club Members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-400 mb-1">25</p>
                  <p className="text-sm text-blue-200">Years History</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400 mb-1">100%</p>
                  <p className="text-sm text-blue-200">Community</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom - Social Links */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="p-6 text-center"
        >
          <div className="flex justify-center space-x-6 text-white/60">
            <a href="#" className="hover:text-white transition-colors">
              <span className="text-xl">📘</span> Facebook
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="text-xl">📸</span> Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="text-xl">📧</span> Email
            </a>
          </div>
          <p className="text-white/40 text-xs mt-4">
            © 2024 Rivervalley Rangers AFC • Building Community Through Football
          </p>
        </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}