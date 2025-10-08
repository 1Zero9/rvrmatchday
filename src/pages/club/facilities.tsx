import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../../components/StandardLayout';
import MaintenanceWrapper from '../../components/MaintenanceWrapper';

export default function Facilities() {
  return (
    <MaintenanceWrapper pagePath="/club/facilities" fallbackTitle="Club Facilities">
      <StandardLayout title="Facilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Facilities</span>
          </div>
        </nav>

        {/* Club Section Navigation */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore Our Club</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/about" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Our Story & Heritage</h3>
                  <p className="text-sm text-gray-600">Our journey since 1981</p>
                </div>
              </Link>
              
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="font-medium text-green-900 mb-2">Facilities</h3>
                <p className="text-sm text-green-700">Training grounds & clubhouse</p>
              </div>
              
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
            
            {/* Training Grounds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Training Grounds</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our state-of-the-art training facilities provide the perfect environment for player development at all levels. Located in the heart of Rivervalley, our grounds offer multiple pitches, modern changing facilities, and excellent drainage systems that ensure year-round playability.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Main Pitch</h4>
                    <p className="text-sm text-gray-600">Full-size 11v11 pitch with floodlighting and covered dugouts</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Youth Pitches</h4>
                    <p className="text-sm text-gray-600">Three dedicated youth pitches for various age groups</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Training Area</h4>
                    <p className="text-sm text-gray-600">Multi-use synthetic surface for skills training</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Goals & Equipment</h4>
                    <p className="text-sm text-gray-600">Professional-standard goals and training equipment</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Clubhouse */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Clubhouse & Amenities</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our modern clubhouse serves as the social heart of Rivervalley Rangers, providing comfortable facilities for players, families, and supporters. Renovated in 2016, it offers everything needed for match days and social events.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500 text-white rounded-full p-1 flex-shrink-0 mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Changing Rooms</h4>
                      <p className="text-sm text-gray-600">Four modern changing rooms with showers and individual lockers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500 text-white rounded-full p-1 flex-shrink-0 mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Function Room</h4>
                      <p className="text-sm text-gray-600">Multi-purpose space for meetings, events, and celebrations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500 text-white rounded-full p-1 flex-shrink-0 mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Kitchen & Cafe</h4>
                      <p className="text-sm text-gray-600">Fully equipped kitchen and refreshment area</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500 text-white rounded-full p-1 flex-shrink-0 mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Parking</h4>
                      <p className="text-sm text-gray-600">Ample on-site parking for members and visitors</p>
                    </div>
                  </div>
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
              className="bg-green-50 rounded-lg border border-green-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-semibold text-green-900">Facility Tours</h3>
              </div>
              <p className="text-green-700 text-sm leading-relaxed mb-4">
                Interested in seeing our facilities? We're currently organizing regular facility tours for new members and their families.
              </p>
              <p className="text-green-700 text-sm leading-relaxed">
                Contact us to arrange a visit and see why Rivervalley Rangers is the perfect place for your football journey!
              </p>
            </motion.div>

            {/* Location Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Access</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600 text-sm">Rivervalley Sports Complex<br />Main Road, Rivervalley</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Opening Hours</h4>
                  <p className="text-gray-600 text-sm">Training: Mon-Fri 6pm-9pm<br />Weekends: 9am-5pm</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Transport</h4>
                  <p className="text-gray-600 text-sm">Bus route 42, 15-min walk from station</p>
                </div>
              </div>
            </motion.div>

            {/* Coming Soon */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-amber-50 rounded-lg border border-amber-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-amber-900">Coming Soon</h3>
              </div>
              <p className="text-amber-700 text-sm leading-relaxed">
                We're adding facility photos, interactive maps, and booking information. Check back soon for virtual tours and detailed facility specifications!
              </p>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Pages</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  ← Back to About Us
                </Link>
                <Link href="/about" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Club History
                </Link>
                <Link href="/club/committee" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Meet the Committee
                </Link>
                <Link href="/join" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Join Our Club
                </Link>
                <Link href="/contact" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Contact Us
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </StandardLayout>
    </MaintenanceWrapper>
  );
}