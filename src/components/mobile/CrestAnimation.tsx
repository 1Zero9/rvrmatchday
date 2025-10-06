/**
 * 🏆 Crest Animation Component
 * 
 * Animated club crest that plays on first load of mobile app
 * Creates "matchday feeling" with glowing entrance animation
 */

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CrestAnimationProps {
  onComplete: () => void;
  skipAnimation?: boolean;
}

export default function CrestAnimation({ onComplete, skipAnimation = false }: CrestAnimationProps) {
  const [showCrest, setShowCrest] = useState(true);

  useEffect(() => {
    if (skipAnimation) {
      onComplete();
      return;
    }

    // Animation sequence timing
    const timer = setTimeout(() => {
      setShowCrest(false);
      // Allow exit animation to complete before calling onComplete
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete, skipAnimation]);

  // Skip render if animation should be skipped
  if (skipAnimation) {
    return null;
  }

  return (
    <AnimatePresence>
      {showCrest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #972A4C 0%, #7A1D3C 50%, #5A0F26 100%)'
          }}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rounded-full"
            ></motion.div>
            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/5 rounded-full"
            ></motion.div>
          </div>

          {/* Main Crest Animation Container */}
          <div className="relative z-10 text-center">
            {/* Glowing Ring Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 0.8, 0.3]
              }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.6, 1],
                ease: "easeOut"
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-40 h-40 rounded-full border-4 border-white/30 shadow-2xl"></div>
            </motion.div>

            {/* Crest Image with Glow */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ 
                scale: 1, 
                rotate: 0, 
                opacity: 1 
              }}
              transition={{ 
                duration: 1.2,
                delay: 0.3,
                ease: "easeOut"
              }}
              className="relative z-20"
            >
              <div className="relative">
                {/* Glow effect behind crest */}
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(255, 255, 255, 0.3)',
                      '0 0 60px rgba(255, 255, 255, 0.5)',
                      '0 0 30px rgba(255, 255, 255, 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full"
                ></motion.div>
                
                {/* Main Crest */}
                <Image 
                  src="/images/logo.png" 
                  alt="RVR AFC Crest" 
                  width={120} 
                  height={120}
                  className="rounded-full relative z-10 shadow-2xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Club Name Animation */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8,
                delay: 1.0,
                ease: "easeOut"
              }}
              className="mt-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                RVR AFC
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="text-white/80 text-lg font-medium"
              >
                MATCHDAY AWAITS
              </motion.p>
            </motion.div>

            {/* Pulsing Energy Rings */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.5,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-60 h-60 rounded-full border-2 border-white/20"></div>
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 2,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-80 h-80 rounded-full border border-white/10"></div>
            </motion.div>
          </div>

          {/* Skip Animation Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => {
              setShowCrest(false);
              setTimeout(onComplete, 300);
            }}
            className="absolute bottom-8 right-8 text-white/60 text-sm hover:text-white/90 transition-colors"
          >
            Skip →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}