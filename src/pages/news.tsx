import { useState, useEffect } from 'react';
import StandardLayout from '../components/StandardLayout';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/SecureAuth';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'match_report' | 'club_news' | 'player_news' | 'community' | 'announcement';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  image_url?: string;
  publish_date: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  views?: number;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        // Use demo articles
        const demoArticles: NewsArticle[] = [
          {
            id: 'demo-1',
            title: 'Rivervalley Rangers Defeat Local Rivals 3-1',
            content: 'In an exciting match at home, Rivervalley Rangers secured a convincing 3-1 victory against their local rivals.',
            excerpt: 'Rangers secure convincing 3-1 victory in local derby with excellent team performance.',
            author: 'Match Reporter',
            category: 'match_report',
            status: 'published',
            featured: true,
            image_url: '/images/homepg-image1.jpg',
            publish_date: '2025-09-20',
            created_at: '2025-09-20T10:00:00Z',
            updated_at: '2025-09-20T10:00:00Z',
            views: 156
          },
          {
            id: 'demo-2',
            title: 'New Training Facility Opens Next Month',
            content: 'The club is excited to announce the opening of our new state-of-the-art training facility.',
            excerpt: 'Modern training facility to boost player development with new facilities.',
            author: 'Club Secretary',
            category: 'club_news',
            status: 'published',
            featured: false,
            image_url: '/images/homepage-hero.jpg',
            publish_date: '2025-09-18',
            created_at: '2025-09-18T15:30:00Z',
            updated_at: '2025-09-18T15:30:00Z',
            views: 89
          },
          {
            id: 'demo-3',
            title: 'Youth Academy Registration Now Open',
            content: 'Registration for our youth academy is now open for the 2025 season.',
            excerpt: 'Youth academy registration open for ages 6-16. All skill levels welcome.',
            author: 'Youth Coordinator',
            category: 'club_news',
            status: 'published',
            featured: false,
            publish_date: '2025-09-15',
            created_at: '2025-09-15T12:00:00Z',
            updated_at: '2025-09-15T12:00:00Z',
            views: 234
          }
        ];
        setArticles(demoArticles);
      } else {
        setArticles(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      match_report: 'bg-green-100 text-green-800',
      club_news: 'bg-blue-100 text-blue-800',
      player_news: 'bg-purple-100 text-purple-800',
      community: 'bg-orange-100 text-orange-800',
      announcement: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      match_report: '⚽',
      club_news: '🏛️',
      player_news: '👤',
      community: '🤝',
      announcement: '📢'
    };
    return icons[category as keyof typeof icons] || '📰';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      match_report: 'Match Report',
      club_news: 'Club News',
      player_news: 'Player News',
      community: 'Community',
      announcement: 'Announcement'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    // Increment view count (could be enhanced to update database)
    setArticles(prevArticles => 
      prevArticles.map(a => 
        a.id === article.id ? { ...a, views: (a.views || 0) + 1 } : a
      )
    );
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">📰 Club News & Updates</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest news, match reports, and announcements from Rivervalley Rangers AFC
            </p>
            
            {/* Admin Button */}
            {isAdmin && (
              <div className="mt-6">
                <Link
                  href="/admin/news"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <span>✏️</span>
                  Manage News
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                    {articles.length}
                  </span>
                </Link>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Featured Articles */}
                {featuredArticles.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="text-yellow-500">⭐</span>
                      Featured Stories
                    </h2>
                    
                    <div className="space-y-6">
                      {featuredArticles.map((article) => (
                        <div 
                          key={article.id} 
                          onClick={() => handleArticleClick(article)}
                          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]"
                        >
                          {/* Article Image */}
                          {article.image_url && (
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={article.image_url} 
                                alt={article.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          <div className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">{getCategoryIcon(article.category)}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                                    {getCategoryLabel(article.category)}
                                  </span>
                                  <span className="text-gray-500 text-sm">
                                    {new Date(article.publish_date).toLocaleDateString('en-GB')}
                                  </span>
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                                    Featured
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                                <p className="text-gray-600 mb-3 leading-relaxed">{article.excerpt}</p>
                                <div className="text-gray-500 text-sm">
                                  By {article.author} • {article.views || 0} views
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Articles */}
                {regularArticles.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="text-blue-500">📰</span>
                      Latest News
                    </h2>
                    
                    <div className="grid gap-4">
                      {regularArticles.map((article) => (
                        <div 
                          key={article.id} 
                          onClick={() => handleArticleClick(article)}
                          className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer hover:scale-[1.01]"
                        >
                          <div className="flex items-start gap-0">
                            {/* Article Thumbnail */}
                            {article.image_url ? (
                              <div className="w-24 h-20 flex-shrink-0">
                                <img 
                                  src={article.image_url} 
                                  alt={article.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-20 bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">{getCategoryIcon(article.category)}</span>
                              </div>
                            )}
                            
                            <div className="flex-1 p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                                  {getCategoryLabel(article.category)}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {new Date(article.publish_date).toLocaleDateString('en-GB')}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                              <p className="text-gray-600 text-sm leading-relaxed mb-2">{article.excerpt}</p>
                              <div className="text-gray-500 text-xs">
                                By {article.author} • {article.views || 0} views
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {articles.length === 0 && !loading && (
                  <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
                    <div className="text-6xl mb-6">📰</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No News Available</h3>
                    <p className="text-gray-600">Check back soon for the latest updates and announcements</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Quick Links */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-green-500">🔗</span>
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    <Link href="/gallery" className="block text-gray-600 hover:text-blue-600 py-2 text-sm hover:bg-gray-50 rounded px-2 transition-colors">
                      📸 Photo Gallery
                    </Link>
                    <Link href="/get-involved/events" className="block text-gray-600 hover:text-blue-600 py-2 text-sm hover:bg-gray-50 rounded px-2 transition-colors">
                      📅 Events Calendar
                    </Link>
                    <Link href="/match-central" className="block text-gray-600 hover:text-blue-600 py-2 text-sm hover:bg-gray-50 rounded px-2 transition-colors">
                      ⚽ Match Central
                    </Link>
                    <Link href="/contact" className="block text-gray-600 hover:text-blue-600 py-2 text-sm hover:bg-gray-50 rounded px-2 transition-colors">
                      📞 Contact Us
                    </Link>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-purple-500">🏷️</span>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 py-1">
                      <span className="text-lg">⚽</span>
                      <span className="text-gray-700 text-sm">Match Reports</span>
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="text-lg">🏛️</span>
                      <span className="text-gray-700 text-sm">Club News</span>
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="text-lg">👤</span>
                      <span className="text-gray-700 text-sm">Player News</span>
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="text-lg">🤝</span>
                      <span className="text-gray-700 text-sm">Community</span>
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="text-lg">📢</span>
                      <span className="text-gray-700 text-sm">Announcements</span>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-orange-500">📊</span>
                    News Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Articles</span>
                      <span className="font-bold text-gray-900">{articles.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Featured</span>
                      <span className="font-bold text-yellow-600">{featuredArticles.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Recent</span>
                      <span className="font-bold text-blue-600">{regularArticles.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            ></motion.div>
          
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            >
              <span className="text-gray-600 text-xl font-bold">×</span>
            </button>

            {/* Article Image */}
            {selectedArticle.image_url && (
              <div className="h-64 overflow-hidden">
                <img 
                  src={selectedArticle.image_url} 
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getCategoryIcon(selectedArticle.category)}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedArticle.category)}`}>
                    {getCategoryLabel(selectedArticle.category)}
                  </span>
                  {selectedArticle.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
                
                <div className="flex items-center text-gray-600 text-sm space-x-4">
                  <span>📅 {new Date(selectedArticle.publish_date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span>👤 {selectedArticle.author}</span>
                  <span>👁️ {selectedArticle.views || 0} views</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 font-medium mb-6 leading-relaxed">
                  {selectedArticle.excerpt}
                </p>
                
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>
              </div>

              {/* Tags */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </StandardLayout>
  );
}