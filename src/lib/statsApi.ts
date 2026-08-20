// Cloudflare Worker Persistent Stats Endpoint (100,000 requests/day)
const CLOUD_API_URL = 'https://portfolio-contact-api.zaidkhan0997.workers.dev/stats';

export const BASE_VIEWS = 1753127;
export const BASE_LIKES = 1518437;

export interface PortfolioStats {
  views: number;
  likes: number;
}

// Local cache keys
const CACHE_KEY_VIEWS = 'portfolio_cached_views_v2';
const CACHE_KEY_LIKES = 'portfolio_cached_likes_v2';

const getInitialCachedStats = (): PortfolioStats => {
  if (typeof window === 'undefined') {
    return { views: BASE_VIEWS, likes: BASE_LIKES };
  }
  try {
    const savedViews = parseInt(localStorage.getItem(CACHE_KEY_VIEWS) || '0', 10);
    const savedLikes = parseInt(localStorage.getItem(CACHE_KEY_LIKES) || '0', 10);
    return {
      views: Math.max(BASE_VIEWS, isNaN(savedViews) ? BASE_VIEWS : savedViews),
      likes: Math.max(BASE_LIKES, isNaN(savedLikes) ? BASE_LIKES : savedLikes),
    };
  } catch {
    return { views: BASE_VIEWS, likes: BASE_LIKES };
  }
};

let cachedStats: PortfolioStats = getInitialCachedStats();

const persistLocally = (stats: PortfolioStats) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY_VIEWS, stats.views.toString());
    localStorage.setItem(CACHE_KEY_LIKES, stats.likes.toString());
  } catch {}
};

export const fetchCloudStats = async (): Promise<PortfolioStats> => {
  try {
    const res = await fetch(CLOUD_API_URL);
    if (!res.ok) return cachedStats;
    const json = await res.json();
    if (json && typeof json.views === 'number' && typeof json.likes === 'number') {
      cachedStats = {
        views: Math.max(BASE_VIEWS, json.views),
        likes: Math.max(BASE_LIKES, json.likes),
      };
      persistLocally(cachedStats);
    }
  } catch {
    // Graceful fallback to local cache
  }
  return cachedStats;
};

export const updateCloudStats = async (newStats: PortfolioStats): Promise<PortfolioStats> => {
  cachedStats = {
    views: Math.max(BASE_VIEWS, newStats.views),
    likes: Math.max(BASE_LIKES, newStats.likes),
  };
  persistLocally(cachedStats);

  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cachedStats),
    });
    if (res.ok) {
      const json = await res.json();
      if (json && typeof json.views === 'number' && typeof json.likes === 'number') {
        cachedStats = {
          views: Math.max(BASE_VIEWS, json.views),
          likes: Math.max(BASE_LIKES, json.likes),
        };
        persistLocally(cachedStats);
      }
    }
  } catch {
    // Saved locally
  }
  return cachedStats;
};
