import StandardLayout from '../components/StandardLayout';
import MobileLayout from '../components/MobileLayout';
import MobilePageContainer from '../components/mobile/MobilePageContainer';
import NewsManager from '../components/NewsManager';
import EditableNewsArticle from '../components/EditableNewsArticle';
import InstagramFeed from '../components/InstagramFeed';
import InstagramWidget from '../components/InstagramWidget';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  category: string;
  tags: string[];
  featuredImage?: string;
  instagramEmbed?: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  views: number;
}

export default function NewsUpdates() {
  const [showNewsManager, setShowNewsManager] = useState(false);
  const [dynamicArticles, setDynamicArticles] = useState<NewsArticle[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  
  // Check authentication
  useEffect(() => {
    const demoAuth = localStorage.getItem('rvr_demo_auth');
    if (demoAuth) {
      try {
        const authData = JSON.parse(demoAuth);
        setCanEdit(authData.role === 'admin' || authData.role === 'editor');
      } catch {
        setCanEdit(false);
      }
    } else {
      setCanEdit(false);
    }
  }, []);
  
  // Load dynamic articles
  useEffect(() => {
    const loadArticles = () => {
      const stored = localStorage.getItem('rvr_news_articles');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const publishedArticles = parsed
            .filter((article: any) => article.status === 'published')
            .map((article: any) => ({
              ...article,
              createdAt: new Date(article.createdAt),
              updatedAt: new Date(article.updatedAt),
              publishDate: new Date(article.publishDate)
            }))
            .sort((a: any, b: any) => b.publishDate.getTime() - a.publishDate.getTime());
          setDynamicArticles(publishedArticles);
        } catch (error) {
          console.error('Error loading articles:', error);
        }
      }
    };

    loadArticles();
    // Reload when returning from news manager
    const handleFocus = () => loadArticles();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [showNewsManager]);

  // Handle saving articles from direct editing
  const handleSaveArticle = async (articleData: Partial<NewsArticle>) => {
    const existingIndex = dynamicArticles.findIndex(a => a.id === articleData.id);
    
    let updatedArticles;
    if (existingIndex >= 0) {
      // Update existing article - ensure dates are Date objects
      updatedArticles = [...dynamicArticles];
      updatedArticles[existingIndex] = { 
        ...updatedArticles[existingIndex], 
        ...articleData,
        publishDate: articleData.publishDate ? new Date(articleData.publishDate) : updatedArticles[existingIndex].publishDate,
        updatedAt: new Date(),
        createdAt: updatedArticles[existingIndex].createdAt || new Date()
      };
    } else {
      return; // Don't create new articles from direct editing
    }
    
    setDynamicArticles(updatedArticles);
    // Save all articles (including drafts from NewsManager)
    const allStoredArticles = JSON.parse(localStorage.getItem('rvr_news_articles') || '[]');
    const updatedAllArticles = allStoredArticles.map((article: any) => 
      article.id === articleData.id 
        ? { 
            ...article, 
            ...articleData, 
            publishDate: articleData.publishDate ? new Date(articleData.publishDate) : article.publishDate,
            updatedAt: new Date(),
            createdAt: article.createdAt || new Date()
          }
        : article
    );
    localStorage.setItem('rvr_news_articles', JSON.stringify(updatedAllArticles));
  };

  // Static demo articles for backward compatibility
  const staticNewsArticles = [
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

  // Combine dynamic and static articles
  const allArticles = [
    ...dynamicArticles,
    ...staticNewsArticles.map(article => ({
      ...article,
      id: String(article.id),
      content: article.excerpt, // Use excerpt as content for static articles
      author: { id: 'system', name: 'RVR Admin', role: 'admin' },
      tags: [],
      status: 'published' as const,
      publishDate: new Date(article.date),
      createdAt: new Date(article.date),
      updatedAt: new Date(article.date),
      views: 0
    }))
  ].sort((a, b) => {
    // Ensure both dates are Date objects
    const dateA = a.publishDate instanceof Date ? a.publishDate : new Date(a.publishDate);
    const dateB = b.publishDate instanceof Date ? b.publishDate : new Date(b.publishDate);
    return dateB.getTime() - dateA.getTime();
  });

  const featuredArticles = allArticles.filter(article => article.featured);
  const regularArticles = allArticles.filter(article => !article.featured);

  return (
    <>
      {/* Instagram Embed Script */}
      <Script
        src="//www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        }}
      />
      
      {/* Mobile Version */}
      <div className="block md:hidden">
        <MobileLayout currentPage="/news">
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

            {/* Instagram Feed - Mobile */}
            <div className="mb-6">
              <h2 className="text-white font-bold text-sm mb-3 flex items-center">
                <span className="mr-2">📸</span>
                Instagram
                <span className="ml-1 text-xs text-blue-200">@rvrfc1981</span>
              </h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-2">
                <InstagramWidget className="scale-95 origin-center" />
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
          className="text-center mb-12 relative"
        >
          <div className="text-6xl mb-6">📰</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Updates</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Stay up to date with the latest news, events, and announcements from Rivervalley Rangers AFC
          </p>
          
          {/* Editor Button */}
          <AnimatePresence>
            {canEdit && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setShowNewsManager(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <span className="text-lg">✏️</span>
                Manage News
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {dynamicArticles.length}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Manual News - Left Column */}
          <div className="lg:col-span-7">
            
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
                  <EditableNewsArticle
                    key={article.id}
                    article={article}
                    onSave={handleSaveArticle}
                    canEdit={canEdit}
                    featured={true}
                    getCategoryColor={getCategoryColor}
                  />
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
                  <EditableNewsArticle
                    key={article.id}
                    article={article}
                    onSave={handleSaveArticle}
                    canEdit={canEdit}
                    featured={false}
                    getCategoryColor={getCategoryColor}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Instagram Feed - Right Column */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">📸</span>
                Latest from Instagram
                <span className="ml-2 text-sm font-normal text-gray-500">@rvrfc1981</span>
              </h2>
              <InstagramWidget />
            </motion.div>
            
            {/* Sidebar Content */}
            <div>
            
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

        </div>
        </StandardLayout>
      </div>
      
      {/* News Manager Modal */}
      <NewsManager 
        isOpen={showNewsManager}
        onClose={() => setShowNewsManager(false)}
      />
    </>
  );
}