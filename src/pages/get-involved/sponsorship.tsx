import StandardLayout from '@/components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Sponsorship() {
  const sponsorshipTiers = [
    {
      tier: 'Platinum',
      price: '€5,000+',
      color: 'from-gray-400 to-gray-600',
      benefits: [
        'Main shirt sponsor (front of jersey)',
        'Logo on all club marketing materials',
        'Stadium board advertising (prime position)',
        'Corporate hospitality for 10 guests',
        'Website homepage feature',
        'Social media promotion (weekly)',
        'Match day announcements',
        'Program advertisements (full page)',
        'Naming rights opportunity'
      ],
      popular: true
    },
    {
      tier: 'Gold',
      price: '€2,500-€4,999',
      color: 'from-yellow-400 to-yellow-600',
      benefits: [
        'Shirt sponsor (sleeve or back)',
        'Stadium board advertising',
        'Corporate hospitality for 6 guests',
        'Website sponsor page listing',
        'Social media promotion (monthly)',
        'Match day program (half page)',
        'Event sponsorship opportunities',
        'Player award sponsorship'
      ],
      popular: false
    },
    {
      tier: 'Silver',
      price: '€1,000-€2,499',
      color: 'from-gray-300 to-gray-500',
      benefits: [
        'Training kit sponsorship',
        'Stadium board advertising (standard)',
        'Corporate hospitality for 4 guests',
        'Website directory listing',
        'Match day program (quarter page)',
        'Team photo sponsorship',
        'Newsletter advertisements'
      ],
      popular: false
    },
    {
      tier: 'Bronze',
      price: '€500-€999',
      color: 'from-amber-600 to-amber-800',
      benefits: [
        'Equipment sponsorship',
        'Website directory listing',
        'Corporate hospitality for 2 guests',
        'Match day program listing',
        'Social media mentions',
        'Club newsletter inclusion'
      ],
      popular: false
    },
    {
      tier: 'Community',
      price: '€100-€499',
      color: 'from-green-400 to-green-600',
      benefits: [
        'Website supporter listing',
        'Match day program mention',
        'Certificate of appreciation',
        'Invitation to annual awards night',
        'Club newsletter acknowledgment'
      ],
      popular: false
    }
  ];

  const currentSponsors = [
    { name: 'Dublin City Motors', tier: 'Platinum', category: 'Automotive', since: '2019' },
    { name: 'O\'Brien Construction', tier: 'Gold', category: 'Construction', since: '2021' },
    { name: 'Kelly\'s Pharmacy', tier: 'Silver', category: 'Healthcare', since: '2020' },
    { name: 'Phoenix Insurance', tier: 'Silver', category: 'Financial Services', since: '2022' },
    { name: 'Murphy\'s Pub & Restaurant', tier: 'Bronze', category: 'Hospitality', since: '2018' },
    { name: 'Green Energy Solutions', tier: 'Bronze', category: 'Energy', since: '2023' }
  ];

  const sponsorshipAreas = [
    {
      area: 'Team Kit',
      description: 'Main sponsor logo on match jerseys',
      availability: 'Available for 2025/26 season',
      price: 'From €3,000'
    },
    {
      area: 'Training Equipment',
      description: 'Footballs, cones, training bibs, goals',
      availability: 'Multiple opportunities available',
      price: 'From €500'
    },
    {
      area: 'Stadium Boards',
      description: 'Pitch-side advertising boards',
      availability: '4 prime positions available',
      price: 'From €1,200'
    },
    {
      area: 'Transport',
      description: 'Team bus for away matches',
      availability: 'Available',
      price: 'From €2,000'
    },
    {
      area: 'Youth Development',
      description: 'Support youth academy programs',
      availability: 'Various levels available',
      price: 'From €800'
    },
    {
      area: 'Events & Awards',
      description: 'Annual awards night, family fun day',
      availability: 'Multiple events throughout year',
      price: 'From €300'
    }
  ];

  return (
    <StandardLayout title="Sponsorship">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sponsorship Opportunities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Partner with Rivervalley Rangers AFC and connect with our passionate community while supporting local football development
          </p>
        </motion.div>

        {/* Why Sponsor Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Partner With Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Reach</h3>
              <p className="text-gray-600">Connect with over 300 active members and their families in the local community</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Brand Values</h3>
              <p className="text-gray-600">Align your brand with positive values of teamwork, development, and community spirit</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Measurable Impact</h3>
              <p className="text-gray-600">See direct impact of your investment in youth development and community engagement</p>
            </div>
          </div>
        </motion.div>

        {/* Sponsorship Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sponsorship Packages</h2>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {sponsorshipTiers.map((tier, index) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 5) }}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {tier.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className={`bg-gradient-to-r ${tier.color} p-6 text-white`}>
                  <h3 className="text-2xl font-bold mb-2">{tier.tier}</h3>
                  <p className="text-xl font-semibold opacity-90">{tier.price}</p>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 px-4 rounded font-semibold text-sm transition-colors ${
                    tier.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}>
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Specific Sponsorship Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specific Sponsorship Opportunities</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsorshipAreas.map((area, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{area.area}</h3>
                <p className="text-gray-600 text-sm mb-3">{area.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Availability:</span>
                    <span className="text-green-600 font-medium">{area.availability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Investment:</span>
                    <span className="text-blue-600 font-semibold">{area.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Current Sponsors */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Current Partners</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {currentSponsors.map((sponsor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{sponsor.name}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sponsor.tier === 'Platinum' ? 'bg-gray-200 text-gray-800' :
                          sponsor.tier === 'Gold' ? 'bg-yellow-200 text-yellow-800' :
                          sponsor.tier === 'Silver' ? 'bg-gray-200 text-gray-700' :
                          'bg-amber-200 text-amber-800'
                        }`}>
                          {sponsor.tier}
                        </span>
                        <span className="text-gray-500">Since {sponsor.since}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{sponsor.category}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">Join these forward-thinking businesses in supporting local football</p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Become a Sponsor
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
                <Link href="/get-involved/fundraising" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Fundraising</Link>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 px-3 py-2 rounded font-medium">Sponsorship</div>
              </nav>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sponsorship Contact</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Commercial Manager</p>
                  <p className="text-gray-600">Brian Kelly</p>
                  <p className="text-blue-600">commercial@rvrfc.com</p>
                  <p className="text-gray-500">+353 87 123 4578</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Club Chairman</p>
                  <p className="text-gray-600">Patrick O'Sullivan</p>
                  <p className="text-green-600">chairman@rvrfc.com</p>
                  <p className="text-gray-500">+353 87 123 4560</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500">
                    Available for meetings Monday-Friday 9am-5pm
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sponsorship Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partnership Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Year-round brand exposure
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Community goodwill
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Networking opportunities
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Corporate hospitality
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Tax benefits available
                </li>
              </ul>
            </motion.div>

            {/* Club Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Club Reach</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Members:</span>
                  <span className="font-semibold text-blue-600">300+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Matches:</span>
                  <span className="font-semibold text-green-600">120</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Social Media Reach:</span>
                  <span className="font-semibold text-purple-600">15K+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Newsletter Subscribers:</span>
                  <span className="font-semibold text-orange-600">450+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Website Visitors:</span>
                  <span className="font-semibold text-red-600">2K/month</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}