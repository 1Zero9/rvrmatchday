import StandardLayout from '../components/StandardLayout';
import MobileLayout from '../components/MobileLayout';
import MobilePageContainer from '../components/mobile/MobilePageContainer';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NewsUpdates() {
  const newsArticles = [
    {
      id: 1,
      title: 'New Youth Academy Opens This September',
      excerpt: 'We are thrilled to announce the opening of our new Youth Academy, offering professional coaching for ages 6-16. Registration now open!',
      date: '2024-08-20',
      category: 'Academy',
      image: '🏆',
      featured: true
    },
    {
      id: 2,
      title: 'First Team Promoted to Division 1A',
      excerpt: 'After an outstanding season, our First Team has been promoted to the top division. Congratulations to all players and coaching staff!',
      date: '2024-08-18',
      category: 'First Team',
      image: '🎉',
      featured: true
    },
    {
      id: 3,
      title: 'Summer Training Camp Success',
      excerpt: 'Our summer training camp was a huge success with over 80 young players participating in professional coaching sessions.',
      date: '2024-08-15',
      category: 'Youth',
      image: '⚽',
      featured: false
    },
    {
      id: 4,
      title: 'New Clubhouse Facilities Open',
      excerpt: 'The newly renovated clubhouse is now open, featuring modern changing rooms, meeting spaces, and a community café.',
      date: '2024-08-12',
      category: 'Facilities',
      image: '🏠',
      featured: false
    },
    {
      id: 5,
      title: 'Community Fundraising Event',
      excerpt: 'Join us for our annual community fundraising day on September 15th. Family fun, games, and great food for a great cause.',
      date: '2024-08-10',
      category: 'Community',
      image: '🎪',
      featured: false
    },
    {
      id: 6,
      title: 'New Coaching Staff Appointments',
      excerpt: 'We welcome three new qualified coaches to our team, bringing additional expertise to our youth development programs.',
      date: '2024-08-08',
      category: 'Coaching',
      image: '👨‍🏫',
      featured: false
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Youth Academy Open Day',
      date: '2024-09-01',
      time: '10:00 AM',
      location: 'Training Ground'
    },
    {
      id: 2,
      title: 'Season Ticket Sales',
      date: '2024-09-05',
      time: '9:00 AM',
      location: 'Clubhouse'
    },
    {
      id: 3,
      title: 'Community Fundraising Day',
      date: '2024-09-15',
      time: '12:00 PM',
      location: 'Main Pitch'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Academy': 'bg-blue-100 text-blue-800',
      'First Team': 'bg-green-100 text-green-800',
      'Youth': 'bg-purple-100 text-purple-800',
      'Facilities': 'bg-orange-100 text-orange-800',
      'Community': 'bg-pink-100 text-pink-800',
      'Coaching': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const featuredArticles = newsArticles.filter(article => article.featured);
  const regularArticles = newsArticles.filter(article => !article.featured);

  return (
    <>
      {/* Mobile Version */}
      <div className="block md:hidden">
        <MobileLayout currentPage="/news" showNavigation={false}>
          <MobilePageContainer 
            title="Latest News"
            subtitle="Updates & Announcements"
            icon="📰"
          >
            {/* Featured Articles - Mobile */}
            <div className="mb-6">
              <h2 className="text-white font-bold text-sm mb-3">Featured Stories</h2>
              <div className="space-y-3">
                {featuredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Category Icon */}
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{article.image}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-orange-200 text-xs bg-orange-500/20 px-2 py-0.5 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-blue-100 text-xs">
                            {new Date(article.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-2">{article.title}</h3>
                        <p className="text-blue-200 text-xs line-clamp-3">{article.excerpt}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Articles - Mobile */}
            <div className="mb-6">
              <h2 className="text-white font-bold text-sm mb-3">Recent Updates</h2>
              <div className="space-y-3">
                {regularArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + (0.1 * index) }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-3 shadow-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">{article.image}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-blue-200 text-xs">{article.category}</span>
                          <span className="text-blue-100 text-xs">
                            {new Date(article.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                        <h3 className="text-white font-medium text-xs mb-1">{article.title}</h3>
                        <p className="text-blue-200 text-xs line-clamp-2">{article.excerpt}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upcoming Events - Mobile */}
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl">
              <h2 className="text-white font-bold text-sm mb-3">📅 Upcoming Events</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <h3 className="text-white font-medium text-xs mb-1">{event.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 text-xs">
                        {new Date(event.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short'
                        })} • {event.time}
                      </span>
                      <span className="text-blue-100 text-xs">{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MobilePageContainer>
        </MobileLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <StandardLayout title="News & Updates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">📰</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Updates</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay up to date with the latest news, events, and announcements from Rivervalley Rangers AFC
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Featured Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
              
              <div className="space-y-6">
                {featuredArticles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{article.image}</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(article.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>

            {/* Recent Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Updates</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {regularArticles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-2xl">{article.image}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(article.date).toLocaleDateString('en-GB')}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-xs">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">📅</span>
                Upcoming Events
              </h3>
              
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-GB')} • {event.time}
                    </p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/get-involved/events"
                className="block mt-4 bg-blue-600 text-white text-center font-semibold py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                View All Events
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              
              <div className="space-y-2">
                <Link href="/gallery" className="block text-gray-600 hover:text-blue-600 py-2 text-sm">
                  📸 Photo Gallery
                </Link>
                <Link href="/get-involved/events" className="block text-gray-600 hover:text-blue-600 py-2 text-sm">
                  📅 Events Calendar
                </Link>
                <Link href="/join/trials" className="block text-gray-600 hover:text-blue-600 py-2 text-sm">
                  🎯 Player Registration
                </Link>
                <Link href="/get-involved/volunteering" className="block text-gray-600 hover:text-blue-600 py-2 text-sm">
                  🙋 Volunteer Opportunities
                </Link>
                <Link href="/contact" className="block text-gray-600 hover:text-blue-600 py-2 text-sm">
                  📞 Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        </div>
        </StandardLayout>
      </div>
    </>
  );
}