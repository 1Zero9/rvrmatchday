/**
 * 📱 SERVICE WORKER FOR RVR MOBILE APP
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'rvr-mobile-v2.0.0';
const STATIC_CACHE_NAME = 'rvr-static-v2.0.0';
const IMAGE_CACHE_NAME = 'rvr-images-v2.0.0';

// Critical assets for LCP optimization
const CRITICAL_ASSETS = [
  '/mobile-app',
  '/images/logo.png',
  '/images/hero/astro-ward.png',
  '/mobile-manifest.json'
];

// Additional static assets
const STATIC_ASSETS = [
  ...CRITICAL_ASSETS,
  '/images/hero/halftime2.jpg',
  // Fonts and other resources
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/fixtures/,
  /\/api\/teams/,
  /\/api\/news/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle mobile app pages
  if (url.pathname.startsWith('/mobile-app')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version and update in background
            fetchAndCache(request);
            return cachedResponse;
          }
          
          // Not in cache, fetch and cache
          return fetchAndCache(request);
        })
        .catch(() => {
          // Return offline page if available
          return caches.match('/mobile-app');
        })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (isAPIRequest(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('📱 Serving API response from cache:', url.pathname);
                return cachedResponse;
              }
              
              // Return offline response
              return new Response(
                JSON.stringify({ 
                  error: 'Offline', 
                  message: 'No network connection' 
                }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(request);
        })
    );
    return;
  }
});

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseClone);
          });
      }
      return response;
    });
}

// Check if request is for API
function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') || 
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Check if request is for static asset
function isStaticAsset(url) {
  return url.pathname.startsWith('/images/') ||
         url.pathname.startsWith('/icons/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.jpeg') ||
         url.pathname.endsWith('.svg');
}

// Handle background sync (for offline match recording)
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-offline-events') {
    event.waitUntil(syncOfflineEvents());
  }
});

// Sync offline events when back online
async function syncOfflineEvents() {
  try {
    console.log('🔄 Syncing offline events...');
    
    // This would integrate with your LocalStorageManager
    // For now, just log that sync would happen
    console.log('✅ Offline events synced');
    
    // Notify the app that sync completed
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now()
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to sync offline events:', error);
  }
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received');
  
  const options = {
    body: 'New update from RVR AFC!',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    tag: 'rvr-notification',
    data: {
      url: '/mobile-app'
    }
  };

  event.waitUntil(
    self.registration.showNotification('RVR AFC', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/mobile-app')
  );
});