import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { checkAdminAccess } from '@/lib/adminAuth';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function AdminNews() {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const checkAccess = useCallback(async () => {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchArticles = useCallback(async () => {
    try {
      let query = supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('published', filterStatus === 'published');
      }

      const { data, error } = await query;

      if (!error && data) {
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('news')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (!error) {
        setArticles(articles.map(article => 
          article.id === id 
            ? { ...article, published: !currentStatus }
            : article
        ));
      }
    } catch (error) {
      console.error('Error updating article status:', error);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (!error) {
        setArticles(articles.filter(article => article.id !== id));
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (published: boolean) => {
    return published 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  if (loading) {
    return (
      <Layout currentSection="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading news articles...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentSection="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">📰</span>
                  News Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Create, edit, and manage club news articles
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Link 
                  href="/admin"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ← Back to Admin
                </Link>
                <Link 
                  href="/admin/news/new"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  + New Article
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Search */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Articles
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by title, excerpt, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Articles</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>

              {/* Stats */}
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredArticles.length}</div>
                <div className="text-sm text-gray-600">
                  {filterStatus === 'all' ? 'Total' : filterStatus === 'published' ? 'Published' : 'Drafts'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Articles List */}
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
              >
                <div className="text-6xl text-gray-300 mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No articles found' : 'No articles yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms or filters'
                    : 'Create your first news article to get started'
                  }
                </p>
                {!searchTerm && (
                  <Link
                    href="/admin/news/new"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Create First Article
                  </Link>
                )}
              </motion.div>
            ) : (
              filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + (index * 0.05) }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 mr-3">
                            {article.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(article.published)}`}>
                            {article.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center text-sm text-gray-500 space-x-6 mb-4">
                          <span>📅 Created: {formatDate(article.created_at)}</span>
                          {article.updated_at !== article.created_at && (
                            <span>✏️ Updated: {formatDate(article.updated_at)}</span>
                          )}
                        </div>

                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        <Link
                          href={`/admin/news/${article.id}/edit`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors text-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => togglePublished(article.id, article.published)}
                          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            article.published
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {article.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}