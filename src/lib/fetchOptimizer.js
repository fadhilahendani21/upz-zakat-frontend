/**
 * Performance optimizations untuk mengurangi lag di form
 * Menggunakan technique:
 * 1. Request caching
 * 2. Request deduplication
 * 3. Abort controller untuk cancel request
 */

// Cache untuk menyimpan hasil fetch
const requestCache = new Map();
const pendingRequests = new Map();

// Cache duration (5 menit)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Fetch dengan caching dan deduplication
 */
export async function cachedFetch(url, options = {}) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  // Check if same request is already pending
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }
  
  // Create abort controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
  // Make request
  const fetchPromise = fetch(url, {
    ...options,
    signal: controller.signal,
  })
    .then(async (response) => {
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the result
      requestCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      
      return data;
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      
      // Don't cache errors
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    })
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });
  
  pendingRequests.set(cacheKey, fetchPromise);
  
  return fetchPromise;
}

/**
 * Clear cache (optional, untuk refresh data)
 */
export function clearCache(pattern) {
  if (pattern) {
    for (const key of requestCache.keys()) {
      if (key.includes(pattern)) {
        requestCache.delete(key);
      }
    }
  } else {
    requestCache.clear();
  }
}

/**
 * Preload resources untuk faster loading
 */
export function preloadData(urls) {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}
