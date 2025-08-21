import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function LogoIntro() {
  const router = useRouter();
  const [showLogo, setShowLogo] = useState(true);
  const [showNewLogo, setShowNewLogo] = useState(false);
  const [showBetaWarning, setShowBetaWarning] = useState(false);

  const handleEnterSite = () => {
    sessionStorage.setItem('hasSeenIntro', 'true');
    router.push('/home');
  };

  useEffect(() => {
    // Check if user has already seen the intro
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro === 'true') {
      // Skip to main homepage
      router.push('/home');
      return;
    }

    // Show logo with zoom in after 1 second
    const zoomInTimer = setTimeout(() => {
      setShowNewLogo(true);
    }, 1000);

    // Show beta warning after 5 seconds
    const betaTimer = setTimeout(() => {
      setShowBetaWarning(true);
    }, 5000);

    return () => {
      clearTimeout(zoomInTimer);
      clearTimeout(betaTimer);
    };
  }, [router]);

  if (!showLogo) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-slate-900"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;utf8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 fill=%22white%22%3e%3ccircle cx=%2220%22 cy=%2220%22 r=%222%22/%3e%3ccircle cx=%2280%22 cy=%2240%22 r=%221%22/%3e%3ccircle cx=%2240%22 cy=%2270%22 r=%221.5%22/%3e%3ccircle cx=%2290%22 cy=%2280%22 r=%221%22/%3e%3ccircle cx=%2210%22 cy=%2260%22 r=%221%22/%3e%3c/svg%3e')] bg-repeat"></div>
      
      {/* Logo Container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center max-w-md mx-auto px-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-full p-8 border border-white/20 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ 
                opacity: showNewLogo ? 1 : 0,
                scale: showNewLogo ? 1 : 0.3
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <Image 
                src="/images/logo.png"
                alt="Rivervalley Rangers AFC Logo" 
                width={180}
                height={180}
                className="mx-auto drop-shadow-2xl"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
            Rivervalley Rangers AFC
          </h1>
          <p className="text-slate-300 text-lg">
            Building Community Through Football
          </p>
        </motion.div>
        
        {/* Beta Warning and Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: showBetaWarning ? 1 : 0,
            y: showBetaWarning ? 0 : 30
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <div className="bg-orange-500/20 backdrop-blur-md border border-orange-400/50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">
                BETA
              </div>
              <span className="text-orange-200 font-semibold">Site Under Development</span>
            </div>
            <div className="text-center text-white text-sm space-y-2">
              <p className="text-orange-100">
                🚧 This website is currently under construction
              </p>
              <p className="text-slate-300 text-xs">
                Some features may be incomplete or not function as expected.
                We're working hard to bring you the best experience!
              </p>
            </div>
          </div>
          
          <button
            onClick={handleEnterSite}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <span className="text-lg">⚽ Enter Site</span>
            <p className="text-sm opacity-90 mt-1">Continue to Rivervalley Rangers</p>
          </button>
          
          <p className="text-center text-slate-400 text-xs mt-4">
            By entering, you acknowledge this is a development version
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}