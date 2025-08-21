import StandardLayout from '../../components/StandardLayout';
import Breadcrumb from '../../components/Breadcrumb';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function YouthMembership() {
  return (
    <StandardLayout title="Youth Membership">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <Breadcrumb items={[
          { label: "Join Us", href: "/join" },
          { label: "Youth Membership" }
        ]} />
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">⚽</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Youth Membership</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our youth development program and start your football journey with Rivervalley Rangers AFC
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Age Groups & Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Age Groups & Membership Fees</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Under 10s & Under 12s</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">€100</p>
                  <p className="text-sm text-gray-600 mb-4">per season</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Weekly training sessions</li>
                    <li>• Match participation</li>
                    <li>• Basic equipment</li>
                    <li>• End of season awards</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Under 14s, 16s & 18s</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">€140</p>
                  <p className="text-sm text-gray-600 mb-4">per season</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Advanced training programs</li>
                    <li>• Competitive league matches</li>
                    <li>• Tournament participation</li>
                    <li>• Player development tracking</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Registration Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Register</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complete Registration Form</h3>
                    <p className="text-gray-600">Fill out our online registration form with player and parent/guardian details.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Attend Trial Session</h3>
                    <p className="text-gray-600">Join a trial training session to meet coaches and players.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Submit Documentation</h3>
                    <p className="text-gray-600">Provide birth certificate, medical forms, and emergency contacts.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pay Membership Fee</h3>
                    <p className="text-gray-600">Complete payment and receive your player pack and schedule.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* What's Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Training & Development</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Weekly group training sessions</li>
                    <li>• Individual skill development</li>
                    <li>• Qualified coaching staff</li>
                    <li>• Progress tracking & reports</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Match Experience</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Regular competitive matches</li>
                    <li>• League participation</li>
                    <li>• Tournament opportunities</li>
                    <li>• Team building activities</li>
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
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded font-medium">Youth Membership</div>
                <Link href="/join/senior" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Senior Membership</Link>
                <Link href="/join/family" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Family Packages</Link>
                <Link href="/join/academy" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Youth Academy</Link>
                <Link href="/join/trials" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Trials & Registration</Link>
              </nav>
            </motion.div>

            {/* Quick Registration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-blue-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Ready to Register?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Start your child's football journey with us today!
              </p>
              <Link 
                href="/join/trials"
                className="block bg-blue-600 text-white text-center font-semibold py-3 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Register for Trials
              </Link>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Youth Coordinator</p>
                  <p className="text-gray-600">Sarah O'Connor</p>
                  <p className="text-blue-600">youth@rvrfc.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">+353 1 123 4567</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Training Location</p>
                  <p className="text-gray-600">Rivervalley Park<br/>Dublin 15</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}