import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Breadcrumb from '../../components/Breadcrumb';

export default function TrialsRegistration() {
  return (
    <div>
      {/* Mobile Version */}
      <div className="block md:hidden">
        <StandardLayout title="Trials & Registration">
          {/* Mobile Header */}
          <div className="p-6 shadow-lg text-white" style={{background: 'linear-gradient(to right, #972A4C, #7A2240)'}}>
            <div className="text-center">
              <h1 className="font-bold text-2xl text-white mb-1">Book a Trial</h1>
              <p className="text-pink-200">Join Rivervalley Rangers today</p>
            </div>
          </div>

          {/* Mobile Content */}
          <div className="p-4 bg-gray-50">
            <div className="space-y-6">
              {/* Registration Form */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="font-bold text-lg mb-4" style={{color: '#972A4C'}}>Register for Trials</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Player Name</label>
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter player name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                      <option>Select age group...</option>
                      <option>U8 (Ages 6-8)</option>
                      <option>U10 (Ages 8-10)</option>
                      <option>U12 (Ages 10-12)</option>
                      <option>U14 (Ages 12-14)</option>
                      <option>U16 (Ages 14-16)</option>
                      <option>U18 (Ages 16-18)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Email</label>
                    <input type="email" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="parent@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="+353 87 123 4567" />
                  </div>
                  <button
                    className="w-full text-white py-3 px-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{background: 'linear-gradient(to right, #972A4C, #7A2240)'}}
                  >
                    Book Trial Session
                  </button>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-3" style={{color: '#972A4C'}}>Next Steps</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full text-white text-sm flex items-center justify-center mr-3 mt-0.5" style={{backgroundColor: '#972A4C'}}>1</div>
                    <div>
                      <div className="font-medium text-gray-900">Submit Registration</div>
                      <div className="text-sm text-gray-600">Complete the form above</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full text-white text-sm flex items-center justify-center mr-3 mt-0.5" style={{backgroundColor: '#5E7794'}}>2</div>
                    <div>
                      <div className="font-medium text-gray-900">We'll Contact You</div>
                      <div className="text-sm text-gray-600">Within 24 hours with trial details</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full text-white text-sm flex items-center justify-center mr-3 mt-0.5" style={{backgroundColor: '#98C0F0'}}>3</div>
                    <div>
                      <div className="font-medium text-gray-900">Attend Trial</div>
                      <div className="text-sm text-gray-600">Bring boots, shin pads & water</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StandardLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <StandardLayout title="Trials & Registration">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <Breadcrumb items={[
          { label: "Join Us", href: "/join" },
          { label: "Trials & Registration" }
        ]} />
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trials & Registration</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to join Rivervalley Rangers AFC? Complete your registration and book your trial session
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Registration Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Registration Process</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Complete Online Registration</h3>
                    <p className="text-gray-600 mb-3">Fill out our comprehensive registration form with player details, emergency contacts, and medical information.</p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-700 mb-2"><strong>Required Documents:</strong></p>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• Birth certificate or passport copy</li>
                        <li>• Proof of address (utility bill)</li>
                        <li>• Medical clearance form</li>
                        <li>• Emergency contact details</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Book Trial Session</h3>
                    <p className="text-gray-600 mb-3">Choose from available trial dates and attend a training session with your age group.</p>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-700 mb-2"><strong>Trial Sessions Available:</strong></p>
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• Every Saturday morning (Youth teams)</li>
                        <li>• Tuesday & Thursday evenings (Senior teams)</li>
                        <li>• Special academy assessment days</li>
                        <li>• Individual assessments by appointment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Assessment & Placement</h3>
                    <p className="text-gray-600 mb-3">Our coaches will assess your ability and recommend the most suitable team placement.</p>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-700 mb-2"><strong>Assessment Criteria:</strong></p>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Technical skills and ball control</li>
                        <li>• Fitness level and athleticism</li>
                        <li>• Tactical understanding</li>
                        <li>• Attitude and commitment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">4</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Complete Registration</h3>
                    <p className="text-gray-600 mb-3">Pay membership fees, receive your kit, and start training with your new team.</p>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm text-orange-700 mb-2"><strong>What You Receive:</strong></p>
                      <ul className="text-sm text-orange-600 space-y-1">
                        <li>• Complete team kit and training gear</li>
                        <li>• Training schedule and fixture list</li>
                        <li>• Player handbook and club guidelines</li>
                        <li>• Access to club facilities and events</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Registration Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Registration Form</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Player Full Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter full name" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position Preference</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select position</option>
                    <option>Goalkeeper</option>
                    <option>Defender</option>
                    <option>Midfielder</option>
                    <option>Forward</option>
                    <option>Any position</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select experience</option>
                    <option>Complete beginner</option>
                    <option>Some experience</option>
                    <option>Club level</option>
                    <option>Competitive level</option>
                    <option>Elite level</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Parent/Guardian name" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+353 123 456 789" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="email@example.com" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Trial Date</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select preferred trial date</option>
                    <option>This Saturday 9:00 AM (U10-U12)</option>
                    <option>This Saturday 10:30 AM (U14-U16)</option>
                    <option>This Saturday 12:00 PM (U18)</option>
                    <option>Tuesday Evening 7:30 PM (Senior)</option>
                    <option>Thursday Evening 7:30 PM (Senior)</option>
                    <option>Academy Assessment (By appointment)</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                  <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Any medical conditions, previous club experience, or special requirements..."></textarea>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-start space-x-2 mb-4">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-600">
                    I agree to the club's terms and conditions, and consent to my data being used for club communications and player development purposes.
                  </span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                  Submit Registration & Book Trial
                </button>
              </div>
            </motion.div>

            {/* Trial Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trial Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What to Bring</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Football boots or trainers</li>
                    <li>• Comfortable sports clothing</li>
                    <li>• Shin pads (mandatory)</li>
                    <li>• Water bottle</li>
                    <li>• Positive attitude and enthusiasm</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Trial Location</h3>
                  <div className="text-gray-600 space-y-2">
                    <p><strong>Rivervalley Park</strong></p>
                    <p>Main Training Facility</p>
                    <p>Dublin 15, Ireland</p>
                    <p>Free parking available</p>
                    <p>Changing facilities on-site</p>
                  </div>
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
                <Link href="/join/family" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Family Packages</Link>
                <Link href="/join/academy" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Youth Academy</Link>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-3 py-2 rounded font-medium">Trials & Registration</div>
              </nav>
            </motion.div>

            {/* Quick Registration Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Fees</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Youth (U10-U12):</span>
                  <span className="font-semibold text-blue-600">€100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Youth (U14-U18):</span>
                  <span className="font-semibold text-blue-600">€140</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Senior Teams:</span>
                  <span className="font-semibold text-green-600">€150-200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Family Packages:</span>
                  <span className="font-semibold text-purple-600">From €180</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Academy Programs:</span>
                  <span className="font-semibold text-orange-600">€160-280</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                *All fees include kit, training, and match participation
              </p>
            </motion.div>

            {/* Next Trial Dates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Trial Dates</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="font-medium text-blue-900">This Saturday</p>
                  <p className="text-blue-700">Youth Teams • 9:00 AM - 12:00 PM</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="font-medium text-green-900">Tuesday Evening</p>
                  <p className="text-green-700">Senior Teams • 7:30 PM - 9:00 PM</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="font-medium text-purple-900">Academy Assessment</p>
                  <p className="text-purple-700">By appointment • Contact us</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Support</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Registration Officer</p>
                  <p className="text-gray-600">Lisa Murphy</p>
                  <p className="text-blue-600">registration@rvrfc.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone Support</p>
                  <p className="text-gray-600">+353 1 123 4569</p>
                  <p className="text-xs text-gray-500">Mon-Fri 10am-6pm</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Trial Bookings</p>
                  <p className="text-gray-600">trials@rvrfc.com</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
        </StandardLayout>
      </div>
    </div>
  );
}