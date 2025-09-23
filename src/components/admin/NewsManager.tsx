/**
 * News Manager Component
 * Admin interface for creating, editing, and managing news articles
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../SecureAuth';

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

const newsCategories = [
  { value: 'match_report', label: 'Match Report', icon: '⚽', color: 'bg-green-100 text-green-800' },
  { value: 'club_news', label: 'Club News', icon: '🏛️', color: 'bg-blue-100 text-blue-800' },
  { value: 'player_news', label: 'Player News', icon: '👤', color: 'bg-purple-100 text-purple-800' },
  { value: 'community', label: 'Community', icon: '🤝', color: 'bg-orange-100 text-orange-800' },
  { value: 'announcement', label: 'Announcement', icon: '📢', color: 'bg-red-100 text-red-800' }
];

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
  { value: 'archived', label: 'Archived', color: 'bg-yellow-100 text-yellow-800' }
];

export default function NewsManager() {
  const { isAdmin, user } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: '',
    content: '',
    excerpt: '',
    author: user?.email || 'Admin',
    category: 'club_news',
    status: 'draft',
    featured: false,
    image_url: '',
    publish_date: new Date().toISOString().split('T')[0],
    tags: []
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchArticles();
    }
  }, [isAdmin]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        setError('Database not connected. Using demo articles. To use real database, run the migration script.');
        // Create demo articles for development
        const demoArticles: NewsArticle[] = [
          {
            id: 'demo-1',
            title: 'Rivervalley Rangers Defeat Local Rivals 3-1',
            content: 'In an exciting match at home, Rivervalley Rangers secured a convincing 3-1 victory against their local rivals. Goals from Smith, O\'Connor, and Murphy sealed the win.',
            excerpt: 'Rangers secure convincing 3-1 victory in local derby',
            author: 'Sports Reporter',
            category: 'match_report',
            status: 'published',
            featured: true,
            publish_date: '2025-09-20',
            created_at: '2025-09-20T10:00:00Z',
            updated_at: '2025-09-20T10:00:00Z',
            tags: ['match', 'victory', 'derby'],
            views: 156
          },
          {
            id: 'demo-2',
            title: 'New Training Facility Opens Next Month',
            content: 'The club is excited to announce the opening of our new state-of-the-art training facility. The facility will include...',
            excerpt: 'Modern training facility to boost player development',
            author: 'Club Secretary',
            category: 'club_news',
            status: 'published',
            featured: false,
            publish_date: '2025-09-18',
            created_at: '2025-09-18T15:30:00Z',
            updated_at: '2025-09-18T15:30:00Z',
            tags: ['facility', 'training', 'development'],
            views: 89
          }
        ];
        setArticles(demoArticles);
      } else {
        setArticles(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let imageUrl = formData.image_url || '';
      
      // Upload image if a new one was selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const articleData = {
        ...formData,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      };

      let result;
      if (editingArticle) {
        // Update existing article
        result = await supabase
          .from('news_articles')
          .update(articleData)
          .eq('id', editingArticle.id)
          .select();
      } else {
        // Create new article
        result = await supabase
          .from('news_articles')
          .insert([{
            ...articleData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
          }])
          .select();
      }

      if (result.error) {
        throw result.error;
      }

      // Reset form and refresh articles
      resetForm();
      await fetchArticles();
      
    } catch (err) {
      console.error('Error saving article:', err);
      setError('Failed to save article. Check if the news_articles table exists.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: user?.email || 'Admin',
      category: 'club_news',
      status: 'draft',
      featured: false,
      image_url: '',
      publish_date: new Date().toISOString().split('T')[0],
      tags: []
    });
    setEditingArticle(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData(article);
    setShowForm(true);
    setImagePreview(article.image_url || '');
    setImageFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image file size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `news-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('news-images')
        .upload(fileName, file);

      if (error) {
        // If storage fails, use a placeholder or external URL approach
        console.warn('Storage upload failed, using base64 fallback:', error);
        return URL.createObjectURL(file);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (err) {
      console.warn('Image upload failed, using fallback:', err);
      return URL.createObjectURL(file);
    } finally {
      setUploading(false);
    }
  };

  const showConfirmDialog = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleDelete = async (articleId: string) => {
    const deleteAction = async () => {
      try {
      // Check if it's a demo article
      if (articleId.startsWith('demo-')) {
          // Remove from local demo articles
          setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
          return;
        }

        const { error } = await supabase
          .from('news_articles')
          .delete()
          .eq('id', articleId);

        if (error) throw error;
        
        await fetchArticles();
      } catch (err) {
        console.error('Error deleting article:', err);
        setError('Failed to delete article');
      }
    };

    showConfirmDialog(
      '🗑️ Delete Article',
      'Are you sure you want to delete this article? This action cannot be undone.',
      deleteAction
    );
  };

  const toggleStatus = async (article: NewsArticle, newStatus: string) => {
    const statusAction = async () => {
      try {
        // Check if it's a demo article
        if (article.id.startsWith('demo-')) {
          // Update local demo article
          setArticles(prevArticles => 
            prevArticles.map(a => 
              a.id === article.id ? { ...a, status: newStatus as any } : a
            )
          );
          return;
        }

        const { error } = await supabase
          .from('news_articles')
          .update({ status: newStatus })
          .eq('id', article.id);

        if (error) throw error;
        
        await fetchArticles();
      } catch (err) {
        console.error('Error updating article:', err);
        setError('Failed to update article');
      }
    };

    const actionText = newStatus === 'published' ? 'publish' : newStatus === 'draft' ? 'unpublish' : 'archive';
    const actionEmoji = newStatus === 'published' ? '🚀' : newStatus === 'draft' ? '📝' : '📦';
    
    showConfirmDialog(
      `${actionEmoji} ${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Article`,
      `Are you sure you want to ${actionText} \"${article.title}\"?`,
      statusAction
    );
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">📰 News Management</h2>
            <p className="text-emerald-100">Create and manage news articles and announcements</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            + Add Article
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-6">
          <p className="text-yellow-800 font-semibold">{error}</p>
          <div className="mt-3 text-yellow-700 text-sm space-y-2">
            <p>To set up the database for permanent article storage:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Open Supabase SQL Editor</li>
              <li>Run: <code className="bg-yellow-100 px-1 rounded">database/migrations/create_news_articles_table.sql</code></li>
              <li>Or run: <code className="bg-yellow-100 px-1 rounded">node setup-news-database.js</code></li>
            </ol>
            <p className="text-xs text-yellow-600 mt-2">
              Current demo articles can be deleted/edited temporarily but won't persist.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {newsCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchArticles}
              className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-gray-600 mb-4">Create your first news article to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Create First Article
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 bg-white border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Article Thumbnail */}
                    {article.image_url ? (
                      <div className="w-20 h-16 flex-shrink-0">
                        <img 
                          src={article.image_url} 
                          alt={article.title}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-lg">{newsCategories.find(c => c.value === article.category)?.icon || '📰'}</span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{article.title}</h3>
                      
                      {/* Category Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        newsCategories.find(c => c.value === article.category)?.color
                      }`}>
                        {newsCategories.find(c => c.value === article.category)?.icon} {newsCategories.find(c => c.value === article.category)?.label}
                      </span>
                      
                      {/* Status Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        statusOptions.find(s => s.value === article.status)?.color
                      }`}>
                        {statusOptions.find(s => s.value === article.status)?.label}
                      </span>
                      
                      {/* Featured Badge */}
                      {article.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </span>
                      )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{article.excerpt}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>👤 {article.author}</div>
                        <div>📅 {new Date(article.publish_date).toLocaleDateString()}</div>
                        <div>👁️ {article.views || 0} views</div>
                        <div>🏷️ {article.tags?.length || 0} tags</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-all"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => toggleStatus(article, article.status === 'published' ? 'draft' : 'published')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        article.status === 'published' 
                          ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {article.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingArticle ? 'Edit Article' : 'Create New Article'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="Article title..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        {newsCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Author
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="Author name..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Publish Date
                      </label>
                      <input
                        type="date"
                        value={formData.publish_date}
                        onChange={(e) => setFormData({...formData, publish_date: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Excerpt *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="Brief summary of the article..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content *
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="Full article content..."
                    />
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Article Image (Optional)
                    </label>
                    
                    {/* Image Preview */}
                    {(imagePreview || formData.image_url) && (
                      <div className="mb-4">
                        <div className="relative w-full max-w-md">
                          <img 
                            src={imagePreview || formData.image_url} 
                            alt="Article preview" 
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setFormData({...formData, image_url: ''});
                              setImageFile(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Upload Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Upload Image File</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG, PNG, GIF supported.</p>
                      </div>
                      
                      {/* URL Input */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Or Enter Image URL</label>
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => {
                            setFormData({...formData, image_url: e.target.value});
                            if (e.target.value) {
                              setImagePreview(e.target.value);
                              setImageFile(null);
                            }
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    {uploading && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Uploading image...
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Featured article (appears prominently on homepage)
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingArticle ? 'Update Article' : 'Create Article'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`${confirmTitle.includes('Delete') ? 'bg-gradient-to-r from-red-500 to-pink-600' : 
                              confirmTitle.includes('Publish') ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                              'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white p-6`}>
                <h3 className="text-xl font-bold">{confirmTitle}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-6">{confirmMessage}</p>
                
                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 px-4 py-3 ${confirmTitle.includes('Delete') ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' : 
                              confirmTitle.includes('Publish') ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' :
                              'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl`}
                  >
                    {confirmTitle.includes('Delete') ? 'Delete' : 
                     confirmTitle.includes('Publish') ? 'Publish' :
                     confirmTitle.includes('Unpublish') ? 'Unpublish' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}