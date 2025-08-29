/**
 * Standard Layout Component
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * This is the main layout wrapper providing consistent navigation,
 * header, and footer across all pages in the template.
 */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, ReactNode } from "react";
import Footer from "./Footer";
import DeveloperCredits from "./DeveloperCredits";

interface StandardLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function StandardLayout({ children, title }: StandardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    // Reset to Stage 1 (Identity Launch Page)
    sessionStorage.removeItem('hasSeenIntro');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation - Single Primary Color */}
      <header className="bg-club-primary text-white shadow-lg sticky top-0 z-50 border-b-4 border-club-accent">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;utf8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 fill=%22white%22%3e%3ccircle cx=%2220%22 cy=%2220%22 r=%222%22/%3e%3ccircle cx=%2280%22 cy=%2240%22 r=%221%22/%3e%3ccircle cx=%2240%22 cy=%2270%22 r=%221.5%22/%3e%3ccircle cx=%2290%22 cy=%2280%22 r=%221%22/%3e%3ccircle cx=%2210%22 cy=%2260%22 r=%221%22/%3e%3c/svg%3e')] bg-repeat"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-24">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={handleLogoClick}>
              <div className="relative">
                <Image 
                  src="/images/logo.png" 
                  alt="Rivervalley Rangers AFC Logo" 
                  width={64}
                  height={64}
                  className="drop-shadow-lg group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute -top-2 -right-2 group/indicator">
                  <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg relative cursor-help">
                    🚧
                    {/* Tooltip - positioned below */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-52 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg py-3 px-4 opacity-0 group-hover/indicator:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                      <div className="text-center">
                        <div className="text-yellow-400 mb-1">⚠️ BETA VERSION</div>
                        <div>Site under active development</div>
                        <div className="text-gray-300 text-xs mt-1">Some features may be incomplete</div>
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-black/90"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-xl text-white group-hover:text-slate-200 transition-colors duration-200">
                  Rivervalley Rangers
                </h1>
                <p className="text-slate-300 text-sm font-medium flex items-center space-x-2">
                  <span>AFC</span>
                  <span className="text-green-400">⚽</span>
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">EST. 1981</span>
                </p>
              </div>
            </div>

            {/* Balanced Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link href="/home" className="px-4 py-3 text-white hover:bg-club-primary-light rounded-lg transition-all duration-200 font-medium text-base">
                🏠 Home
              </Link>
              
              <div className="relative group">
                <button className="px-4 py-3 text-white hover:bg-club-primary-light rounded-lg transition-all duration-200 font-medium flex items-center text-base">
                  🏛️ About
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-club-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <Link href="/about" className="block px-4 py-3 text-gray-700 hover:bg-club-accent hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🏰 Our Story
                  </Link>
                  <Link href="/club" className="block px-4 py-3 text-gray-700 hover:bg-club-accent hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🏛️ Club Overview
                  </Link>
                  <Link href="/club/values" className="block px-4 py-3 text-gray-700 hover:bg-club-accent hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🤝 Our Values
                  </Link>
                  <Link href="/club/history" className="block px-4 py-3 text-gray-700 hover:bg-club-accent hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    📜 Club History
                  </Link>
                  <Link href="/club/facilities" className="block px-4 py-3 text-gray-700 hover:bg-club-accent hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🏟️ Facilities
                  </Link>
                  <Link href="/club/committee" className="block px-4 py-3 text-gray-700 hover:bg-club-accent hover:bg-opacity-20 hover:text-club-primary">
                    👥 Committee
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="px-4 py-3 text-white hover:bg-club-secondary-light rounded-lg transition-all duration-200 font-medium flex items-center text-base">
                  👥 Teams
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-club-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <Link href="/teams" className="block px-4 py-3 text-gray-700 hover:bg-club-secondary hover:bg-opacity-20 hover:text-club-secondary border-b border-gray-100 font-medium">
                    👥 All Teams
                  </Link>
                  <Link href="/teams/boys" className="block px-4 py-3 text-gray-700 hover:bg-club-secondary hover:bg-opacity-20 hover:text-club-secondary border-b border-gray-100">
                    ⚽ Boys Teams
                  </Link>
                  <Link href="/teams/girls" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🌟 Girls Teams
                  </Link>
                  <Link href="/teams/youth" className="block px-4 py-3 text-gray-700 hover:bg-club-secondary hover:bg-opacity-20 hover:text-club-secondary border-b border-gray-100">
                    🧒 Youth Teams
                  </Link>
                  <Link href="/teams/senior" className="block px-4 py-3 text-gray-700 hover:bg-club-secondary hover:bg-opacity-20 hover:text-club-secondary border-b border-gray-100">
                    👨 Senior Teams
                  </Link>
                  <Link href="/teams/inclusive" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🌈 Inclusive Football
                  </Link>
                  <Link href="/coach" className="block px-4 py-3 text-gray-700 hover:bg-club-accent hover:bg-opacity-20 hover:text-club-accent">
                    👨‍🏫 Coaching Staff
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="px-4 py-3 text-white hover:bg-club-accent-dark rounded-lg transition-all duration-200 font-medium text-base flex items-center space-x-1">
                  <span>⚽ Matches</span>
                  <span className="text-xs">▼</span>
                </button>
                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-club-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <Link href="/match-recorder" className="block px-4 py-3 text-gray-700 hover:bg-club-secondary hover:bg-opacity-20 hover:text-club-secondary border-b border-gray-100 font-medium">
                    📱 Record Match
                  </Link>
                  <Link href="/match-central" className="block px-4 py-3 text-gray-700 hover:bg-club-secondary hover:bg-opacity-20 hover:text-club-secondary border-b border-gray-100">
                    📊 Match Central
                  </Link>
                  <Link href="/match-admin" className="block px-4 py-3 text-gray-700 hover:bg-club-secondary hover:bg-opacity-20 hover:text-club-secondary">
                    ⚙️ Administration
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="px-4 py-3 text-white hover:bg-club-primary-dark rounded-lg transition-all duration-200 font-medium flex items-center text-base">
                  🌟 More
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-club-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <Link href="/news" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    📰 News
                  </Link>
                  <Link href="/gallery" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    📸 Gallery
                  </Link>
                  <Link href="/volunteering" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🤝 Volunteer
                  </Link>
                  <Link href="/fundraising" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    💰 Fundraising
                  </Link>
                  <Link href="/shop" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🛒 Club Shop
                  </Link>
                  <Link href="/get-involved/events" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🎉 Events
                  </Link>
                  <Link href="/boot-room" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary">
                    👢 Boot Room
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="px-4 py-3 text-white hover:bg-club-neutral-dark rounded-lg transition-all duration-200 font-medium flex items-center text-base">
                  📞 Contact
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-club-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <Link href="/contact" className="block px-4 py-3 text-gray-700 hover:bg-club-accent hover:bg-opacity-20 hover:text-club-secondary border-b border-gray-100 font-medium">
                    📞 Contact Us
                  </Link>
                  <Link href="/join" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🎯 Join the Club
                  </Link>
                  <Link href="/join/trials" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    ⚽ Trials
                  </Link>
                  <Link href="/join/inclusive" className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100">
                    🌈 Inclusive Football
                  </Link>
                  <Link href="/members" className="block px-4 py-3 text-gray-700 hover:bg-club-accent hover:bg-opacity-20 hover:text-club-accent">
                    👥 Member Area
                  </Link>
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button - Club Colors */}
            <button 
              className="lg:hidden text-white bg-club-primary p-2 rounded-lg hover:bg-club-primary-light transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Simplified Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-club-primary border-t-2 border-club-accent"
          >
            <nav className="px-4 py-4 space-y-2">
              <Link href="/home" className="block py-3 text-white hover:bg-club-primary-light rounded px-2" onClick={() => setMobileMenuOpen(false)}>🏠 Home</Link>
              <Link href="/about" className="block py-3 text-white hover:bg-club-primary-light rounded px-2" onClick={() => setMobileMenuOpen(false)}>🏛️ About</Link>
              <Link href="/club/history" className="block py-3 text-white hover:bg-club-primary-light rounded px-2 pl-6 text-sm" onClick={() => setMobileMenuOpen(false)}>📜 Club History</Link>
              <Link href="/teams" className="block py-3 text-white hover:bg-club-primary-light rounded px-2" onClick={() => setMobileMenuOpen(false)}>👥 Teams</Link>
              <Link href="/teams/boys" className="block py-3 text-white hover:bg-club-primary-light rounded px-2 pl-6 text-sm" onClick={() => setMobileMenuOpen(false)}>⚽ Boys Teams</Link>
              <Link href="/teams/girls" className="block py-3 text-white hover:bg-club-primary-light rounded px-2 pl-6 text-sm" onClick={() => setMobileMenuOpen(false)}>🌟 Girls Teams</Link>
              <Link href="/match-recorder" className="block py-3 text-white hover:bg-club-primary-light rounded px-2" onClick={() => setMobileMenuOpen(false)}>📱 Record Match</Link>
              <Link href="/match-central" className="block py-3 text-white hover:bg-club-primary-light rounded px-2" onClick={() => setMobileMenuOpen(false)}>📊 Match Central</Link>
              <Link href="/match-admin" className="block py-3 text-white hover:bg-club-primary-light rounded px-2" onClick={() => setMobileMenuOpen(false)}>⚙️ Admin</Link>
              <Link href="/volunteering" className="block py-3 text-white hover:bg-club-primary-light rounded px-2" onClick={() => setMobileMenuOpen(false)}>🤝 Volunteer</Link>
              <Link href="/contact" className="block py-3 text-white hover:bg-club-primary-light rounded px-2" onClick={() => setMobileMenuOpen(false)}>📞 Contact</Link>
              <Link href="/join" className="block py-3 text-white hover:bg-club-primary-light rounded px-2 pl-6 text-sm" onClick={() => setMobileMenuOpen(false)}>🎯 Join the Club</Link>
              <Link href="/join/trials" className="block py-3 text-white hover:bg-club-primary-light rounded px-2 pl-6 text-sm" onClick={() => setMobileMenuOpen(false)}>⚽ Trials</Link>
              <Link href="/coach" className="block py-3 text-white hover:bg-club-primary-light rounded px-2 pl-6 text-sm" onClick={() => setMobileMenuOpen(false)}>🧑‍🏫 Become a Coach</Link>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Page Title */}
      {title && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Enhanced Footer Component - Consistent across all pages */}
      <Footer />
      
      {/* Developer Credits - Minimal Branding */}
      <DeveloperCredits variant="minimal" />
    </div>
  );
}