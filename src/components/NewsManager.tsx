/**
 * News Manager Component
 * Dashboard for managing news articles
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsEditor from './NewsEditor';

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

interface NewsManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsManager({ isOpen, onClose }: NewsManagerProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | undefined>();
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');

  // Load articles from localStorage
  useEffect(() => {
    const loadArticles = () => {
      const stored = localStorage.getItem('rvr_news_articles');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const articlesWithDates = parsed.map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
            publishDate: new Date(article.publishDate)
          }));
          setArticles(articlesWithDates);
        } catch (error) {
          console.error('Error loading articles:', error);
        }
      }
    };

    if (isOpen) {
      loadArticles();
    }
  }, [isOpen]);

  const saveArticle = async (articleData: Partial<NewsArticle>) => {
    const existingIndex = articles.findIndex(a => a.id === articleData.id);
    
    let updatedArticles;
    if (existingIndex >= 0) {
      // Update existing article
      updatedArticles = [...articles];
      updatedArticles[existingIndex] = { ...updatedArticles[existingIndex], ...articleData };
    } else {
      // Add new article
      const newArticle = {
        ...articleData,
        id: articleData.id || `news_${Date.now()}`,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishDate: new Date()
      } as NewsArticle;
      updatedArticles = [newArticle, ...articles];
    }
    
    setArticles(updatedArticles);
    localStorage.setItem('rvr_news_articles', JSON.stringify(updatedArticles));
  };

  const deleteArticle = (articleId: string) => {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      const updatedArticles = articles.filter(a => a.id !== articleId);
      setArticles(updatedArticles);
      localStorage.setItem('rvr_news_articles', JSON.stringify(updatedArticles));
    }
  };

  const toggleArticleStatus = (articleId: string) => {
    const updatedArticles = articles.map(article => 
      article.id === articleId 
        ? { ...article, status: article.status === 'published' ? 'draft' : 'published' as 'draft' | 'published' }
        : article
    );
    setArticles(updatedArticles);
    localStorage.setItem('rvr_news_articles', JSON.stringify(updatedArticles));
  };

  // Filter and sort articles
  const filteredArticles = articles
    .filter(article => {
      if (filter === 'published') return article.status === 'published';
      if (filter === 'drafts') return article.status === 'draft';
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleNewArticle = () => {
    setEditingArticle(undefined);
    setShowEditor(true);
  };

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

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Manager Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-7xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">📰</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">News Management</h2>
                  <p className="text-gray-600">
                    {articles.length} total articles • {articles.filter(a => a.status === 'published').length} published • {articles.filter(a => a.status === 'draft').length} drafts
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNewArticle}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <span className="text-lg">✏️</span>
                  New Article
                </button>
                
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">Filter:</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'drafts')}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Articles</option>
                    <option value="published">Published</option>
                    <option value="drafts">Drafts</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">Sort:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'category')}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="date">Last Modified</option>
                    <option value="title">Title</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {filteredArticles.length} articles
              </div>
            </div>

            {/* Articles List */}
            <div className="flex-1 overflow-auto max-h-[60vh]">
              {filteredArticles.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
                    <p className="text-gray-600 mb-6">
                      {filter === 'all' 
                        ? "Get started by creating your first news article."
                        : `No ${filter} articles found. Try adjusting your filter.`
                      }
                    </p>
                    {filter === 'all' && (
                      <button
                        onClick={handleNewArticle}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Create First Article
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {filteredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                              {article.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {article.status.toUpperCase()}
                            </span>
                            {article.featured && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                                FEATURED
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>By {article.author.name}</span>
                            <span>•</span>
                            <span>{article.updatedAt.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{article.views} views</span>
                            {article.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{article.tags.length} tags</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit article"
                          >
                            ✏️
                          </button>
                          
                          <button
                            onClick={() => toggleArticleStatus(article.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              article.status === 'published'
                                ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            }`}
                            title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {article.status === 'published' ? '📤' : '📝'}
                          </button>
                          
                          <button
                            onClick={() => deleteArticle(article.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete article"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* News Editor */}
      <NewsEditor
        isOpen={showEditor}
        article={editingArticle}
        onSave={saveArticle}
        onClose={() => setShowEditor(false)}
      />
    </>
  );
}