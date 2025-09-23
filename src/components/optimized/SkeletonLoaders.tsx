/**
 * Skeleton Loading Components
 * Provides smooth loading states for homepage elements
 */

import React from 'react';
import { motion } from 'framer-motion';

// Base skeleton animation
const skeletonAnimation = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 1.5,
    ease: 'linear',
    repeat: Infinity,
  }
};

const skeletonGradient = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';

// Hero Box Skeleton
export const HeroBoxSkeleton: React.FC = () => (
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 h-full">
    {/* Header skeleton */}
    <div className="flex items-center justify-between mb-4">
      <motion.div
        className="h-6 w-24 rounded"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
      <motion.div
        className="h-8 w-8 rounded-full"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
    </div>
    
    {/* Content skeleton */}
    <div className="space-y-3">
      <motion.div
        className="h-8 w-full rounded"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
      <motion.div
        className="h-4 w-3/4 rounded"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
      <motion.div
        className="h-4 w-1/2 rounded"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
    </div>
    
    {/* Button skeleton */}
    <motion.div
      className="h-10 w-32 rounded-lg mt-6"
      style={{
        background: skeletonGradient,
        backgroundSize: '200% 100%',
      }}
      {...skeletonAnimation}
    />
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton: React.FC = () => (
  <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
    <motion.div
      className="h-12 w-16 mx-auto rounded mb-3"
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
        backgroundSize: '200% 100%',
      }}
      {...skeletonAnimation}
    />
    <motion.div
      className="h-4 w-20 mx-auto rounded"
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
        backgroundSize: '200% 100%',
      }}
      {...skeletonAnimation}
    />
  </div>
);

// Team Showcase Skeleton
export const TeamShowcaseSkeleton: React.FC = () => (
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
    <div className="flex items-center mb-6">
      <motion.div
        className="h-16 w-16 rounded-full mr-4"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
      <div>
        <motion.div
          className="h-6 w-32 rounded mb-2"
          style={{
            background: skeletonGradient,
            backgroundSize: '200% 100%',
          }}
          {...skeletonAnimation}
        />
        <motion.div
          className="h-4 w-24 rounded"
          style={{
            background: skeletonGradient,
            backgroundSize: '200% 100%',
          }}
          {...skeletonAnimation}
        />
      </div>
    </div>
    
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <motion.div
            className="h-10 w-10 rounded-full"
            style={{
              background: skeletonGradient,
              backgroundSize: '200% 100%',
            }}
            {...skeletonAnimation}
          />
          <div className="flex-1">
            <motion.div
              className="h-4 w-full rounded mb-1"
              style={{
                background: skeletonGradient,
                backgroundSize: '200% 100%',
              }}
              {...skeletonAnimation}
            />
            <motion.div
              className="h-3 w-2/3 rounded"
              style={{
                background: skeletonGradient,
                backgroundSize: '200% 100%',
              }}
              {...skeletonAnimation}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// News Article Skeleton
export const NewsArticleSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <motion.div
      className="h-48 w-full"
      style={{
        background: skeletonGradient,
        backgroundSize: '200% 100%',
      }}
      {...skeletonAnimation}
    />
    <div className="p-6">
      <motion.div
        className="h-6 w-full rounded mb-3"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
      <motion.div
        className="h-4 w-3/4 rounded mb-2"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
      <motion.div
        className="h-4 w-1/2 rounded mb-4"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
      <motion.div
        className="h-8 w-24 rounded"
        style={{
          background: skeletonGradient,
          backgroundSize: '200% 100%',
        }}
        {...skeletonAnimation}
      />
    </div>
  </div>
);

// Generic Skeleton Wrapper
interface SkeletonWrapperProps {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  loading,
  skeleton,
  children,
  delay = 0
}) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay }}
      >
        {skeleton}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation for immediate feedback
export const PulseLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`bg-gray-200 rounded ${className}`}
    animate={{
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
    }}
  />
);

// Loading spinner for smaller elements
export const SpinnerLoader: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({ 
  size = 'md', 
  color = 'text-blue-600' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${color}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      }}
    >
      <svg className="animate-spin h-full w-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  );
};