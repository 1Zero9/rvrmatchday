import StandardLayout from '../components/StandardLayout';
import MobileLayout from '../components/MobileLayout';
import MobilePageContainer from '../components/mobile/MobilePageContainer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const galleryItems = [
    {
      id: 1,
      title: 'First Team Championship Celebration',
      category: 'first-team',
      date: '2024-08-18',
      description: 'Celebrating our promotion to Division 1A',
      image: '🏆',
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 2,
      title: 'Youth Academy Training Session',
      category: 'youth',
      date: '2024-08-15',
      description: 'Professional coaching for young talents',
      image: '⚽',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 3,
      title: 'New Clubhouse Opening',
      category: 'facilities',
      date: '2024-08-12',
      description: 'Modern facilities for our community',
      image: '🏠',
      color: 'from-purple-600 to-violet-600'
    },
    {
      id: 4,
      title: 'Community Fundraising Day',
      category: 'community',
      date: '2024-08-10',
      description: 'Family fun day bringing everyone together',
      image: '🎪',
      color: 'from-pink-600 to-rose-600'
    },
    {
      id: 5,
      title: 'Summer Training Camp',
      category: 'youth',
      date: '2024-08-08',
      description: 'Intensive skills development program',
      image: '🏃‍♂️',
      color: 'from-orange-600 to-amber-600'
    },
    {
      id: 6,
      title: 'Match Day Action - Local Derby',
      category: 'first-team',
      date: '2024-08-05',
      description: 'Thrilling 3-2 victory against rivals',
      image: '⚽',
      color: 'from-red-600 to-pink-600'
    },
    {
      id: 7,
      title: 'U16 Tournament Winners',
      category: 'youth',
      date: '2024-08-03',
      description: 'Our U16 team lifting the regional cup',
      image: '🥇',
      color: 'from-yellow-600 to-orange-600'
    },
    {
      id: 8,
      title: 'Pitch Maintenance & Upgrade',
      category: 'facilities',
      date: '2024-08-01',
      description: 'New grass installation completed',
      image: '🌱',
      color: 'from-green-600 to-lime-600'
    },
    {
      id: 9,
      title: 'Coach Education Workshop',
      category: 'coaching',
      date: '2024-07-30',
      description: 'Professional development for our coaching staff',
      image: '👨‍🏫',
      color: 'from-indigo-600 to-purple-600'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Photos', icon: '📸' },
    { id: 'first-team', label: 'First Team', icon: '🏆' },
    { id: 'youth', label: 'Youth Teams', icon: '👦' },
    { id: 'facilities', label: 'Facilities', icon: '🏠' },
    { id: 'community', label: 'Community', icon: '🤝' },
    { id: 'coaching', label: 'Coaching', icon: '👨‍🏫' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <>
      {/* Mobile Version */}
      <div className="block md:hidden">
        <MobileLayout currentPage="/gallery" showNavigation={false}>
          <MobilePageContainer 
            title="Photo Gallery"
            subtitle="Match Photos & Memories"
            icon="📸"
          >
            {/* Category Filter - Mobile */}
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category.id
                        ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                        : 'bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/15 border border-white/20'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span className="text-xs">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Grid - Mobile */}
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl"
                >
                  <div className="flex items-center space-x-4">
                    {/* Image */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <div className="text-2xl">{item.image}</div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                      <p className="text-blue-200 text-xs mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100 text-xs">
                          {new Date(item.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                        <span className="text-white text-xs bg-white/20 px-2 py-1 rounded-full">
                          12 photos
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Upload Section - Mobile */}
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl mt-6 text-center">
              <div className="text-2xl mb-2">📤</div>
              <h3 className="text-white font-bold text-sm mb-2">Share Your Photos</h3>
              <p className="text-blue-200 text-xs mb-4">
                Have great photos? Share them with the community!
              </p>
              <Link 
                href="/contact"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-medium inline-block"
              >
                📧 Email Photos
              </Link>
            </div>
          </MobilePageContainer>
        </MobileLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <StandardLayout title="Photo Gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">📸</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Capturing moments, celebrating achievements, and sharing the spirit of Rivervalley Rangers AFC
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Image Placeholder */}
                <div className={`h-48 bg-gradient-to-br ${item.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {item.image}
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold">View Photos</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-blue-600 text-xs font-medium">
                      12 photos →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8 mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Gallery Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600 mb-2">250+</p>
              <p className="text-sm text-gray-600">Total Photos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600 mb-2">45</p>
              <p className="text-sm text-gray-600">Photo Albums</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600 mb-2">15</p>
              <p className="text-sm text-gray-600">Match Galleries</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600 mb-2">30+</p>
              <p className="text-sm text-gray-600">Events Covered</p>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-blue-50 rounded-lg p-8 mt-8 text-center"
        >
          <div className="text-4xl mb-4">📤</div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Photos</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Have great photos from matches or club events? We'd love to feature them in our gallery! 
            Contact us to share your images with the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📧 Email Photos
            </Link>
            <Link 
              href="/members/parents"
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              📱 Member Portal
            </Link>
          </div>
        </motion.div>

        </div>
        </StandardLayout>
      </div>
    </>
  );
}