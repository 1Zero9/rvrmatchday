/**
 * Mobile Action Card Component
 * Vibrant, interactive cards for mobile CTAs and actions
 * Features: Glass morphism, animations, gradients, strong visual hierarchy
 */

import { motion } from 'framer-motion';
import Link from 'next/link';

interface MobileActionCardProps {
  icon: string;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  gradient: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal' | 'red' | 'amber';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  badge?: string;
  disabled?: boolean;
}

export default function MobileActionCard({
  icon,
  title,
  description,
  href,
  onClick,
  gradient,
  size = 'medium',
  className = '',
  badge,
  disabled = false
}: MobileActionCardProps) {
  const gradientClasses = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-violet-600',
    orange: 'from-orange-500 to-amber-600',
    pink: 'from-pink-500 to-rose-600',
    teal: 'from-teal-500 to-cyan-600',
    red: 'from-red-500 to-pink-600',
    amber: 'from-amber-500 to-yellow-600'
  };

  const sizeClasses = {
    small: 'p-4 h-24',
    medium: 'p-6 h-32',
    large: 'p-8 h-40'
  };

  const iconSizes = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  };

  const textSizes = {
    small: { title: 'text-sm', desc: 'text-xs' },
    medium: { title: 'text-base', desc: 'text-sm' },
    large: { title: 'text-lg', desc: 'text-base' }
  };

  const Component = href ? motion.a : motion.div;
  const linkProps = href ? { href } : {};

  const cardContent = (
    <Component
      {...linkProps}
      onClick={!disabled ? onClick : undefined}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      className={`
        block relative cursor-pointer
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className={`
        h-full bg-gradient-to-br ${gradientClasses[gradient]} rounded-2xl 
        shadow-2xl hover:shadow-3xl transition-all duration-300
        border border-white/30 backdrop-blur-lg
        flex flex-col items-center justify-center
        relative overflow-hidden
        drop-shadow-lg
      `}>
        {/* Enhanced Glass effect overlay */}
        <div className="absolute inset-0 bg-white/15 backdrop-blur-lg" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />
        
        {/* Inner glass panel */}
        <div className="absolute inset-1 bg-white/5 rounded-xl backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative z-10 text-center text-white p-3">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className={`${iconSizes[size]} mb-2 drop-shadow-lg`}
          >
            {icon}
          </motion.div>
          <h3 className={`font-bold ${textSizes[size].title} drop-shadow-md mb-1`}>
            {title}
          </h3>
          <p className={`opacity-90 ${textSizes[size].desc} drop-shadow-sm leading-tight`}>
            {description}
          </p>
        </div>

        {/* Badge with glass effect */}
        {badge && (
          <div className="absolute -top-1 -right-1 bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-xl border-2 border-white/50">
            {badge === 'NEW' ? 'N' : badge}
          </div>
        )}

        {/* Enhanced shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0">
          <div className="absolute top-2 right-3 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
          <div className="absolute bottom-3 left-2 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000" />
        </div>
      </div>
    </Component>
  );

  return href ? (
    <Link href={href} className="block">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}