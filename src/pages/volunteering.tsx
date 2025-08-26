import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../components/GlassPageTemplate';
import { GlassCard } from '../components/Glass';

export default function Volunteering() {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'benefits' | 'signup' | 'recognition'>('opportunities');

  const opportunities = [
    {
      title: 'Match Day Helper',
      commitment: '2-3 hours per match day',
      description: 'Help with setup, refreshments, and ensuring match day runs smoothly',
      skills: 'Friendly attitude, basic organization',
      impact: 'Direct support for players and families',
      urgency: 'high',
      volunteers: { current: 8, needed: 12 }
    },
    {
      title: 'Fundraising Committee',
      commitment: '2-4 hours per month',
      description: 'Plan and organize club fundraising events and initiatives',
      skills: 'Event planning, creativity, communication',
      impact: 'Help secure club\'s financial future',
      urgency: 'medium',
      volunteers: { current: 5, needed: 8 }
    },
    {
      title: 'Social Media Team',
      commitment: '1-2 hours per week',
      description: 'Share club news, match photos, and engage with our community online',
      skills: 'Social media savvy, photography, writing',
      impact: 'Boost club visibility and engagement',
      urgency: 'medium',
      volunteers: { current: 3, needed: 6 }
    },
    {
      title: 'Kit Manager',
      commitment: '3-4 hours per month',
      description: 'Manage equipment, coordinate kit orders, and maintain inventory',
      skills: 'Organization, attention to detail',
      impact: 'Ensure all players are properly equipped',
      urgency: 'high',
      volunteers: { current: 2, needed: 4 }
    },
    {
      title: 'Transport Coordinator',
      commitment: 'As needed basis',
      description: 'Help organize carpools and transport for away matches',
      skills: 'Good communication, planning skills',
      impact: 'Ensure no player misses a match',
      urgency: 'low',
      volunteers: { current: 12, needed: 15 }
    },
    {
      title: 'First Aid Support',
      commitment: 'Match days + training',
      description: 'Provide first aid support during matches and training sessions',
      skills: 'First Aid certification (training provided)',
      impact: 'Essential player safety support',
      urgency: 'high',
      volunteers: { current: 4, needed: 8 }
    }
  ];

  const benefits = [
    {
      category: 'Personal Rewards',
      items: [
        'Make lasting friendships with other parents and families',
        'Develop new skills and gain experience',
        'Feel the satisfaction of contributing to your community',
        'Set a positive example for your children'
      ]
    },
    {
      category: 'Club Perks',
      items: [
        'Exclusive volunteer appreciation events',
        'Priority match day parking spots',
        'Volunteer of the month recognition',
        'Early access to club events and tickets'
      ]
    },
    {
      category: 'For Your Child',
      items: [
        'See their parent actively involved in their passion',
        'Better club facilities and resources',
        'Enhanced match day experience',
        'Pride in your family\'s club contribution'
      ]
    }
  ];

  const recognitionProgram = [
    {
      award: 'Volunteer of the Month',
      description: 'Monthly recognition for outstanding contribution',
      perks: ['Special parking spot', 'Club merchandise', 'Social media feature'],
      icon: '🏆'
    },
    {
      award: 'Annual Volunteer Award',
      description: 'Yearly celebration of our most dedicated volunteers',
      perks: ['Trophy presentation', 'Family dinner voucher', 'Club hall of fame'],
      icon: '🌟'
    },
    {
      award: 'Long Service Recognition',
      description: 'Appreciation for multi-year commitment',
      perks: ['Commemorative plaque', 'Lifetime membership benefits', 'Special club event'],
      icon: '🎖️'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Urgent Need';
      case 'medium': return 'Active Recruitment';
      case 'low': return 'Always Welcome';
      default: return 'Open';
    }
  };

  const quickActions = [
    {
      icon: "🙋‍♀️",
      title: "Join Our Team",
      description: "Start volunteering today",
      href: "#signup",
      gradient: "blue" as const
    },
    {
      icon: "📋",
      title: "View Opportunities",
      description: "Find your perfect role",
      href: "#opportunities",
      gradient: "green" as const
    },
    {
      icon: "❤️",
      title: "Volunteer Benefits",
      description: "What you'll get back",
      href: "#benefits",
      gradient: "purple" as const
    },
    {
      icon: "🏆",
      title: "Recognition",
      description: "Celebrating our heroes",
      href: "#recognition",
      gradient: "orange" as const
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Join Our Volunteer Team"
      heroSubtitle="Help us build something special at Rivervalley Rangers - every contribution makes a difference in our community"
      heroIcon="🤝"
      backgroundImage="/images/volunteering-hero.jpg"
      quickActions={quickActions}
      sectionName="VOLUNTEERING"
      imageSpecs="1920x1080px minimum, community and volunteering activities preferred"
    >
          
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: 'opportunities', label: 'Opportunities', icon: '🎯', desc: 'Ways to help' },
                { id: 'benefits', label: 'Why Volunteer?', icon: '💝', desc: 'What you get' },
                { id: 'signup', label: 'Get Started', icon: '✋', desc: 'Join us today' },
                { id: 'recognition', label: 'Recognition', icon: '🏆', desc: 'We appreciate you' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{tab.icon}</div>
                  <div className="font-semibold text-sm">{tab.label}</div>
                  <div className="text-xs opacity-80 mt-1">{tab.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Opportunities Tab */}
          {activeTab === 'opportunities' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">🎯</span>
                  Volunteer Opportunities
                </h2>
                
                <div className="grid gap-6">
                  {opportunities.map((opp, index) => (
                    <motion.div
                      key={opp.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="lg:w-2/3">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{opp.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(opp.urgency)}`}>
                              {getUrgencyLabel(opp.urgency)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{opp.description}</p>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-blue-700">⏰ Time: </span>
                              <span className="text-gray-600">{opp.commitment}</span>
                            </div>
                            <div>
                              <span className="font-medium text-green-700">💪 Skills: </span>
                              <span className="text-gray-600">{opp.skills}</span>
                            </div>
                            <div>
                              <span className="font-medium text-purple-700">💫 Impact: </span>
                              <span className="text-gray-600">{opp.impact}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="lg:w-1/3 mt-4 lg:mt-0 lg:text-right">
                          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                            <div className="text-2xl font-bold text-blue-600">
                              {opp.volunteers.current} / {opp.volunteers.needed}
                            </div>
                            <div className="text-xs text-gray-500">Current / Needed</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(opp.volunteers.current / opp.volunteers.needed) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                            I'm Interested
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200 text-center">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">🌟 Can't find what you're looking for?</h3>
                  <p className="text-green-700 mb-4">
                    We're always open to new ideas! Have a skill or passion you'd like to share with our club community?
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Suggest New Opportunity
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">💝</span>
                  Why Volunteer With Us?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {benefits.map((category, index) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{category.category}</h3>
                      <ul className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start text-sm text-gray-700">
                            <span className="text-blue-600 mr-2 mt-1">✨</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-blue-50 rounded-xl p-8 border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4 text-center">💬 What Our Volunteers Say</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <p className="text-gray-700 italic mb-3">
                        "I started helping with match day refreshments and ended up making some of my closest friends. 
                        The community spirit here is incredible!"
                      </p>
                      <div className="text-sm text-blue-700 font-medium">— Sarah M., Parent Volunteer</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <p className="text-gray-700 italic mb-3">
                        "Volunteering with the fundraising committee taught me event planning skills I now use in my career. 
                        Plus, we raised enough for new training equipment!"
                      </p>
                      <div className="text-sm text-blue-700 font-medium">— Michael D., Fundraising Team</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sign Up Tab */}
          {activeTab === 'signup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">✋</span>
                  Ready to Get Started?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Getting Started is Easy</h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, title: 'Express Interest', desc: 'Fill out our simple volunteer form or contact us directly' },
                        { step: 2, title: 'Chat with Us', desc: 'We\'ll have a friendly conversation about your interests and availability' },
                        { step: 3, title: 'Try It Out', desc: 'Start with a small commitment to see if it\'s a good fit' },
                        { step: 4, title: 'Join the Team', desc: 'Become a regular part of our volunteer community' }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start">
                          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Quick Interest Form</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your phone number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Select an area</option>
                          <option value="match-day">Match Day Helper</option>
                          <option value="fundraising">Fundraising</option>
                          <option value="social-media">Social Media</option>
                          <option value="kit">Kit Management</option>
                          <option value="transport">Transport</option>
                          <option value="first-aid">First Aid</option>
                          <option value="other">Something else</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about yourself (Optional)</label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                          placeholder="Any skills, experience, or questions you'd like to share..."
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                      >
                        Submit Interest
                      </button>
                    </form>
                    
                    <div className="mt-4 text-center text-xs text-gray-500">
                      Or email us directly at <a href="mailto:volunteers@rvrafc.ie" className="text-blue-600 hover:underline">volunteers@rvrafc.ie</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recognition Tab */}
          {activeTab === 'recognition' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">🏆</span>
                  Volunteer Recognition
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {recognitionProgram.map((program, index) => (
                    <motion.div
                      key={program.award}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 text-center"
                    >
                      <div className="text-4xl mb-4">{program.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{program.award}</h3>
                      <p className="text-sm text-gray-700 mb-4">{program.description}</p>
                      <div className="space-y-2">
                        {program.perks.map((perk, perkIndex) => (
                          <div key={perkIndex} className="text-xs text-orange-800 bg-orange-100 rounded-full px-3 py-1">
                            {perk}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">🌟 Current Volunteer Spotlights</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                      <div className="text-4xl mb-3">🥇</div>
                      <h4 className="font-semibold text-gray-900 mb-2">Volunteer of the Month</h4>
                      <p className="text-blue-600 font-medium mb-2">Emma Thompson</p>
                      <p className="text-sm text-gray-600">
                        "Emma has been incredible organizing our match day refreshments. 
                        Her attention to detail and friendly smile make every match day special!"
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                      <div className="text-4xl mb-3">🎖️</div>
                      <h4 className="font-semibold text-gray-900 mb-2">5-Year Service Award</h4>
                      <p className="text-purple-600 font-medium mb-2">David & Lisa Murphy</p>
                      <p className="text-sm text-gray-600">
                        "Five years of dedicated service in fundraising, transport coordination, and so much more. 
                        True club legends!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

    </GlassPageTemplate>
  );
}