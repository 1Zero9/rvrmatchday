/**
 * 📱 LOCAL STORAGE MANAGER
 * Handles offline storage and sync for mobile app
 * Optimized for performance and data efficiency
 */

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'rvr_mobile_preferences',
  CACHED_FIXTURES: 'rvr_cached_fixtures',
  CACHED_TEAMS: 'rvr_cached_teams',
  CACHED_NEWS: 'rvr_cached_news',
  OFFLINE_EVENTS: 'rvr_offline_events',
  LAST_SYNC: 'rvr_last_sync',
  APP_STATE: 'rvr_app_state'
} as const;

// Data Types
export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export interface OfflineEvent {
  id: string;
  type: 'match_event' | 'score_update' | 'player_action';
  data: any;
  timestamp: number;
  synced: boolean;
}

export interface UserPreferences {
  preferredTeams: string[];
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
  defaultView: 'dashboard' | 'fixtures' | 'teams';
}

// Storage Manager Class
export class LocalStorageManager {
  private static instance: LocalStorageManager;
  
  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  // Generic storage methods
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  // Cache data with expiry
  cacheData<T>(key: string, data: T, expiryMinutes: number = 60): void {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + (expiryMinutes * 60 * 1000)
    };
    this.setItem(key, cached);
  }

  // Get cached data if not expired
  getCachedData<T>(key: string): T | null {
    const cached = this.getItem<CachedData<T>>(key);
    
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() > cached.expiry) {
      this.removeItem(key);
      return null;
    }
    
    return cached.data;
  }

  // User Preferences
  getUserPreferences(): UserPreferences {
    return this.getItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES) || {
      preferredTeams: [],
      notificationsEnabled: true,
      theme: 'light',
      defaultView: 'dashboard'
    };
  }

  setUserPreferences(preferences: UserPreferences): void {
    this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  // Fixtures caching
  cacheFixtures(fixtures: any[]): void {
    this.cacheData(STORAGE_KEYS.CACHED_FIXTURES, fixtures, 30); // 30 minutes
  }

  getCachedFixtures(): any[] | null {
    return this.getCachedData(STORAGE_KEYS.CACHED_FIXTURES);
  }

  // Teams caching
  cacheTeams(teams: any[]): void {
    this.cacheData(STORAGE_KEYS.CACHED_TEAMS, teams, 120); // 2 hours
  }

  getCachedTeams(): any[] | null {
    return this.getCachedData(STORAGE_KEYS.CACHED_TEAMS);
  }

  // News caching
  cacheNews(news: any[]): void {
    this.cacheData(STORAGE_KEYS.CACHED_NEWS, news, 15); // 15 minutes
  }

  getCachedNews(): any[] | null {
    return this.getCachedData(STORAGE_KEYS.CACHED_NEWS);
  }

  // Offline Events Management
  addOfflineEvent(event: Omit<OfflineEvent, 'id' | 'timestamp' | 'synced'>): void {
    const offlineEvents = this.getOfflineEvents();
    const newEvent: OfflineEvent = {
      ...event,
      id: `offline_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      synced: false
    };
    
    offlineEvents.push(newEvent);
    this.setItem(STORAGE_KEYS.OFFLINE_EVENTS, offlineEvents);
  }

  getOfflineEvents(): OfflineEvent[] {
    return this.getItem<OfflineEvent[]>(STORAGE_KEYS.OFFLINE_EVENTS) || [];
  }

  markEventSynced(eventId: string): void {
    const events = this.getOfflineEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex >= 0) {
      events[eventIndex].synced = true;
      this.setItem(STORAGE_KEYS.OFFLINE_EVENTS, events);
    }
  }

  clearSyncedEvents(): void {
    const events = this.getOfflineEvents();
    const unsyncedEvents = events.filter(e => !e.synced);
    this.setItem(STORAGE_KEYS.OFFLINE_EVENTS, unsyncedEvents);
  }

  // Sync Management
  getLastSyncTime(): Date | null {
    const timestamp = this.getItem<number>(STORAGE_KEYS.LAST_SYNC);
    return timestamp ? new Date(timestamp) : null;
  }

  setLastSyncTime(date: Date = new Date()): void {
    this.setItem(STORAGE_KEYS.LAST_SYNC, date.getTime());
  }

  // App State Management
  saveAppState(state: any): void {
    this.setItem(STORAGE_KEYS.APP_STATE, {
      ...state,
      timestamp: Date.now()
    });
  }

  getAppState(): any {
    const state = this.getItem(STORAGE_KEYS.APP_STATE);
    if (!state) return null;
    
    // Check if state is too old (24 hours)
    const dayOld = Date.now() - (24 * 60 * 60 * 1000);
    if (state.timestamp < dayOld) {
      this.removeItem(STORAGE_KEYS.APP_STATE);
      return null;
    }
    
    return state;
  }

  // Storage size management
  getStorageUsage(): { used: number; available: number; percentage: number } {
    let used = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
    
    // Rough estimate - browsers typically allow 5-10MB
    const available = 5 * 1024 * 1024; // 5MB estimate
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  }

  // Clean old data
  cleanExpiredData(): void {
    const keys = Object.values(STORAGE_KEYS);
    
    keys.forEach(key => {
      const cached = this.getItem<CachedData<any>>(key);
      if (cached && Date.now() > cached.expiry) {
        this.removeItem(key);
      }
    });
    
    // Clean old synced events
    this.clearSyncedEvents();
  }

  // Clear all app data
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }

  // Check if we're likely offline
  isOffline(): boolean {
    return !navigator.onLine;
  }

  // Get data freshness indicator
  getDataFreshness(key: string): 'fresh' | 'stale' | 'expired' {
    const cached = this.getItem<CachedData<any>>(key);
    
    if (!cached) return 'expired';
    
    const now = Date.now();
    const age = now - cached.timestamp;
    const timeToExpiry = cached.expiry - now;
    
    if (timeToExpiry <= 0) return 'expired';
    if (age < 5 * 60 * 1000) return 'fresh'; // Less than 5 minutes old
    return 'stale';
  }
}

// Hook for React components
export function useLocalStorage() {
  return LocalStorageManager.getInstance();
}

// Export singleton instance
export const storage = LocalStorageManager.getInstance();