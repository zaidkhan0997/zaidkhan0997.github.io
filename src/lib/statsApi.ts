const CLOUD_API_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a015b9a168453a';

export const BASE_VIEWS = 1753127;
export const BASE_LIKES = 1518437;

export interface PortfolioStats {
  views: number;
  likes: number;
}

let cachedStats: PortfolioStats = { views: BASE_VIEWS, likes: BASE_LIKES };

export const fetchCloudStats = async (): Promise<PortfolioStats> => {
  try {
    const res = await fetch(CLOUD_API_URL);
    if (!res.ok) return cachedStats;
    const json = await res.json();
    if (json && json.data && typeof json.data.views === 'number' && typeof json.data.likes === 'number') {
      cachedStats = {
        views: Math.max(BASE_VIEWS, json.data.views),
        likes: Math.max(BASE_LIKES, json.data.likes),
      };
    }
  } catch (err) {
    console.warn('Failed to fetch cloud stats:', err);
  }
  return cachedStats;
};

export const updateCloudStats = async (newStats: PortfolioStats): Promise<PortfolioStats> => {
  cachedStats = newStats;
  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'zaidkhan0997_portfolio_stats',
        data: newStats,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        cachedStats = {
          views: Math.max(BASE_VIEWS, json.data.views),
          likes: Math.max(BASE_LIKES, json.data.likes),
        };
      }
    }
  } catch (err) {
    console.warn('Failed to update cloud stats:', err);
  }
  return cachedStats;
};
