import StandardLayout from '@/components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Gallery() {
  const galleryItems = [
    {
      id: 1,
      title: 'U18 League Champions Celebration',
      category: 'Youth Teams',
      date: 'May 2024',
      image: '/api/placeholder/400/300',
      description: 'Celebrating our U18 team winning the County Youth League Division 1'
    },
    {
      id: 2,
      title: 'New Season Training Camp',
      category: 'Training',
      date: 'July 2024',
      image: '/api/placeholder/400/300',
      description: 'Pre-season training camp with all youth and senior squads'
    },
    {
      id: 3,
      title: 'Club Facilities Upgrade',
      category: 'Infrastructure',
      date: 'June 2024',
      image: '/api/placeholder/400/300',
      description: 'New floodlights and pitch improvements at Rivervalley Park'
    },
    {
      id: 4,
      title: 'Annual Awards Night',
      category: 'Events',
      date: 'April 2024',
      image: '/api/placeholder/400/300',
      description: 'Celebrating player achievements and club milestones'
    },
    {
      id: 5,
      title: 'Community Outreach Program',
      category: 'Community',
      date: 'March 2024',
      image: '/api/placeholder/400/300',
      description: 'Coaching sessions at local primary schools'
    },
    {
      id: 6,
      title: 'First Team Derby Victory',
      category: 'Senior Teams',
      date: 'February 2024',
      image: '/api/placeholder/400/300',
      description: 'Dramatic 3-2 victory against local rivals in the Dublin Cup'
    },
    {
      id: 7,
      title: 'Youth Academy Graduation',
      category: 'Academy',
      date: 'January 2024',
      image: '/api/placeholder/400/300',
      description: 'Academy players moving up to senior football'
    },
    {
      id: 8,
      title: 'Christmas Family Fun Day',
      category: 'Events',
      date: 'December 2023',
      image: '/api/placeholder/400/300',
      description: 'Annual Christmas celebration with all club families'
    },
    {
      id: 9,
      title: 'New Kit Launch',
      category: 'Club News',
      date: 'August 2024',
      image: '/api/placeholder/400/300',
      description: 'Revealing our new home and away kits for the 2024/25 season'
    }
  ];

  const categories = ['All', 'Youth Teams', 'Senior Teams', 'Training', 'Events', 'Academy', 'Community', 'Infrastructure', 'Club News'];

  return (
    <StandardLayout title="Gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">📸</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Capturing the memorable moments and milestones of Rivervalley Rangers AFC
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      index === 0 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Gallery Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <div className="text-4xl">🏆</div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-white bg-opacity-90 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white text-blue-600 rounded-full p-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                    <p className="text-gray-600 text-xs line-clamp-2">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center mt-12"
            >
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Load More Photos
              </button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* News & Media Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">News & Media</h3>
              <nav className="space-y-2">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-3 py-2 rounded font-medium">Gallery</div>
                <Link href="/news-media/events" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Events & News</Link>
              </nav>
            </motion.div>

            {/* Recent Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Highlights</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-green-900 text-sm">League Champions</p>
                  <p className="text-green-700 text-xs">U18 team wins Division 1</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-blue-900 text-sm">New Facilities</p>
                  <p className="text-blue-700 text-xs">Floodlights installation complete</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-purple-900 text-sm">Community Award</p>
                  <p className="text-purple-700 text-xs">Outstanding outreach program</p>
                </div>
              </div>
            </motion.div>

            {/* Gallery Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Photos:</span>
                  <span className="font-semibold text-blue-600">847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month:</span>
                  <span className="font-semibold text-green-600">43</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Most Popular:</span>
                  <span className="font-semibold text-purple-600">Awards Night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories:</span>
                  <span className="font-semibold text-orange-600">8</span>
                </div>
              </div>
            </motion.div>

            {/* Submit Photos */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-orange-50 border border-orange-200 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Share Your Photos</h3>
              <p className="text-orange-700 text-sm mb-4">
                Have great photos from club events? We'd love to feature them in our gallery!
              </p>
              <div className="space-y-3">
                <div className="text-xs text-orange-600">
                  <p>• Send to: photos@rvrfc.com</p>
                  <p>• Include event details</p>
                  <p>• High resolution preferred</p>
                  <p>• Permission for use required</p>
                </div>
                <button className="w-full bg-orange-600 text-white text-center font-semibold py-2 px-4 rounded text-sm hover:bg-orange-700 transition-colors">
                  Email Photos
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}