import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '@/components/StandardLayout';

export default function History() {
  return (
    <StandardLayout title="History & Achievements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">History & Achievements</span>
          </div>
        </nav>

        {/* Club Section Navigation */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore Our Club</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-900 mb-2">History & Achievements</h3>
                <p className="text-sm text-blue-700">Our journey since 2009</p>
              </div>
              
              <Link href="/club/facilities" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Facilities</h3>
                  <p className="text-sm text-gray-600">Training grounds & clubhouse</p>
                </div>
              </Link>
              
              <Link href="/club/committee" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Committee</h3>
                  <p className="text-sm text-gray-600">Leadership & governance</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Club Foundation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Foundation</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Founded in 2009, Rivervalley Rangers AFC began with a simple vision: to create a community-centered football club that would bring together players of all ages and abilities. What started as a small local initiative has grown into one of the region's most respected amateur football clubs.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our journey from humble beginnings to our current status represents the dedication of countless volunteers, players, coaches, and supporters who believed in building something special for the community.
                </p>
              </div>
            </motion.div>

            {/* Key Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Key Milestones</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded mr-3">2009</span>
                    <h3 className="font-semibold text-gray-900">Club Foundation</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Rivervalley Rangers AFC officially established with first youth team</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded mr-3">2012</span>
                    <h3 className="font-semibold text-gray-900">First Trophy</h3>
                  </div>
                  <p className="text-gray-600 text-sm">U-12 team wins regional youth championship</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <div className="flex items-center mb-2">
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded mr-3">2016</span>
                    <h3 className="font-semibold text-gray-900">Facilities Expansion</h3>
                  </div>
                  <p className="text-gray-600 text-sm">New clubhouse and training facilities completed</p>
                </div>
                
                <div className="border-l-4 border-amber-500 pl-6">
                  <div className="flex items-center mb-2">
                    <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded mr-3">2020</span>
                    <h3 className="font-semibold text-gray-900">Community Recognition</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Awarded "Club of the Year" by local council for community contribution</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Development Notice */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-blue-50 rounded-lg border border-blue-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-900">Under Development</h3>
              </div>
              <p className="text-blue-700 text-sm leading-relaxed">
                We're currently compiling our complete history archive, including match records, trophy wins, and player achievements. Check back soon for our comprehensive club timeline!
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Club at a Glance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-semibold text-gray-900">2009</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Years Active</span>
                  <span className="font-semibold text-gray-900">15+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Teams</span>
                  <span className="font-semibold text-gray-900">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Players</span>
                  <span className="font-semibold text-gray-900">250+</span>
                </div>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Pages</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  ← Back to About Us
                </Link>
                <Link href="/club/facilities" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → View Our Facilities
                </Link>
                <Link href="/club/committee" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Meet the Committee
                </Link>
                <Link href="/teams/youth" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Our Teams
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </StandardLayout>
  );
}