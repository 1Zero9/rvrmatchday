import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard } from '../../components/Glass';

export default function MembersFeedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    anonymous: false
  });
  const [submitted, setSubmitted] = useState(false);

  const quickActions = [
    {
      icon: "❓",
      title: "FAQ",
      description: "Common questions answered",
      href: "/members/faq",
      gradient: "blue" as const
    },
    {
      icon: "📞",
      title: "Contact Us",
      description: "Speak to someone directly",
      href: "/contact",
      gradient: "green" as const
    },
    {
      icon: "👥",
      title: "Parent Portal",
      description: "Member login & info",
      href: "/login",
      gradient: "purple" as const
    },
    {
      icon: "🏠",
      title: "Members Home",
      description: "Back to member area",
      href: "/members",
      gradient: "orange" as const
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real implementation, this would send the feedback to a server
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (submitted) {
    return (
      <GlassPageTemplate
        heroTitle="Thank You!"
        heroSubtitle="Your feedback has been received and will help us improve our club"
        heroIcon="✅"
        quickActions={quickActions}
        sectionName="FEEDBACK SENT"
        imageSpecs="1920x1080px minimum, community and support activities preferred"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard intensity="heavy" className="p-12 bg-gradient-to-br from-green-600/90 to-blue-600/90 text-white text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Feedback Received!</h2>
            <p className="text-lg mb-8 opacity-90">
              Thank you for taking the time to share your thoughts with us. Your feedback helps us continue to improve Rivervalley Rangers for all our members.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Submit Another
              </button>
              <a
                href="/members"
                className="bg-green-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors border border-white/20"
              >
                Back to Members
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </GlassPageTemplate>
    );
  }

  return (
    <GlassPageTemplate
      heroTitle="Member Feedback"
      heroSubtitle="Share your thoughts, suggestions, and ideas to help us improve our club"
      heroIcon="💬"
      backgroundImage="https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      quickActions={quickActions}
      sectionName="MEMBER FEEDBACK"
      imageSpecs="1920x1080px minimum, community and support activities preferred"
    >

      {/* Feedback Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={formData.anonymous}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder={formData.anonymous ? "Anonymous submission" : "Enter your name"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={formData.anonymous}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder={formData.anonymous ? "Anonymous submission" : "your.email@example.com"}
                />
              </div>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Submit this feedback anonymously
              </label>
            </div>

            {/* Feedback Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category...</option>
                <option value="coaching">Coaching & Training</option>
                <option value="facilities">Facilities & Equipment</option>
                <option value="communication">Communication</option>
                <option value="events">Events & Activities</option>
                <option value="administration">Administration</option>
                <option value="website">Website & Technology</option>
                <option value="suggestion">General Suggestion</option>
                <option value="complaint">Complaint</option>
                <option value="praise">Praise & Recognition</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your feedback"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Please share your detailed feedback, suggestions, or concerns..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>

      {/* Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-blue-50/80 to-green-50/80">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How We Use Your Feedback</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">👂</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We Listen</h3>
              <p className="text-gray-600 text-sm">Every piece of feedback is read and considered by our committee</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We Act</h3>
              <p className="text-gray-600 text-sm">Valid suggestions are discussed and implemented where possible</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">📢</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We Respond</h3>
              <p className="text-gray-600 text-sm">Non-anonymous feedback receives a personal response within 48 hours</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

    </GlassPageTemplate>
  );
}