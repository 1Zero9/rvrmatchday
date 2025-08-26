import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard } from '../../components/Glass';
import Link from 'next/link';

export default function JoinInclusive() {
  const quickActions = [
    {
      icon: "👦",
      title: "Youth Teams",
      description: "Traditional age-group teams",
      href: "/join/youth",
      gradient: "blue" as const
    },
    {
      icon: "🏆",
      title: "Senior Teams",
      description: "Adult competitive football",
      href: "/join/senior",
      gradient: "green" as const
    },
    {
      icon: "🎯",
      title: "Trial Sessions",
      description: "Come and try before joining",
      href: "/join/trials",
      gradient: "purple" as const
    },
    {
      icon: "📞",
      title: "Get in Touch",
      description: "Speak to our team",
      href: "/contact",
      gradient: "orange" as const
    }
  ];

  const inclusivePrograms = [
    {
      title: "Football for All",
      description: "Weekly training sessions specifically designed for children and young people with special needs or learning difficulties.",
      ageRange: "Ages 6-16",
      schedule: "Saturdays 10:00 AM - 11:30 AM",
      features: [
        "Qualified special needs coaches",
        "Small group sizes for individual attention",
        "Adapted training methods and equipment",
        "Focus on fun, friendship, and skill development"
      ],
      icon: "🌟"
    },
    {
      title: "Sensory-Friendly Sessions", 
      description: "Calm, structured environment for children who may be overwhelmed by busy, noisy training sessions.",
      ageRange: "Ages 5-14",
      schedule: "Sundays 9:00 AM - 10:00 AM",
      features: [
        "Quieter training environment",
        "Predictable routine and structure",
        "Visual aids and clear instructions",
        "Parent/carer involvement welcome"
      ],
      icon: "🤗"
    },
    {
      title: "Mixed-Ability Teams",
      description: "Integrated teams where players of all abilities train and play together in a supportive environment.",
      ageRange: "Ages 8-18",
      schedule: "Various age-appropriate times",
      features: [
        "Peer support and inclusion",
        "Adapted rules for fair play",
        "Celebration of all achievements",
        "Regular social activities"
      ],
      icon: "🤝"
    }
  ];

  const supportServices = [
    {
      title: "Individual Support",
      description: "One-to-one support workers available for children who need extra assistance",
      icon: "👤"
    },
    {
      title: "Family Support",
      description: "Guidance and resources for parents and families new to inclusive football",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      title: "Equipment Adaptation",
      description: "Modified equipment and training aids to suit individual needs",
      icon: "⚽"
    },
    {
      title: "Transport Assistance",
      description: "Help arranging transport for families who need it",
      icon: "🚌"
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Football for Everyone"
      heroSubtitle="Inclusive football programs welcoming players of all abilities and backgrounds"
      heroIcon="🌈"
      quickActions={quickActions}
      sectionName="INCLUSIVE FOOTBALL"
      imageSpecs="1920x1080px minimum, inclusive sports and community activities preferred"
    >

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <GlassCard intensity="heavy" className="p-8 bg-gradient-to-br from-purple-600/90 to-blue-600/90 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Everyone Belongs at RVRFC</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            At Rivervalley Rangers, we believe football is for everyone. Our inclusive programs ensure that all children and young people, regardless of ability, background, or circumstances, can enjoy the beautiful game in a safe, welcoming, and supportive environment.
          </p>
        </GlassCard>
      </motion.div>

      {/* Inclusive Programs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Inclusive Programs</h2>
        
        <div className="space-y-8">
          {inclusivePrograms.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                  <div className="text-center lg:text-left mb-6 lg:mb-0">
                    <div className="text-6xl mb-4 lg:mb-2">{program.icon}</div>
                    <div className="lg:hidden">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="hidden lg:block">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-900 text-sm mb-1">Age Range</h4>
                        <p className="text-blue-700 text-sm">{program.ageRange}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-green-900 text-sm mb-1">Schedule</h4>
                        <p className="text-green-700 text-sm">{program.schedule}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Program Features:</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {program.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start">
                            <span className="text-green-500 mr-2 text-sm">✓</span>
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Support Services Available</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {supportServices.map((service, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">{service.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-12"
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-green-50/80 to-blue-50/80">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Getting Started</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get in touch to discuss your child's needs and which program might be best suited
              </p>
              <a href="/contact" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                Contact Our Team →
              </a>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">👀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Come and See</h3>
              <p className="text-gray-600 text-sm mb-4">
                Visit one of our sessions to see how they work and meet our coaches
              </p>
              <span className="text-gray-500 text-sm">No appointment needed</span>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Join In</h3>
              <p className="text-gray-600 text-sm mb-4">
                Start attending sessions at your child's pace - there's no pressure
              </p>
              <span className="text-green-600 text-sm font-semibold">First month free!</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center"
      >
        <GlassCard intensity="heavy" className="p-8 bg-gradient-to-br from-orange-600/90 to-red-600/90 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Inclusive Community?</h2>
          <p className="text-lg opacity-90 mb-8">
            Every child deserves the chance to play football. Contact us today to learn more about our inclusive programs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us Today
            </a>
            <Link 
              href="/teams/inclusive"
              className="bg-orange-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors border border-white/20"
            >
              See Our Teams
            </Link>
          </div>
        </GlassCard>
      </motion.div>

    </GlassPageTemplate>
  );
}