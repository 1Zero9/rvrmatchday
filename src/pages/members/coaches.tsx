import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CoachesArea() {
  return (
    <StandardLayout title="Coaches Area">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🧑‍🏫</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coaches Area</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Resources, tools, and information for our coaching staff and volunteers
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Quick Access Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Coaching Tools & Resources</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-500 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-blue-900">Training Plans</h3>
                  </div>
                  <p className="text-blue-700 text-sm mb-3">Age-specific session plans and drills library</p>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Access Library →</button>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-500 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-green-900">Player Management</h3>
                  </div>
                  <p className="text-green-700 text-sm mb-3">Squad lists, attendance tracking, and development notes</p>
                  <button className="text-green-600 text-sm font-medium hover:text-green-800">Manage Squad →</button>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-500 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-purple-900">Equipment Requests</h3>
                  </div>
                  <p className="text-purple-700 text-sm mb-3">Request training equipment and facility bookings</p>
                  <button className="text-purple-600 text-sm font-medium hover:text-purple-800">Make Request →</button>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-500 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-orange-900">CPD Resources</h3>
                  </div>
                  <p className="text-orange-700 text-sm mb-3">Coaching development courses and qualifications</p>
                  <button className="text-orange-600 text-sm font-medium hover:text-orange-800">View Courses →</button>
                </div>
              </div>
            </motion.div>

            {/* Coach Development */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Development</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">FAI Coaching Courses</h3>
                  <p className="text-gray-600 mb-3">Upcoming FAI coaching qualification courses and workshops.</p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-blue-900">FAI Kickstart 1</p>
                        <p className="text-blue-700">March 15-16, 2025</p>
                        <p className="text-xs text-blue-600">€120 - Club subsidy available</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">FAI Kickstart 2</p>
                        <p className="text-blue-700">April 12-13, 2025</p>
                        <p className="text-xs text-blue-600">€150 - Club subsidy available</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Youth Module</p>
                        <p className="text-blue-700">May 3-4, 2025</p>
                        <p className="text-xs text-blue-600">€180 - Priority for youth coaches</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Safeguarding Workshop</p>
                        <p className="text-blue-700">Quarterly sessions</p>
                        <p className="text-xs text-blue-600">Free - Mandatory for all coaches</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Coach Meetings</h3>
                  <p className="text-gray-600 mb-3">Regular meetings to discuss player development and club initiatives.</p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm">
                      <p className="font-medium text-green-900 mb-2">Next Meeting: First Thursday of Every Month, 7:30 PM</p>
                      <div className="space-y-2 text-green-700">
                        <p>• Player development discussions</p>
                        <p>• Training methodology sharing</p>
                        <p>• Equipment and facility updates</p>
                        <p>• Guest speakers and workshops</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mentorship Program</h3>
                  <p className="text-gray-600 mb-3">Experienced coaches supporting new volunteers and developing coaches.</p>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-purple-900">New Coach Support</p>
                        <p className="text-purple-700">Assigned mentor for first season</p>
                      </div>
                      <div>
                        <p className="font-medium text-purple-900">Observation Sessions</p>
                        <p className="text-purple-700">Constructive feedback and guidance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Club Philosophy & Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Club Coaching Philosophy</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Development Focus</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• Player enjoyment and engagement</li>
                    <li>• Technical skill development</li>
                    <li>• Age-appropriate physical development</li>
                    <li>• Character building and sportsmanship</li>
                    <li>• Tactical understanding progression</li>
                    <li>• Individual player pathway planning</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Age Group Guidelines</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="font-medium text-blue-900">U6-U10: Fun & Participation</p>
                      <p className="text-blue-700">Equal playing time, basic skills, small-sided games</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="font-medium text-green-900">U11-U14: Development</p>
                      <p className="text-green-700">Skill progression, teamwork, competitive introduction</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="font-medium text-purple-900">U15+: Performance</p>
                      <p className="text-purple-700">Tactical focus, physical development, competition</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* Members Area Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Members Area</h3>
              <nav className="space-y-2">
                <Link href="/members/parents" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Parents Area</Link>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 text-green-700 px-3 py-2 rounded font-medium">Coaches Area</div>
                <Link href="/members/admin" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Admin Portal</Link>
              </nav>
            </motion.div>

            {/* Coach Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Contacts</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Head of Coaching</p>
                  <p className="text-gray-600">James Mitchell</p>
                  <p className="text-blue-600">coaching@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4570</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Youth Development Officer</p>
                  <p className="text-gray-600">Sarah O'Connor</p>
                  <p className="text-green-600">youth@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4567</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Equipment Manager</p>
                  <p className="text-gray-600">Tom Kelly</p>
                  <p className="text-purple-600">equipment@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4572</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coaching Team Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Coaches:</span>
                  <span className="font-semibold text-blue-600">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Qualified Coaches:</span>
                  <span className="font-semibold text-green-600">14</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Training:</span>
                  <span className="font-semibold text-orange-600">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Experience:</span>
                  <span className="font-semibold text-purple-600">6 years</span>
                </div>
              </div>
            </motion.div>

            {/* Training Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-medium">Coach Meeting</span>
                  <span className="text-gray-600">Thu 7:30pm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-medium">U18 Training</span>
                  <span className="text-gray-600">Tue/Thu 7pm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-medium">Youth Sessions</span>
                  <span className="text-gray-600">Sat AM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Equipment Check</span>
                  <span className="text-gray-600">Sun 10am</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}