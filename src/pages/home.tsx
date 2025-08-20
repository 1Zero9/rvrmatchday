import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function StandardHomepage() {
  const [activeCard, setActiveCard] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Main navigation cards for the homepage
  const mainCards = [
    {
      id: 'dashboard',
      title: 'Match Central',
      subtitle: 'Live matches & fixtures',
      description: 'Your complete matchday experience',
      color: 'from-green-600 to-emerald-700',
      icon: '⚽',
      href: '/dashboard'
    },
    {
      id: 'join',
      title: 'Join Us',
      subtitle: 'Registration & membership', 
      description: 'Start your football journey',
      color: 'from-blue-600 to-cyan-700',
      icon: '🚀',
      href: '/join'
    },
    {
      id: 'news',
      title: 'News & Updates',
      subtitle: 'Latest club announcements',
      description: 'Stay informed with club updates',
      color: 'from-purple-600 to-violet-700',
      icon: '📰',
      href: '/news'
    },
    {
      id: 'fundraising',
      title: 'Get Involved',
      subtitle: 'Fundraising & volunteering',
      description: 'Support your community club',
      color: 'from-amber-600 to-orange-700',
      icon: '🤝',
      href: '/fundraising'
    },
    {
      id: 'shop',
      title: 'Club Shop',
      subtitle: 'Merchandise & gear',
      description: 'Show your Rangers pride',
      color: 'from-red-600 to-pink-700',
      icon: '🛍️',
      href: '/shop'
    },
    {
      id: 'gallery',
      title: 'Gallery',
      subtitle: 'Photos & memories',
      description: 'Celebrating our community',
      color: 'from-indigo-600 to-purple-700',
      icon: '📸',
      href: '/gallery'
    }
  ];

  const handleLogoClick = () => {
    // Reset to Stage 1 (Identity Launch Page)
    sessionStorage.removeItem('hasSeenIntro');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo - Resets to Stage 1 */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
              <Image 
                src="/images/logo.png" 
                alt="Rivervalley Rangers AFC Logo" 
                width={40}
                height={40}
                className="drop-shadow-sm"
              />
              <div>
                <h1 className="font-bold text-lg">Rivervalley Rangers</h1>
                <p className="text-blue-200 text-xs">AFC</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/home" className="text-white hover:text-blue-200 transition-colors font-medium">
                Home
              </Link>
              
              <div className="relative group">
                <button className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
                  Match Central
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/dashboard" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                    Live Dashboard
                  </Link>
                  <Link href="/match-central/fixtures" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Fixtures
                  </Link>
                  <Link href="/match-central/results" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Results
                  </Link>
                  <Link href="/match-central/tables" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                    League Tables
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
                  The Club
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/about" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                    About Us
                  </Link>
                  <Link href="/club/history" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    History & Achievements
                  </Link>
                  <Link href="/club/facilities" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Facilities
                  </Link>
                  <Link href="/club/committee" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                    Committee / Governance
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
                  Teams
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/teams/youth" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                    Youth Teams
                  </Link>
                  <Link href="/teams/senior" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Senior Teams
                  </Link>
                  <Link href="/teams/coaching" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                    Coaching Staff
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
                  Join Us
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/join/youth" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                    Youth Membership
                  </Link>
                  <Link href="/join/senior" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Senior Membership
                  </Link>
                  <Link href="/join/family" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Family Packages
                  </Link>
                  <Link href="/join/academy" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Youth Academy
                  </Link>
                  <Link href="/join/trials" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                    Trials & Registration
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
                  Members
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/members/parents" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                    Parent Portal
                  </Link>
                  <Link href="/members/coaches" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Coach Dashboard
                  </Link>
                  <Link href="/members/admin" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                    Admin Access
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
                  News & Media
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/news" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                    Latest News
                  </Link>
                  <Link href="/news/gallery" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Photo Gallery
                  </Link>
                  <Link href="/news/events" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                    Events Calendar
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
                  Get Involved
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/get-involved/volunteering" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg">
                    Volunteering
                  </Link>
                  <Link href="/get-involved/fundraising" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Fundraising
                  </Link>
                  <Link href="/get-involved/sponsorship" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg">
                    Sponsorship & Partners
                  </Link>
                </div>
              </div>

              <Link href="/shop" className="text-white hover:text-blue-200 transition-colors font-medium">
                Shop
              </Link>
              <Link href="/contact" className="text-white hover:text-blue-200 transition-colors font-medium">
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
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

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-slate-800 border-t border-slate-700"
          >
            <nav className="px-4 py-4 space-y-2">
              <Link href="/home" className="block py-2 text-white hover:text-blue-200">Home</Link>
              <Link href="/dashboard" className="block py-2 text-white hover:text-blue-200">Match Central</Link>
              <Link href="/about" className="block py-2 text-white hover:text-blue-200">About</Link>
              <Link href="/teams" className="block py-2 text-white hover:text-blue-200">Teams</Link>
              <Link href="/join" className="block py-2 text-white hover:text-blue-200">Join</Link>
              <Link href="/login" className="block py-2 text-white hover:text-blue-200">Members</Link>
              <Link href="/news" className="block py-2 text-white hover:text-blue-200">News</Link>
              <Link href="/shop" className="block py-2 text-white hover:text-blue-200">Shop</Link>
              <Link href="/contact" className="block py-2 text-white hover:text-blue-200">Contact</Link>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Rivervalley Rangers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your complete football community hub. Discover matches, join teams, stay updated, and connect with fellow Rangers.
          </p>
        </motion.div>

        {/* Main Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {mainCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setActiveCard(index)}
              className="group"
            >
              <Link href={card.href}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${card.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      <svg className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-blue-100 text-sm">{card.subtitle}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    <div className="text-sm font-medium text-gray-400">
                      Click to explore →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Club at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600 mb-2">15+</p>
              <p className="text-sm text-gray-600">Active Teams</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600 mb-2">250+</p>
              <p className="text-sm text-gray-600">Club Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600 mb-2">44</p>
              <p className="text-sm text-gray-600">Years History</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600 mb-2">100%</p>
              <p className="text-sm text-gray-600">Community</p>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
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
                <li><Link href="/teams" className="text-gray-300 hover:text-white">Teams</Link></li>
                <li><Link href="/fixtures" className="text-gray-300 hover:text-white">Fixtures</Link></li>
                <li><Link href="/join" className="text-gray-300 hover:text-white">Join Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Members</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="text-gray-300 hover:text-white">Member Login</Link></li>
                <li><Link href="/coach/login" className="text-gray-300 hover:text-white">Coach Portal</Link></li>
                <li><Link href="/admin/login" className="text-gray-300 hover:text-white">Admin Access</Link></li>
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