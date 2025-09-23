/**
 * Optimized Hero Section Component
 * Performance-enhanced hero section with lazy loading, caching, and smooth animations
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useOptimizedHomepageData, formatMatchDate, formatMatchTime, getRelativeTimeToMatch } from '../../hooks/useOptimizedHomepageData';
import { LazyBackgroundImage } from './LazyImage';
import { HeroBoxSkeleton, SkeletonWrapper } from './SkeletonLoaders';

// Lazy load admin components (only for admins)
const AdminNotificationPopup = lazy(() => import('../AdminNotificationPopup'));
const SpecialEventsPopup = lazy(() => import('../SpecialEventsPopup'));

interface OptimizedHeroSectionProps {
  isAdmin?: boolean;
  user?: any;
}

export const OptimizedHeroSection: React.FC<OptimizedHeroSectionProps> = ({
  isAdmin = false,
  user
}) => {
  const [showVideo, setShowVideo] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { latestResult, nextFixture, latestNews, loading, error } = useOptimizedHomepageData();

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => setShowVideo(false), 500);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  // Animation variants for staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const heroBoxVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      
      {/* Admin Controls - Lazy Loaded */}
      {isAdmin && user && (
        <div className="fixed top-6 left-6 z-50 flex flex-col space-y-4">
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

          <Suspense fallback={<div className="w-8 h-8 bg-white/20 rounded animate-pulse" />}>
            <AdminNotificationPopup />
          </Suspense>
        </div>
      )}

      {/* Background Media */}
      <div className="absolute inset-0">
        {/* Video Background with Performance Optimization */}
        {showVideo && (
          <motion.video
            autoPlay
            muted
            playsInline
            preload="metadata" // Only load metadata initially
            onEnded={handleVideoEnd}
            onLoadedData={handleVideoLoad}
            className="w-full h-full object-cover"
            animate={{ opacity: videoEnded ? 0 : 1 }}
            transition={{ duration: 1 }}
            poster="/images/hero/astro-ward.png" // Poster for faster perceived loading
          >
            <source src="/images/hero/rvr-drone-5.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
        )}
        
        {/* Optimized Fallback Image */}
        <LazyBackgroundImage
          src="/images/hero/astro-ward.png"
          priority={!showVideo || videoEnded}
          overlay={true}
          overlayOpacity={0.3}
          className="w-full h-full"
        >
          <div /> {/* Empty content for background only */}
        </LazyBackgroundImage>
      </div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Club Title */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Rivervalley Rangers
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
            Established 1981 • Ward River Valley Park
          </p>
        </motion.div>

        {/* Hero Information Boxes */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          variants={containerVariants}
        >
          {/* Latest Result Box */}
          <SkeletonWrapper
            loading={loading}
            skeleton={<HeroBoxSkeleton />}
            delay={0}
          >
            <motion.div
              variants={heroBoxVariants}
              whileHover="hover"
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Latest Result</h3>
                <span className={`w-3 h-3 rounded-full ${
                  latestResult?.result === 'win' ? 'bg-green-500' : 
                  latestResult?.result === 'loss' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
              </div>
              
              {latestResult && (
                <>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {latestResult.homeTeam} {latestResult.homeScore} - {latestResult.awayScore} {latestResult.awayTeam}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {formatMatchDate(latestResult.matchDate)}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {latestResult.matchType}
                  </div>
                </>
              )}
              
              <Link 
                href="/matches" 
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium group-hover:underline transition-colors"
              >
                View All Results →
              </Link>
            </motion.div>
          </SkeletonWrapper>

          {/* Next Fixture Box */}
          <SkeletonWrapper
            loading={loading}
            skeleton={<HeroBoxSkeleton />}
            delay={0.1}
          >
            <motion.div
              variants={heroBoxVariants}
              whileHover="hover"
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Next Fixture</h3>
                <span className="text-2xl">⚽</span>
              </div>
              
              {nextFixture && (
                <>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {nextFixture.homeTeam} vs {nextFixture.awayTeam}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {getRelativeTimeToMatch(nextFixture.matchDate, nextFixture.matchTime)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {formatMatchTime(nextFixture.matchTime)} • {nextFixture.venue}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {nextFixture.matchType}
                  </div>
                </>
              )}
              
              <Link 
                href="/matches" 
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium group-hover:underline transition-colors"
              >
                View Fixtures →
              </Link>
            </motion.div>
          </SkeletonWrapper>

          {/* Latest News Box */}
          <SkeletonWrapper
            loading={loading}
            skeleton={<HeroBoxSkeleton />}
            delay={0.2}
          >
            <motion.div
              variants={heroBoxVariants}
              whileHover="hover"
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Latest News</h3>
                <span className="text-2xl">📰</span>
              </div>
              
              {latestNews && (
                <>
                  <div className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {latestNews.title}
                  </div>
                  <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {latestNews.excerpt}
                  </div>
                  <div className="text-xs text-gray-500">
                    By {latestNews.author} • {formatMatchDate(latestNews.publishDate)}
                  </div>
                </>
              )}
              
              <Link 
                href="/news" 
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium group-hover:underline transition-colors"
              >
                Read More →
              </Link>
            </motion.div>
          </SkeletonWrapper>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className="mt-12"
        >
          <Link
            href="/get-involved"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            Join Our Community
          </Link>
        </motion.div>
      </motion.div>

      {/* Special Events Popup - Lazy Loaded */}
      {!isAdmin && (
        <Suspense fallback={null}>
          <SpecialEventsPopup />
        </Suspense>
      )}

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50"
          >
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Refresh page
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};