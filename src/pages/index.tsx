import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import Layout from "@/components/Layout";

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [matchOfTheDay] = useState({
    homeTeam: "Rangers U16",
    awayTeam: "Celtic Academy",
    time: "14:00",
    venue: "Rivervalley Park",
    status: "LIVE"
  });

  // Interactive sections for the main experience
  const sections = [
    {
      id: 'matches',
      title: '⚽ Match Central',
      subtitle: 'Live scores, fixtures & results',
      color: 'from-green-600 to-emerald-700',
      icon: '⚽'
    },
    {
      id: 'teams',
      title: '👕 Our Teams',
      subtitle: 'From U6s to Seniors - find your squad',
      color: 'from-blue-600 to-cyan-700',
      icon: '👕'
    },
    {
      id: 'stats',
      title: '📊 Player Stats',
      subtitle: 'Track progress & achievements',
      color: 'from-purple-600 to-violet-700',
      icon: '📊'
    },
    {
      id: 'community',
      title: '🏆 Community',
      subtitle: 'Events, news & club life',
      color: 'from-red-600 to-rose-700',
      icon: '🏆'
    }
  ];

  return (
    <Layout currentSection="home">
      {/* Interactive Hero - Stadium Style */}
      <div className="relative min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 bg-[url('/images/footer_grass.png')] bg-repeat"
          ></motion.div>
        </div>

        {/* Stadium Lights Effect */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-yellow-200/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/50 to-transparent"></div>

        <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col">
          
          {/* Live Match Banner */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-8 mb-8"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-4 shadow-2xl max-w-md mx-auto">
              <div className="flex items-center justify-between text-white">
                <div className="text-center">
                  <p className="font-bold text-lg">{matchOfTheDay.homeTeam}</p>
                  <p className="text-sm opacity-90">2</p>
                </div>
                <div className="text-center px-4">
                  <div className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    {matchOfTheDay.status}
                  </div>
                  <p className="text-xs mt-1">{matchOfTheDay.time}</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{matchOfTheDay.awayTeam}</p>
                  <p className="text-sm opacity-90">1</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Logo & Title */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center mb-12"
          >
            <div className="relative inline-block">
              <Image 
                src="/images/logo.png" 
                alt="Rivervalley Rangers AFC Logo" 
                width={150}
                height={150}
                className="mx-auto drop-shadow-2xl filter brightness-110"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-xs font-bold">LIVE</span>
              </div>
            </div>
            
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
            >
              Rivervalley <span className="text-yellow-400">Rangers</span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg md:text-xl text-green-100 mb-8"
            >
              Your Digital Matchday Experience
            </motion.p>
          </motion.div>

          {/* Interactive Cards Grid */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
          >
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setActiveSection(index)}
                className="perspective-1000"
              >
                <Link href={`/${section.id}`}>
                  <div className={`
                    bg-gradient-to-br ${section.color} 
                    rounded-2xl p-6 h-32 lg:h-40 
                    text-white shadow-2xl 
                    cursor-pointer transform-gpu
                    border border-white/20
                    relative overflow-hidden
                    group
                  `}>
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="text-3xl lg:text-4xl mb-2 group-hover:animate-bounce">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm lg:text-base mb-1">
                          {section.title}
                        </h3>
                        <p className="text-xs opacity-90 leading-tight">
                          {section.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Stats Bar */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 bg-black/30 backdrop-blur-sm rounded-2xl p-4 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-4 gap-4 text-center text-white">
              <div>
                <p className="text-2xl font-bold text-yellow-400">15</p>
                <p className="text-xs opacity-80">Teams</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">247</p>
                <p className="text-xs opacity-80">Players</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">12</p>
                <p className="text-xs opacity-80">Matches This Week</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">89%</p>
                <p className="text-xs opacity-80">Win Rate</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-8 mb-8 text-center space-y-4"
          >
            <div className="space-x-4">
              <Link
                href="/join"
                className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                🚀 Join the Action
              </Link>
              
              <Link
                href="/app"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                📱 Open Matchday App
              </Link>
            </div>
            
            {/* Coach/Parent Access */}
            <div className="flex justify-center space-x-6 text-sm">
              <Link 
                href="/coach/login"
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span>👨‍🏫</span>
                <span>Coach Access</span>
              </Link>
              <Link 
                href="/app/login"
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span>👨‍👩‍👧‍👦</span>
                <span>Parent Portal</span>
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="w-4 h-4 bg-yellow-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-20 animate-pulse delay-1000">
          <div className="w-6 h-6 bg-white rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-pulse delay-2000">
          <div className="w-3 h-3 bg-green-400 rounded-full opacity-50"></div>
        </div>
      </div>
    </Layout>
  );
}