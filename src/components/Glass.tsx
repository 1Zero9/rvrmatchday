import { ReactNode } from 'react';
import { motion } from 'framer-motion';

// Base Glass Card Component
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  gradient?: 'blue' | 'green' | 'purple' | 'orange' | 'white' | 'dark' | 'club-primary' | 'club-secondary' | 'club-accent';
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className = '', 
  intensity = 'medium',
  gradient = 'white',
  hover = false,
  onClick 
}: GlassCardProps) {
  const intensityStyles = {
    light: 'bg-white/10 backdrop-blur-sm border-white/20',
    medium: 'bg-white/15 backdrop-blur-md border-white/30', 
    heavy: 'bg-white/25 backdrop-blur-lg border-white/40'
  };

  const gradientStyles = {
    blue: 'bg-blue-800/70 border-blue-300/30',
    green: 'bg-green-800/70 border-green-300/30',
    purple: 'bg-purple-800/70 border-purple-300/30',
    orange: 'bg-orange-800/70 border-orange-300/30',
    white: intensityStyles[intensity],
    dark: 'bg-black/70 backdrop-blur-md border-gray-400/30',
    'club-primary': 'bg-club-primary/70 border-club-primary/30',
    'club-secondary': 'bg-club-secondary/70 border-club-secondary/30', 
    'club-accent': 'bg-club-accent/70 border-club-accent/30'
  };

  const hoverStyles = hover ? 'hover:bg-white/30 hover:scale-[1.02] transition-all duration-300' : '';

  return (
    <motion.div
      className={`
        ${gradientStyles[gradient]} 
        ${hoverStyles}
        border rounded-2xl shadow-xl
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : {}}
    >
      {children}
    </motion.div>
  );
}

// Floating Action Card
interface GlassActionCardProps {
  icon: string;
  title: string;
  description?: string;
  href?: string;
  gradient?: 'blue' | 'green' | 'purple' | 'orange' | 'white' | 'club-primary' | 'club-secondary' | 'club-accent';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export function GlassActionCard({
  icon,
  title,
  description,
  href,
  gradient = 'white',
  size = 'md',
  children
}: GlassActionCardProps) {
  const sizeStyles = {
    sm: 'p-4 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg'
  };

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl', 
    lg: 'text-4xl'
  };

  const Component = href ? motion.a : motion.div;
  const linkProps = href ? { href } : {};

  return (
    <Component
      {...linkProps}
      className={`
        block text-center text-white cursor-pointer
        ${sizeStyles[size]}
      `}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard 
        gradient={gradient} 
        hover={true}
        className="h-full"
      >
        <div className={`${iconSizes[size]} mb-3`}>{icon}</div>
        <h3 className="font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-xs opacity-90 mb-3">{description}</p>
        )}
        {children}
      </GlassCard>
    </Component>
  );
}

// Glass Navigation Bar
interface GlassNavProps {
  children: ReactNode;
  className?: string;
}

export function GlassNav({ children, className = '' }: GlassNavProps) {
  return (
    <nav className={`
      bg-white/10 backdrop-blur-md border-b border-white/20
      sticky top-0 z-50
      ${className}
    `}>
      {children}
    </nav>
  );
}

// Glass Modal/Dialog
interface GlassModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function GlassModal({ children, isOpen, onClose, title }: GlassModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-lg w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard intensity="heavy" className="p-6">
          {title && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
          )}
          <div className="text-white">
            {children}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// Glass Button
interface GlassButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false
}: GlassButtonProps) {
  const variantStyles = {
    primary: 'bg-white/20 hover:bg-white/30 text-white border-white/30',
    secondary: 'bg-black/20 hover:bg-black/30 text-white border-white/20',
    ghost: 'bg-transparent hover:bg-white/10 text-white border-white/20'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        backdrop-blur-md border rounded-lg font-semibold
        transition-all duration-300 disabled:opacity-50
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  );
}

// Glass Stats Card
interface GlassStatsProps {
  icon: string;
  value: string;
  label: string;
  gradient?: 'blue' | 'green' | 'purple' | 'orange';
}

export function GlassStats({ icon, value, label, gradient = 'blue' }: GlassStatsProps) {
  return (
    <GlassCard gradient={gradient} className="p-6 text-center text-white">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </GlassCard>
  );
}

// Glass Hero Section
interface GlassHeroProps {
  backgroundImage?: string;
  backgroundVideo?: string;
  overlay?: boolean;
  children: ReactNode;
  height?: string;
}

export function GlassHero({
  backgroundImage,
  backgroundVideo,
  overlay = true,
  children,
  height = 'h-[70vh] min-h-[500px]'
}: GlassHeroProps) {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background Media */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img 
            src={backgroundImage}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          {overlay && <div className="absolute inset-0 bg-black/40" />}
        </div>
      )}
      
      {backgroundVideo && (
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          {overlay && <div className="absolute inset-0 bg-black/40" />}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 w-full px-4 max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}