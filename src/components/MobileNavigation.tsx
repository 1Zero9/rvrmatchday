import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavigationProps {
  currentPage?: string;
}

export default function MobileNavigation({ currentPage }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mainNavItems = [
    { href: "/matchday", label: "Match Day", icon: "⚽", description: "Today's fixtures & results" },
    { href: "/teams", label: "Teams", icon: "👥", description: "All our squads" },
    { href: "/about", label: "About Club", icon: "🏛️", description: "Our story & values" },
    { href: "/join/trials", label: "Join Us", icon: "🎯", description: "Book a trial" },
    { href: "/contact", label: "Contact", icon: "📞", description: "Get in touch" },
    { href: "/news", label: "News", icon: "📰", description: "Latest updates" },
    { href: "/gallery", label: "Gallery", icon: "📸", description: "Photos & videos" }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header - Fixed Position */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo/Home */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <img 
              src="/images/logo.png" 
              alt="RVR AFC Logo" 
              className="h-8 w-8"
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-sm">RVR AFC</span>
              <span className="text-xs text-gray-500">Est. 1981</span>
            </div>
          </Link>

          {/* Burger Menu */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-5 h-0.5 bg-gray-700 block transition-transform origin-center"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-0.5 bg-gray-700 block my-1 transition-opacity"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-5 h-0.5 bg-gray-700 block transition-transform origin-center"
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Spacing for Fixed Header */}
      <div className="md:hidden h-16"></div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="md:hidden fixed left-0 top-16 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Rivervalley Rangers AFC</h2>
                <p className="text-sm text-gray-600">Building community through football</p>
              </div>

              {/* Main Navigation */}
              <nav className="space-y-2 mb-8">
                {mainNavItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`
                        flex items-center p-4 rounded-lg transition-colors
                        ${currentPage === item.href 
                          ? 'bg-red-50 border border-red-200 text-red-700' 
                          : 'hover:bg-gray-50 border border-transparent'
                        }
                      `}
                    >
                      <span className="text-2xl mr-4">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Match Central Section */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-lg">Match Central</h3>
                    <p className="text-blue-200 text-sm">Password Protected Area</p>
                  </div>
                  <Link
                    href="/match-central/login"
                    onClick={closeMenu}
                    className="block bg-white/20 hover:bg-white/30 text-center py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    🔒 Access Match Central
                  </Link>
                  <p className="text-xs text-blue-200 text-center mt-2">Password: rvrfc2025</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/volunteering"
                    onClick={closeMenu}
                    className="p-3 bg-green-50 rounded-lg text-center border border-green-200 hover:bg-green-100 transition-colors"
                  >
                    <div className="text-lg mb-1">🤝</div>
                    <div className="text-xs font-medium text-green-800">Volunteer</div>
                  </Link>
                  <Link
                    href="/shop"
                    onClick={closeMenu}
                    className="p-3 bg-purple-50 rounded-lg text-center border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    <div className="text-lg mb-1">🛒</div>
                    <div className="text-xs font-medium text-purple-800">Shop</div>
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <div className="flex justify-center space-x-4 mb-4">
                  <a href="https://www.facebook.com/RVRFC/" className="text-blue-600 hover:text-blue-700">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">📘</span>
                    </div>
                  </a>
                  <a href="https://www.instagram.com/rvrfc1981/" className="text-pink-600 hover:text-pink-700">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">📷</span>
                    </div>
                  </a>
                </div>
                <p className="text-xs text-gray-500">© 2025 Rivervalley Rangers AFC</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}