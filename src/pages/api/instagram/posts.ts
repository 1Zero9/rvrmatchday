/**
 * API Route: /api/instagram/posts
 * Fetches Instagram posts from @rvrfc1981 account
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { InstagramApiClient, type InstagramPost } from '../../../lib/instagram-api';

interface ApiResponse {
  success: boolean;
  posts?: InstagramPost[];
  error?: string;
  cached?: boolean;
  timestamp?: string;
}

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
let cachedPosts: InstagramPost[] | null = null;
let lastFetchTime: number = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

  try {
    const { limit = '10' } = req.query;
    const postLimit = Math.min(parseInt(limit as string) || 10, 25); // Max 25 posts
    
    // Check if we have cached data that's still fresh
    const now = Date.now();
    const cacheAge = now - lastFetchTime;
    
    if (cachedPosts && cacheAge < CACHE_DURATION) {
      console.log(`📱 Serving cached Instagram posts (${Math.round(cacheAge / 60000)}min old)`);
      return res.status(200).json({
        success: true,
        posts: cachedPosts.slice(0, postLimit),
        cached: true,
        timestamp: new Date(lastFetchTime).toISOString()
      });
    }

    // Check if Instagram access token is configured
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) {
      console.warn('⚠️ Instagram Access Token not configured, using fallback');
      
      // Return mock data as fallback
      const mockPosts: InstagramPost[] = [
        {
          id: 'mock_1',
          permalink: 'https://www.instagram.com/p/example1/',
          media_url: 'https://picsum.photos/400/400?random=1',
          media_type: 'IMAGE',
          caption: '🎉 Great win for our U16s today! Final score 3-1 against local rivals. The lads showed real character! ⚽ #RVR #YouthFootball',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'mock_2',
          permalink: 'https://www.instagram.com/p/example2/',
          media_url: 'https://picsum.photos/400/400?random=2',
          media_type: 'IMAGE',
          caption: '📸 Match day preparations complete! Our senior team ready for tonight\'s cup fixture! 🏆 #MatchDay #RVRReady',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      return res.status(200).json({
        success: true,
        posts: mockPosts.slice(0, postLimit),
        cached: false,
        timestamp: new Date().toISOString()
      });
    }

    // Fetch fresh data from Instagram API
    console.log('📱 Fetching fresh Instagram posts from API...');
    const instagramApi = new InstagramApiClient(accessToken);
    const posts = await instagramApi.getUserMedia(postLimit);
    
    // Update cache
    cachedPosts = posts;
    lastFetchTime = now;
    
    console.log(`✅ Successfully fetched ${posts.length} Instagram posts`);
    
    return res.status(200).json({
      success: true,
      posts,
      cached: false,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Instagram API Error:', error);
    
    // Return cached data if available, even if stale
    if (cachedPosts) {
      console.log('📱 Returning stale cached data due to API error');
      return res.status(200).json({
        success: true,
        posts: cachedPosts.slice(0, parseInt(req.query.limit as string) || 10),
        cached: true,
        timestamp: new Date(lastFetchTime).toISOString()
      });
    }
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Instagram posts'
    });
  }
}