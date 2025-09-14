/**
 * Contact Page - Club Contact Information & Form
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Contact page converted to glass morphism design system.
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import StandardLayout from '../components/StandardLayout';
import GlassPageTemplate from '../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../components/Glass';
import MobileLayout from '../components/MobileLayout';
import MobileContactPro from '../components/mobile/MobileContactPro';

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
    console.log('Form submitted:', formData);
  };

  const quickActions = [
    {
      icon: "📧",
      title: "General Inquiry",
      description: "Get in touch with questions",
      href: "#contact-form",
      gradient: "club-accent" as const
    },
    {
      icon: "⚽",
      title: "Youth Teams",
      description: "Registration & information",
      href: "#youth-contact",
      gradient: "club-primary" as const
    },
    {
      icon: "🏟️",
      title: "Facilities",
      description: "Bookings & facility info",
      href: "#facilities-contact",
      gradient: "club-secondary" as const
    },
    {
      icon: "🤝",
      title: "Sponsorship",
      description: "Partnership opportunities",
      href: "#commercial-contact",
      gradient: "club-primary" as const
    }
  ];

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
    <div>
      {/* Mobile Version - Professional */}
      <div className="block md:hidden">
        <MobileLayout 
          currentPage="/contact"
          clubData={{
            name: "RVR AFC", 
            logo: "/images/logo.png",
            established: "1981",
            colors: {
              primary: "#972A4C",
              secondary: "#5E7794",
              accent: "#98C0F0",
              neutral: "#B6B7B6"
            }
          }}
        >
          <MobileContactPro />
        </MobileLayout>
      </div>


      {/* Desktop Version */}
      <div className="hidden md:block">
        <GlassPageTemplate
          heroTitle="Contact Us"
          heroSubtitle="Get in touch with Rivervalley Rangers AFC - we're here to help with any questions or inquiries"
          heroIcon="📞"
          backgroundImage="/images/hero/sunset-hero.jpg"
          quickActions={quickActions}
          sectionName="CONTACT"
          imageSpecs="1920x1080px minimum, club facilities and contact activities preferred"
    >

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
            id="contact-form"
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
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
                  className="w-full bg-club-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-club-primary-light transition-colors"
                >
                  Send Message
                </button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Location & Directions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
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
                    <button className="bg-club-secondary text-white px-4 py-2 rounded font-semibold text-sm hover:bg-club-secondary-light transition-colors">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          
          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-club-accent/20 rounded-full p-2">
                    <span className="text-blue-600 text-lg">📧</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">General Email</p>
                    <p className="text-blue-600 text-sm">info@rvrfc.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-club-primary/20 rounded-full p-2">
                    <span className="text-green-600 text-lg">📞</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Main Phone</p>
                    <p className="text-green-600 text-sm">+353 1 123 4560</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <span className="text-purple-600 text-lg">📍</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-purple-600 text-sm">Rivervalley Park, Dublin 15</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Office Hours */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
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
            </GlassCard>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
            <GlassCard intensity="medium" className="bg-gradient-to-br from-red-50/80 to-red-100/80 border-red-200 p-6">
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
            </GlassCard>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <GlassCard intensity="medium" className="bg-gradient-to-br from-blue-50/80 to-green-50/80 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="space-y-3">
                <a href="https://www.facebook.com/RVRFC/" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="bg-club-secondary text-white rounded p-2">
                    <span className="text-sm">👥</span>
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </a>
                <a href="https://www.instagram.com/rvrfc1981/" className="flex items-center space-x-3 text-gray-600 hover:text-pink-600 transition-colors">
                  <div className="bg-pink-500 text-white rounded p-2">
                    <span className="text-sm">📸</span>
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Key Contacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12"
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Contacts</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyContacts.map((contact, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
              >
                <GlassCard intensity="light" className="p-6 h-full bg-gradient-to-br from-white/70 to-gray-50/70 hover:shadow-md transition-shadow">
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
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

    </GlassPageTemplate>
      </div>
    </div>
  );
}