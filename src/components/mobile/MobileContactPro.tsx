/**
 * 🚀 PROFESSIONAL MOBILE CONTACT PAGE  
 * Premium contact experience for football platform
 * 
 * Features: Contact form, key contacts, quick actions, social proof
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MobileHero, ActionCard, ContentCard } from '../../design/MobileDesignSystem';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  department: string;
}

export default function MobileContactPro() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    department: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      department: 'general'
    });
  };

  // Quick contact actions
  const quickActions = [
    {
      icon: "📧",
      title: "General Info",
      subtitle: "Ask us anything",
      href: "#contact-form",
      variant: "primary" as const
    },
    {
      icon: "⚽",
      title: "Join Team",
      subtitle: "Youth registration",
      href: "/join/trials",
      variant: "success" as const
    },
    {
      icon: "🏟️",
      title: "Book Pitch",
      subtitle: "Facility bookings",
      href: "/book-astro",
      variant: "secondary" as const
    },
    {
      icon: "🤝",
      title: "Sponsorship",
      subtitle: "Partnership enquiries",
      href: "/get-involved/sponsorship",
      variant: "warning" as const
    }
  ];

  // Key staff contacts
  const keyContacts = [
    {
      role: "Club Chairman",
      name: "Patrick O'Sullivan",
      email: "chairman@rvrfc.com",
      phone: "+353 87 123 4560",
      description: "Strategic decisions & leadership",
      icon: "👔"
    },
    {
      role: "Youth Coordinator", 
      name: "Sarah O'Connor",
      email: "youth@rvrfc.com",
      phone: "+353 1 123 4567",
      description: "Youth teams & development",
      icon: "🌟"
    },
    {
      role: "Commercial Manager",
      name: "Brian Kelly", 
      email: "commercial@rvrfc.com",
      phone: "+353 87 123 4578",
      description: "Sponsorship & partnerships",
      icon: "🤝"
    }
  ];

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'youth', label: 'Youth Teams' },
    { value: 'senior', label: 'Senior Teams' },
    { value: 'membership', label: 'Membership' },
    { value: 'facilities', label: 'Facilities & Booking' },
    { value: 'sponsorship', label: 'Sponsorship' },
    { value: 'media', label: 'Media & Press' }
  ];

  return (
    <div className="pb-20">
      
      {/* Hero Section */}
      <MobileHero
        image="/images/hero/halftime2.jpg"
        title="Contact Us"
        subtitle="Get in touch with Rivervalley Rangers AFC"
        height="md"
        overlay="gradient"
      />

      {/* Quick Actions */}
      <section className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">How can we help?</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + (index * 0.1), duration: 0.4 }}
              >
                <ActionCard {...action} size="lg" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="px-4 py-6" id="contact-form">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* Key Contacts */}
      <section className="px-4 py-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Key Contacts</h2>
          <div className="space-y-4">
            {keyContacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.4 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{contact.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{contact.role}</div>
                    <div className="font-medium text-blue-600">{contact.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{contact.description}</div>
                    <div className="space-y-1">
                      <a href={`mailto:${contact.email}`} className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                        <span className="text-xs mr-1">📧</span>
                        {contact.email}
                      </a>
                      <a href={`tel:${contact.phone}`} className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                        <span className="text-xs mr-1">📞</span>
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Club Information */}
      <section className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Visit Our Clubhouse</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center justify-center">
              <span className="mr-2">📍</span>
              <span>Rivervalley Park, Dublin 15</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-2">🕒</span>
              <span>Open: Mon-Fri 6pm-9pm, Sat-Sun 9am-6pm</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-2">🚗</span>
              <span>Free parking available</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6">
              <a 
                href="https://www.facebook.com/RVRFC/" 
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="mr-1">📘</span>
                <span className="text-sm font-medium">Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/rvrfc1981/" 
                className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="mr-1">📷</span>
                <span className="text-sm font-medium">Instagram</span>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}