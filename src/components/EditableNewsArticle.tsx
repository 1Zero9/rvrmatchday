/**
 * Editable News Article Component
 * Shows articles with inline editing capabilities
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NewsEditor from './NewsEditor';

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

interface EditableNewsArticleProps {
  article: NewsArticle;
  onSave: (article: Partial<NewsArticle>) => void;
  canEdit: boolean;
  featured?: boolean;
  getCategoryColor: (category: string) => string;
}

export default function EditableNewsArticle({ 
  article, 
  onSave, 
  canEdit, 
  featured = false, 
  getCategoryColor 
}: EditableNewsArticleProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Load Instagram script if article has Instagram embed
  useEffect(() => {
    if ((article as any).instagramEmbed) {
      const timer = setTimeout(() => {
        loadInstagramScript();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [(article as any).instagramEmbed]);

  const handleSave = async (articleData: Partial<NewsArticle>) => {
    await onSave({ ...articleData, id: article.id });
  };

  // Don't show edit effects on static articles (those without proper author data)
  const isEditableArticle = canEdit && article.author?.id !== 'system';

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all relative ${
          isEditableArticle ? 'cursor-pointer' : ''
        } ${isEditableArticle && isHovering ? 'ring-2 ring-yellow-200 bg-yellow-50/50' : ''}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => isEditableArticle && setShowEditor(true)}
      >
        {/* Edit Indicator */}
        {isEditableArticle && (
          <div className={`absolute top-2 right-2 z-10 transition-all duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-40'
          }`}>
            <div className="bg-yellow-400 hover:bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg">
              ✏️
            </div>
          </div>
        )}

        {/* Yellow highlight overlay when hovering and editable */}
        {isEditableArticle && isHovering && (
          <div className="absolute inset-0 bg-yellow-100/20 rounded-lg pointer-events-none" />
        )}

        <div className="p-6">
          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-4">
              {article.featuredImage.includes('instagram.com') ? (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg text-center">
                  <span className="text-2xl">📸</span>
                  <p className="mt-2 font-semibold">Instagram Post</p>
                  <a 
                    href={article.featuredImage} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm underline hover:no-underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on Instagram
                  </a>
                </div>
              ) : (
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
          )}

          {/* Instagram Embed */}
          {(article as any).instagramEmbed && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <div 
                  dangerouslySetInnerHTML={{ __html: (article as any).instagramEmbed }}
                  className="instagram-embed-content"
                />
              </div>
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div className={featured ? "text-4xl" : "text-2xl"}>
              {(article as any).image || '📰'}
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
              {article.featured && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                  FEATURED
                </span>
              )}
              {isEditableArticle && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  EDITABLE
                </span>
              )}
            </div>
          </div>
          
          <h3 className={`font-bold text-gray-900 mb-3 ${featured ? 'text-xl' : 'text-lg'}`}>
            {article.title}
          </h3>
          
          <p className={`text-gray-600 mb-4 ${featured ? 'text-base' : 'text-sm'} ${featured ? '' : 'line-clamp-3'}`}>
            {article.excerpt}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{article.author.name}</span>
              <span>•</span>
              <span>
                {article.publishDate.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: featured ? 'long' : 'short',
                  year: featured ? 'numeric' : undefined
                })}
              </span>
              {article.views > 0 && (
                <>
                  <span>•</span>
                  <span>{article.views} views</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                  {article.tags.length > 2 && (
                    <span className="text-blue-600 text-xs">+{article.tags.length - 2}</span>
                  )}
                </div>
              )}
              
              {!isEditableArticle && (
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Read More →
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.article>

      {/* News Editor Modal */}
      <NewsEditor
        isOpen={showEditor}
        article={article}
        onSave={handleSave}
        onClose={() => setShowEditor(false)}
      />
    </>
  );
}