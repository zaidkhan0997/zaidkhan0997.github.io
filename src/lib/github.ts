export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  category: 'android' | 'cpp' | 'shell' | 'web';
  updated_at: string;
}

export interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  bio: string | null;
  location: string | null;
}

export async function fetchGitHubUser(): Promise<GitHubUser | null> {
  try {
    const res = await fetch('https://api.github.com/users/zaidkhan0997');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch GitHub user data:', err);
    return null;
  }
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch('https://api.github.com/users/zaidkhan0997/repos?per_page=100&sort=updated');
    if (!res.ok) return [];
    const data: any[] = await res.json();

    return data.map((repo) => {
      const name = repo.name.toLowerCase();
      const lang = (repo.language || '').toLowerCase();
      let category: 'android' | 'cpp' | 'shell' | 'web' = 'web';

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
  } catch (err) {
    console.warn('Failed to fetch GitHub repos:', err);
    return [];
  }
}
