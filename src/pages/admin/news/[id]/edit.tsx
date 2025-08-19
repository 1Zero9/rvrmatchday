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

export default function EditArticle() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [originalArticle, setOriginalArticle] = useState<NewsArticle | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    published: false,
    tags: [] as string[]
  });
  
  const [tagInput, setTagInput] = useState('');

  const checkAccess = useCallback(async () => {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        router.push('/admin/news');
      } else if (data) {
        setOriginalArticle(data);
        setFormData({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          published: data.published,
          tags: data.tags || []
        });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      router.push('/admin/news');
    } finally {
      setInitialLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id, fetchArticle]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const saveArticle = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in at least the title and content fields.');
      return;
    }

    setLoading(true);

    try {
      const articleData = {
        title: formData.title,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        content: formData.content,
        published: formData.published,
        tags: formData.tags,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('news')
        .update(articleData)
        .eq('id', id);

      if (error) {
        console.error('Error updating article:', error);
        alert('Error updating article. Please try again.');
      } else {
        router.push('/admin/news');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Error updating article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async () => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting article:', error);
        alert('Error deleting article. Please try again.');
      } else {
        router.push('/admin/news');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPreviewContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (initialLoading) {
    return (
      <Layout currentSection="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!originalArticle) {
    return (
      <Layout currentSection="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-gray-300 mb-4">📰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been deleted.</p>
            <Link
              href="/admin/news"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              ← Back to News Management
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentSection="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">✏️</span>
                  Edit Article
                </h1>
                <p className="text-gray-600 mt-2">
                  Editing: {originalArticle.title}
                </p>
                <div className="text-sm text-gray-500 mt-2 space-x-4">
                  <span>📅 Created: {formatDate(originalArticle.created_at)}</span>
                  {originalArticle.updated_at !== originalArticle.created_at && (
                    <span>✏️ Last updated: {formatDate(originalArticle.updated_at)}</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-3">
                  <Link 
                    href="/admin/news"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    ← Back to News
                  </Link>
                  <button
                    onClick={() => setPreview(!preview)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {preview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                <button
                  onClick={deleteArticle}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  🗑️ Delete Article
                </button>
              </div>
            </div>
          </motion.div>

          {!preview ? (
            /* Edit Form */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <form className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter article title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief summary of the article (optional - will auto-generate if empty)..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This appears in article previews and search results
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                    Article Content *
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your article content here..."
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use double line breaks to create paragraphs
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      id="tags"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyPress}
                      placeholder="Add tags (press Enter or comma to add)..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Examples: match-report, registration, training, announcement
                  </p>
                </div>

                {/* Published Toggle */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => handleInputChange('published', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Published
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Toggle to publish or unpublish this article
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div className="text-sm text-gray-500">
                    * Required fields
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={saveArticle}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            /* Preview */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <div className="max-w-none prose prose-lg">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      formData.published 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {formData.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {formData.title || 'Untitled Article'}
                  </h1>
                  
                  {formData.excerpt && (
                    <div className="text-xl text-gray-600 mb-6 italic bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                      {formData.excerpt}
                    </div>
                  )}

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-gray-800 leading-relaxed">
                  {formData.content ? (
                    formatPreviewContent(formData.content)
                  ) : (
                    <p className="text-gray-400 italic">No content to preview yet...</p>
                  )}
                </div>
              </div>

              {/* Preview Actions */}
              <div className="border-t pt-6 mt-8">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    Preview Mode - Changes are not saved automatically
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={saveArticle}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </Layout>
  );
}