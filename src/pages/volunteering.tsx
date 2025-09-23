import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPageTemplate from '../components/GlassPageTemplate';
import { GlassCard } from '../components/Glass';
import { supabase } from '../lib/supabase';
import { sendVolunteerSignupNotification } from '../lib/emailNotifications';

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  category: 'coaching' | 'events' | 'administration' | 'fundraising' | 'facilities' | 'youth' | 'general';
  location?: string;
  date?: string;
  time?: string;
  duration_hours?: number;
  required_skills?: string[];
  max_volunteers: number;
  current_signups: number;
  is_active: boolean;
  contact_person?: string;
  contact_email?: string;
  requirements?: string;
  benefits?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface VolunteerSignupForm {
  volunteer_name: string;
  volunteer_email: string;
  volunteer_phone: string;
  age_group: string;
  previous_experience: string;
  availability_notes: string;
  motivation: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

const categories = [
  { value: 'coaching', label: 'Coaching', icon: '⚽' },
  { value: 'events', label: 'Events', icon: '🎉' },
  { value: 'administration', label: 'Administration', icon: '📋' },
  { value: 'fundraising', label: 'Fundraising', icon: '💰' },
  { value: 'facilities', label: 'Facilities', icon: '🔧' },
  { value: 'youth', label: 'Youth', icon: '👦' },
  { value: 'general', label: 'General', icon: '🤝' }
];

const ageGroups = [
  { value: 'under_16', label: 'Under 16' },
  { value: '16_25', label: '16-25' },
  { value: '26_35', label: '26-35' },
  { value: '36_50', label: '36-50' },
  { value: '51_65', label: '51-65' },
  { value: 'over_65', label: 'Over 65' }
];

export default function Volunteering() {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'benefits' | 'signup'>('opportunities');
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  const [signupForm, setSignupForm] = useState<VolunteerSignupForm>({
    volunteer_name: '',
    volunteer_email: '',
    volunteer_phone: '',
    age_group: '',
    previous_experience: '',
    availability_notes: '',
    motivation: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteer_opportunities')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching volunteer opportunities:', error);
        setError('Database connection failed. Using demo opportunities.');
        // Create demo opportunities for development
        const demoOpportunities: VolunteerOpportunity[] = [
          {
            id: 'demo-1',
            title: 'Match Day Assistant Coach',
            description: 'Help our coaching staff during home matches by assisting with equipment setup, player coordination, and sideline support. Perfect for those interested in gaining coaching experience.',
            excerpt: 'Assist coaching staff during home matches with equipment and player support.',
            category: 'coaching',
            location: 'Home Ground',
            date: '2025-10-05',
            time: '13:00',
            duration_hours: 4,
            required_skills: ['basic football knowledge', 'communication skills'],
            max_volunteers: 2,
            current_signups: 1,
            is_active: true,
            contact_person: 'John Smith',
            contact_email: 'coaching@rvrafc.ie',
            requirements: 'Must be over 18. Garda vetting required for youth matches.',
            benefits: 'Coaching experience, match day meals provided, club training opportunities.',
            priority: 'high'
          },
          {
            id: 'demo-2',
            title: 'Fundraising Event Setup Crew',
            description: 'Join our setup team for the annual fundraising race night. Help with venue preparation, table arrangement, decorations, and equipment setup. Great way to meet other volunteers.',
            excerpt: 'Help set up venue and equipment for annual fundraising race night.',
            category: 'fundraising',
            location: 'Club House Main Hall',
            date: '2025-11-15',
            time: '16:00',
            duration_hours: 3,
            required_skills: ['physical work', 'teamwork'],
            max_volunteers: 6,
            current_signups: 2,
            is_active: true,
            contact_person: 'Mary O\'Connor',
            contact_email: 'events@rvrafc.ie',
            requirements: 'Able to lift and move furniture. Safety briefing required.',
            benefits: 'Free entry to event, volunteer appreciation dinner, club merchandise.',
            priority: 'medium'
          }
        ];
        setOpportunities(demoOpportunities);
      } else {
        setOpportunities(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load volunteer opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = (opportunity: VolunteerOpportunity) => {
    setSelectedOpportunity(opportunity);
    setShowSignupModal(true);
  };

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOpportunity) return;
    
    try {
      setLoading(true);
      
      const signupData = {
        opportunity_id: selectedOpportunity.id,
        ...signupForm,
        signed_up_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check if it's a demo opportunity
      if (selectedOpportunity.id.startsWith('demo-')) {
        // For demo, just show success message
        console.log('Demo signup submitted:', signupData);
      } else {
        const { error } = await supabase
          .from('volunteer_signups')
          .insert([{
            ...signupData,
            id: crypto.randomUUID(),
            status: 'pending'
          }]);

        if (error) throw error;
        
        // Send email notification to admins
        await sendVolunteerSignupNotification({
          volunteer_name: signupForm.volunteer_name,
          volunteer_email: signupForm.volunteer_email,
          volunteer_phone: signupForm.volunteer_phone,
          opportunity_title: selectedOpportunity.title,
          motivation: signupForm.motivation,
          signed_up_at: new Date().toISOString()
        });
      }

      // Reset form and show success
      setSignupForm({
        volunteer_name: '',
        volunteer_email: '',
        volunteer_phone: '',
        age_group: '',
        previous_experience: '',
        availability_notes: '',
        motivation: '',
        emergency_contact_name: '',
        emergency_contact_phone: ''
      });
      setShowSignupModal(false);
      setSignupSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setSignupSuccess(false), 5000);
      
    } catch (err) {
      console.error('Error submitting signup:', err);
      setError('Failed to submit signup. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1];
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'urgent': return { label: 'Urgent Need', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'high': return { label: 'High Priority', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'medium': return { label: 'Active Recruitment', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'low': return { label: 'Always Welcome', color: 'bg-green-100 text-green-800 border-green-200' };
      default: return { label: 'Open', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };


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
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Join Our Volunteer Team"
      heroSubtitle="Help us build something special at Rivervalley Rangers - every contribution makes a difference in our community"
      heroIcon="🤝"
      backgroundImage="/images/hero/astrocorner.jpg"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { id: 'opportunities', label: 'Opportunities', icon: '🎯', desc: 'Ways to help' },
                { id: 'benefits', label: 'Why Volunteer?', icon: '💝', desc: 'What you get' },
                { id: 'signup', label: 'Get Started', icon: '✋', desc: 'Join us today' }
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

          {/* Success Message */}
          {signupSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold">Signup Successful!</p>
                  <p className="text-sm text-green-100">We'll review your application and get back to you soon.</p>
                </div>
              </div>
            </motion.div>
          )}

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
                  {opportunities.length > 0 && (
                    <span className="ml-3 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {opportunities.length} Available
                    </span>
                  )}
                </h2>
                
                {error && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-center">{error}</p>
                  </div>
                )}
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading opportunities...</p>
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🤝</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Opportunities Available</h3>
                    <p className="text-gray-600">Check back soon for new volunteer opportunities!</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {opportunities.map((opp, index) => {
                      const categoryInfo = getCategoryInfo(opp.category);
                      const priorityInfo = getPriorityInfo(opp.priority);
                      return (
                        <motion.div
                          key={opp.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="lg:w-2/3">
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold text-gray-900">{opp.title}</h3>
                                
                                {/* Category Badge */}
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                  <span>{categoryInfo.icon}</span>
                                  <span>{categoryInfo.label}</span>
                                </span>
                                
                                {/* Priority Badge */}
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityInfo.color}`}>
                                  {priorityInfo.label}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-4">{opp.description}</p>
                              
                              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                {opp.duration_hours && (
                                  <div>
                                    <span className="font-medium text-blue-700">⏰ Duration: </span>
                                    <span className="text-gray-600">{opp.duration_hours}h</span>
                                  </div>
                                )}
                                {opp.location && (
                                  <div>
                                    <span className="font-medium text-green-700">📍 Location: </span>
                                    <span className="text-gray-600">{opp.location}</span>
                                  </div>
                                )}
                                {opp.date && (
                                  <div>
                                    <span className="font-medium text-purple-700">📅 Date: </span>
                                    <span className="text-gray-600">{new Date(opp.date).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {opp.required_skills && opp.required_skills.length > 0 && (
                                  <div>
                                    <span className="font-medium text-orange-700">💪 Skills: </span>
                                    <span className="text-gray-600">{opp.required_skills.slice(0, 2).join(', ')}{opp.required_skills.length > 2 ? '...' : ''}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="lg:w-1/3 mt-4 lg:mt-0 lg:text-right">
                              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                                <div className="text-2xl font-bold text-blue-600">
                                  {opp.current_signups} / {opp.max_volunteers}
                                </div>
                                <div className="text-xs text-gray-500">Signed up / Needed</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((opp.current_signups / opp.max_volunteers) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleSignup(opp)}
                                disabled={opp.current_signups >= opp.max_volunteers}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                  opp.current_signups >= opp.max_volunteers
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                {opp.current_signups >= opp.max_volunteers ? 'Full' : 'Sign Up'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200 text-center">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">🌟 Can't find what you're looking for?</h3>
                  <p className="text-green-700 mb-4">
                    We're always open to new ideas! Have a skill or passion you'd like to share with our club community?
                  </p>
                  <a 
                    href="mailto:volunteers@rvrafc.ie?subject=New Volunteer Opportunity Suggestion"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors inline-block"
                  >
                    Suggest New Opportunity
                  </a>
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
                        { step: 1, title: 'Browse Opportunities', desc: 'Look through our available volunteer positions and find one that interests you' },
                        { step: 2, title: 'Sign Up Online', desc: 'Click "Sign Up" on any opportunity and fill out our simple application form' },
                        { step: 3, title: 'Admin Review', desc: 'Our volunteer coordinators will review your application and contact you' },
                        { step: 4, title: 'Get Started', desc: 'Once approved, you\'ll receive all the details to begin volunteering' }
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
                    
                    <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Success</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Be specific about your availability and interests</li>
                        <li>• Don't worry if you're new - we provide training!</li>
                        <li>• Start small and grow your involvement over time</li>
                        <li>• Connect with other volunteers - it's more fun together!</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Current Opportunities Summary</h3>
                    
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading...</p>
                      </div>
                    ) : opportunities.length === 0 ? (
                      <p className="text-center text-gray-600 py-4">No opportunities currently available</p>
                    ) : (
                      <div className="space-y-3">
                        {opportunities.slice(0, 3).map((opp) => {
                          const categoryInfo = getCategoryInfo(opp.category);
                          return (
                            <div key={opp.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{categoryInfo.icon}</span>
                                  <h4 className="font-medium text-gray-900 text-sm">{opp.title}</h4>
                                </div>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                  {opp.current_signups}/{opp.max_volunteers}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-3">{opp.excerpt}</p>
                              <button
                                onClick={() => handleSignup(opp)}
                                disabled={opp.current_signups >= opp.max_volunteers}
                                className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                  opp.current_signups >= opp.max_volunteers
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                {opp.current_signups >= opp.max_volunteers ? 'Full' : 'Sign Up Now'}
                              </button>
                            </div>
                          );
                        })}
                        
                        {opportunities.length > 3 && (
                          <div className="text-center pt-2">
                            <button
                              onClick={() => setActiveTab('opportunities')}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View all {opportunities.length} opportunities →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                      Questions? Email us at <a href="mailto:volunteers@rvrafc.ie" className="text-blue-600 hover:underline">volunteers@rvrafc.ie</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}


          {/* Signup Modal */}
          <AnimatePresence>
            {showSignupModal && selectedOpportunity && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowSignupModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-2">🤝 Volunteer Signup</h3>
                        <p className="text-blue-100 text-sm">{selectedOpportunity.title}</p>
                      </div>
                      <button
                        onClick={() => setShowSignupModal(false)}
                        className="text-white/80 hover:text-white text-2xl font-bold transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Opportunity Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Opportunity Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>📍 <strong>Location:</strong> {selectedOpportunity.location || 'TBD'}</div>
                        <div>⏱️ <strong>Duration:</strong> {selectedOpportunity.duration_hours ? `${selectedOpportunity.duration_hours}h` : 'Flexible'}</div>
                        {selectedOpportunity.date && (
                          <div>📅 <strong>Date:</strong> {new Date(selectedOpportunity.date).toLocaleDateString()}</div>
                        )}
                        <div>👥 <strong>Spots:</strong> {selectedOpportunity.current_signups}/{selectedOpportunity.max_volunteers}</div>
                      </div>
                      <p className="text-sm text-gray-700 mt-3">{selectedOpportunity.description}</p>
                    </div>
                    
                    <form onSubmit={submitSignup} className="space-y-4">
                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={signupForm.volunteer_name}
                            onChange={(e) => setSignupForm({...signupForm, volunteer_name: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={signupForm.volunteer_email}
                            onChange={(e) => setSignupForm({...signupForm, volunteer_email: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={signupForm.volunteer_phone}
                            onChange={(e) => setSignupForm({...signupForm, volunteer_phone: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="+353 87 123 4567"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Age Group
                          </label>
                          <select
                            value={signupForm.age_group}
                            onChange={(e) => setSignupForm({...signupForm, age_group: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="">Select age group</option>
                            {ageGroups.map(group => (
                              <option key={group.value} value={group.value}>{group.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous Experience
                        </label>
                        <textarea
                          rows={3}
                          value={signupForm.previous_experience}
                          onChange={(e) => setSignupForm({...signupForm, previous_experience: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Tell us about any relevant experience you have..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Why do you want to volunteer? *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={signupForm.motivation}
                          onChange={(e) => setSignupForm({...signupForm, motivation: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Share your motivation for volunteering with us..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Availability Notes
                        </label>
                        <textarea
                          rows={2}
                          value={signupForm.availability_notes}
                          onChange={(e) => setSignupForm({...signupForm, availability_notes: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="When are you typically available? Any schedule constraints?"
                        />
                      </div>
                      
                      {/* Emergency Contact */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Emergency Contact (Optional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Contact Name
                            </label>
                            <input
                              type="text"
                              value={signupForm.emergency_contact_name}
                              onChange={(e) => setSignupForm({...signupForm, emergency_contact_name: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                              placeholder="Emergency contact name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Contact Phone
                            </label>
                            <input
                              type="tel"
                              value={signupForm.emergency_contact_phone}
                              onChange={(e) => setSignupForm({...signupForm, emergency_contact_phone: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                              placeholder="Emergency contact phone"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowSignupModal(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
                        >
                          {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

    </GlassPageTemplate>
  );
}