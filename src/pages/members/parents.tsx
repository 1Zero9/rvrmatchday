import StandardLayout from '@/components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ParentsArea() {
  return (
    <StandardLayout title="Parents Area">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">👨‍👩‍👧‍👦</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Parents Area</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Resources and information for parents supporting their children's football journey
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/match-central/fixtures" className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-500 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-blue-900">Fixtures & Results</h3>
                  </div>
                  <p className="text-blue-700 text-sm">View upcoming matches and recent results for all teams</p>
                </Link>
                
                <Link href="/teams/youth" className="bg-green-50 hover:bg-green-100 rounded-lg p-6 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-500 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-green-900">Youth Teams</h3>
                  </div>
                  <p className="text-green-700 text-sm">Information about youth teams and training schedules</p>
                </Link>
                
                <Link href="/join/trials" className="bg-purple-50 hover:bg-purple-100 rounded-lg p-6 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-500 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-purple-900">Registration Forms</h3>
                  </div>
                  <p className="text-purple-700 text-sm">Complete registration and trial booking forms</p>
                </Link>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-500 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-orange-900">Team Communications</h3>
                  </div>
                  <p className="text-orange-700 text-sm">WhatsApp groups and email updates for team news</p>
                </div>
              </div>
            </motion.div>

            {/* Parent Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Parent Resources</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Youth Football Development Guide</h3>
                  <p className="text-gray-600 mb-3">Understanding age-appropriate development stages and how to support your child's football journey.</p>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-600">• Age 6-8: Fun, participation, and basic skills</p>
                    <p className="text-sm text-blue-600">• Age 9-12: Technique development and teamwork</p>
                    <p className="text-sm text-blue-600">• Age 13-16: Tactical understanding and competition</p>
                    <p className="text-sm text-blue-600">• Age 17+: Performance and pathway planning</p>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Match Day Guidelines</h3>
                  <p className="text-gray-600 mb-3">How to best support your child and team during matches.</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Do:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Encourage all players</li>
                        <li>• Respect the referee</li>
                        <li>• Stay in designated areas</li>
                        <li>• Focus on effort and fun</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-1">Don't:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Coach from the sideline</li>
                        <li>• Criticize players or officials</li>
                        <li>• Focus solely on winning</li>
                        <li>• Enter the field of play</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Health & Safety Information</h3>
                  <p className="text-gray-600 mb-3">Important health and safety guidelines for youth players.</p>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <ul className="text-sm text-purple-700 space-y-2">
                      <li>• Medical forms must be kept up to date</li>
                      <li>• Inform coaches of any injuries or concerns</li>
                      <li>• Ensure proper hydration before and after training</li>
                      <li>• Appropriate clothing for weather conditions</li>
                      <li>• Emergency contact details must be current</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Communication Channels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Stay Connected</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">WhatsApp Groups</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="font-medium text-green-900">U10 Rangers Parents</p>
                      <p className="text-green-700">Quick updates and match reminders</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="font-medium text-green-900">U12 Rangers Parents</p>
                      <p className="text-green-700">Training schedules and team news</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="font-medium text-green-900">Youth Parents General</p>
                      <p className="text-green-700">Club-wide announcements</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Email Updates</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="font-medium text-blue-900">Weekly Newsletter</p>
                      <p className="text-blue-700">Every Sunday evening</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="font-medium text-blue-900">Match Reports</p>
                      <p className="text-blue-700">After every fixture</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="font-medium text-blue-900">Club Events</p>
                      <p className="text-blue-700">Special events and fundraisers</p>
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
                <div className="bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 px-3 py-2 rounded font-medium">Parents Area</div>
                <Link href="/members/coaches" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Coaches Area</Link>
                <Link href="/members/admin" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Admin Portal</Link>
              </nav>
            </motion.div>

            {/* Important Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Contacts</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Youth Coordinator</p>
                  <p className="text-gray-600">Sarah O'Connor</p>
                  <p className="text-blue-600">youth@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4567</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Safeguarding Officer</p>
                  <p className="text-gray-600">Maria Walsh</p>
                  <p className="text-purple-600">safeguarding@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4571</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Club Secretary</p>
                  <p className="text-gray-600">John Murphy</p>
                  <p className="text-green-600">secretary@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4560</p>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Parent Events</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-medium text-orange-900">Parent Coffee Morning</p>
                  <p className="text-orange-700">Saturday 9:30 AM</p>
                  <p className="text-xs text-gray-600">Clubhouse - All welcome</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-medium text-red-900">AGM Meeting</p>
                  <p className="text-red-700">Thursday 7:00 PM</p>
                  <p className="text-xs text-gray-600">Important club decisions</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-medium text-blue-900">Family Fun Day</p>
                  <p className="text-blue-700">Sunday 12:00 PM</p>
                  <p className="text-xs text-gray-600">Fundraising event</p>
                </div>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked</h3>
              <div className="space-y-3 text-sm">
                <details className="cursor-pointer">
                  <summary className="font-medium text-gray-700 hover:text-blue-600">When are training sessions?</summary>
                  <p className="text-gray-600 mt-2 pl-4">Training times vary by age group. Check the team page for specific schedules.</p>
                </details>
                <details className="cursor-pointer">
                  <summary className="font-medium text-gray-700 hover:text-blue-600">What equipment is needed?</summary>
                  <p className="text-gray-600 mt-2 pl-4">Football boots, shin pads, and weather-appropriate clothing. Kit is provided by the club.</p>
                </details>
                <details className="cursor-pointer">
                  <summary className="font-medium text-gray-700 hover:text-blue-600">How do I volunteer to help?</summary>
                  <p className="text-gray-600 mt-2 pl-4">Contact your team manager or visit our Get Involved section for volunteer opportunities.</p>
                </details>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}