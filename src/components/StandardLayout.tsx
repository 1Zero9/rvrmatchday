import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, ReactNode } from "react";

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
      {/* Header Navigation - Modern Large Header */}
      <header className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white shadow-2xl sticky top-0 z-50 border-b-4 border-green-400">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;utf8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22 fill=%22white%22%3e%3ccircle cx=%2250%22 cy=%2250%22 r=%224%22/%3e%3ccircle cx=%22150%22 cy=%2280%22 r=%222%22/%3e%3ccircle cx=%2280%22 cy=%22140%22 r=%223%22/%3e%3ccircle cx=%22180%22 cy=%22160%22 r=%222%22/%3e%3ccircle cx=%2220%22 cy=%22120%22 r=%222%22/%3e%3ccircle cx=%22120%22 cy=%2230%22 r=%221.5%22/%3e%3c/svg%3e')] bg-repeat"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
          <div className="flex justify-between items-center py-6">
            
            {/* Enhanced Logo Section */}
            <div className="flex items-center space-x-6 cursor-pointer group" onClick={handleLogoClick}>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/20 transition-all duration-300">
                  <Image 
                    src="/images/logo.png" 
                    alt="Rivervalley Rangers AFC Logo" 
                    width={64}
                    height={64}
                    className="drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                <h1 className="font-bold text-2xl text-white group-hover:text-green-100 transition-colors duration-300">
                  Rivervalley Rangers
                </h1>
                <p className="text-green-200 text-base font-medium flex items-center space-x-2">
                  <span>AFC</span>
                  <span className="text-yellow-400 animate-bounce">⚽</span>
                  <span className="text-xs bg-green-600 px-2 py-1 rounded-full">EST. 2009</span>
                </p>
              </div>
            </div>

            {/* Modern Large Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link href="/home" className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-semibold text-lg backdrop-blur-sm border border-white/10 hover:border-white/30">
                <span className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>Home</span>
                </span>
              </Link>
              
              <div className="relative group">
                <button className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-semibold text-lg backdrop-blur-sm border border-white/10 hover:border-white/30 flex items-center space-x-2">
                  <span>⚽</span>
                  <span>Matches</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-4 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <Link href="/dashboard" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    📊 Live Dashboard
                  </Link>
                  <Link href="/match-central/fixtures" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    📅 Fixtures
                  </Link>
                  <Link href="/match-central/results" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    🏆 Results
                  </Link>
                  <Link href="/match-central/tables" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
                    📋 League Tables
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-semibold text-lg backdrop-blur-sm border border-white/10 hover:border-white/30 flex items-center space-x-2">
                  <span>🏛️</span>
                  <span>Club & Teams</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-4 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">About Club</div>
                  <Link href="/about" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    📖 About Us
                  </Link>
                  <Link href="/club/history" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    🏆 History & Achievements
                  </Link>
                  <Link href="/club/facilities" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    🏟️ Facilities
                  </Link>
                  <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-t">Teams</div>
                  <Link href="/teams/youth" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    👦 Youth Teams
                  </Link>
                  <Link href="/teams/senior" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    👨 Senior Teams
                  </Link>
                  <Link href="/teams/coaching" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
                    🧑‍🏫 Coaches
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-semibold text-lg backdrop-blur-sm border border-white/10 hover:border-white/30 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Join & Support</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-4 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Join Club</div>
                  <Link href="/join/trials" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    🎯 Trials & Registration
                  </Link>
                  <Link href="/join/youth" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    👦 Youth Membership
                  </Link>
                  <Link href="/join/senior" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    👨 Senior Membership
                  </Link>
                  <Link href="/join/academy" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    ⭐ Elite Academy
                  </Link>
                  <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-t">Support</div>
                  <Link href="/get-involved/volunteering" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    🙋 Volunteer
                  </Link>
                  <Link href="/get-involved/sponsorship" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
                    🤝 Sponsor
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-semibold text-lg backdrop-blur-sm border border-white/10 hover:border-white/30 flex items-center space-x-2">
                  <span>👥</span>
                  <span>Members</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-4 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <Link href="/members/parents" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    👨‍👩‍👧‍👦 Parent Portal
                  </Link>
                  <Link href="/members/coaches" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    🧑‍🏫 Coach Dashboard
                  </Link>
                  <Link href="/members/admin" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
                    🔐 Admin Access
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-semibold text-lg backdrop-blur-sm border border-white/10 hover:border-white/30 flex items-center space-x-2">
                  <span>📰</span>
                  <span>News & More</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-4 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <Link href="/news-media/events" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-100">
                    📰 News & Events
                  </Link>
                  <Link href="/shop" className="block px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 border-b border-gray-100">
                    🛍️ Club Shop
                  </Link>
                  <Link href="/contact" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
                    📞 Contact Us
                  </Link>
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button - Football Style */}
            <button 
              className="lg:hidden text-white bg-green-600 p-2 rounded-lg hover:bg-green-500 transition-colors"
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
            className="lg:hidden bg-green-800 border-t-2 border-white"
          >
            <nav className="px-4 py-4 space-y-1">
              <Link href="/home" className="block py-3 text-white hover:bg-green-700 rounded px-2">🏠 Home</Link>
              <Link href="/dashboard" className="block py-3 text-white hover:bg-green-700 rounded px-2">⚽ Matches</Link>
              <Link href="/about" className="block py-3 text-white hover:bg-green-700 rounded px-2">🏛️ Club & Teams</Link>
              <Link href="/join/trials" className="block py-3 text-white hover:bg-green-700 rounded px-2">🎯 Join & Support</Link>
              <Link href="/members/parents" className="block py-3 text-white hover:bg-green-700 rounded px-2">👨‍👩‍👧‍👦 Members</Link>
              <Link href="/news-media/events" className="block py-3 text-white hover:bg-green-700 rounded px-2">📰 News & More</Link>
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="/images/logo.png" 
                  alt="Rivervalley Rangers AFC Logo" 
                  width={32}
                  height={32}
                />
                <h3 className="font-bold">Rivervalley Rangers AFC</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Building Community Through Football Since 2009
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link href="/teams/youth" className="text-gray-300 hover:text-white">Teams</Link></li>
                <li><Link href="/match-central/fixtures" className="text-gray-300 hover:text-white">Fixtures</Link></li>
                <li><Link href="/join" className="text-gray-300 hover:text-white">Join Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Members</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/members/parents" className="text-gray-300 hover:text-white">Parent Portal</Link></li>
                <li><Link href="/members/coaches" className="text-gray-300 hover:text-white">Coach Dashboard</Link></li>
                <li><Link href="/members/admin" className="text-gray-300 hover:text-white">Admin Access</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-white">📘 Facebook</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">📸 Instagram</a></li>
                <li><a href="mailto:info@rvrfc.com" className="text-gray-300 hover:text-white">📧 Email</a></li>
                <li><a href="tel:+353123456789" className="text-gray-300 hover:text-white">📞 Phone</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Rivervalley Rangers AFC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}