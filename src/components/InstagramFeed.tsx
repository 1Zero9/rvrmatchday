/**
 * Instagram Feed Component
 * Displays latest posts from @rvrfc1981 official account
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InstagramPost {
  id: string;
  permalink: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption?: string;
  timestamp: string;
}

interface InstagramFeedProps {
  maxPosts?: number;
  className?: string;
}

export default function InstagramFeed({ maxPosts = 6, className = "" }: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for now - will replace with actual API
  const mockPosts: InstagramPost[] = [
    {
      id: '1',
      permalink: 'https://www.instagram.com/p/example1/',
      media_url: 'https://picsum.photos/400/400?random=1',
      media_type: 'IMAGE',
      caption: '🎉 Great win for our U16s today! Final score 3-1 against local rivals. Well done lads! 💪⚽ #RVR #YouthFootball #ProudMoment',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: '2',
      permalink: 'https://www.instagram.com/p/example2/',
      media_url: 'https://picsum.photos/400/400?random=2',
      media_type: 'IMAGE',
      caption: '📸 Match day preparations in full swing. Our senior team ready for tonight\'s cup fixture! 🏆 #MatchDay #RVRReady',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
    },
    {
      id: '3',
      permalink: 'https://www.instagram.com/p/example3/',
      media_url: 'https://picsum.photos/400/400?random=3',
      media_type: 'IMAGE',
      caption: '🌟 New training kit has arrived! Looking sharp for the new season. Thanks to our sponsors! 👕✨ #NewKit #Sponsored #RVR1981',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: '4',
      permalink: 'https://www.instagram.com/p/example4/',
      media_url: 'https://picsum.photos/400/400?random=4',
      media_type: 'IMAGE',
      caption: '⚽ Youth academy open day was a huge success! Over 50 kids joined us for skills sessions and fun. Next session Saturday! 🎯 #YouthAcademy #OpenDay',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadInstagramPosts = async () => {
      setLoading(true);
      try {
        // For now, use mock data
        // TODO: Replace with actual Instagram API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setPosts(mockPosts.slice(0, maxPosts));
        setError(null);
      } catch (err) {
        setError('Unable to load Instagram posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadInstagramPosts();
  }, [maxPosts]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return postTime.toLocaleDateString();
  };

  const truncateCaption = (caption: string, maxLength: number = 120) => {
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="w-full h-64 bg-gray-200 rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instagram Feed Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="https://www.instagram.com/rvrfc1981" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            <span>📸</span>
            View on Instagram
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Instagram Header */}
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
                alt={post.caption ? truncateCaption(post.caption, 50) : 'Instagram post'}
                className="w-full h-64 object-cover"
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
                  {truncateCaption(post.caption)}
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

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center pt-4"
        >
          <a
            href="https://www.instagram.com/rvrfc1981"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <span>📸</span>
            Follow @rvrfc1981
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
}