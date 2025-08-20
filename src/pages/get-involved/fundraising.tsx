import StandardLayout from '@/components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Fundraising() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Annual Golf Classic',
      date: 'September 15, 2024',
      location: 'Elmgreen Golf Club',
      target: '€15,000',
      description: 'Our biggest fundraising event featuring 18 holes, lunch, and prizes',
      status: 'accepting_entries'
    },
    {
      id: 2,
      title: 'Family Fun Day & BBQ',
      date: 'July 20, 2024',
      location: 'Rivervalley Park',
      target: '€5,000',
      description: 'Community event with games, food stalls, and entertainment for all ages',
      status: 'volunteers_needed'
    },
    {
      id: 3,
      title: 'Christmas Raffle Draw',
      date: 'December 15, 2024',
      location: 'Various Locations',
      target: '€8,000',
      description: 'Annual raffle with fantastic prizes donated by local businesses',
      status: 'planning'
    },
    {
      id: 4,
      title: 'Sponsored Walk/Run',
      date: 'October 8, 2024',
      location: 'Phoenix Park',
      target: '€3,500',
      description: '5K and 10K options for all fitness levels with family-friendly activities',
      status: 'registration_open'
    }
  ];

  const fundingPriorities = [
    {
      title: 'New Changing Rooms',
      target: '€45,000',
      raised: '€32,000',
      percentage: 71,
      description: 'Modern changing facilities with accessible options',
      urgent: true
    },
    {
      title: 'Youth Academy Equipment',
      target: '€12,000',
      raised: '€8,500',
      percentage: 71,
      description: 'Training cones, goals, and specialized coaching equipment',
      urgent: false
    },
    {
      title: 'Pitch Maintenance',
      target: '€18,000',
      raised: '€6,200',
      percentage: 34,
      description: 'Ongoing pitch improvement and maintenance costs',
      urgent: false
    },
    {
      title: 'Transport Mini-Bus',
      target: '€35,000',
      raised: '€15,000',
      percentage: 43,
      description: 'Club mini-bus for team transport to away matches',
      urgent: false
    }
  ];

  const fundraisingIdeas = [
    {
      category: 'Events',
      ideas: ['Quiz Night', 'Disco/Dance', 'Car Boot Sale', 'Fashion Show', 'Casino Night']
    },
    {
      category: 'Activities',
      ideas: ['Sponsored Silence', 'Penalty Shootout', 'Marathon Training', 'Cycle Challenge', 'Swim-a-thon']
    },
    {
      category: 'Sales',
      ideas: ['Bake Sale', 'Second-hand Kit', 'Club Merchandise', 'Plant Sale', 'Book Fair']
    },
    {
      category: 'Digital',
      ideas: ['Online Auction', 'Crowdfunding', 'Virtual Events', 'Social Media Challenges', 'Gaming Tournament']
    }
  ];

  return (
    <StandardLayout title="Fundraising">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">💰</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fundraising</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us raise funds to improve facilities, equipment, and opportunities for all our players
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Funding Priorities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Funding Priorities</h2>
              
              <div className="space-y-6">
                {fundingPriorities.map((priority, index) => (
                  <div key={index} className={`border rounded-lg p-6 ${priority.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{priority.title}</h3>
                          {priority.urgent && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                              Priority
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{priority.description}</p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-6 text-right">
                        <div className="text-2xl font-bold text-green-600">{priority.raised}</div>
                        <div className="text-sm text-gray-500">of {priority.target}</div>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{priority.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${priority.urgent ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${priority.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">How to Donate</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>• Bank Transfer: IBAN IE64 BANK 9311 5500 0000 00</p>
                  <p>• PayPal: donate@rvrfc.com</p>
                  <p>• In Person: Contact club treasurer</p>
                  <p>• Standing Order: Available for regular donations</p>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Fundraising Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Fundraising Events</h2>
              
              <div className="space-y-6">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                          <span>📅 {event.date}</span>
                          <span>📍 {event.location}</span>
                          <span>🎯 Target: {event.target}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{event.description}</p>
                        
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${
                            event.status === 'accepting_entries' ? 'bg-green-100 text-green-800' :
                            event.status === 'volunteers_needed' ? 'bg-orange-100 text-orange-800' :
                            event.status === 'registration_open' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                        <button className={`px-6 py-2 rounded font-semibold text-sm transition-colors ${
                          event.status === 'volunteers_needed' ? 'bg-orange-600 text-white hover:bg-orange-700' :
                          event.status === 'planning' ? 'bg-gray-400 text-gray-600 cursor-not-allowed' :
                          'bg-blue-600 text-white hover:bg-blue-700'
                        }`} disabled={event.status === 'planning'}>
                          {event.status === 'volunteers_needed' ? 'Volunteer' :
                           event.status === 'planning' ? 'Coming Soon' :
                           event.status === 'accepting_entries' ? 'Enter Now' :
                           'Register'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fundraising Ideas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fundraising Ideas</h2>
              <p className="text-gray-600 mb-6">
                Want to organize your own fundraising activity? Here are some ideas that have worked well for other clubs and community groups.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {fundraisingIdeas.map((category, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">{category.category}</h3>
                    <ul className="space-y-2">
                      {category.ideas.map((idea, idx) => (
                        <li key={idx} className="text-gray-700 text-sm flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                          {idea}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">Want to Organize an Event?</h3>
                <p className="text-green-700 text-sm mb-4">
                  We'd love to support your fundraising initiative! Contact our fundraising committee for guidance, resources, and promotion.
                </p>
                <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold text-sm hover:bg-green-700 transition-colors">
                  Contact Fundraising Team
                </button>
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
                <Link href="/get-involved/volunteering" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Volunteering</Link>
                <div className="bg-gradient-to-r from-green-50 to-yellow-50 text-green-700 px-3 py-2 rounded font-medium">Fundraising</div>
                <Link href="/get-involved/sponsorship" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Sponsorship</Link>
              </nav>
            </motion.div>

            {/* Quick Donate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Donate</h3>
              <p className="text-gray-700 text-sm mb-4">
                Every contribution helps us improve facilities and opportunities for our players.
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-50">€25</button>
                  <button className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-50">€50</button>
                  <button className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-50">€100</button>
                </div>
                <input 
                  type="number" 
                  placeholder="Custom amount €" 
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <button className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded hover:bg-green-700 transition-colors">
                  Donate Now
                </button>
              </div>
            </motion.div>

            {/* Fundraising Team */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fundraising Team</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Fundraising Chair</p>
                  <p className="text-gray-600">Mary O'Sullivan</p>
                  <p className="text-green-600">fundraising@rvrfc.com</p>
                  <p className="text-gray-500">+353 87 123 4576</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Treasurer</p>
                  <p className="text-gray-600">Kevin Walsh</p>
                  <p className="text-blue-600">treasurer@rvrfc.com</p>
                  <p className="text-gray-500">+353 87 123 4577</p>
                </div>
              </div>
            </motion.div>

            {/* Fundraising Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Year's Progress</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Raised:</span>
                  <span className="font-semibold text-green-600">€61,700</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Target:</span>
                  <span className="font-semibold text-blue-600">€110,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Events Completed:</span>
                  <span className="font-semibold text-purple-600">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Campaigns:</span>
                  <span className="font-semibold text-orange-600">4</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Annual Progress</span>
                    <span className="font-medium">56%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '56%' }}></div>
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