import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  tags: string[];
  created_at: string;
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data) {
          setArticles(data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Clean Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl translate-x-40"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl translate-y-36"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
               backgroundSize: '30px 30px'
             }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Top Navigation - Minimal */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center p-6"
        >
          <div className="flex items-center space-x-4">
            <Image 
              src="/images/logo.png" 
              alt="Rivervalley Rangers AFC Logo" 
              width={75}
              height={75}
              className="drop-shadow-lg"
            />
            <div className="text-white">
              <h1 className="text-xl font-bold">News & Updates</h1>
              <p className="text-sm text-blue-200">Latest club news & announcements</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex space-x-4 text-sm">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              ← Home
            </Link>
          </div>
        </motion.div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl w-full">
            
            {/* Hero Title */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <div className="text-6xl mb-6">📰</div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Club News
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Stay Up to Date • Latest News, Match Reports & Announcements
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
          
              {loading ? (
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Loading latest news...</p>
                </div>
              ) : articles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center text-white border border-white/20"
                >
                  <div className="text-6xl mb-4">📝</div>
                  <h2 className="text-2xl font-bold mb-4">No News Yet</h2>
                  <p className="text-blue-100 mb-6">
                    We&apos;re working on bringing you the latest club updates. Check back soon!
                  </p>
                  <Link
                    href="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Back to Homepage
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-6"
                >
                  {articles.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <time className="text-sm text-blue-300">
                            {formatDate(article.created_at)}
                          </time>
                          {article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {article.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-400/30"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-4 hover:text-blue-300 transition-colors">
                          {article.title}
                        </h2>
                        
                        <p className="text-blue-100 mb-6 leading-relaxed">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                            Read More
                          </button>
                          <div className="text-sm text-blue-300">
                            📖 2 min read
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}