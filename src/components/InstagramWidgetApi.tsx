/**
 * Instagram Widget with Real API Integration
 * Production-ready component that fetches from real Instagram API
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InstagramPost } from '../lib/instagram-api';

interface InstagramWidgetApiProps {
  className?: string;
  maxPosts?: number;
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours === 1) return '1h';
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1d';
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return postTime.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });
};

export default function InstagramWidgetApi({ className = "", maxPosts = 3 }: InstagramWidgetApiProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const response = await fetch(`/api/instagram/posts?limit=${maxPosts}`);
        const data = await response.json();
        
        if (data.success) {
          setPosts(data.posts);
          setIsApiConnected(!data.cached || data.posts[0]?.id?.startsWith('mock_') === false);
          setLastUpdated(data.timestamp);
        } else {
          throw new Error(data.error || 'Failed to load posts');
        }
      } catch (error) {
        console.error('Failed to load Instagram posts:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();

    // Auto-refresh every 30 minutes if tab is active
    const interval = setInterval(() => {
      if (!document.hidden) {
        loadPosts();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [maxPosts]);

  return (
    <div className={`${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 max-w-full"
      >
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white p-5 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;utf8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 fill=%22white%22%3e%3ccircle cx=%2220%22 cy=%2220%22 r=%222%22/%3e%3ccircle cx=%2280%22 cy=%2240%22 r=%221%22/%3e%3ccircle cx=%2240%22 cy=%2270%22 r=%221.5%22/%3e%3ccircle cx=%2290%22 cy=%2280%22 r=%221%22/%3e%3ccircle cx=%2210%22 cy=%2260%22 r=%221%22/%3e%3c/svg%3e')] bg-repeat"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
              <span className="text-xl">📸</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">@rvrfc1981</h3>
                <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-semibold">
                    {isApiConnected ? 'LIVE API' : 'DEMO MODE'}
                  </span>
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">
                {isApiConnected ? 'Real Instagram Posts • Live Feed' : 'Demo Content • Setup API for Live Feed'}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isApiConnected ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-xs font-medium">
                {isApiConnected ? 'Live' : 'Demo'}
              </span>
            </div>
          </div>
        </div>

        {/* Instagram Posts */}
        <div className="bg-gray-50 relative">
          
          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10 rounded-lg"
                style={{ minHeight: '200px' }}
              >
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm font-medium">Loading Instagram content...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Error State */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-red-50 flex items-center justify-center z-10 rounded-lg border-2 border-red-100"
                style={{ minHeight: '200px' }}
              >
                <div className="text-center p-6">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instagram Unavailable</h3>
                  <p className="text-gray-600 text-sm mb-4">Unable to load Instagram content</p>
                  <a 
                    href="https://www.instagram.com/rvrfc1981" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors text-sm font-medium"
                  >
                    <span>📸</span>
                    View on Instagram
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Instagram Posts Content */}
          {!isLoading && !hasError && (
            <div className="p-5 space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
                >
                  {/* Post Header */}
                  <div className="flex items-center p-4 pb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">RVR</span>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">rvrfc1981</h4>
                        <span className="text-blue-500 text-sm">✓</span>
                      </div>
                      <p className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</p>
                    </div>
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>

                  {/* Post Image */}
                  <div className="relative">
                    <img 
                      src={post.media_url}
                      alt={post.caption ? post.caption.substring(0, 50) + '...' : 'Instagram post'}
                      className="w-full h-48 sm:h-56 object-cover"
                      loading="lazy"
                    />
                    {post.media_type === 'VIDEO' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    {post.media_type === 'CAROUSEL_ALBUM' && (
                      <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                        📷 Multiple
                      </div>
                    )}
                  </div>

                  {/* Post Caption */}
                  {post.caption && (
                    <div className="p-4">
                      <p className="text-gray-800 text-sm leading-relaxed">
                        <span className="font-semibold">rvrfc1981</span>{' '}
                        {post.caption.length > 120 
                          ? post.caption.substring(0, 120) + '...'
                          : post.caption
                        }
                      </p>
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                      >
                        View on Instagram →
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* View All Posts Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-center pt-2"
              >
                <a
                  href="https://www.instagram.com/rvrfc1981"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                >
                  <span>📸</span>
                  See all posts on Instagram
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </motion.div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isApiConnected ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-gray-600 text-sm font-medium">
                {isApiConnected ? 'Live Instagram API' : 'Demo Mode Active'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/rvrfc1981"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium text-sm rounded-lg transition-all shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <span className="text-sm">📸</span>
                Follow @rvrfc1981
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* API Status Info */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Official Rivervalley Rangers AFC Instagram</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {isApiConnected ? 'Live API Connected' : 'Setup Required for Live Feed'}
              </span>
            </div>
            {lastUpdated && (
              <div className="text-center mt-2">
                <span className="text-xs text-gray-400">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}