/**
 * 🎨 PREMIUM MOBILE DESIGN SYSTEM
 * Professional glass morphism with magical animations
 * Inspired by Uber, Livescore, and premium mobile apps
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useScroll, AnimatePresence } from 'framer-motion';

// ==========================================
// 🌟 PREMIUM DESIGN TOKENS
// ==========================================

export const PremiumTokens = {
  // Enhanced Glass Effects
  glass: {
    subtle: 'bg-white/10 backdrop-blur-md border border-white/20',
    medium: 'bg-white/15 backdrop-blur-lg border border-white/30',
    strong: 'bg-white/20 backdrop-blur-xl border border-white/40',
    intense: 'bg-white/25 backdrop-blur-2xl border border-white/50'
  },

  // Premium Shadows (layered for depth)
  shadows: {
    soft: 'shadow-lg drop-shadow-sm',
    medium: 'shadow-xl drop-shadow-md',
    strong: 'shadow-2xl drop-shadow-lg',
    magical: 'shadow-2xl drop-shadow-lg shadow-purple-500/10'
  },

  // Advanced Gradients
  gradients: {
    primary: 'bg-gradient-to-br from-[#972A4C] via-[#B8336A] to-[#C44088]',
    secondary: 'bg-gradient-to-br from-[#5E7794] via-[#7B9BB8] to-[#98BFDC]',
    success: 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500',
    warning: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500',
    magical: 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600',
    aurora: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'
  },

  // Premium Typography
  typography: {
    display: 'font-display font-black tracking-tight',
    headline: 'font-display font-bold tracking-tight',
    title: 'font-sans font-semibold tracking-wide',
    body: 'font-sans font-medium',
    caption: 'font-sans font-medium text-xs tracking-wide uppercase'
  },

  // Motion Presets
  motion: {
    spring: { type: "spring", stiffness: 400, damping: 30 },
    bounce: { type: "spring", stiffness: 300, damping: 20 },
    smooth: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] },
    magical: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// ==========================================
// 🌟 PREMIUM GLASS COMPONENTS
// ==========================================

// Magical Glass Card
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong' | 'intense';
  hover?: boolean;
  glow?: boolean;
  gradient?: keyof typeof PremiumTokens.gradients;
}

export function GlassCard({ 
  children, 
  className = '', 
  intensity = 'medium',
  hover = true,
  glow = false,
  gradient 
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { 
        scale: 1.02, 
        y: -4,
        transition: PremiumTokens.motion.spring 
      } : undefined}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-3xl
        ${PremiumTokens.glass[intensity]}
        ${PremiumTokens.shadows.strong}
        ${glow ? 'shadow-lg shadow-purple-500/20' : ''}
        ${className}
      `}
    >
      {/* Background Gradient */}
      {gradient && (
        <div className={`absolute inset-0 ${PremiumTokens.gradients[gradient]} opacity-10`} />
      )}
      
      {/* Glass Reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
      
      {/* Subtle Border Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50" 
           style={{ padding: '1px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Magical Particles */}
      {glow && (
        <>
          <div className="absolute top-4 right-6 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
          <div className="absolute bottom-6 left-4 w-0.5 h-0.5 bg-white/40 rounded-full animate-ping" />
          <div className="absolute top-1/2 right-4 w-0.5 h-0.5 bg-white/50 rounded-full animate-bounce" />
        </>
      )}
    </motion.div>
  );
}

// Floating Action Button with Magic
interface FloatingActionButtonProps {
  icon: string;
  label?: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  gradient?: keyof typeof PremiumTokens.gradients;
  pulse?: boolean;
}

export function FloatingActionButton({ 
  icon, 
  label,
  onClick, 
  position = 'bottom-right',
  gradient = 'primary',
  pulse = false 
}: FloatingActionButtonProps) {
  const positions = {
    'bottom-right': 'fixed bottom-24 right-6',
    'bottom-left': 'fixed bottom-24 left-6',
    'top-right': 'fixed top-24 right-6',
    'top-left': 'fixed top-24 left-6'
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className={`
        ${positions[position]} z-50
        w-16 h-16 rounded-2xl
        ${PremiumTokens.gradients[gradient]}
        ${PremiumTokens.shadows.magical}
        flex items-center justify-center
        text-white text-2xl
        ${pulse ? 'animate-pulse' : ''}
      `}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={PremiumTokens.motion.bounce}
    >
      <motion.span
        animate={pulse ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360] 
        } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.span>
      
      {/* Glow Ring */}
      <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping" />
      
      {/* Label */}
      {label && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-4 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap"
        >
          {label}
        </motion.div>
      )}
    </motion.button>
  );
}

// Premium Progress Ring
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  showText?: boolean;
}

export function ProgressRing({ 
  progress, 
  size = 100, 
  strokeWidth = 8,
  color = '#972A4C',
  backgroundColor = '#e5e7eb',
  animated = true,
  showText = true 
}: ProgressRingProps) {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          stroke={backgroundColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Progress Circle */}
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animated ? strokeDashoffset : circumference - (progress / 100) * circumference }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(151, 42, 76, 0.3))'
          }}
        />
      </svg>
      
      {/* Text */}
      {showText && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, ...PremiumTokens.motion.bounce }}
        >
          <span className="text-lg font-bold text-gray-800">{Math.round(progress)}%</span>
        </motion.div>
      )}
    </div>
  );
}

// Animated Background Particles
export function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
  }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const colors = ['rgba(151, 42, 76, 0.1)', 'rgba(94, 119, 148, 0.1)', 'rgba(255, 255, 255, 0.1)'];
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 10
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Magical Loading Spinner
export function MagicalSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="relative">
      <motion.div
        className={`${sizes[size]} rounded-full border-4 border-transparent`}
        style={{
          background: 'conic-gradient(from 0deg, #972A4C, #B8336A, #C44088, #972A4C)',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner glow */}
      <motion.div
        className={`absolute inset-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

// Slide-up Panel (like iOS Control Center)
interface SlideUpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string;
}

export function SlideUpPanel({ isOpen, onClose, children, height = 'h-96' }: SlideUpPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={PremiumTokens.motion.smooth}
            className={`
              fixed bottom-0 left-0 right-0 z-50
              ${height} rounded-t-3xl
              ${PremiumTokens.glass.strong}
              ${PremiumTokens.shadows.magical}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-white/40 rounded-full" />
            </div>
            
            {/* Content */}
            <div className="px-6 pb-6 overflow-y-auto max-h-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Haptic Feedback Button
export function HapticButton({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  haptic = true 
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'magical';
  className?: string;
  haptic?: boolean;
}) {
  const variants = {
    primary: PremiumTokens.gradients.primary,
    secondary: PremiumTokens.gradients.secondary,
    success: PremiumTokens.gradients.success,
    magical: PremiumTokens.gradients.magical
  };

  const handleClick = () => {
    // Simulate haptic feedback
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden
        ${variants[variant]}
        ${PremiumTokens.shadows.strong}
        text-white font-semibold
        rounded-2xl px-6 py-4
        ${className}
      `}
      transition={PremiumTokens.motion.spring}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}