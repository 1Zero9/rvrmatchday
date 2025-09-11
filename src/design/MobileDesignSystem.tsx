/**
 * 🎨 MOBILE DESIGN SYSTEM
 * Professional UI Components for Football Platform
 * 
 * Built for: Premium sports club experiences
 * Target: Modern, fast, conversion-focused mobile UX
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// 🎯 DESIGN TOKENS
// ==========================================

export const DesignTokens = {
  // Professional Color Palette
  colors: {
    // Primary Brand (Customizable per club)
    primary: {
      50: '#fef2f2',
      100: '#fde6e6', 
      200: '#fbc4c4',
      300: '#f87171',
      400: '#ef4444',
      500: '#dc2626', // Main brand color
      600: '#b91c1c',
      700: '#991b1b',
      800: '#7f1d1d',
      900: '#671414'
    },
    
    // Neutral Grays (Professional)
    neutral: {
      0: '#ffffff',
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    
    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  
  // Typography Scale (Professional)
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      display: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px  
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem'   // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },
  
  // 8px Grid System
  spacing: {
    0: '0px',
    1: '0.25rem', // 4px
    2: '0.5rem',  // 8px  
    3: '0.75rem', // 12px
    4: '1rem',    // 16px
    5: '1.25rem', // 20px
    6: '1.5rem',  // 24px
    8: '2rem',    // 32px
    10: '2.5rem', // 40px
    12: '3rem',   // 48px
    16: '4rem',   // 64px
    20: '5rem'    // 80px
  },
  
  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem', // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px'
  },
  
  // Shadows (Subtle, Professional)
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
};

// ==========================================
// 📱 MOBILE COMPONENTS
// ==========================================

// Professional Hero Section
interface MobileHeroProps {
  image: string;
  title: string;
  subtitle?: string;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  overlay?: 'light' | 'dark' | 'gradient';
  children?: ReactNode;
}

export function MobileHero({ 
  image, 
  title, 
  subtitle, 
  height = 'lg',
  overlay = 'gradient',
  children 
}: MobileHeroProps) {
  const heights = {
    sm: 'h-48',   // 192px
    md: 'h-64',   // 256px
    lg: 'h-80',   // 320px  
    xl: 'h-96'    // 384px
  };
  
  const overlays = {
    light: 'bg-white/40',
    dark: 'bg-black/50', 
    gradient: 'bg-gradient-to-t from-black/60 via-black/20 to-transparent'
  };
  
  return (
    <div className={`relative ${heights[height]} overflow-hidden`}>
      <img 
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className={`absolute inset-0 ${overlays[overlay]}`} />
      
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <h1 className="text-2xl font-bold mb-1 text-shadow-lg">{title}</h1>
          {subtitle && <p className="text-sm text-gray-200">{subtitle}</p>}
        </motion.div>
        {children}
      </div>
    </div>
  );
}

// Action Card Component
interface ActionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export function ActionCard({ 
  icon, 
  title, 
  subtitle, 
  href, 
  variant = 'primary',
  size = 'md' 
}: ActionCardProps) {
  const variants = {
    primary: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100',
    secondary: 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100',
    success: 'bg-green-50 border-green-200 text-green-900 hover:bg-green-100',
    warning: 'bg-orange-50 border-orange-200 text-orange-900 hover:bg-orange-100'
  };
  
  const sizes = {
    sm: 'p-3',
    md: 'p-4', 
    lg: 'p-6'
  };
  
  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };
  
  return (
    <motion.a
      href={href}
      whileTap={{ scale: 0.98 }}
      className={`
        block ${sizes[size]} rounded-xl border-2 transition-all duration-200
        ${variants[variant]}
        hover:shadow-md hover:scale-[1.02]
        active:scale-[0.98]
      `}
    >
      <div className="text-center">
        <div className={`${iconSizes[size]} mb-2`}>{icon}</div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs opacity-75">{subtitle}</p>
      </div>
    </motion.a>
  );
}

// Professional Header
interface MobileHeaderProps {
  logo: string;
  clubName: string;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export function MobileHeader({ logo, clubName, onMenuToggle, isMenuOpen }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <img src={logo} alt={`${clubName} Logo`} className="h-6 w-6" />
          <span className="font-semibold text-sm text-gray-900">{clubName}</span>
        </div>
        
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-5 flex flex-col justify-center items-center">
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              className="w-4 h-0.5 bg-gray-700 block transition-transform origin-center"
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-4 h-0.5 bg-gray-700 block my-0.5 transition-opacity"
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              className="w-4 h-0.5 bg-gray-700 block transition-transform origin-center"
            />
          </div>
        </button>
      </div>
    </header>
  );
}

// Content Cards
interface ContentCardProps {
  title: string;
  content: string;
  image?: string;
  date?: string;
  category?: string;
  href?: string;
}

export function ContentCard({ title, content, image, date, category, href }: ContentCardProps) {
  const Card = href ? motion.a : motion.div;
  
  return (
    <Card 
      href={href}
      whileHover={href ? { y: -2 } : undefined}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      {image && (
        <div className="h-32 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          {category && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
              {category}
            </span>
          )}
          {date && <span className="text-xs text-gray-500">{date}</span>}
        </div>
        
        <h3 className="font-semibold text-gray-900 text-sm mb-2">{title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{content}</p>
      </div>
    </Card>
  );
}

// Bottom Navigation (if needed)
interface BottomNavProps {
  items: Array<{
    icon: string;
    label: string;
    href: string;
    active?: boolean;
  }>;
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              item.active 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

// Loading States
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
      />
    </div>
  );
}

// Error States  
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-800 text-sm">{message}</p>
    </div>
  );
}

// Empty States
export function EmptyState({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4 opacity-50">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-sm mx-auto">{description}</p>
    </div>
  );
}