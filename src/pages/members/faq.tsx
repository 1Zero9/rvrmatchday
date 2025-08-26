import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard } from '../../components/Glass';

export default function MembersFAQ() {
  const quickActions = [
    {
      icon: "❓",
      title: "Ask a Question",
      description: "Get help from our team",
      href: "/contact",
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
      icon: "💬",
      title: "Feedback",
      description: "Share your thoughts",
      href: "/members/feedback",
      gradient: "orange" as const
    }
  ];

  const faqCategories = [
    {
      title: "Membership & Registration",
      icon: "👥",
      faqs: [
        {
          question: "How do I register my child?",
          answer: "Visit our trials page or contact us directly. We'll guide you through our registration process and help match your child with the right age group and team."
        },
        {
          question: "What are the membership fees?",
          answer: "Membership fees vary by age group and program. Please contact us for current rates and available payment plans including family discounts."
        },
        {
          question: "When can my child start?",
          answer: "New members can join throughout the season, subject to availability. We recommend starting at the beginning of the season for the best experience."
        }
      ]
    },
    {
      title: "Training & Matches",
      icon: "⚽",
      faqs: [
        {
          question: "Where are training sessions held?",
          answer: "All training takes place at our facilities in Swords. Specific training times and locations are provided when you register."
        },
        {
          question: "What should my child bring?",
          answer: "Football boots, shin pads, water bottle, and appropriate sportswear. We provide balls and training equipment during sessions."
        },
        {
          question: "What happens if training is cancelled?",
          answer: "We notify parents via text/email if training is cancelled due to weather. Follow our social media for real-time updates."
        }
      ]
    },
    {
      title: "Parents & Communication",
      icon: "📱",
      faqs: [
        {
          question: "How do I stay updated?",
          answer: "We use text messages, email, and our website to share updates. Make sure your contact details are current in our system."
        },
        {
          question: "Can I volunteer to help?",
          answer: "Absolutely! We welcome parent volunteers for coaching, administration, fundraising, and match day support. Contact us to get involved."
        },
        {
          question: "How can I contact my child's coach?",
          answer: "Coach contact details are provided at registration. For urgent matters during matches, speak to the team manager on duty."
        }
      ]
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Frequently Asked Questions"
      heroSubtitle="Quick answers to common questions about membership, training, and club activities"
      heroIcon="❓"
      quickActions={quickActions}
      sectionName="MEMBERS FAQ"
      imageSpecs="1920x1080px minimum, community and support activities preferred"
    >

      {/* FAQ Categories */}
      <div className="space-y-12">
        {faqCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{category.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>
              
              <div className="space-y-6">
                {category.faqs.map((faq, faqIndex) => (
                  <div key={faqIndex} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12"
      >
        <GlassCard intensity="heavy" className="p-8 bg-gradient-to-br from-blue-600/90 to-green-600/90 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg mb-6 opacity-90">
            Can't find what you're looking for? Our team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/members/feedback"
              className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors border border-white/20"
            >
              Send Feedback
            </a>
          </div>
        </GlassCard>
      </motion.div>

    </GlassPageTemplate>
  );
}