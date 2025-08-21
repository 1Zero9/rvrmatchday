import Link from "next/link";
import { motion } from "framer-motion";
// import { useState } from "react";
import StandardLayout from "../components/StandardLayout";

export default function StandardHomepage() {
  // const [activeCard, setActiveCard] = useState(0);

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
      description: 'Show your club pride',
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

  return (
    <StandardLayout title="Home">
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
            Your complete football community hub. Discover matches, join teams, stay updated, and connect with our community.
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
              // onHoverStart={() => setActiveCard(index)}
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-green-600 via-blue-600 to-green-700 rounded-2xl shadow-xl p-8 text-white mb-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative text-center">
            <div className="text-6xl mb-4">⚽</div>
            <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-xl text-green-100 mb-6 max-w-2xl mx-auto">
              From grassroots to competitive football, we offer programs for all ages and skill levels.
              Join our football family today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join/youth" className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Join Youth Teams
              </Link>
              <Link href="/join/senior" className="bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors border border-green-600">
                Senior Football
              </Link>
              <Link href="/contact" className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors border border-white">
                Get in Touch
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16"
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

        {/* Sponsors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl p-8 border-2 border-blue-200 shadow-xl"
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🤝</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Community Partners</h2>
            <p className="text-lg text-gray-600">Supporting Rivervalley Rangers and local football development</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Enhanced sponsor placeholders with logo areas */}
            <div className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-blue-100 hover:border-blue-300">
              <div className="text-center">
                {/* Logo placeholder area */}
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-20 w-full mb-4 flex items-center justify-center border-2 border-dashed border-blue-300">
                  <div className="text-center text-blue-600">
                    <div className="text-2xl mb-1">📷</div>
                    <p className="text-xs font-medium">Logo Here</p>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Main Sponsor</h3>
                <p className="text-blue-600 text-sm font-semibold">Primary Partnership</p>
                <p className="text-gray-500 text-xs mt-1">€5,000+ per year</p>
              </div>
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-95 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="font-bold mb-2">Partnership Opportunity</p>
                  <p className="text-sm mb-3">Become our main sponsor and get maximum visibility</p>
                  <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Contact Us
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-green-100 hover:border-green-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg h-20 w-full mb-4 flex items-center justify-center border-2 border-dashed border-green-300">
                  <div className="text-center text-green-600">
                    <div className="text-2xl mb-1">📷</div>
                    <p className="text-xs font-medium">Logo Here</p>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Local Business</h3>
                <p className="text-green-600 text-sm font-semibold">Community Support</p>
                <p className="text-gray-500 text-xs mt-1">€1,000+ per year</p>
              </div>
              <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-95 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <div className="text-3xl mb-2">🌱</div>
                  <p className="font-bold mb-2">Local Partnership</p>
                  <p className="text-sm mb-3">Support grassroots football in your community</p>
                  <div className="bg-white text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Get Involved
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-purple-100 hover:border-purple-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg h-20 w-full mb-4 flex items-center justify-center border-2 border-dashed border-purple-300">
                  <div className="text-center text-purple-600">
                    <div className="text-2xl mb-1">📷</div>
                    <p className="text-xs font-medium">Logo Here</p>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Kit Sponsor</h3>
                <p className="text-purple-600 text-sm font-semibold">Equipment Partner</p>
                <p className="text-gray-500 text-xs mt-1">€2,500+ per year</p>
              </div>
              <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-95 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <div className="text-3xl mb-2">⚽</div>
                  <p className="font-bold mb-2">Kit Sponsorship</p>
                  <p className="text-sm mb-3">Your logo on every jersey - maximum exposure</p>
                  <div className="bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Learn More
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-orange-100 hover:border-orange-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg h-20 w-full mb-4 flex items-center justify-center border-2 border-dashed border-orange-300">
                  <div className="text-center text-orange-600">
                    <div className="text-2xl mb-1">📷</div>
                    <p className="text-xs font-medium">Logo Here</p>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Community Hub</h3>
                <p className="text-orange-600 text-sm font-semibold">Local Supporters</p>
                <p className="text-gray-500 text-xs mt-1">€500+ per year</p>
              </div>
              <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-95 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <div className="text-3xl mb-2">❤️</div>
                  <p className="font-bold mb-2">Join Our Family</p>
                  <p className="text-sm mb-3">Be part of our growing community story</p>
                  <div className="bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Join Us
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Why Sponsor Us?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <p className="font-semibold text-gray-900">250+ Members</p>
                  <p className="text-gray-600">Active community reach</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <p className="font-semibold text-gray-900">Social Media</p>
                  <p className="text-gray-600">Digital visibility</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <p className="font-semibold text-gray-900">Match Days</p>
                  <p className="text-gray-600">Local event presence</p>
                </div>
              </div>
            </div>
            <Link href="/get-involved/sponsorship" className="inline-block bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              🤝 Become a Sponsor
            </Link>
          </div>
        </motion.div>

      </main>
    </StandardLayout>
  );
}