/**
 * 🎯 PROFESSIONAL MOBILE NAVIGATION
 * Premium mobile navigation system
 * 
 * Features: Smooth animations, professional styling, modular structure
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileHeader } from '../../design/MobileDesignSystem';

interface MobileNavigationProProps {
  currentPage?: string;
  clubData?: {
    name: string;
    logo: string;
    established: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
}

export default function MobileNavigationPro({ 
  currentPage,
  clubData = {
    name: "RVR AFC",
    logo: "/images/logo.png", 
    established: "1981",
    colors: {
      primary: "var(--club-primary)",
      secondary: "var(--club-secondary)",
      accent: "var(--club-accent)",
      neutral: "var(--club-neutral)"
    }
  }
}: MobileNavigationProProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Marketing-focused navigation items
  const publicNavItems = [
    {
      href: "/matchday",
      label: "MatchDay",
      icon: "⚽",
      description: "Live fixtures & results", 
      color: "text-green-700",
      bgColor: "bg-green-50"
    },
    {
      href: "/join/trials",
      label: "Join Club", 
      icon: "🎯",
      description: "Book a trial today",
      color: "text-blue-700",
      bgColor: "bg-blue-50"
    },
    {
      href: "/teams",
      label: "Our Teams",
      icon: "👥", 
      description: "All squads & ages",
      color: "text-purple-700",
      bgColor: "bg-purple-50"
    },
    {
      href: "/about",
      label: "About Club",
      icon: "🏛️",
      description: "Our story & values", 
      color: "text-gray-700",
      bgColor: "bg-gray-50"
    },
    {
      href: "/contact", 
      label: "Contact",
      icon: "📞",
      description: "Get in touch",
      color: "text-orange-700", 
      bgColor: "bg-orange-50"
    }
  ];

  // Professional tools section
  const professionalTools = [
    {
      href: "/match-central/login",
      label: "Match Central",
      icon: "🔒", 
      description: "Coaching & admin tools",
      requiresAuth: true
    },
    {
      href: "/tracker",
      label: "Match Tracker", 
      icon: "📊",
      description: "Performance analytics",
      requiresAuth: true
    }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Professional Header */}
      <MobileHeader
        logo={clubData.logo}
        clubName={clubData.name}
        onMenuToggle={toggleMenu}
        isMenuOpen={isOpen}
      />

      {/* Compact spacing */}
      <div className="h-12" />

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-12 bottom-0 w-80 max-w-[85vw] bg-gradient-to-br from-white via-gray-50 to-[var(--club-accent)]/10 z-50 shadow-2xl overflow-y-auto border-r-4 border-[var(--club-primary)]"
          >
            <div className="p-6">
              
              {/* Club Identity Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8 pb-6 border-b-2 border-[var(--club-primary)]/20 bg-gradient-to-r from-[var(--club-primary)]/5 to-[var(--club-secondary)]/5 rounded-lg p-4 mx-2"
              >
                <img 
                  src={clubData.logo} 
                  alt={`${clubData.name} Logo`}
                  className="w-16 h-16 mx-auto mb-3"
                />
                <h2 className="font-bold text-lg text-[var(--club-primary)]">Rivervalley Rangers AFC</h2>
                <p className="text-sm text-[#5E7794] font-medium">Community Football Since {clubData.established}</p>
              </motion.div>

              {/* Main Navigation */}
              <motion.nav
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 mb-8"
              >
                {publicNavItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.05) }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`
                        flex items-center p-4 rounded-xl transition-all duration-200
                        ${currentPage === item.href 
                          ? `bg-gradient-to-r from-[var(--club-primary)]/10 to-[var(--club-secondary)]/10 border-2 border-[var(--club-primary)]/30 shadow-sm` 
                          : 'hover:bg-gradient-to-r hover:from-[#98C0F0]/10 hover:to-white border-2 border-transparent'
                        }
                      `}
                    >
                      <div className={`text-2xl mr-4 ${currentPage === item.href ? 'text-[var(--club-primary)]' : 'text-[var(--club-secondary)]'}`}>{item.icon}</div>
                      <div className="flex-1">
                        <div className={`font-semibold ${currentPage === item.href ? 'text-[var(--club-primary)]' : 'text-gray-900'}`}>{item.label}</div>
                        <div className={`text-xs ${currentPage === item.href ? 'text-[#5E7794]' : 'text-gray-500'}`}>{item.description}</div>
                      </div>
                      <svg className={`w-5 h-5 ${currentPage === item.href ? 'text-[var(--club-primary)]' : 'text-[var(--club-neutral)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Professional Tools Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="border-t border-gray-200 pt-6 mb-6"
              >
                <h3 className="text-sm font-bold text-[var(--club-primary)] mb-4 uppercase tracking-wide">
                  Professional Tools
                </h3>
                
                <div className="space-y-3">
                  {professionalTools.map((tool, index) => (
                    <motion.div
                      key={tool.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + (index * 0.1) }}
                    >
                      <Link
                        href={tool.href}
                        onClick={closeMenu}
                        className="flex items-center p-3 rounded-lg bg-gradient-to-r from-[var(--club-primary)] to-[var(--club-secondary)] text-white hover:from-[var(--club-primary)]/90 hover:to-[var(--club-secondary)]/90 transition-all shadow-md"
                      >
                        <span className="text-xl mr-3">{tool.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{tool.label}</div>
                          <div className="text-xs opacity-90">{tool.description}</div>
                        </div>
                        {tool.requiresAuth && (
                          <div className="w-2 h-2 bg-[#98C0F0] rounded-full" title="Requires login" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="border-t border-gray-200 pt-6 mb-6"
              >
                <h3 className="text-sm font-bold text-[var(--club-primary)] mb-4 uppercase tracking-wide">
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/gallery"
                    onClick={closeMenu}
                    className="p-3 bg-gradient-to-br from-[var(--club-accent)]/10 to-white rounded-lg text-center border border-[var(--club-neutral)]/30 hover:bg-gradient-to-br hover:from-[var(--club-accent)]/20 hover:to-[var(--club-primary)]/5 transition-all shadow-sm"
                  >
                    <div className="text-lg mb-1">📸</div>
                    <div className="text-xs font-semibold text-[#5E7794]">Gallery</div>
                  </Link>
                  <Link
                    href="/news"
                    onClick={closeMenu}
                    className="p-3 bg-gradient-to-br from-[var(--club-accent)]/10 to-white rounded-lg text-center border border-[var(--club-neutral)]/30 hover:bg-gradient-to-br hover:from-[var(--club-accent)]/20 hover:to-[var(--club-primary)]/5 transition-all shadow-sm"
                  >
                    <div className="text-lg mb-1">📰</div>
                    <div className="text-xs font-semibold text-[#5E7794]">News</div>
                  </Link>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="text-center border-t border-gray-200 pt-6"
              >
                <h3 className="text-sm font-bold text-[var(--club-primary)] mb-4">Follow Us</h3>
                <div className="flex justify-center space-x-4 mb-4">
                  <a 
                    href="https://www.facebook.com/RVRFC/" 
                    className="w-10 h-10 bg-gradient-to-br from-[#98C0F0]/20 to-[#5E7794]/10 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-[#98C0F0]/30 hover:to-[#5E7794]/20 transition-all shadow-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-sm">📘</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/rvrfc1981/" 
                    className="w-10 h-10 bg-gradient-to-br from-[var(--club-primary)]/20 to-[var(--club-accent)]/10 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-[var(--club-primary)]/30 hover:to-[var(--club-accent)]/20 transition-all shadow-sm"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span className="text-sm">📷</span>
                  </a>
                </div>
                <p className="text-xs text-[#5E7794] font-medium">© 2025 Rivervalley Rangers AFC</p>
                <p className="text-xs text-[#B6B7B6] mt-1">Powered by RVR Platform</p>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}