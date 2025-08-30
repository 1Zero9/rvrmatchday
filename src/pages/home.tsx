import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";

export default function StandardHomepage() {
  return (
    <div className="min-h-screen">
      {/* Mobile-Only Design */}
      <div className="block md:hidden">
        {/* Mobile Header - Simplified */}
        <div className="bg-club-primary text-white p-3">
          <div className="flex items-center justify-center">
            <Image 
              src="/images/logo.png" 
              alt="Rivervalley Rangers AFC Logo" 
              width={40}
              height={40}
              className="mr-3"
            />
            <div>
              <h1 className="font-bold text-lg">Rivervalley Rangers</h1>
              <p className="text-xs text-green-200">AFC • Est. 1981</p>
            </div>
          </div>
        </div>

        {/* Mobile Hero - Compact */}
        <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/images/hero/halftime2.jpg" 
              alt="Rivervalley Rangers AFC"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-3xl font-bold mb-3 text-shadow-lg"
              >
                Building Community
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-lg font-medium text-green-200 mb-4"
              >
                Through Football Since 1981
              </motion.p>
              
              {/* Floating Action Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link href="/join/trials" className="bg-white/20 backdrop-blur-lg border-2 border-white/40 text-white font-bold py-3 px-6 rounded-full text-sm shadow-2xl hover:bg-white/30 transition-all duration-300">
                  ⚽ Join Rangers
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Mobile Quick Actions - Glass Cards */}
        <section className="p-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/25 backdrop-blur-lg border border-white/40 rounded-xl p-3 text-center shadow-xl bg-gradient-to-br from-club-primary/90 to-club-secondary/90 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-2xl mb-2 text-white">📅</div>
              <h3 className="text-sm font-bold mb-1 text-white">Fixtures</h3>
              <Link href="/match-central" className="text-white text-xs font-semibold underline">
                View →
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05, rotateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/25 backdrop-blur-lg border border-white/40 rounded-xl p-3 text-center shadow-xl bg-gradient-to-br from-purple-600/90 to-purple-700/90 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-2xl mb-2 text-white">🏆</div>
              <h3 className="text-sm font-bold mb-1 text-white">Results</h3>
              <Link href="/match-central" className="text-white text-xs font-semibold underline">
                View →
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/25 backdrop-blur-lg border border-white/40 rounded-xl p-3 text-center shadow-xl bg-gradient-to-br from-teal-600/90 to-teal-700/90 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-2xl mb-2 text-white">👥</div>
              <h3 className="text-sm font-bold mb-1 text-white">Teams</h3>
              <Link href="/teams" className="text-white text-xs font-semibold underline">
                View →
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              whileHover={{ scale: 1.05, rotateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/25 backdrop-blur-lg border border-white/40 rounded-xl p-3 text-center shadow-xl bg-gradient-to-br from-orange-600/90 to-orange-700/90 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-2xl mb-2 text-white">📞</div>
              <h3 className="text-sm font-bold mb-1 text-white">Contact</h3>
              <Link href="/contact" className="text-white text-xs font-semibold underline">
                View →
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/25 backdrop-blur-lg border border-white/40 rounded-xl p-3 text-center shadow-xl bg-gradient-to-br from-red-600/90 to-red-700/90 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-2xl mb-2 text-white">📰</div>
              <h3 className="text-sm font-bold mb-1 text-white">News</h3>
              <Link href="/news" className="text-white text-xs font-semibold underline">
                View →
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              whileHover={{ scale: 1.05, rotateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/25 backdrop-blur-lg border border-white/40 rounded-xl p-3 text-center shadow-xl bg-gradient-to-br from-indigo-600/90 to-indigo-700/90 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-2xl mb-2 text-white">🎉</div>
              <h3 className="text-sm font-bold mb-1 text-white">Events</h3>
              <Link href="/get-involved/events" className="text-white text-xs font-semibold underline">
                View →
              </Link>
            </motion.div>
          </motion.div>

          {/* Upcoming Events Section - Instagram Style */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="space-y-3"
          >
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
              className="text-lg font-bold text-gray-900 mb-4 flex items-center"
            >
              <span className="mr-2">📅</span>
              <span>What's Coming Up</span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 3 }}
                className="ml-2"
              >
                ✨
              </motion.span>
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 2.6 }}
              whileHover={{ scale: 1.02, rotateX: 2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl p-4 shadow-xl bg-gradient-to-br from-green-600/30 to-blue-600/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center mb-2">
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">MATCH DAY</span>
                <span className="text-gray-700 text-xs">This Saturday</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">U16 County Cup Final</h3>
              <p className="text-gray-700 text-xs mb-2">vs Milltown FC • 2pm • Aviva Stadium</p>
              <p className="text-club-primary text-xs font-semibold">Come support the lads! 🏆</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 2.8 }}
              whileHover={{ scale: 1.02, rotateX: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl p-4 shadow-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center mb-2">
                <motion.span 
                  animate={{ pulse: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold mr-2"
                >
                  FUNDRAISER
                </motion.span>
                <span className="text-gray-800 text-xs font-medium">Next Friday</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">Quiz Night</h3>
              <p className="text-gray-800 text-xs mb-2">Club House • 7:30pm • €10 per team</p>
              <p className="text-purple-700 text-xs font-semibold">Prizes & craic guaranteed! 🎯</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 3.0 }}
              whileHover={{ scale: 1.02, rotateX: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl p-4 shadow-xl bg-gradient-to-br from-orange-600/30 to-red-600/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center mb-2">
                <motion.span 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold mr-2"
                >
                  TRAINING
                </motion.span>
                <span className="text-gray-800 text-xs font-medium">Every Tuesday</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">Youth Development Programme</h3>
              <p className="text-gray-800 text-xs mb-2">Ages 8-16 • 6:00-7:30pm • New players welcome</p>
              <p className="text-orange-700 text-xs font-semibold">First session free! ⚽</p>
            </motion.div>

            {/* Add more Instagram-style events */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 3.2 }}
              whileHover={{ scale: 1.02, rotateX: 2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl p-4 shadow-xl bg-gradient-to-br from-blue-600/30 to-cyan-600/30 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center mb-2">
                <motion.span 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold mr-2"
                >
                  PROGRAMME
                </motion.span>
                <span className="text-gray-800 text-xs font-medium">Starting Soon</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">Summer Football Camp</h3>
              <p className="text-gray-800 text-xs mb-2">July 1-5 • Ages 6-14 • €50 for the week</p>
              <p className="text-blue-700 text-xs font-semibold">Early bird discount available! 🏕️</p>
            </motion.div>
          </motion.div>

          {/* Enhanced Footer - Glass Effect */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.4 }}
            className="mt-8"
          >
            <div className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl p-4 shadow-xl">
              <div className="flex justify-center space-x-6 mb-3">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/about" className="text-club-primary text-sm font-medium hover:text-club-secondary transition-colors">About</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/join" className="text-club-primary text-sm font-medium hover:text-club-secondary transition-colors">Join</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/volunteering" className="text-club-primary text-sm font-medium hover:text-club-secondary transition-colors">Volunteer</Link>
                </motion.div>
              </div>
              <motion.p 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-xs text-gray-600 text-center"
              >
                © 2025 Rivervalley Rangers AFC
              </motion.p>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Desktop Version - Unchanged */}
      <div className="hidden md:block">
        <StandardLayout>
      <main>
        
        {/* Hero Section - Authentic Community Feel */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          
          {/* 
          ===================================================================
          🎬 HERO IMAGE/VIDEO REPLACEMENT INSTRUCTIONS (NON-CODER FRIENDLY)
          ===================================================================
          
          TO ADD YOUR HERO IMAGE:
          1. Save your image as: /public/images/hero-main.jpg (or .png)
          2. Replace the section below with:
             <div className="absolute inset-0">
               <img 
                 src="/images/hero-main.jpg" 
                 alt="Rivervalley Rangers AFC - Team celebration"
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/40"></div>
             </div>
          
          TO ADD YOUR HERO VIDEO:
          1. Save your video as: /public/videos/hero-main.mp4
          2. Replace the section below with:
             <div className="absolute inset-0">
               <video 
                 autoPlay 
                 muted 
                 loop 
                 className="w-full h-full object-cover"
               >
                 <source src="/videos/hero-main.mp4" type="video/mp4" />
                 Your browser does not support the video tag.
               </video>
               <div className="absolute inset-0 bg-black/40"></div>
             </div>
          
          BEST HERO IMAGES/VIDEOS:
          - Team celebrating a win
          - Players in action during a match  
          - Community gathering or supporters
          - Training session with multiple age groups
          - Club facilities with people
          
          IMAGE SPECS: 1920x1080px minimum, landscape orientation
          VIDEO SPECS: MP4 format, under 10MB, 10-30 seconds max
          ===================================================================
          */}
          
          {/* CURRENT PLACEHOLDER - REPLACE THIS ENTIRE DIV WITH INSTRUCTIONS ABOVE */}
          <div className="absolute inset-0">
               <img 
                 src="/images/hero/halftime2.jpg" 
                 alt="Rivervalley Rangers AFC - Team celebration"
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/40"></div>
             </div>
          
          {/* Hero Content Overlay - Enhanced with Action Grid */}
          <div className="relative z-10 w-full px-4 max-w-7xl mx-auto">
            
            {/* Club Header - Back to Top */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">
                Rivervalley Rangers AFC
              </h1>
              <p className="text-xl md:text-2xl font-medium text-green-200">
                Building Community Through Football Since 1981
              </p>
            </motion.div>
            
            {/* Content with Logo on Left - Properly Centered */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12">
              
              {/* Logo Section - Left Side */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-shrink-0 text-center lg:text-left"
              >
                <div className="relative">
                  <Image 
                    src="/images/logo.png" 
                    alt="Rivervalley Rangers AFC Logo" 
                    width={160}
                    height={160}
                    className="drop-shadow-2xl hover:scale-105 transition-transform duration-300 mx-auto lg:mx-0"
                  />
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-xl -z-10"></div>
                </div>
              </motion.div>

              {/* Action Cards - Right Side */}
              <div className="flex-1 w-full max-w-4xl">

                {/* Main Action Grid - Larger Boxes */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto"
                >
              
                  {/* Row 1: Large Join Club + Medium Fixtures + Medium Results */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="col-span-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-xl p-6 text-center text-white hover:bg-white/25 transition-all duration-300 shadow-2xl"
                  >
                    <div className="text-4xl mb-3">⚽</div>
                    <h3 className="text-xl font-bold mb-2">Join Our Club</h3>
                    <p className="text-sm opacity-90 mb-4">Youth & Senior teams welcoming new players</p>
                    <Link href="/join/trials" className="inline-block bg-club-primary hover:bg-club-secondary text-white font-bold py-3 px-6 rounded-lg transition-all">
                      Register Now
                    </Link>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-club-secondary/20 backdrop-blur-md border border-club-accent/30 rounded-xl p-4 text-center text-white hover:bg-club-secondary/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="text-3xl mb-3">📅</div>
                    <h3 className="text-lg font-bold mb-2">Fixtures</h3>
                    <Link href="/match-central/fixtures" className="inline-block bg-club-accent hover:bg-club-primary text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      View Schedule
                    </Link>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-purple-600/20 backdrop-blur-md border border-purple-300/30 rounded-xl p-4 text-center text-white hover:bg-purple-600/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="text-3xl mb-3">🏆</div>
                    <h3 className="text-lg font-bold mb-2">Results</h3>
                    <Link href="/match-central/results" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      Latest Scores
                    </Link>
                  </motion.div>

                  {/* Row 2: Four Regular Boxes */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-orange-600/20 backdrop-blur-md border border-orange-300/30 rounded-xl p-4 text-center text-white hover:bg-orange-600/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="text-3xl mb-3">📞</div>
                    <h3 className="text-lg font-bold mb-2">Contact</h3>
                    <Link href="/contact" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      Get in Touch
                    </Link>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-red-600/20 backdrop-blur-md border border-red-300/30 rounded-xl p-4 text-center text-white hover:bg-red-600/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="text-3xl mb-3">📰</div>
                    <h3 className="text-lg font-bold mb-2">News</h3>
                    <Link href="/news" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      Latest News
                    </Link>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-teal-600/20 backdrop-blur-md border border-teal-300/30 rounded-xl p-4 text-center text-white hover:bg-teal-600/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="text-3xl mb-3">👥</div>
                    <h3 className="text-lg font-bold mb-2">Teams</h3>
                    <Link href="/teams" className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      Our Teams
                    </Link>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-indigo-600/20 backdrop-blur-md border border-indigo-300/30 rounded-xl p-4 text-center text-white hover:bg-indigo-600/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="text-3xl mb-3">📸</div>
                    <h3 className="text-lg font-bold mb-2">Gallery</h3>
                    <Link href="/gallery" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      View Photos
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Main Sponsors Section - High Visibility */}
        <section className="bg-white py-16 border-b-4 border-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Proudly Supported By Our Community Partners</h2>
              <p className="text-lg text-gray-600">The businesses and organizations that make our club possible</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              
              {/* 
              ===================================================================
              💼 SPONSOR LOGO REPLACEMENT INSTRUCTIONS
              ===================================================================
              
              TO ADD SPONSOR LOGOS:
              1. Save sponsor logo as: /public/images/sponsors/main-sponsor.png (or .jpg)
              2. Replace the placeholder div below with:
                 <div className="group cursor-pointer">
                   <div className="bg-white rounded-lg p-4 h-32 flex items-center justify-center hover:shadow-lg transition-all border">
                     <img 
                       src="/images/sponsors/main-sponsor.png" 
                       alt="Main Sponsor Name"
                       className="max-w-full max-h-full object-contain"
                     />
                   </div>
                 </div>
              
              LOGO SPECS: PNG with transparent background preferred, 400x200px max
              NAMING: main-sponsor.png, kit-sponsor.png, transport-sponsor.png, etc.
              ===================================================================
              */}
              
              {/* MAIN SPONSOR - REPLACE THIS DIV */}
              <div className="group cursor-pointer">
                <div className="bg-gray-100 rounded-lg p-8 h-32 flex items-center justify-center hover:shadow-lg transition-all">
                  <div className="text-center text-gray-600">
                    <div className="text-2xl mb-2">🏢</div>
                    <p className="text-xs font-bold">MAIN SPONSOR</p>
                    <p className="text-xs">Logo Placeholder</p>
                  </div>
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="bg-gray-100 rounded-lg p-8 h-32 flex items-center justify-center hover:shadow-lg transition-all">
                  <div className="text-center text-gray-600">
                    <div className="text-2xl mb-2">🛍️</div>
                    <p className="text-xs font-bold">KIT SPONSOR</p>
                    <p className="text-xs">Logo Placeholder</p>
                  </div>
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="bg-gray-100 rounded-lg p-8 h-32 flex items-center justify-center hover:shadow-lg transition-all">
                  <div className="text-center text-gray-600">
                    <div className="text-2xl mb-2">🚗</div>
                    <p className="text-xs font-bold">TRANSPORT PARTNER</p>
                    <p className="text-xs">Logo Placeholder</p>
                  </div>
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="bg-gray-100 rounded-lg p-8 h-32 flex items-center justify-center hover:shadow-lg transition-all">
                  <div className="text-center text-gray-600">
                    <div className="text-2xl mb-2">🍔</div>
                    <p className="text-xs font-bold">REFRESHMENTS</p>
                    <p className="text-xs">Logo Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/get-involved/sponsorship" className="inline-block bg-club-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-club-secondary transition-colors">
                Become a Sponsor
              </Link>
            </div>
          </div>
        </section>

        {/* Community News & Quick Updates */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Happening at Rangers</h2>
              <p className="text-lg text-gray-600">Latest news, results, and community stories</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Featured Story */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  
                  {/* 
                  ===================================================================
                  📰 FEATURED NEWS PHOTO REPLACEMENT INSTRUCTIONS
                  ===================================================================
                  
                  TO ADD NEWS FEATURED IMAGE:
                  1. Save your image as: /public/images/news/featured-story.jpg (or .png)
                  2. Replace the div below with:
                     <div className="h-64 overflow-hidden">
                       <img 
                         src="/images/news/featured-story.jpg" 
                         alt="Featured story - U16 County Cup"
                         className="w-full h-full object-cover"
                       />
                     </div>
                  
                  BEST NEWS IMAGES:
                  - Match action shots
                  - Award ceremonies  
                  - Team celebrations
                  - Community events
                  - Training highlights
                  
                  IMAGE SPECS: 800x400px minimum, landscape orientation
                  ===================================================================
                  */}
                  
                  {/* FEATURED NEWS PHOTO PLACEHOLDER - REPLACE THIS DIV */}
                  <div className="h-64 bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">📸</div>
                      <p className="text-sm font-bold">FEATURED STORY PHOTO</p>
                      <p className="text-xs">See instructions above in code</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="bg-club-primary text-white px-2 py-1 rounded text-xs font-bold mr-2">LATEST NEWS</span>
                      <span className="text-gray-500 text-sm">2 days ago</span>
                    </div>
                    {/* 
                    ===============================================
                    📝 FEATURED STORY CONTENT CUSTOMIZATION
                    ===============================================
                    Update the headline and story text below with your own club news
                    Keep the format but change to your team's actual stories
                    =============================================== 
                    */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">U16 Boys Reach County Cup Final</h3>
                    <p className="text-gray-600 mb-4">
                      Our U16 boys team made history last weekend by securing their place in the County Cup Final after a thrilling 3-2 victory against Milltown FC. The final will be played at...
                    </p>
                    <Link href="/news" className="text-green-600 font-semibold hover:text-green-700">
                      Read Full Story →
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Quick Updates */}
              <div className="space-y-6">
                
                {/* Latest Result */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-club-accent text-white px-2 py-1 rounded text-xs font-bold mr-2">LATEST RESULT</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">RVR FC 2-1 Millbrook FC</h4>
                  <p className="text-gray-600 text-sm mb-3">Great performance from the seniors on Saturday!</p>
                  <Link href="/match-central/results" className="text-blue-600 text-sm font-semibold">
                    View All Results →
                  </Link>
                </div>
                
                {/* Upcoming Fixture */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">NEXT MATCH</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">RVR FC vs Oakwood United</h4>
                  <p className="text-gray-600 text-sm mb-1">Saturday 3pm • Home</p>
                  <p className="text-gray-600 text-sm mb-3">Come support the lads!</p>
                  <Link href="/match-central/fixtures" className="text-orange-600 text-sm font-semibold">
                    View All Fixtures →
                  </Link>
                </div>
                
                {/* Community Story */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">COMMUNITY</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">New Girls Teams Growing Fast</h4>
                  <p className="text-gray-600 text-sm mb-3">50+ girls registered since launch in 2023</p>
                  <Link href="/teams/girls" className="text-purple-600 text-sm font-semibold">
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Feeds */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Follow Our Journey</h2>
              <p className="text-lg text-gray-600">Stay connected with live updates from our social channels</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Instagram Feed */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">📸</div>
                  <h3 className="text-xl font-bold">Instagram</h3>
                </div>
                <p className="mb-4">Match photos, training sessions, and behind-the-scenes content</p>
                {/* SOCIAL INTEGRATION PLACEHOLDER */}
                <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur">
                  <p className="text-sm opacity-90">📱 INSTAGRAM FEED INTEGRATION</p>
                  <p className="text-xs opacity-75 mt-1">@rvrfc1981</p>
                  <p className="text-xs opacity-75">https://www.instagram.com/rvrfc1981/?hl=en</p>
                </div>
                <a href="https://www.instagram.com/rvrfc1981/?hl=en" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-purple-600 px-4 py-2 rounded font-semibold hover:bg-gray-100">
                  Follow Us
                </a>
              </div>
              
              {/* Main Facebook */}
              <div className="bg-club-secondary rounded-lg p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">👥</div>
                  <h3 className="text-xl font-bold">Facebook - Main Club</h3>
                </div>
                <p className="mb-4">Club announcements, events, and community discussions</p>
                {/* SOCIAL INTEGRATION PLACEHOLDER */}
                <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur">
                  <p className="text-sm opacity-90">📱 FACEBOOK FEED INTEGRATION</p>
                  <p className="text-xs opacity-75 mt-1">Main Club Page</p>
                  <p className="text-xs opacity-75">https://www.facebook.com/RVRFC/</p>
                </div>
                <a href="https://www.facebook.com/RVRFC/" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100">
                  Like Our Page
                </a>
              </div>
              
              {/* Seniors Facebook */}
              <div className="bg-club-primary rounded-lg p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">🏆</div>
                  <h3 className="text-xl font-bold">Facebook - Seniors</h3>
                </div>
                <p className="mb-4">Senior team news, match reports, and player updates</p>
                {/* SOCIAL INTEGRATION PLACEHOLDER */}
                <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur">
                  <p className="text-sm opacity-90">📱 FACEBOOK FEED INTEGRATION</p>
                  <p className="text-xs opacity-75 mt-1">Seniors Team Page</p>
                  <p className="text-xs opacity-75">https://www.facebook.com/RVRSeniors/</p>
                </div>
                <a href="https://www.facebook.com/RVRSeniors/" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-green-600 px-4 py-2 rounded font-semibold hover:bg-gray-100">
                  Follow Seniors
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Community Gallery Preview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Community in Action</h2>
              <p className="text-lg text-gray-600">Capturing the moments that make Rangers special</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* PHOTO PLACEHOLDERS: Community gallery preview */}
              {[
                { title: "Match Action", desc: "Players in action during matches" },
                { title: "Training Sessions", desc: "Youth and senior training" },
                { title: "Community Events", desc: "Club social events and fundraisers" },
                { title: "Awards & Celebrations", desc: "Trophy presentations and achievements" }
              ].map((photo, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="aspect-square bg-gradient-to-br from-green-400 to-blue-500 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:opacity-90 transition-opacity">
                      <div className="text-white text-center">
                        <div className="text-3xl mb-2">📸</div>
                        <p className="text-xs font-bold">{photo.title.toUpperCase()}</p>
                        <p className="text-xs opacity-75 px-2">{photo.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link href="/gallery" className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-club-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join the Rangers Family?</h2>
            <p className="text-xl mb-8 text-green-100">
              Whether you're 7 or 70, there's a place for you at Rivervalley Rangers AFC
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="bg-white text-green-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors">
                Join as a Player
              </Link>
              <Link href="/volunteering" className="bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-orange-700 transition-colors">
                Volunteer with Us
              </Link>
              <Link href="/get-involved/sponsorship" className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-white/10 transition-colors">
                Support the Club
              </Link>
            </div>
          </div>
        </section>

      </main>
        </StandardLayout>
      </div>
    </div>
  );
}