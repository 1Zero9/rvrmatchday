import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import StandardLayout from "../components/StandardLayout";

export default function StandardHomepage() {
  const [activeCard, setActiveCard] = useState(0);

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
            <h2 className="text-3xl font-bold mb-4">Ready to Join Rangers?</h2>
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
          className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Community Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Sponsor placeholders with hover effects */}
            <div className="group relative bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🏢</div>
                <h3 className="font-semibold text-gray-900 mb-1">Main Sponsor</h3>
                <p className="text-gray-500 text-sm">Primary Partnership</p>
              </div>
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-blue-700">
                  <p className="font-semibold mb-1">Partnership Opportunity</p>
                  <p className="text-sm">Contact us to become our main sponsor</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🛍️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Local Business</h3>
                <p className="text-gray-500 text-sm">Community Support</p>
              </div>
              <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-green-700">
                  <p className="font-semibold mb-1">Local Partnership</p>
                  <p className="text-sm">Support local football development</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🏭</div>
                <h3 className="font-semibold text-gray-900 mb-1">Kit Sponsor</h3>
                <p className="text-gray-500 text-sm">Equipment Partner</p>
              </div>
              <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-purple-700">
                  <p className="font-semibold mb-1">Kit Sponsorship</p>
                  <p className="text-sm">Outfit our teams in style</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🤝</div>
                <h3 className="font-semibold text-gray-900 mb-1">Community</h3>
                <p className="text-gray-500 text-sm">Local Supporters</p>
              </div>
              <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-orange-700">
                  <p className="font-semibold mb-1">Join Our Family</p>
                  <p className="text-sm">Be part of our community story</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/get-involved/sponsorship" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Become a Sponsor
            </Link>
          </div>
        </motion.div>

      </main>
    </StandardLayout>
  );
}