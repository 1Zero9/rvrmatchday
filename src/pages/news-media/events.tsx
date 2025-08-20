import StandardLayout from '@/components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EventsNews() {
  const newsEvents = [
    {
      id: 1,
      title: 'U18 Rangers Claim County League Title',
      type: 'Match Report',
      date: 'May 15, 2024',
      excerpt: 'A thrilling 2-1 victory against Blackrock FC secured the County Youth League Division 1 title for our U18 team in dramatic fashion.',
      featured: true,
      category: 'Youth Teams'
    },
    {
      id: 2,
      title: 'New Floodlights Installation Complete',
      type: 'Club News',
      date: 'June 8, 2024',
      excerpt: 'State-of-the-art LED floodlighting system now operational at Rivervalley Park, enabling evening training and matches.',
      featured: true,
      category: 'Infrastructure'
    },
    {
      id: 3,
      title: 'Annual Family Fun Day - July 20th',
      type: 'Upcoming Event',
      date: 'July 20, 2024',
      excerpt: 'Join us for our biggest family event of the year with games, food stalls, bouncy castles, and exhibition matches.',
      featured: false,
      category: 'Events'
    },
    {
      id: 4,
      title: 'Community Coaching Awards Recognition',
      type: 'Achievement',
      date: 'April 22, 2024',
      excerpt: 'Rivervalley Rangers recognized by Dublin County FA for outstanding community outreach programs in local schools.',
      featured: false,
      category: 'Community'
    },
    {
      id: 5,
      title: 'First Team Reaches Cup Semi-Final',
      type: 'Match Report',
      date: 'March 30, 2024',
      excerpt: 'A commanding 3-0 victory over Ashtown United books our first team a place in the Dublin Cup semi-final.',
      featured: false,
      category: 'Senior Teams'
    },
    {
      id: 6,
      title: 'New Academy Intake - Registration Open',
      type: 'Registration',
      date: 'August 1, 2024',
      excerpt: 'Elite youth academy accepting applications for September intake. Assessment days scheduled for mid-August.',
      featured: false,
      category: 'Academy'
    },
    {
      id: 7,
      title: 'Fundraising Milestone Achieved',
      type: 'Club News',
      date: 'February 14, 2024',
      excerpt: 'Club reaches €50,000 fundraising target for new changing room facilities thanks to community support.',
      featured: false,
      category: 'Fundraising'
    },
    {
      id: 8,
      title: 'Coach Education Workshop Success',
      type: 'Development',
      date: 'January 18, 2024',
      excerpt: 'Twelve club coaches complete FAI Kickstart qualification course, enhancing our coaching standards.',
      featured: false,
      category: 'Education'
    }
  ];

  const upcomingEvents = [
    {
      date: 'July 20',
      month: 'Jul',
      title: 'Family Fun Day',
      time: '12:00 PM - 6:00 PM',
      location: 'Rivervalley Park'
    },
    {
      date: 'August 5',
      month: 'Aug',
      title: 'Season Launch BBQ',
      time: '2:00 PM - 8:00 PM',
      location: 'Clubhouse'
    },
    {
      date: 'August 15',
      month: 'Aug',
      title: 'Academy Assessment Day',
      time: '10:00 AM - 4:00 PM',
      location: 'Main Pitch'
    },
    {
      date: 'September 7',
      month: 'Sep',
      title: 'AGM Meeting',
      time: '7:00 PM - 9:00 PM',
      location: 'Clubhouse'
    }
  ];

  return (
    <StandardLayout title="Events & News">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">📰</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Events & News</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, match reports, and upcoming events at Rivervalley Rangers AFC
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Featured Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {newsEvents.filter(item => item.featured).map((item, index) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <div className="text-4xl">
                        {item.type === 'Match Report' ? '⚽' : '🏆'}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {item.type}
                        </span>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.excerpt}</p>
                      <div className="mt-4">
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* All News Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
              
              <div className="space-y-6">
                {newsEvents.filter(item => !item.featured).map((item, index) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium mr-3">
                            {item.type}
                          </span>
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{item.excerpt}</p>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-2">{item.date}</p>
                          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                            Read Full Article
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium">1</button>
                  <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-300">2</button>
                  <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-300">3</button>
                  <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-300">→</button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* News & Media Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">News & Media</h3>
              <nav className="space-y-2">
                <Link href="/news-media/gallery" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Gallery</Link>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 text-green-700 px-3 py-2 rounded font-medium">Events & News</div>
              </nav>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3 text-center min-w-0 flex-shrink-0">
                      <div className="text-blue-600 font-bold text-lg leading-none">{event.date.split(' ')[1]}</div>
                      <div className="text-blue-500 text-xs uppercase">{event.month}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{event.title}</h4>
                      <p className="text-gray-600 text-xs">{event.time}</p>
                      <p className="text-gray-500 text-xs">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/get-involved/events" className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View All Events →
                </Link>
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-700 text-sm mb-4">
                Get the latest news and event updates delivered to your inbox every week.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
                  Subscribe to Newsletter
                </button>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="bg-blue-500 text-white rounded p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"/>
                    </svg>
                  </div>
                  <span className="text-sm">Facebook</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="bg-blue-400 text-white rounded p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </div>
                  <span className="text-sm">Twitter</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-pink-600 transition-colors">
                  <div className="bg-pink-500 text-white rounded p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"/>
                    </svg>
                  </div>
                  <span className="text-sm">Instagram</span>
                </a>
              </div>
            </motion.div>

            {/* Contact Press */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Contact</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Press Officer</p>
                  <p className="text-gray-600">Michael O'Brien</p>
                  <p className="text-blue-600">press@rvrfc.com</p>
                  <p className="text-gray-500">+353 87 123 4580</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    For media inquiries, match reports, or interview requests
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}