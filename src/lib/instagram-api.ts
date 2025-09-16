/**
 * Instagram API Integration
 * Handles real Instagram API calls for @rvrfc1981
 */

interface InstagramPost {
  id: string;
  permalink: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption?: string;
  timestamp: string;
}

interface InstagramApiResponse {
  data: Array<{
    id: string;
    permalink: string;
    media_url: string;
    media_type: string;
    caption?: string;
    timestamp: string;
  }>;
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

class InstagramApiClient {
  private accessToken: string;
  private baseUrl = 'https://graph.instagram.com';
  
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Fetch user's recent media posts
   * @param limit Number of posts to fetch (max 25)
   */
  async getUserMedia(limit: number = 10): Promise<InstagramPost[]> {
    try {
      const fields = 'id,permalink,media_url,media_type,caption,timestamp';
      const url = `${this.baseUrl}/me/media?fields=${fields}&limit=${limit}&access_token=${this.accessToken}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
      }
      
      const data: InstagramApiResponse = await response.json();
      
      return data.data.map(item => ({
        id: item.id,
        permalink: item.permalink,
        media_url: item.media_url,
        media_type: item.media_type as 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM',
        caption: item.caption,
        timestamp: item.timestamp
      }));
      
    } catch (error) {
      console.error('Failed to fetch Instagram media:', error);
      throw error;
    }
  }

  /**
   * Refresh long-lived access token
   * Long-lived tokens expire after 60 days and need refresh
   */
  async refreshAccessToken(): Promise<{ access_token: string; expires_in: number }> {
    try {
      const url = `${this.baseUrl}/refresh_access_token?grant_type=ig_refresh_token&access_token=${this.accessToken}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Token refresh error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Failed to refresh Instagram token:', error);
      throw error;
    }
  }

  /**
   * Get user info (profile details)
   */
  async getUserInfo(): Promise<{ id: string; username: string; account_type: string }> {
    try {
      const fields = 'id,username,account_type';
      const url = `${this.baseUrl}/me?fields=${fields}&access_token=${this.accessToken}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Failed to fetch Instagram user info:', error);
      throw error;
    }
  }
}

// Singleton instance
let instagramApiClient: InstagramApiClient | null = null;

export const getInstagramApi = (): InstagramApiClient => {
  const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('Instagram Access Token not configured. Please set NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN environment variable.');
  }
  
  if (!instagramApiClient) {
    instagramApiClient = new InstagramApiClient(accessToken);
  }
  
  return instagramApiClient;
};

export type { InstagramPost };
export { InstagramApiClient };