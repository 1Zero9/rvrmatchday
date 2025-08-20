import StandardLayout from '@/components/StandardLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    department: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'youth', label: 'Youth Teams' },
    { value: 'senior', label: 'Senior Teams' },
    { value: 'academy', label: 'Youth Academy' },
    { value: 'membership', label: 'Membership' },
    { value: 'facilities', label: 'Facilities & Booking' },
    { value: 'sponsorship', label: 'Sponsorship' },
    { value: 'media', label: 'Media & Press' }
  ];

  const keyContacts = [
    {
      role: 'Club Chairman',
      name: 'Patrick O\'Sullivan',
      email: 'chairman@rvrfc.com',
      phone: '+353 87 123 4560',
      description: 'Overall club leadership and strategic decisions',
      icon: '👔'
    },
    {
      role: 'Club Secretary',
      name: 'John Murphy',
      email: 'secretary@rvrfc.com',
      phone: '+353 87 123 4561',
      description: 'Club administration, meetings, and correspondence',
      icon: '📝'
    },
    {
      role: 'Youth Coordinator',
      name: 'Sarah O\'Connor',
      email: 'youth@rvrfc.com',
      phone: '+353 1 123 4567',
      description: 'Youth team development and registration',
      icon: '⚽'
    },
    {
      role: 'Head of Coaching',
      name: 'James Mitchell',
      email: 'coaching@rvrfc.com',
      phone: '+353 1 123 4570',
      description: 'Coaching development and academy programs',
      icon: '🧑‍🏫'
    },
    {
      role: 'Facilities Manager',
      name: 'Tom Kelly',
      email: 'facilities@rvrfc.com',
      phone: '+353 1 123 4572',
      description: 'Ground bookings and facility management',
      icon: '🏟️'
    },
    {
      role: 'Commercial Manager',
      name: 'Brian Kelly',
      email: 'commercial@rvrfc.com',
      phone: '+353 87 123 4578',
      description: 'Sponsorship and commercial partnerships',
      icon: '🤝'
    }
  ];

  return (
    <StandardLayout title="Contact Us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">📞</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with Rivervalley Rangers AFC - we're here to help with any questions or inquiries
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+353 123 456 789"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief subject of your inquiry"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600">
                    I consent to my personal information being used to respond to my inquiry and for club communications. *
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Location & Directions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location & Directions</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Our Home Ground</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="font-medium text-gray-900">Rivervalley Park</p>
                    <p>Rivervalley Road</p>
                    <p>Dublin 15, Ireland</p>
                    <p>Eircode: D15 XY12</p>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Facilities</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Main pitch with floodlights</li>
                      <li>• Two training pitches</li>
                      <li>• Changing rooms and showers</li>
                      <li>• Clubhouse with refreshments</li>
                      <li>• Free parking available</li>
                      <li>• Disabled access</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Getting Here</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900">By Car</h4>
                      <p className="text-gray-600">Exit M50 at Junction 6, follow signs to Blanchester. Continue for 2km, ground on left.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">By Public Transport</h4>
                      <p className="text-gray-600">Bus routes 39, 70, and 220 stop nearby. Castleknock train station is 15 minutes walk.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Parking</h4>
                      <p className="text-gray-600">Free parking available for 100 cars. Additional roadside parking on match days.</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-green-700 transition-colors">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">General Email</p>
                    <p className="text-blue-600 text-sm">info@rvrfc.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Main Phone</p>
                    <p className="text-green-600 text-sm">+353 1 123 4560</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-purple-600 text-sm">Rivervalley Park, Dublin 15</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Extended hours during match days and events
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-red-900 mb-4">Emergency Contact</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-red-900">Emergency Line</p>
                  <p className="text-red-700">+353 87 123 9999</p>
                  <p className="text-red-600 text-xs">24/7 for urgent club matters</p>
                </div>
                <div>
                  <p className="font-medium text-red-900">Safeguarding Officer</p>
                  <p className="text-red-700">Maria Walsh</p>
                  <p className="text-red-600">safeguarding@rvrfc.com</p>
                </div>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="bg-blue-500 text-white rounded p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="bg-pink-500 text-white rounded p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="bg-blue-400 text-white rounded p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Key Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8 mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Contacts</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyContacts.map((contact, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="text-3xl mr-3">{contact.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.role}</h3>
                    <p className="text-gray-700 font-medium">{contact.name}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{contact.description}</p>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-600">{contact.email}</p>
                  <p className="text-green-600">{contact.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </StandardLayout>
  );
}
