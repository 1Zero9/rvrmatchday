import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../../components/StandardLayout';

export default function Committee() {
  return (
    <StandardLayout title="Committee / Governance">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Committee / Governance</span>
          </div>
        </nav>

        {/* Club Section Navigation */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore Our Club</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/club/history" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">History & Achievements</h3>
                  <p className="text-sm text-gray-600">Our journey since 2009</p>
                </div>
              </Link>
              
              <Link href="/club/facilities" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Facilities</h3>
                  <p className="text-sm text-gray-600">Training grounds & clubhouse</p>
                </div>
              </Link>
              
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-medium text-purple-900 mb-2">Committee</h3>
                <p className="text-sm text-purple-700">Leadership & governance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Club Leadership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Club Leadership</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-6">
                  Rivervalley Rangers AFC is governed by a dedicated committee of volunteers who bring diverse skills, experience, and passion to ensure our club operates with transparency, integrity, and focus on our community mission.
                </p>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our committee structure ensures democratic decision-making while maintaining efficient operations. All major decisions are made collectively, with regular meetings held monthly and extraordinary meetings as needed.
                </p>
              </div>
            </motion.div>

            {/* Committee Structure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Committee Structure</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Executive Positions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 text-sm">Chairperson</span>
                      <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded">Executive</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 text-sm">Vice Chairperson</span>
                      <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded">Executive</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 text-sm">Secretary</span>
                      <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded">Executive</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 text-sm">Treasurer</span>
                      <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded">Executive</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3">Specialist Roles</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 text-sm">Youth Development Officer</span>
                      <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">Specialist</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 text-sm">Facilities Manager</span>
                      <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">Specialist</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 text-sm">Safeguarding Officer</span>
                      <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">Specialist</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 text-sm">Communications Officer</span>
                      <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">Specialist</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">General Committee Members</h4>
                <p className="text-sm text-gray-600">
                  Additional committee positions filled by parent volunteers and community members who contribute their expertise in areas such as coaching coordination, fundraising, events management, and club development.
                </p>
              </div>
            </motion.div>

            {/* Governance Principles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Governance Principles</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Transparency</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    All committee meetings have published minutes, financial reports are available to members, and major decisions are communicated openly to the club community.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Accountability</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Committee members are elected annually by club members, with clear role descriptions and regular performance reviews against club objectives.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Inclusivity</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We actively encourage diverse representation on our committee, welcoming members from all backgrounds to contribute their skills and perspectives.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Community Focus</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Every decision is evaluated against our core mission of serving the local community and providing excellent football development opportunities.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Get Involved */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-purple-50 rounded-lg border border-purple-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-purple-900">Join Our Committee</h3>
              </div>
              <p className="text-purple-700 text-sm leading-relaxed mb-4">
                We're always looking for dedicated volunteers to join our committee. Whether you have specific expertise or just want to contribute to your local club, we'd love to hear from you.
              </p>
              <p className="text-purple-700 text-sm leading-relaxed">
                Elections are held annually at our AGM, but co-opted positions are available throughout the year.
              </p>
            </motion.div>

            {/* Meeting Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Schedule</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Monthly Meetings</h4>
                  <p className="text-gray-600 text-sm">First Tuesday of each month, 7:30pm<br />Location: Club House</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Annual General Meeting</h4>
                  <p className="text-gray-600 text-sm">June each year<br />Open to all members</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Extraordinary Meetings</h4>
                  <p className="text-gray-600 text-sm">Called as needed<br />Members notified in advance</p>
                </div>
              </div>
            </motion.div>

            {/* Coming Soon */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-amber-50 rounded-lg border border-amber-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-amber-900">Under Development</h3>
              </div>
              <p className="text-amber-700 text-sm leading-relaxed">
                We're working on adding committee member profiles, meeting minutes archive, and governance documents. Check back soon for complete committee information!
              </p>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Pages</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  ← Back to About Us
                </Link>
                <Link href="/club/history" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Club History
                </Link>
                <Link href="/club/facilities" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → View Our Facilities
                </Link>
                <Link href="/get-involved/volunteering" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Volunteer Opportunities
                </Link>
                <Link href="/contact" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Contact Committee
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </StandardLayout>
  );
}