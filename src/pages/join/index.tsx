import StandardLayout from '@/components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function JoinIndex() {
  const joinOptions = [
    {
      title: 'Youth Teams',
      description: 'Join our youth development programs for players aged 6-17',
      icon: '👦',
      href: '/join/youth',
      features: ['Age-appropriate coaching', 'Regular matches', 'Player development', 'Fun environment'],
      price: 'From €120/year'
    },
    {
      title: 'Senior Teams',
      description: 'Adult football leagues and competitions',
      icon: '👨',
      href: '/join/senior',
      features: ['Competitive leagues', 'Training sessions', 'Match fitness', 'Social events'],
      price: 'From €200/year'
    },
    {
      title: 'Elite Academy',
      description: 'Advanced development program for talented players',
      icon: '⭐',
      href: '/join/academy',
      features: ['Professional coaching', 'Advanced training', 'Pathway to higher levels', 'Individual development'],
      price: 'From €400/year'
    },
    {
      title: 'Trials & Registration',
      description: 'Open trials and registration information',
      icon: '🎯',
      href: '/join/trials',
      features: ['Open to all abilities', 'Assessment sessions', 'Team placement', 'Registration process'],
      price: 'Free assessment'
    }
  ];

  return (
    <StandardLayout title="Join Our Club">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">⚽</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Rivervalley Rangers AFC</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Become part of our football family! We welcome players of all ages and abilities to join our community-focused club.
          </p>
        </motion.div>

        {/* Join Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {joinOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 2) }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{option.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-green-600 font-semibold">{option.price}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{option.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={option.href}
                  className="inline-block w-full text-center bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Join Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Join Rivervalley Rangers AFC?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Focus</h3>
              <p className="text-gray-600">Join a welcoming community that values friendship, respect, and fair play above all else.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Coaching</h3>
              <p className="text-gray-600">Learn from qualified coaches committed to developing every player's skills and confidence.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Great Facilities</h3>
              <p className="text-gray-600">Train and play on well-maintained pitches with modern facilities and equipment.</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join?</h2>
          <p className="text-gray-600 mb-6">
            Have questions about joining? Our friendly team is here to help guide you through the process.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Youth Coordinator</h3>
              <p className="text-gray-600 text-sm">Sarah O'Connor</p>
              <p className="text-green-600 text-sm">youth@rvrfc.com</p>
              <p className="text-gray-500 text-sm">+353 1 123 4567</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Club Secretary</h3>
              <p className="text-gray-600 text-sm">John Murphy</p>
              <p className="text-green-600 text-sm">secretary@rvrfc.com</p>
              <p className="text-gray-500 text-sm">+353 87 123 4561</p>
            </div>
          </div>
          
          <Link 
            href="/contact"
            className="inline-block bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Contact Us Today
          </Link>
        </motion.div>
      </div>
    </StandardLayout>
  );
}