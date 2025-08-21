import StandardLayout from '../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CoachRecruitment() {
  return (
    <StandardLayout title="Become a Coach">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🧑‍🏫</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Coaching Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help shape the future of football in our community. We're looking for passionate coaches to join our growing club.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Why Coach With Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Coach with Rivervalley Rangers?</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Support & Development</h3>
                      <p className="text-gray-600 text-sm">Ongoing training and mentorship from experienced coaches</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Flexible Commitment</h3>
                      <p className="text-gray-600 text-sm">Choose your level of involvement that fits your schedule</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Community Impact</h3>
                      <p className="text-gray-600 text-sm">Make a real difference in young people's lives</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Equipment Provided</h3>
                      <p className="text-gray-600 text-sm">All training equipment and kit provided by the club</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Expenses Covered</h3>
                      <p className="text-gray-600 text-sm">Training courses and certification costs supported</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Great Community</h3>
                      <p className="text-gray-600 text-sm">Join a supportive team of dedicated volunteers</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Coaching Opportunities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Coaching Opportunities</h2>
              
              <div className="space-y-4">
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Youth Development Coach</h3>
                      <p className="text-green-700">U10 & U12 Age Groups</p>
                    </div>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">URGENT</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    Lead fun, engaging training sessions focused on basic skills development and enjoyment of the game.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 2 sessions per week (Tuesday & Thursday evenings)</li>
                    <li>• Saturday morning matches</li>
                    <li>• Full training and mentorship provided</li>
                    <li>• Garda vetting required</li>
                  </ul>
                </div>
                
                <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Assistant Coach</h3>
                      <p className="text-blue-700">U14 & U16 Teams</p>
                    </div>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">AVAILABLE</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    Support our head coaches with training delivery and match day activities.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Flexible time commitment</li>
                    <li>• Learning opportunity with experienced coaches</li>
                    <li>• Pathway to head coach role</li>
                    <li>• FAI coaching course supported</li>
                  </ul>
                </div>
                
                <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">Girls Football Coach</h3>
                      <p className="text-purple-700">U12 & U14 Girls Teams</p>
                    </div>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">NEW</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    Help develop our rapidly growing girls' section. Experience with girls' football preferred but not essential.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 1-2 sessions per week</li>
                    <li>• Supportive team environment</li>
                    <li>• Girls-specific coaching training provided</li>
                    <li>• Opportunity to shape the future of girls' football</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Qualifications & Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Qualifications & Requirements</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Essential Requirements</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Passion for football and youth development</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Commitment to safeguarding children</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Clean Garda vetting (we assist with this)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Reliable and punctual</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Patient and encouraging approach</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Desirable Qualifications</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">FAI Grassroots coaching qualification</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Previous coaching or teaching experience</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">First Aid certification</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Playing experience (any level)</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Don't have qualifications?</strong> No problem! We provide full training and support to help you develop your coaching skills.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Apply Now Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-green-50 rounded-lg p-6 border border-green-200"
            >
              <h3 className="text-lg font-semibold text-green-900 mb-4">Ready to Get Started?</h3>
              <p className="text-green-700 text-sm mb-4">
                Join our coaching team and help shape the next generation of footballers.
              </p>
              <Link 
                href="/contact"
                className="block bg-green-600 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors mb-3"
              >
                Apply to Coach
              </Link>
              <p className="text-xs text-green-600 text-center">
                Or call us on +353 1 123 4567
              </p>
            </motion.div>

            {/* Training Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Coach Training</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900 text-sm">FAI Grassroots Course</p>
                  <p className="text-blue-700 text-xs">March 15-16, 2025</p>
                  <p className="text-blue-600 text-xs">Spaces available</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900 text-sm">Safeguarding Workshop</p>
                  <p className="text-green-700 text-xs">March 22, 2025</p>
                  <p className="text-green-600 text-xs">Mandatory for all coaches</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900 text-sm">Girls Football Coaching</p>
                  <p className="text-purple-700 text-xs">April 5, 2025</p>
                  <p className="text-purple-600 text-xs">Registration opens soon</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Head of Coaching</p>
                  <p className="text-gray-600">John Murphy</p>
                  <p className="text-blue-600">coaching@rvrfc.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Youth Development</p>
                  <p className="text-gray-600">Sarah O'Connor</p>
                  <p className="text-green-600">youth@rvrfc.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Club Office</p>
                  <p className="text-gray-600">+353 1 123 4567</p>
                  <p className="text-gray-600">Monday - Friday, 7-9pm</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}