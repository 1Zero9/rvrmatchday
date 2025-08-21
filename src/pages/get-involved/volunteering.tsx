import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Volunteering() {
  const volunteerRoles = [
    {
      id: 1,
      title: 'Assistant Coach',
      category: 'Coaching',
      commitment: '2-3 hours/week',
      requirements: ['Love of football', 'Good with children', 'Reliable and punctual'],
      description: 'Help with youth team training sessions and provide support during matches.',
      urgent: true
    },
    {
      id: 2,
      title: 'Match Day Official',
      category: 'Match Operations',
      commitment: '3-4 hours/weekend',
      requirements: ['Available weekends', 'Good communication', 'Organized'],
      description: 'Assist with match day setup, registration, and ensuring smooth operations.',
      urgent: false
    },
    {
      id: 3,
      title: 'Equipment Manager',
      category: 'Logistics',
      commitment: '2 hours/week',
      requirements: ['Organized', 'Attention to detail', 'Physical ability'],
      description: 'Manage and maintain training equipment, kit distribution, and storage.',
      urgent: false
    },
    {
      id: 4,
      title: 'Fundraising Committee',
      category: 'Administration',
      commitment: '1-2 hours/week',
      requirements: ['Creative thinking', 'Good networking', 'Event planning experience'],
      description: 'Plan and execute fundraising events to support club development.',
      urgent: false
    },
    {
      id: 5,
      title: 'Social Media Manager',
      category: 'Communications',
      commitment: '1 hour/day',
      requirements: ['Social media savvy', 'Photography skills', 'Creative content'],
      description: 'Manage club social media accounts and create engaging content.',
      urgent: true
    },
    {
      id: 6,
      title: 'Transport Coordinator',
      category: 'Logistics',
      commitment: 'Match days',
      requirements: ['Full driving license', 'Clean record', 'Reliable'],
      description: 'Help coordinate team transport to away matches and events.',
      urgent: false
    }
  ];

  const benefits = [
    {
      icon: '🏆',
      title: 'Make a Difference',
      description: 'Directly impact young players\' development and club success'
    },
    {
      icon: '🤝',
      title: 'Community Connection',
      description: 'Build lasting friendships with like-minded club members'
    },
    {
      icon: '📚',
      title: 'Skill Development',
      description: 'Learn new skills and gain valuable experience'
    },
    {
      icon: '🎯',
      title: 'Flexible Commitment',
      description: 'Choose roles that fit your schedule and availability'
    }
  ];

  return (
    <StandardLayout title="Volunteering">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section - Historical Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Service</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Like St. Columba's tradition of service and Brian Boru's call to unite for the common good,
            our volunteers carry forward centuries of community dedication through football.
          </p>
        </motion.div>

        {/* Historical Connection Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white rounded-2xl p-8 mb-12"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
              <span className="text-3xl mr-3">⛪</span>
              Following in Ancient Footsteps
            </h2>
            <p className="text-purple-200 max-w-3xl mx-auto leading-relaxed">
              St. Columba established centers of learning and community service in the 6th century.
              Today's volunteers continue this noble tradition, dedicating their time to develop young minds
              and bodies through the beautiful game.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Why Volunteer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Volunteer With Us?</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-3xl flex-shrink-0">{benefit.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Current Volunteer Impact</h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">42</div>
                    <div className="text-blue-800 text-sm">Active Volunteers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">1,200</div>
                    <div className="text-green-800 text-sm">Hours Contributed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">180</div>
                    <div className="text-purple-800 text-sm">Young People Helped</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Volunteer Opportunities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Opportunities</h2>
              
              <div className="space-y-6">
                {volunteerRoles.map((role, index) => (
                  <div key={role.id} className={`border rounded-lg p-6 ${role.urgent ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{role.title}</h3>
                          {role.urgent && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                              Urgent Need
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mb-3 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                            {role.category}
                          </span>
                          <span className="text-gray-600">
                            📅 {role.commitment}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{role.description}</p>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {role.requirements.map((req, idx) => (
                              <li key={idx}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                        <button className={`px-6 py-2 rounded font-semibold text-sm transition-colors ${
                          role.urgent 
                            ? 'bg-orange-600 text-white hover:bg-orange-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}>
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Application Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Get Started</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Express Interest</h3>
                    <p className="text-gray-600 mb-3">Complete our volunteer application form or contact us directly about roles that interest you.</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700 transition-colors">
                      Submit Application
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Initial Meeting</h3>
                    <p className="text-gray-600">Meet with our volunteer coordinator to discuss your interests, availability, and how you'd like to contribute.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Background Checks</h3>
                    <p className="text-gray-600">Complete necessary background checks and safeguarding training (we'll guide you through this process).</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Orientation & Training</h3>
                    <p className="text-gray-600">Attend orientation session and receive any role-specific training needed to get started.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">5</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Start Volunteering!</h3>
                    <p className="text-gray-600">Begin your volunteer journey with ongoing support from our team and fellow volunteers.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* Get Involved Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Involved</h3>
              <nav className="space-y-2">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 px-3 py-2 rounded font-medium">Volunteering</div>
                <Link href="/get-involved/fundraising" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Fundraising</Link>
                <Link href="/get-involved/sponsorship" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Sponsorship</Link>
              </nav>
            </motion.div>

            {/* Volunteer Coordinator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Support</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Volunteer Coordinator</p>
                  <p className="text-gray-600">Claire Thompson</p>
                  <p className="text-blue-600">volunteers@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4575</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500">
                    Available Mon-Fri 10am-4pm for volunteer inquiries and support
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Impact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Volunteers:</span>
                  <span className="font-semibold text-green-600">42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours This Month:</span>
                  <span className="font-semibold text-blue-600">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Open Positions:</span>
                  <span className="font-semibold text-orange-600">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Training Sessions:</span>
                  <span className="font-semibold text-purple-600">Monthly</span>
                </div>
              </div>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-purple-50 border border-purple-200 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Volunteer Story</h3>
              <div className="text-sm">
                <p className="text-purple-700 italic mb-3">
                  "Volunteering as an assistant coach has been incredibly rewarding. Seeing the kids develop their skills and confidence is amazing. The club really supports volunteers with training and flexibility."
                </p>
                <div className="flex items-center">
                  <div className="bg-purple-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">SM</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Sarah McKenna</p>
                    <p className="text-purple-600 text-xs">U12 Assistant Coach</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}