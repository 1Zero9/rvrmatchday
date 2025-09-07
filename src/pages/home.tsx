import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import MobileHomePage from "../components/MobileHomePage";

export default function StandardHomepage() {
  return (
    <StandardLayout currentPage="/home">
      {/* Mobile content is handled by MobileLayout in StandardLayout */}
      {/* This is the desktop content */}
      <main>
        
        {/* Hero Section - Authentic Community Feel */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          
          {/* Hero Background */}
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
                    className="bg-indigo-600/20 backdrop-blur-md border border-indigo-300/30 rounded-xl p-4 text-center text-white hover:bg-indigo-600/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="text-3xl mb-3">🎉</div>
                    <h3 className="text-lg font-bold mb-2">Events</h3>
                    <Link href="/get-involved/events" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      What's On
                    </Link>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-purple-600/20 backdrop-blur-md border border-purple-300/30 rounded-xl p-4 text-center text-white hover:bg-purple-600/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="text-3xl mb-3">🏆</div>
                    <h3 className="text-lg font-bold mb-2">Results</h3>
                    <Link href="/matchday" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      Latest Scores
                    </Link>
                  </motion.div>

                  {/* Row 2: Four Regular Boxes */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-green-600/20 backdrop-blur-md border border-green-300/30 rounded-xl p-4 text-center text-white hover:bg-green-600/30 transition-all duration-300 shadow-xl"
                  >
                    <div className="text-3xl mb-3">🏟️</div>
                    <h3 className="text-lg font-bold mb-2">Book Astro</h3>
                    <Link href="/book-astro" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                      Reserve Pitch
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

        {/* Rest of desktop content continues... */}
        {/* Main Sponsors, News, etc. - keeping existing desktop layout */}
        
      </main>
    </StandardLayout>
  );
}