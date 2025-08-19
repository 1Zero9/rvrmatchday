import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);

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
      color: 'from-red-600 to-rose-700',
      icon: '👤',
      description: 'Access your personalized area'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-emerald-800 to-teal-900 relative overflow-hidden">
      {/* Clean Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl translate-x-40"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl translate-y-36"></div>
        
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
          <div className="flex items-center space-x-3">
            <Image 
              src="/images/logo.png" 
              alt="Rivervalley Rangers AFC Logo" 
              width={40}
              height={40}
              className="drop-shadow-lg"
            />
            <div className="text-white">
              <h1 className="text-lg font-bold">Rivervalley Rangers</h1>
              <p className="text-sm text-green-200">AFC</p>
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Rivervalley Rangers
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                Building Community Through Football • Your Digital Matchday Experience
              </p>
            </motion.div>

            {/* Interactive Cards Grid */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
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
                  <p className="text-3xl font-bold text-yellow-400 mb-1">15+</p>
                  <p className="text-sm text-green-200">Active Teams</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400 mb-1">250+</p>
                  <p className="text-sm text-green-200">Club Members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400 mb-1">25</p>
                  <p className="text-sm text-green-200">Years History</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-400 mb-1">100%</p>
                  <p className="text-sm text-green-200">Community</p>
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

      </div>
    </div>
  );
}