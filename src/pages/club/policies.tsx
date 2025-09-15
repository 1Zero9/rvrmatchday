/**
 * Club Policies Page - GDPR, Terms & Conditions, Code of Conduct
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Comprehensive club policies including GDPR compliance, T&C, and conduct guidelines.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard } from '../../components/Glass';
import InlineEditor from '../../components/InlineEditor';

export default function ClubPolicies() {
  const quickActions = [
    {
      icon: "🔒",
      title: "Privacy Policy",
      description: "GDPR compliance & data protection",
      href: "#privacy",
      gradient: "blue" as const
    },
    {
      icon: "📋",
      title: "Terms & Conditions",
      description: "Membership terms and conditions",
      href: "#terms",
      gradient: "green" as const
    },
    {
      icon: "⚖️",
      title: "Code of Conduct",
      description: "Behavior standards for all members",
      href: "#conduct",
      gradient: "purple" as const
    },
    {
      icon: "🛡️",
      title: "Safeguarding",
      description: "Child protection policies",
      href: "#safeguarding",
      gradient: "orange" as const
    }
  ];

  return (
    <GlassPageTemplate
        heroTitle="Club Policies & Governance"
        heroSubtitle="Transparency, Safety, and Standards • Protecting Our Community"
        heroIcon="📋"
        backgroundImage="/images/hero/bw-photo.jpg"
        quickActions={quickActions}
        sectionName="POLICIES"
        imageSpecs="1920x1080px minimum, club governance and community activities preferred"
      >

        {/* Privacy Policy & GDPR */}
        <div id="privacy" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🔒</div>
                <h2 className="text-3xl font-bold text-gray-800">Privacy Policy & GDPR Compliance</h2>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <InlineEditor
                  contentKey="privacy_policy_full_content"
                  initialContent={`**Data We Collect**

Rivervalley Rangers AFC collects personal information necessary for club membership, training, and match participation. This includes contact details, emergency contacts, medical information, and payment details.

**How We Use Your Data**

• Communication about training, matches, and club events
• Registration with football governing bodies (FAI, DDSL)
• Emergency contact and medical information for player safety
• Processing membership fees and payments

**Your Rights**

Under GDPR, you have the right to access, correct, delete, or transfer your personal data. You can also object to processing or request restrictions. Contact our Data Protection Officer at privacy@rivervalleyrangers.ie for any data-related requests.

**Contact**

For questions about this Privacy Policy, contact: privacy@rivervalleyrangers.ie`}
                  type="textarea"
                  className="prose max-w-none"
                  placeholder="Privacy policy content..."
                  renderMarkdown={true}
                />
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Terms & Conditions */}
        <div id="terms" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">📋</div>
                <h2 className="text-3xl font-bold text-gray-800">Terms & Conditions</h2>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <InlineEditor
                  contentKey="terms_conditions_full_content"
                  initialContent={`**Membership**

Membership is open to all players who agree to abide by club rules and FAI regulations. Annual membership fees must be paid before participation in training or matches. Membership includes insurance coverage during official club activities.

**Training & Matches**

Regular attendance at training is expected. Players must arrive on time and properly equipped. Match selection is at the discretion of coaches based on attendance, attitude, and ability. All participants must follow safety guidelines and respect equipment.

**Fees & Payments**

• Annual membership fees are due at registration
• Equipment costs (jerseys, shorts, socks) are additional
• Refunds may be available in exceptional circumstances

**Cancellation**

Members may cancel membership with 30 days written notice. Outstanding fees remain payable. Club reserves the right to terminate membership for breach of conduct or non-payment.`}
                  type="textarea"
                  className="prose max-w-none"
                  placeholder="Terms and conditions content..."
                  renderMarkdown={true}
                />
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Code of Conduct */}
        <div id="conduct" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">⚖️</div>
                <h2 className="text-3xl font-bold text-gray-800">Code of Conduct</h2>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <InlineEditor
                  contentKey="code_of_conduct_full_content"
                  initialContent={`**For Players**

• Respect teammates, opponents, referees, and coaches at all times
• Play fairly and within the rules of the game
• Accept decisions of referees and coaches without argument
• Arrive prepared with proper equipment and positive attitude

**For Parents/Guardians**

• Support your child and their teammates positively
• Respect coaches' decisions and methods
• Maintain appropriate sideline behavior
• Address concerns through proper channels

**Disciplinary Procedures**

Breaches of conduct will be addressed through discussion, warning, suspension, or termination of membership depending on severity. All parties have the right to appeal decisions to the club committee.`}
                  type="textarea"
                  className="prose max-w-none"
                  placeholder="Code of conduct content..."
                  renderMarkdown={true}
                />
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Safeguarding */}
        <div id="safeguarding" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🛡️</div>
                <h2 className="text-3xl font-bold text-gray-800">Safeguarding & Child Protection</h2>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <InlineEditor
                  contentKey="safeguarding_full_content"
                  initialContent={`**Our Commitment**

Rivervalley Rangers AFC is committed to providing a safe environment for all children and young people. We follow FAI and Government guidelines for child protection and have appointed a designated Children's Officer.

**Garda Vetting**

All coaches, volunteers, and committee members working with young people undergo Garda vetting through the FAI. Current vetting certificates are maintained and renewed as required.

**Reporting Concerns**

Any concerns about child welfare should be reported immediately to our Children's Officer or Club Secretary. We follow FAI reporting procedures and work with statutory agencies when required.

**Emergency Contact**

Children's Officer: safeguarding@rivervalleyrangers.ie  
Emergency: 999  
Tulsa: 1800 805 555`}
                  type="textarea"
                  className="prose max-w-none"
                  placeholder="Safeguarding policy content..."
                  renderMarkdown={true}
                />
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Questions About Our Policies?</h2>
          <p className="text-xl mb-8 opacity-90">
            <InlineEditor
              contentKey="policies_contact_text"
              initialContent="Our committee is here to help with any questions about club policies, membership, or governance."
              type="textarea"
              as="span"
            />
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/contact"
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
            >
              📞 Contact the Club
            </Link>
            <Link
              href="/club/committee"
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
            >
              👥 Meet the Committee
            </Link>
          </div>

          <div className="mt-6 text-sm opacity-75">
            <p>
              <InlineEditor
                contentKey="policies_last_updated"
                initialContent="Last Updated: January 2025 | Review Date: January 2026"
                as="span"
              />
            </p>
          </div>
        </motion.div>

      </GlassPageTemplate>
  );
}