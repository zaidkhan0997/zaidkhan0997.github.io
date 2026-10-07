let cachedUser = null;
let userPromise = null;
let lastUserFetch = 0;

let cachedRepos = null;
let reposPromise = null;
let lastReposFetch = 0;

const GITHUB_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchGitHubUser() {
  const now = Date.now();
  if (cachedUser && now - lastUserFetch < GITHUB_CACHE_TTL) {
    return cachedUser;
  }
  if (userPromise) return userPromise;

  userPromise = (async () => {
    try {
      const res = await fetch('https://api.github.com/users/zaidkhan0997');
      if (res.ok) {
        cachedUser = await res.json();
        lastUserFetch = Date.now();
      }
    } catch (err) {
      console.warn('Failed to fetch GitHub user data:', err);
    } finally {
      userPromise = null;
    }
    return cachedUser;
  })();

  return userPromise;
}

export async function fetchGitHubRepos() {
  const now = Date.now();
  if (cachedRepos && now - lastReposFetch < GITHUB_CACHE_TTL) {
    return cachedRepos;
  }
  if (reposPromise) return reposPromise;

  reposPromise = (async () => {
    try {
      const res = await fetch('https://api.github.com/users/zaidkhan0997/repos?per_page=100&sort=updated');
      if (res.ok) {
        const data = await res.json();
        cachedRepos = data.map((repo) => {
          const name = repo.name.toLowerCase();
          const lang = (repo.language || '').toLowerCase();
          let category = 'web';

          if (
            name.includes('xiaomi') ||
            name.includes('kernel') ||
            name.includes('android') ||
            name.includes('device') ||
            name.includes('vendor') ||
            name.includes('aosp') ||
            name.includes('rom')
          ) {
            category = 'android';
          } else if (lang === 'c' || lang === 'c++') {
            category = 'cpp';
          } else if (lang === 'shell' || lang === 'makefile') {
            category = 'shell';
          }

          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language || 'Code',
            category,
            updated_at: repo.updated_at,
          };
        });
        lastReposFetch = Date.now();
      }
    } catch (err) {
      console.warn('Failed to fetch GitHub repos:', err);
    } finally {
      reposPromise = null;
    }
    return cachedRepos || [];
  })();

  return reposPromise;
}
