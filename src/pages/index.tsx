import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function IdentityLaunchPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      src: "data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23059669'/%3e%3ccircle cx='50' cy='50' r='30' fill='white' stroke='%23065f46' stroke-width='3'/%3e%3cpath d='M35 40 L50 30 L65 40 L60 55 L40 55 Z' fill='%23065f46'/%3e%3c/svg%3e",
      alt: "Youth Training Session"
    },
    {
      src: "data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23047857'/%3e%3crect x='10' y='30' width='80' height='40' fill='white' stroke='%23065f46' stroke-width='2'/%3e%3ccircle cx='50' cy='50' r='8' fill='%23065f46'/%3e%3ctext x='50' y='55' text-anchor='middle' font-size='8' fill='%23065f46'%3eRVR%3c/text%3e%3c/svg%3e",
      alt: "Match Day Action"
    },
    {
      src: "data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23065f46'/%3e%3cpath d='M20 80 L80 80 L80 60 L20 60 Z' fill='%23059669'/%3e%3cpath d='M30 60 L70 60 L70 40 L30 40 Z' fill='%23047857'/%3e%3cpath d='M40 40 L60 40 L60 20 L40 20 Z' fill='white'/%3e%3ctext x='50' y='32' text-anchor='middle' font-size='6' fill='%23065f46'%3eTROPHY%3c/text%3e%3c/svg%3e",
      alt: "Club Achievements"
    }
  ];

  useEffect(() => {
    // Check if user has already seen the intro
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro === 'true') {
      // Skip to main homepage
      router.push('/home');
      return;
    }

    // Mark as loaded for animations
    setIsLoaded(true);

    // Carousel auto-rotate
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [router]);

  const handleEnterSite = () => {
    // Mark that user has seen the intro
    sessionStorage.setItem('hasSeenIntro', 'true');
    router.push('/home');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 relative overflow-hidden">
      {/* Enhanced Modern Background */}
      <div className="absolute inset-0">
        {/* Dynamic Background Carousel */}
        <div className="absolute inset-0 opacity-20">
          {carouselImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.1
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 bg-center bg-cover filter blur-[1px]"
              style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: '300px 300px',
                backgroundRepeat: 'repeat'
              }}
            />
          ))}
        </div>
        
        {/* Modern gradient overlay with depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/85 to-green-800/90 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-15"></div>
        
        {/* Football Field Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl translate-x-40"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-green-400/10 rounded-full blur-3xl translate-y-36"></div>
        
        {/* Football Pitch Lines Pattern */}
        <div className="absolute inset-0 opacity-[0.12] z-5">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-0.5"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Football Icons Floating */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0] 
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 text-4xl opacity-20"
          >
            ⚽
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -15, 0] 
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-40 right-32 text-3xl opacity-20"
          >
            🏆
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute bottom-32 left-1/4 text-3xl opacity-20"
          >
            🥅
          </motion.div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-8 lg:px-12">
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Enhanced Club Crest with Modern Backdrop */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-full scale-150 animate-pulse"></div>
              <motion.div
                animate={{ 
                  scale: [1, 1.03, 1],
                  rotateY: [0, 3, 0, -3, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20">
                  <Image 
                    src="/images/logo.png" 
                    alt="Rivervalley Rangers AFC Logo" 
                    width={240}
                    height={240}
                    className="mx-auto drop-shadow-2xl filter brightness-115"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Enhanced Club Name Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-10"
          >
            <div className="relative">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-wider leading-tight drop-shadow-2xl">
                <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
                  RIVERVALLEY
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-200 via-yellow-300 to-green-200 bg-clip-text text-transparent">
                  RANGERS
                </span>
              </h1>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.9 }}
                className="h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 mx-auto mb-6 rounded-full shadow-2xl max-w-lg"
              ></motion.div>
              
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <p className="text-xl text-white font-bold tracking-wide">
                    AFC
                  </p>
                </div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-3xl"
                >
                  ⚽
                </motion.div>
                <div className="bg-yellow-400/90 backdrop-blur-sm px-3 py-1 rounded-full text-green-900 font-bold text-sm">
                  EST. 2009
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Tagline */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-8"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-xl md:text-2xl text-white font-medium tracking-wide mb-2">
                🏆 Building Community Through Football Since 2009 🏆
              </p>
              <p className="text-green-200 text-sm md:text-base">
                Where Champions Are Made • Where Communities Unite
              </p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-10"
          >
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">300+</div>
                <div className="text-xs text-green-200">Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">15</div>
                <div className="text-xs text-green-200">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">12</div>
                <div className="text-xs text-green-200">Teams</div>
              </div>
            </div>
          </motion.div>

          {/* Premium Large CTA */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-12"
          >
            <motion.button
              onClick={handleEnterSite}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-2xl border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-15"
                initial={false}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span className="relative flex items-center justify-center space-x-3">
                <motion.span
                  animate={{ 
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-2xl"
                >
                  ⚽
                </motion.span>
                <span className="text-center">
                  <div className="font-bold text-xl">ENTER THE PITCH</div>
                  <div className="text-xs text-green-100 font-medium">Join Our Football Family</div>
                </span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-xl"
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>

          {/* Skip/Enter Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <p className="text-blue-300/60 text-sm">
              Click anywhere to continue
            </p>
          </motion.div>

        </div>
      </div>

      {/* Click anywhere to enter */}
      <div 
        className="absolute inset-0 cursor-pointer z-10"
        onClick={handleEnterSite}
      ></div>
    </div>
  );
}