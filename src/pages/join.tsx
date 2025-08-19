import Layout from '@/components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Join() {
  return (
    <Layout currentSection="public">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display text-gray-900 mb-4">
                Join Rivervalley Rangers AFC
              </h1>
              <p className="text-xl text-gray-700">
                Become part of our football family and start your journey with us!
              </p>
            </div>

            {/* Coach Registration CTA */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-primary-800 mb-2">
                    🏃‍♂️ Want to Coach?
                  </h3>
                  <p className="text-primary-700">
                    Join our coaching team and help develop the next generation of football stars.
                  </p>
                </div>
                <Link
                  href="/coach/register"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Apply to Coach
                </Link>
              </div>
            </div>

            {/* Registration Options */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">⚽</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Youth Players</h3>
                <p className="text-gray-700 mb-4">Ages 6-17, all skill levels welcome</p>
                <div className="text-2xl font-bold text-gray-900 mb-2">€120/season</div>
                <p className="text-sm text-gray-700">Includes training & matches</p>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Senior Players</h3>
                <p className="text-gray-700 mb-4">18+ competitive league football</p>
                <div className="text-2xl font-bold text-gray-900 mb-2">€200/season</div>
                <p className="text-sm text-gray-700">Includes all league fees</p>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Family Package</h3>
                <p className="text-gray-700 mb-4">2+ children from same family</p>
                <div className="text-2xl font-bold text-gray-900 mb-2">€180/season</div>
                <p className="text-sm text-gray-700">Save €60+ per child</p>
              </motion.div>
            </div>

            {/* Registration Form Placeholder */}
            <div className="bg-primary-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Ready to Join?
              </h2>
              
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Player Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter player's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Group
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select age group</option>
                    <option value="U8">Under 8</option>
                    <option value="U10">Under 10</option>
                    <option value="U12">Under 12</option>
                    <option value="U14">Under 14</option>
                    <option value="U16">Under 16</option>
                    <option value="U18">Under 18</option>
                    <option value="Senior">Senior (18+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent/Guardian Email
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                <button className="w-full bg-primary-600 text-white py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors">
                  Start Registration
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  This will redirect to our secure registration system
                </p>
              </div>
            </div>

            {/* What's Included */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">What&apos;s Included</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Weekly training sessions
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    League match participation
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Qualified coaching staff
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Club social events
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Player development tracking
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Access to club facilities
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>
                <ol className="space-y-2 text-gray-700">
                  <li className="flex">
                    <span className="bg-primary-100 text-primary-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    Complete registration form above
                  </li>
                  <li className="flex">
                    <span className="bg-primary-100 text-primary-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    Attend welcome session & trial
                  </li>
                  <li className="flex">
                    <span className="bg-primary-100 text-primary-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    Complete medical & contact forms
                  </li>
                  <li className="flex">
                    <span className="bg-primary-100 text-primary-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    Start training with your team!
                  </li>
                </ol>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-12 text-center bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions?</h3>
              <p className="text-gray-700 mb-4">
                Our friendly team is here to help with any questions about joining the club.
              </p>
              <div className="space-x-4">
                <Link href="/contact" className="text-blue-700 hover:text-blue-800 hover:underline font-semibold">
                  Contact Us
                </Link>
                <span className="text-gray-400">|</span>
                <a href="mailto:info@rvrfc.com" className="text-blue-700 hover:text-blue-800 hover:underline font-semibold">
                  info@rvrfc.com
                </a>
                <span className="text-gray-400">|</span>
                <a href="tel:+353123456789" className="text-blue-700 hover:text-blue-800 hover:underline font-semibold">
                  +353 123 456 789
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}