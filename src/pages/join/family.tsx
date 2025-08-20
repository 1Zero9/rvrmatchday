import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FamilyPackages() {
  return (
    <StandardLayout title="Family Packages">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">👨‍👩‍👧‍👦</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Family Packages</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Special discounted rates for families with multiple children - making football accessible for everyone
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Family Package Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Family Package Pricing</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">2-Child Family Package</h3>
                      <p className="text-purple-700">Save €40 compared to individual memberships</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600">€180</p>
                      <p className="text-sm text-gray-600">per season</p>
                      <p className="text-sm text-green-600">Regular: €220</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• All youth membership benefits</li>
                    <li>• Family event invitations</li>
                    <li>• Sibling coordination support</li>
                    <li>• Shared transport arrangements</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900">3+ Child Family Package</h3>
                      <p className="text-indigo-700">Maximum savings for larger families</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-indigo-600">€250</p>
                      <p className="text-sm text-gray-600">for 3 children</p>
                      <p className="text-sm text-green-600">Regular: €330</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Additional child: €60 each</li>
                    <li>• Maximum family rate applies</li>
                    <li>• Priority event booking</li>
                    <li>• Dedicated family liaison</li>
                  </ul>
                </div>

                <div className="bg-amber-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900">Adult + Youth Combo</h3>
                      <p className="text-amber-700">Parent and child playing together</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-amber-600">€320</p>
                      <p className="text-sm text-gray-600">per season</p>
                      <p className="text-sm text-green-600">Regular: €360</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• One adult membership</li>
                    <li>• One youth membership</li>
                    <li>• Family match day experiences</li>
                    <li>• Shared training opportunities</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Additional Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Family Package Benefits</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Family Support</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Coordinated training schedules</li>
                    <li>• Family liaison officer</li>
                    <li>• Sibling team coordination</li>
                    <li>• Shared transport network</li>
                    <li>• Family event priority</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Cost Savings</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Significant membership discounts</li>
                    <li>• Bulk equipment purchasing</li>
                    <li>• Shared travel costs</li>
                    <li>• Group training rates</li>
                    <li>• Family event discounts</li>
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
                <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-medium">Family Packages</div>
                <Link href="/join/academy" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Youth Academy</Link>
                <Link href="/join/trials" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Trials & Registration</Link>
              </nav>
            </motion.div>

            {/* Package Calculator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-purple-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Calculate Your Savings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">2 Children Individual:</span>
                  <span className="font-semibold">€220</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Family Package:</span>
                  <span className="font-semibold">€180</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-green-700 font-semibold">Your Savings:</span>
                  <span className="font-bold text-green-600">€40</span>
                </div>
              </div>
              <Link 
                href="/join/trials"
                className="block bg-purple-600 text-white text-center font-semibold py-3 px-4 rounded hover:bg-purple-700 transition-colors mt-4"
              >
                Apply for Family Package
              </Link>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Support</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Family Liaison Officer</p>
                  <p className="text-gray-600">Emma Kelly</p>
                  <p className="text-purple-600">families@rvrfc.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Special Rates Helpline</p>
                  <p className="text-gray-600">+353 1 123 4568</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}