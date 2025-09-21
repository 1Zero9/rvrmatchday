import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import StandardLayout from "../components/StandardLayout";
import MobileLayout from "../components/MobileLayout";
import MobileHomePro from "../components/mobile/MobileHomePro";
import AdminNotificationPopup from "../components/AdminNotificationPopup";
import { useAuth } from "../components/SecureAuth";
export default function StandardHomepage() {
  const { isAdmin, user } = useAuth();
  const [showVideo, setShowVideo] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showFloatingScroll, setShowFloatingScroll] = useState(false);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    // Fade out video after a brief delay
    setTimeout(() => {
      setShowVideo(false);
    }, 500);
  };

  // Handle scroll to show/hide floating scroll button
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        setShowFloatingScroll(scrollPosition > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNextSection = () => {
    const sections = document.querySelectorAll('section');
    const currentScrollY = window.scrollY;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      
      if (sectionTop > currentScrollY + 100) {
        section.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  };

  return (
    <>
      {/* Mobile Version - Professional */}
      <div className="block md:hidden">
        <MobileLayout 
          currentPage="/home"
          showNavigation={false}
          clubData={{
            name: "RVR AFC", 
            logo: "/images/logo.png",
            established: "1981",
            colors: {
              primary: "#972A4C",
              secondary: "#5E7794",
              accent: "#98C0F0",
              neutral: "#B6B7B6"
            }
          }}
        >
          <MobileHomePro />
        </MobileLayout>
      </div>

      {/* Desktop Version - Existing */}
      <div className="hidden md:block">
        <StandardLayout currentPage="/home">
          <main>
        
        {/* Hero Section - Authentic Community Feel */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          
          {/* Top Left Admin Area - Only for Logged-in Admins */}
          {isAdmin && user && (
            <div className="fixed top-6 left-6 z-50 flex flex-col space-y-4">
              {/* Bright Tools CTA */}
              <motion.div
                initial={{ opacity: 0, x: -100, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Link 
                  href="/admin" 
                  className="text-black hover:text-gray-800 text-sm flex items-center space-x-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 px-5 py-3 rounded-full shadow-2xl border-2 border-yellow-600 hover:border-yellow-700 hover:shadow-2xl transition-all animate-pulse font-bold"
                  title="Admin Tools & Diagnostics"
                  style={{
                    boxShadow: '0 0 25px rgba(255, 235, 59, 0.8), 0 6px 20px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <span className="animate-bounce text-xl">🛠️</span>
                  <span className="font-black uppercase tracking-wide text-base">ADMIN TOOLS</span>
                </Link>
              </motion.div>

              {/* Admin Notification Popup - Repositioned */}
              <div className="relative">
                <AdminNotificationPopup />
              </div>
            </div>
          )}
          
          {/* Hero Background */}
          <div className="absolute inset-0">
            {/* Video Background */}
            {showVideo && (
              <motion.video
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                className="w-full h-full object-cover"
                animate={{ opacity: videoEnded ? 0 : 1 }}
                transition={{ duration: 1 }}
              >
                <source src="/images/hero/rvr-drone-5.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </motion.video>
            )}
            
            {/* Fallback Image - fades in when video ends */}
            <motion.img 
              src="/images/hero/astro-ward.png" 
              alt="Rivervalley Rangers AFC - Astro Pitch"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: showVideo ? 0 : 1 }}
              transition={{ duration: 1 }}
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
            
            {/* Separate Logo - Positioned to Left */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -left-8 lg:-left-40 xl:left-0 top-1/2 transform -translate-y-1/2 hidden lg:block z-20"
            >
              <div className="relative">
                <Image 
                  src="/images/logo.png" 
                  alt="Rivervalley Rangers AFC Logo" 
                  width={170}
                  height={170}
                  className="drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl -z-10"></div>
              </div>
            </motion.div>
            
            {/* Centered Action Cards - Independent */}
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">

                {/* Main Action Grid - Larger Boxes */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center max-w-4xl mx-auto"
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
                
                {/* Enhanced Neon Scroll Indicator - Under Hero Boxes */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="flex justify-center mt-8"
                >
                  <div className="flex flex-col items-center">
                    <button
                      onClick={scrollToNextSection}
                      className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-3 shadow-2xl animate-bounce hover:bg-white/30 transition-all duration-300 cursor-pointer group relative overflow-hidden hover:shadow-green-400/50 hover:shadow-2xl"
                    >
                      {/* Neon glow effect on hover */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      
                      <svg className="w-6 h-6 text-white group-hover:text-green-200 transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>
                    <div className="mt-2 text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 group-hover:text-green-200 transition-colors">
                      Scroll Down
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Club Updates - Right Under Hero */}
        <section id="club-updates" className="py-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid lg:grid-cols-3 gap-4">
              
              {/* Latest Result - Compact */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg overflow-hidden border border-green-200"
              >
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-2">
                  <div className="flex items-center justify-between text-white">
                    <span className="font-bold text-sm uppercase tracking-wide">Latest Win</span>
                    <div className="text-lg">🏆</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-2">Senior Team • Saturday</div>
                    <div className="flex items-center justify-between text-lg font-bold mb-2">
                      <span className="text-green-700">RVR FC</span>
                      <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                        2 - 1
                      </div>
                      <span className="text-gray-700">Millbrook FC</span>
                    </div>
                    <Link href="/matchday" className="inline-block bg-green-600 text-white px-4 py-1 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
                      Match Report
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Next Fixture - Compact */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg overflow-hidden border border-orange-200"
              >
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-2">
                  <div className="flex items-center justify-between text-white">
                    <span className="font-bold text-sm uppercase tracking-wide">Next Match</span>
                    <div className="text-lg">⚽</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-2">Saturday 15:00 • Home</div>
                    <div className="flex items-center justify-between text-lg font-bold mb-2">
                      <span className="text-orange-700">RVR FC</span>
                      <div className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm">
                        VS
                      </div>
                      <span className="text-gray-700">Oakwood Utd</span>
                    </div>
                    <Link href="/match-central" className="inline-block bg-orange-600 text-white px-4 py-1 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm">
                      Match Info
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* News Highlight - Compact */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg overflow-hidden border border-blue-200"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2">
                  <div className="flex items-center justify-between text-white">
                    <span className="font-bold text-sm uppercase tracking-wide">Club News</span>
                    <div className="text-lg">📰</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">U16 Boys Reach County Cup Final</h3>
                    <p className="text-gray-600 text-xs mb-2">Historic achievement for our youth team</p>
                    <Link href="/news" className="inline-block bg-blue-600 text-white px-4 py-1 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Live Stats Bar - Dynamic Info */}
        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-8 border-t-4 border-green-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white"
              >
                <div className="text-3xl font-bold text-green-400 mb-1">350+</div>
                <div className="text-sm uppercase tracking-wide text-gray-300">Active Players</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white"
              >
                <div className="text-3xl font-bold text-green-400 mb-1">18</div>
                <div className="text-sm uppercase tracking-wide text-gray-300">Teams</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white"
              >
                <div className="text-3xl font-bold text-green-400 mb-1">44</div>
                <div className="text-sm uppercase tracking-wide text-gray-300">Years Strong</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-white"
              >
                <div className="text-3xl font-bold text-green-400 mb-1">25</div>
                <div className="text-sm uppercase tracking-wide text-gray-300">Qualified Coaches</div>
              </motion.div>
            </div>
          </div>
        </section>


        {/* Teams Showcase - Interactive */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Teams</h2>
              <p className="text-xl text-gray-600">From grassroots to senior level - football for everyone</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Youth Teams */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent group-hover:border-green-300 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-green-400 via-green-500 to-green-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-6xl mb-4">⚽</div>
                        <h3 className="text-2xl font-bold">Youth Teams</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">U8 - U18</span>
                      <span className="text-2xl">⭐</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Development Focus</h4>
                    <p className="text-gray-600 mb-4">Building skills, character, and friendships through football. Professional coaching for all abilities.</p>
                    <Link href="/teams/boys" className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      Explore Youth Teams
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Girls Teams */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent group-hover:border-pink-300 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-6xl mb-4">⚽</div>
                        <h3 className="text-2xl font-bold">Girls Teams</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-bold">U8 - U16</span>
                      <span className="text-2xl">🌟</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Growing Strong</h4>
                    <p className="text-gray-600 mb-4">Our fastest growing section! Empowering girls through sport in a supportive environment.</p>
                    <Link href="/teams/girls" className="block w-full text-center bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                      Join Girls Football
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Senior Teams */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent group-hover:border-blue-300 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-2xl font-bold">Senior Teams</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">Adult</span>
                      <span className="text-2xl">👑</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Competitive Edge</h4>
                    <p className="text-gray-600 mb-4">League and cup competitions. Experience the thrill of adult football with a welcoming club.</p>
                    <Link href="/teams/seniors" className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Senior Football
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Community Impact Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">More Than Just Football</h2>
              <p className="text-xl text-green-100">Building stronger communities through sport</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="bg-white/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <span className="text-4xl">🤝</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Community First</h3>
                <p className="text-green-100">Supporting local families and bringing the neighborhood together through shared passion for football.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="bg-white/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <span className="text-4xl">🌱</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Youth Development</h3>
                <p className="text-green-100">Nurturing young talent with professional coaching, building confidence and life skills on and off the pitch.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="bg-white/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <span className="text-4xl">💚</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Inclusivity</h3>
                <p className="text-green-100">Football for everyone - regardless of ability, background, or experience. Everyone has a home at Rangers.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Media & Engagement */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Stay Connected</h2>
              <p className="text-xl text-gray-600">Follow our journey across social media</p>
            </motion.div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Instagram */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">📸</div>
                      <h3 className="text-2xl font-bold">Instagram</h3>
                    </div>
                    <p className="mb-6 text-lg">Behind the scenes content, match photos, and player moments</p>
                    <div className="bg-white/20 rounded-xl p-4 mb-6 backdrop-blur-sm">
                      <p className="text-sm font-bold">@rvrfc1981</p>
                      <p className="text-xs opacity-75">Daily updates & stories</p>
                    </div>
                    <a href="https://www.instagram.com/rvrfc1981/?hl=en" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 group-hover:scale-105">
                      Follow Us
                    </a>
                  </div>
                </div>
              </motion.div>
              
              {/* Facebook Main */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">👥</div>
                      <h3 className="text-2xl font-bold">Facebook</h3>
                    </div>
                    <p className="mb-6 text-lg">Club announcements, events, and community discussions</p>
                    <div className="bg-white/20 rounded-xl p-4 mb-6 backdrop-blur-sm">
                      <p className="text-sm font-bold">Main Club Page</p>
                      <p className="text-xs opacity-75">News & events</p>
                    </div>
                    <a href="https://www.facebook.com/RVRFC/" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 group-hover:scale-105">
                      Like Our Page
                    </a>
                  </div>
                </div>
              </motion.div>
              
              {/* WhatsApp Community */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">💬</div>
                      <h3 className="text-2xl font-bold">Join Our Community</h3>
                    </div>
                    <p className="mb-6 text-lg">Direct contact with coaches and instant match updates</p>
                    <div className="bg-white/20 rounded-xl p-4 mb-6 backdrop-blur-sm">
                      <p className="text-sm font-bold">WhatsApp Groups</p>
                      <p className="text-xs opacity-75">Team communications</p>
                    </div>
                    <Link href="/contact" className="inline-block bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 group-hover:scale-105">
                      Get Contact Info
                    </Link>
                  </div>
                </div>
              </motion.div>
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

        {/* Sponsors Section - Moved to End */}
        <section className="bg-white py-12 border-b-4 border-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Community Partners</h2>
              <p className="text-gray-600">Supporting grassroots football in our community</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              
              {/* MAIN SPONSOR - REPLACE THIS DIV */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="bg-gray-100 rounded-lg p-6 h-24 flex items-center justify-center hover:shadow-lg transition-all">
                  <div className="text-center text-gray-600">
                    <div className="text-xl mb-1">🏢</div>
                    <p className="text-xs font-bold">MAIN SPONSOR</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-gray-100 rounded-lg p-6 h-24 flex items-center justify-center hover:shadow-lg transition-all">
                  <div className="text-center text-gray-600">
                    <div className="text-xl mb-1">🛍️</div>
                    <p className="text-xs font-bold">KIT SPONSOR</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="group cursor-pointer"
              >
                <div className="bg-gray-100 rounded-lg p-6 h-24 flex items-center justify-center hover:shadow-lg transition-all">
                  <div className="text-center text-gray-600">
                    <div className="text-xl mb-1">🚗</div>
                    <p className="text-xs font-bold">TRANSPORT</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="group cursor-pointer"
              >
                <div className="bg-gray-100 rounded-lg p-6 h-24 flex items-center justify-center hover:shadow-lg transition-all">
                  <div className="text-center text-gray-600">
                    <div className="text-xl mb-1">🍔</div>
                    <p className="text-xs font-bold">REFRESHMENTS</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="text-center mt-6">
              <Link href="/get-involved/sponsorship" className="inline-block bg-club-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-club-secondary transition-colors text-sm">
                Become a Sponsor
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

      {/* Floating Scroll Button - Follows user down page */}
      {showFloatingScroll && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button
            onClick={scrollToNextSection}
            className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-4 shadow-2xl hover:bg-white/30 transition-all duration-300 cursor-pointer group relative overflow-hidden hover:shadow-green-400/50 hover:shadow-2xl"
          >
            {/* Neon glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            <svg className="w-6 h-6 text-gray-900 group-hover:text-green-600 transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </motion.div>
      )}

    </>
  );
}