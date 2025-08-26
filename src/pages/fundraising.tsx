import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../components/Glass';

export default function Fundraising() {
  const [activeTab, setActiveTab] = useState<'current' | 'ways' | 'goals' | 'impact'>('current');

  const currentCampaigns = [
    {
      id: '1',
      title: 'New Training Equipment Fund',
      description: 'Help us purchase modern training cones, bibs, and goal nets for all our teams',
      target: 2500,
      raised: 1820,
      endDate: '2024-12-31',
      urgency: 'high',
      image: '/images/training-equipment.jpg',
      backers: 87
    },
    {
      id: '2',
      title: 'Away Kit for U14 Girls Team',
      description: 'Our talented girls team needs a new away kit for their upcoming league campaign',
      target: 800,
      raised: 650,
      endDate: '2024-11-15',
      urgency: 'medium',
      image: '/images/girls-kit.jpg',
      backers: 32
    },
    {
      id: '3',
      title: 'Pitch Maintenance Equipment',
      description: 'Essential equipment to keep our home ground in top condition all season long',
      target: 1200,
      raised: 340,
      endDate: '2024-12-15',
      urgency: 'low',
      image: '/images/pitch-maintenance.jpg',
      backers: 15
    }
  ];

  const fundraisingWays = [
    {
      category: 'Ongoing Programs',
      methods: [
        {
          title: 'RVR Lottery',
          description: 'Weekly draw with cash prizes - €2 per week',
          impact: '€200+ per month for club development',
          effort: 'Low - automated weekly draw',
          howTo: 'Sign up for direct debit through team manager'
        },
        {
          title: 'Easyfundraising',
          description: 'Shop online and raise money at no extra cost',
          impact: '€500+ annually from regular shoppers',
          effort: 'Zero - just shop as normal',
          howTo: 'Register at easyfundraising.org.uk'
        },
        {
          title: 'Sponsor a Player',
          description: 'Local businesses sponsor player equipment',
          impact: '€50-€200 per sponsorship',
          effort: 'Medium - connect with local businesses',
          howTo: 'Contact fundraising team for sponsor packs'
        }
      ]
    },
    {
      category: 'Special Events',
      methods: [
        {
          title: 'Annual Quiz Night',
          description: 'Family-friendly quiz with prizes and refreshments',
          impact: '€1000+ per event',
          effort: 'High - requires organization team',
          howTo: 'Join our events committee'
        },
        {
          title: 'Car Boot Sales',
          description: 'Monthly car boot sales at the club grounds',
          impact: '€300-€500 per sale',
          effort: 'Medium - helpers needed for setup',
          howTo: 'Book your pitch with events team'
        },
        {
          title: 'Sponsored Challenges',
          description: 'Fun challenges like penalty shootouts or skill tests',
          impact: '€500-€1500 depending on challenge',
          effort: 'Medium - promotion and coordination needed',
          howTo: 'Suggest ideas to fundraising committee'
        }
      ]
    },
    {
      category: 'Creative Ideas',
      methods: [
        {
          title: '100 Club',
          description: 'Monthly draw for 100 members at €5 each',
          impact: '€300 per month (€200 prizes, €300 to club)',
          effort: 'Low - simple monthly administration',
          howTo: 'Sign up through club secretary'
        },
        {
          title: 'Birthday Fundraisers',
          description: 'Ask for club donations instead of birthday gifts',
          impact: 'Variable - €50-€500 per birthday',
          effort: 'Low - just ask friends and family',
          howTo: 'Create Facebook fundraiser or donation page'
        },
        {
          title: 'Skills Sharing',
          description: 'Offer services like gardening, decorating, or tutoring for donations',
          impact: '€100-€300 per service',
          effort: 'Medium - depends on service offered',
          howTo: 'Advertise skills on club social media'
        }
      ]
    }
  ];

  const clubGoals = [
    {
      priority: 'urgent',
      title: 'New Changing Rooms',
      description: 'Modern, accessible changing facilities for all teams',
      target: 25000,
      timeframe: '18 months',
      benefits: ['Better player facilities', 'Wheelchair accessible', 'Increased capacity', 'Modern amenities'],
      funded: 8500
    },
    {
      priority: 'important',
      title: 'Astro Pitch Upgrade',
      description: 'Resurface training pitch with latest 3G technology',
      target: 45000,
      timeframe: '2 years',
      benefits: ['Year-round training', 'Better surface quality', 'Reduced injuries', 'Income from rentals'],
      funded: 12000
    },
    {
      priority: 'future',
      title: 'Youth Academy Expansion',
      description: 'Equipment and coaching for additional age groups',
      target: 15000,
      timeframe: '3 years',
      benefits: ['More teams', 'Better coaching ratios', 'Professional development', 'Community growth'],
      funded: 3200
    }
  ];

  const impactStories = [
    {
      year: '2023',
      achievement: 'New Home Kits for All Teams',
      amount: '€3,200',
      impact: 'Every player now has a professional kit they can be proud of',
      story: 'Thanks to our car boot sales and lottery, we provided brand new home kits for all 12 teams. The pride on the kids\' faces was priceless!'
    },
    {
      year: '2022',
      achievement: 'Defibrillator Installation',
      amount: '€1,800',
      impact: 'Critical safety equipment now available at all matches',
      story: 'Our quiz night raised enough for a defibrillator and first aid training for 10 volunteers. Player safety is our top priority.'
    },
    {
      year: '2021',
      achievement: 'Pitch Drainage System',
      amount: '€8,500',
      impact: 'Reduced match cancellations by 70% in winter months',
      story: 'Community sponsored walk raised funds for drainage improvements. Now we rarely have to cancel matches due to waterlogged pitches!'
    }
  ];

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'important': return 'bg-orange-600 text-white';
      case 'future': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const quickActions = [
    {
      icon: "🎯",
      title: "Current Campaigns",
      description: "Support active fundraisers",
      href: "#current-campaigns",
      gradient: "blue" as const
    },
    {
      icon: "💡",
      title: "Ways to Help",
      description: "Find your perfect contribution",
      href: "#ways-to-help",
      gradient: "green" as const
    },
    {
      icon: "🏗️",
      title: "Club Goals",
      description: "See what we're building",
      href: "#club-goals",
      gradient: "purple" as const
    },
    {
      icon: "✨",
      title: "Our Impact",
      description: "Celebrate achievements",
      href: "#our-impact",
      gradient: "orange" as const
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Building Our Legacy"
      heroSubtitle="Like the ancient builders of Swords Castle, we're constructing something lasting for our community"
      heroIcon="🏰"
      quickActions={quickActions}
      sectionName="FUNDRAISING"
      imageSpecs="1920x1080px minimum, club facilities and community building activities preferred"
    >

      <div className="max-w-7xl mx-auto">
        {/* Historical Connection Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <GlassCard intensity="heavy" className="bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">From Castle to Clubhouse</h2>
              <p className="text-slate-200 max-w-3xl mx-auto leading-relaxed">
                For over a thousand years, this community has come together to build something greater than themselves.
                From Brian Boru's stronghold to St. Columba's centers of learning, from Ward Park gatherings to our modern clubhouse -
                your support continues this proud tradition of community investment.
              </p>
            </div>
          </GlassCard>
        </motion.div>
          
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <GlassCard intensity="medium" className="bg-gradient-to-br from-white/80 to-gray-50/80 p-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: 'current', label: 'Current Campaigns', icon: '🎯', desc: 'Active fundraisers' },
                { id: 'ways', label: 'Ways to Help', icon: '💡', desc: 'How you can contribute' },
                { id: 'goals', label: 'Club Goals', icon: '🏗️', desc: 'What we\'re building' },
                { id: 'impact', label: 'Our Impact', icon: '✨', desc: 'What we\'ve achieved' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{tab.icon}</div>
                  <div className="font-semibold text-sm">{tab.label}</div>
                  <div className="text-xs opacity-80 mt-1">{tab.desc}</div>
                </button>
              ))}
            </div>
            </GlassCard>
          </motion.div>

          {/* Current Campaigns Tab */}
          {activeTab === 'current' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard intensity="medium" className="bg-gradient-to-br from-white/80 to-gray-50/80 p-8" id="current-campaigns">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">🎯</span>
                  Active Fundraising Campaigns
                </h2>
                
                <div className="grid gap-8">
                  {currentCampaigns.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-gradient-to-r from-gray-50/80 to-green-50/80 rounded-xl p-6 border border-gray-100"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/3">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(campaign.urgency)}`}>
                              {campaign.urgency === 'high' ? 'Urgent' : 
                               campaign.urgency === 'medium' ? 'Active' : 'Ongoing'}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{campaign.description}</p>
                          
                          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Progress</span>
                              <span className="text-sm text-gray-500">{campaign.backers} supporters</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                              <div 
                                className="bg-green-600 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${getProgressPercentage(campaign.raised, campaign.target)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-green-600">
                                {formatCurrency(campaign.raised)} raised
                              </span>
                              <span className="text-gray-600">
                                of {formatCurrency(campaign.target)} goal
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">⏰</span>
                            Campaign ends: {formatDate(campaign.endDate)}
                          </div>
                        </div>
                        
                        <div className="lg:w-1/3">
                          <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-lg h-48 mb-4 flex items-center justify-center text-white text-4xl">
                            ⚽
                          </div>
                          <div className="space-y-3">
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
                              Contribute Now
                            </button>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                              Share Campaign
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Ways to Help Tab */}
          {activeTab === 'ways' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard intensity="medium" className="bg-gradient-to-br from-white/80 to-gray-50/80 p-8" id="ways-to-help">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">💡</span>
                  Ways You Can Help
                </h2>
                
                <div className="space-y-8">
                  {fundraisingWays.map((category, categoryIndex) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        {category.category}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.methods.map((method, methodIndex) => (
                          <div
                            key={method.title}
                            className="bg-gradient-to-br from-yellow-50/80 to-green-50/80 rounded-xl p-6 border border-yellow-100"
                          >
                            <h4 className="font-semibold text-gray-900 mb-3">{method.title}</h4>
                            <p className="text-sm text-gray-700 mb-4">{method.description}</p>
                            
                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="font-medium text-green-700">💰 Impact: </span>
                                <span className="text-gray-600">{method.impact}</span>
                              </div>
                              <div>
                                <span className="font-medium text-blue-700">⚡ Effort: </span>
                                <span className="text-gray-600">{method.effort}</span>
                              </div>
                              <div>
                                <span className="font-medium text-purple-700">🚀 How: </span>
                                <span className="text-gray-600">{method.howTo}</span>
                              </div>
                            </div>
                            
                            <button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg text-sm transition-colors">
                              Get Started
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-green-50/80 rounded-xl p-6 border border-green-200 text-center">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">🎉 Can't find your preferred way to help?</h3>
                  <p className="text-green-700 mb-4">
                    We're always open to creative fundraising ideas! Have a unique skill, connection, or idea? 
                    Let's make it happen together.
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Suggest an Idea
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Club Goals Tab */}
          {activeTab === 'goals' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard intensity="medium" className="bg-gradient-to-br from-white/80 to-gray-50/80 p-8" id="club-goals">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">🏗️</span>
                  Long-term Club Goals
                </h2>
                
                <div className="space-y-6">
                  {clubGoals.map((goal, index) => (
                    <motion.div
                      key={goal.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 rounded-xl p-6 border border-gray-100"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/3">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(goal.priority)}`}>
                              {goal.priority.toUpperCase()}
                            </span>
                            <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{goal.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="text-sm text-gray-600">Target Amount</div>
                              <div className="text-lg font-bold text-blue-600">{formatCurrency(goal.target)}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="text-sm text-gray-600">Timeframe</div>
                              <div className="text-lg font-bold text-green-600">{goal.timeframe}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Key Benefits:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {goal.benefits.map((benefit, benefitIndex) => (
                                <div key={benefitIndex} className="flex items-center text-sm text-gray-700">
                                  <span className="text-green-600 mr-2">✓</span>
                                  {benefit}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="lg:w-1/3">
                          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                            <div className="text-sm text-gray-600 mb-2">Current Funding</div>
                            <div className="text-2xl font-bold text-green-600 mb-3">
                              {formatCurrency(goal.funded)}
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                              <div 
                                className="bg-green-600 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${getProgressPercentage(goal.funded, goal.target)}%` }}
                              ></div>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-4">
                              {Math.round((goal.funded / goal.target) * 100)}% of goal
                            </div>
                            
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                              Support This Goal
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Impact Tab */}
          {activeTab === 'impact' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard intensity="medium" className="bg-gradient-to-br from-white/80 to-gray-50/80 p-8" id="our-impact">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">✨</span>
                  Our Fundraising Impact
                </h2>
                
                <div className="mb-8 text-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50/80 to-blue-50/80 rounded-xl p-6 border border-green-100">
                      <div className="text-3xl font-bold text-green-600 mb-2">€47,350</div>
                      <div className="text-sm text-gray-600">Total Raised (Last 3 Years)</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-xl p-6 border border-blue-100">
                      <div className="text-3xl font-bold text-blue-600 mb-2">234</div>
                      <div className="text-sm text-gray-600">Community Contributors</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-xl p-6 border border-purple-100">
                      <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
                      <div className="text-sm text-gray-600">Major Projects Completed</div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Success Stories</h3>
                
                <div className="space-y-6">
                  {impactStories.map((story, index) => (
                    <motion.div
                      key={story.year}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-gradient-to-r from-yellow-50/80 to-green-50/80 rounded-xl p-6 border border-yellow-100"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="lg:w-1/4 text-center lg:text-left">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="text-2xl font-bold text-gray-900">{story.year}</div>
                            <div className="text-lg font-semibold text-green-600">{story.amount}</div>
                          </div>
                        </div>
                        
                        <div className="lg:w-3/4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{story.achievement}</h4>
                          <p className="text-blue-700 font-medium mb-3">{story.impact}</p>
                          <p className="text-gray-700 italic">"{story.story}"</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-gradient-to-r from-green-50/80 to-blue-50/80 rounded-xl p-8 border border-green-200 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🙏 Thank You to Our Community</h3>
                  <p className="text-gray-700 mb-6">
                    None of this would be possible without the incredible generosity and support of our parents, 
                    local businesses, and community members. Every contribution, whether time or money, makes a real difference.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <span className="bg-white px-4 py-2 rounded-full text-green-800 shadow-sm">💚 Parent Volunteers</span>
                    <span className="bg-white px-4 py-2 rounded-full text-blue-800 shadow-sm">🏢 Local Business Sponsors</span>
                    <span className="bg-white px-4 py-2 rounded-full text-purple-800 shadow-sm">🤝 Community Partners</span>
                    <span className="bg-white px-4 py-2 rounded-full text-orange-800 shadow-sm">🎉 Event Participants</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

      </div>

    </GlassPageTemplate>
  );
}