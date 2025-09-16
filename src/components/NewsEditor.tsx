/**
 * News Editor Component
 * Rich text editor for creating and editing news articles
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Load Instagram embed script
const loadInstagramScript = () => {
  if (typeof window !== 'undefined' && !window.instgrm) {
    const script = document.createElement('script');
    script.async = true;
    script.src = '//www.instagram.com/embed.js';
    document.head.appendChild(script);
  } else if (window.instgrm) {
    window.instgrm.Embeds.process();
  }
};

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

interface NewsEditorProps {
  article?: NewsArticle;
  onSave: (article: Partial<NewsArticle>) => void;
  onClose: () => void;
  isOpen: boolean;
}

const categories = [
  'Academy',
  'First Team', 
  'Youth',
  'Facilities',
  'Community',
  'Coaching',
  'Fixtures',
  'Results',
  'Transfers',
  'Events'
];

export default function NewsEditor({ article, onSave, onClose, isOpen }: NewsEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Community',
    tags: [] as string[],
    featured: false,
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    publishDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    featuredImage: '',
    instagramEmbed: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load article data if editing
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category,
        tags: article.tags,
        featured: article.featured,
        status: article.status,
        publishDate: article.publishDate.toISOString().split('T')[0],
        featuredImage: article.featuredImage || '',
        instagramEmbed: (article as any).instagramEmbed || ''
      });
    } else {
      // Reset for new article
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: 'Community',
        tags: [],
        featured: false,
        status: 'draft',
        publishDate: new Date().toISOString().split('T')[0],
        featuredImage: '',
        instagramEmbed: ''
      });
    }
  }, [article, isOpen]);

  // Load Instagram script when component mounts or Instagram embed changes
  useEffect(() => {
    if (formData.instagramEmbed && isOpen) {
      const timer = setTimeout(() => {
        loadInstagramScript();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [formData.instagramEmbed, isOpen]);

  const handleSave = async (publishStatus: 'draft' | 'published') => {
    setIsSaving(true);
    
    // Get current user info
    const authData = JSON.parse(localStorage.getItem('rvr_demo_auth') || '{}');
    
    const articleData = {
      ...formData,
      status: publishStatus,
      excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
      publishDate: new Date(formData.publishDate), // Ensure it's a Date object
      author: {
        id: authData.username || 'unknown',
        name: authData.username || 'Unknown Author',
        role: authData.role || 'editor'
      },
      updatedAt: new Date(),
      ...(article ? {} : { 
        id: `news_${Date.now()}`,
        createdAt: new Date(),
        views: 0
      })
    };

    await onSave(articleData);
    setIsSaving(false);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Editor Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📰</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {article ? 'Edit Article' : 'Create New Article'}
                </h2>
                <p className="text-sm text-gray-600">
                  {article ? `Editing: ${article.title}` : 'Write and publish your news story'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Preview Toggle */}
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  previewMode 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {previewMode ? '✏️ Edit' : '👁️ Preview'}
              </button>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto max-h-[calc(90vh-200px)]">
            {previewMode ? (
              /* Preview Mode */
              <div className="p-8 max-w-4xl mx-auto">
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    formData.category === 'Academy' ? 'bg-blue-100 text-blue-800' :
                    formData.category === 'First Team' ? 'bg-green-100 text-green-800' :
                    formData.category === 'Youth' ? 'bg-purple-100 text-purple-800' :
                    formData.category === 'Facilities' ? 'bg-orange-100 text-orange-800' :
                    formData.category === 'Community' ? 'bg-pink-100 text-pink-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.category}
                  </span>
                  {formData.featured && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || 'Article Title'}</h1>
                <p className="text-xl text-gray-600 mb-8">{formData.excerpt || 'Article excerpt will appear here...'}</p>
                
                <div className="prose max-w-none">
                  {formData.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                      {paragraph || '\u00A0'}
                    </p>
                  ))}
                </div>
                
                {/* Instagram Embed Preview */}
                {formData.instagramEmbed && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-sm font-medium text-purple-800 mb-3">📸 Instagram Content</p>
                      <div 
                        dangerouslySetInnerHTML={{ __html: formData.instagramEmbed }}
                        className="instagram-embed-content"
                      />
                      <p className="text-xs text-purple-600 mt-2">
                        Note: Instagram embed will be fully functional when published
                      </p>
                    </div>
                  </div>
                )}
                
                {formData.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Edit Mode */
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                    placeholder="Enter article title"
                    autoFocus
                  />
                </div>

                {/* Meta Information Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-semibold text-gray-700">Featured Article</span>
                    </label>
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter image URL or Instagram post link"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Tip: For Instagram posts, use the direct image URL or paste the Instagram post link
                  </p>
                  {formData.featuredImage && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      {formData.featuredImage.includes('instagram.com') ? (
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg text-sm">
                          📸 Instagram Post: {formData.featuredImage.substring(0, 50)}...
                        </div>
                      ) : (
                        <img 
                          src={formData.featuredImage} 
                          alt="Featured image preview" 
                          className="max-w-xs h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Instagram Embed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram Embed Code
                  </label>
                  <textarea
                    value={formData.instagramEmbed}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagramEmbed: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    rows={6}
                    placeholder="Paste Instagram embed code here (e.g., <blockquote class=&quot;instagram-media&quot;...)"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    📱 Tip: Go to Instagram → Click "..." → "Embed" → Copy the embed code and paste here
                  </p>
                  {formData.instagramEmbed && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-purple-800 mb-2">📸 Instagram Embed Preview:</p>
                      <div className="bg-white rounded-lg p-3 border max-h-64 overflow-auto">
                        <div 
                          dangerouslySetInnerHTML={{ __html: formData.instagramEmbed }}
                          className="instagram-embed-preview"
                        />
                      </div>
                      <p className="text-xs text-purple-600 mt-2">
                        Note: Full functionality requires the Instagram embed script to load
                      </p>
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Brief summary of the article (optional - will auto-generate if empty)"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Article Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    rows={15}
                    placeholder="Write your article content here..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Tip: Use line breaks to separate paragraphs. Each new line will become a paragraph.
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add tags (press Enter)"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Status: {formData.status}</span>
              {formData.featured && <span>• Featured</span>}
              <span>• Category: {formData.category}</span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              
              <button
                onClick={() => handleSave('draft')}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                disabled={isSaving || !formData.title || !formData.content}
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                onClick={() => handleSave('published')}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={isSaving || !formData.title || !formData.content}
              >
                {isSaving ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}