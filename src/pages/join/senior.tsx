import StandardLayout from '@/components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SeniorMembership() {
  return (
    <StandardLayout title="Senior Membership">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Senior Membership</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our competitive senior teams and represent Rivervalley Rangers AFC in adult leagues
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Team Options & Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Senior Teams & Membership</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">First Team</h3>
                      <p className="text-green-700">Leinster Senior League Division 1A</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">€200</p>
                      <p className="text-sm text-gray-600">per season</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Competitive league matches</li>
                    <li>• Professional training sessions</li>
                    <li>• Cup competitions</li>
                    <li>• Full kit and equipment</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Reserve Team</h3>
                      <p className="text-blue-700">Leinster Senior League Division 3B</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">€180</p>
                      <p className="text-sm text-gray-600">per season</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Development pathway</li>
                    <li>• Regular match opportunities</li>
                    <li>• Skills development focus</li>
                    <li>• Full kit and equipment</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">Veterans Team</h3>
                      <p className="text-purple-700">Over 35s League</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600">€150</p>
                      <p className="text-sm text-gray-600">per season</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Social football environment</li>
                    <li>• Flexible training schedule</li>
                    <li>• Team social events</li>
                    <li>• Full kit and equipment</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Requirements & Commitments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Membership Requirements</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Player Requirements</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Minimum age: 18 years</li>
                    <li>• Basic fitness level</li>
                    <li>• Commitment to training</li>
                    <li>• Team-first attitude</li>
                    <li>• Clean disciplinary record</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Training Schedule</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Tuesday evenings: 7:30-9:00pm</li>
                    <li>• Thursday evenings: 7:30-9:00pm</li>
                    <li>• Saturday matches: 2:30pm</li>
                    <li>• Sunday matches: 11:00am</li>
                    <li>• Pre-season training from July</li>
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
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded font-medium">Senior Membership</div>
                <Link href="/join/family" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Family Packages</Link>
                <Link href="/join/academy" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Youth Academy</Link>
                <Link href="/join/trials" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Trials & Registration</Link>
              </nav>
            </div>

            {/* Quick Registration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-green-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-green-900 mb-4">Join Our Senior Teams</h3>
              <p className="text-green-700 text-sm mb-4">
                Experience competitive adult football with a welcoming club atmosphere.
              </p>
              <Link 
                href="/join/trials"
                className="block bg-green-600 text-white text-center font-semibold py-3 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Register Interest
              </Link>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Senior Team Contacts</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">First Team Manager</p>
                  <p className="text-gray-600">Michael Walsh</p>
                  <p className="text-green-600">firstteam@rvrfc.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Reserve Team Manager</p>
                  <p className="text-gray-600">David Murphy</p>
                  <p className="text-blue-600">reserves@rvrfc.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Training Ground</p>
                  <p className="text-gray-600">Rivervalley Park<br/>Tuesday & Thursday 7:30pm</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}