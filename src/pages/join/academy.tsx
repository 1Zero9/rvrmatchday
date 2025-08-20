import StandardLayout from '@/components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function YouthAcademy() {
  return (
    <StandardLayout title="Youth Academy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🌟</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Youth Academy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elite development pathway for talented young footballers seeking to reach their full potential
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Academy Programs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Academy Programs</h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Foundation Academy</h3>
                      <p className="text-blue-700">Ages 8-12 • Skill Development Focus</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">€160</p>
                      <p className="text-sm text-gray-600">per season</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• 3 training sessions per week</li>
                    <li>• Individual skill assessments</li>
                    <li>• Academic support program</li>
                    <li>• Tournament participation</li>
                  </ul>
                  <p className="text-xs text-blue-600 font-medium">✨ Entry by invitation or assessment</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Development Academy</h3>
                      <p className="text-green-700">Ages 13-16 • Elite Pathway</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">€220</p>
                      <p className="text-sm text-gray-600">per season</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• 4 training sessions per week</li>
                    <li>• Strength & conditioning program</li>
                    <li>• Mental performance coaching</li>
                    <li>• Professional club trials</li>
                  </ul>
                  <p className="text-xs text-green-600 font-medium">⭐ Invitation only - exceptional talent</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">Elite Academy</h3>
                      <p className="text-purple-700">Ages 16-18 • Pre-Professional</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600">€280</p>
                      <p className="text-sm text-gray-600">per season</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• Daily training program</li>
                    <li>• Professional club partnerships</li>
                    <li>• Sports science support</li>
                    <li>• Scholarship opportunities</li>
                  </ul>
                  <p className="text-xs text-purple-600 font-medium">🏆 Elite invitation only</p>
                </div>
              </div>
            </motion.div>

            {/* Assessment Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Process</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Initial Application</h3>
                    <p className="text-gray-600">Submit academy application with player history and recommendations.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Skills Assessment</h3>
                    <p className="text-gray-600">Attend structured assessment sessions with academy coaches.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Trial Period</h3>
                    <p className="text-gray-600">4-week trial period training with academy squads.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Academy Placement</h3>
                    <p className="text-gray-600">Placement decision and academy program commencement.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Academy Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Academy Philosophy</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Technical Excellence</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Advanced ball mastery</li>
                    <li>• Tactical understanding</li>
                    <li>• Position-specific skills</li>
                    <li>• Game intelligence</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Development</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Leadership qualities</li>
                    <li>• Mental resilience</li>
                    <li>• Academic balance</li>
                    <li>• Character building</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* Join Section Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Join Us Sections</h3>
              <nav className="space-y-2">
                <Link href="/join/youth" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Youth Membership</Link>
                <Link href="/join/senior" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Senior Membership</Link>
                <Link href="/join/family" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Family Packages</Link>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-3 py-2 rounded font-medium">Youth Academy</div>
                <Link href="/join/trials" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Trials & Registration</Link>
              </nav>
            </motion.div>

            {/* Academy Application */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply to Academy</h3>
              <p className="text-gray-700 text-sm mb-4">
                Elite development pathway for exceptional young players.
              </p>
              <Link 
                href="/join/trials"
                className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center font-semibold py-3 px-4 rounded hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Apply for Assessment
              </Link>
            </motion.div>

            {/* Academy Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academy Success</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Professional Contracts:</span>
                  <span className="font-semibold text-green-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">College Scholarships:</span>
                  <span className="font-semibold text-blue-600">25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">International Caps:</span>
                  <span className="font-semibold text-purple-600">8</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academy Director</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">James Mitchell</p>
                  <p className="text-gray-600">UEFA A License, FA Youth</p>
                  <p className="text-blue-600">academy@rvrfc.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Direct Line</p>
                  <p className="text-gray-600">+353 1 123 4570</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}