import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, GitFork, ExternalLink, FolderGit2, RefreshCw } from 'lucide-react';
import { fetchGitHubRepos, GitHubRepo } from '@/lib/github';

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: 'device_xiaomi_lisa',
    description: 'Android Device Tree For Xiaomi 11 Lite NE 5G (lisa). Optimized for custom ROM compilation & HAL integration.',
    language: 'C++',
    stargazers_count: 12,
    forks_count: 4,
    category: 'android',
    html_url: 'https://github.com/zaidkhan0997/device_xiaomi_lisa',
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'kernel_xiaomi_lisa',
    description: 'Linux Kernel Tree For Xiaomi 11 Lite NE 5G with custom performance tweaks, CPU governors & RAM management.',
    language: 'C',
    stargazers_count: 18,
    forks_count: 6,
    category: 'android',
    html_url: 'https://github.com/zaidkhan0997/kernel_xiaomi_lisa',
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'android_kernel_xiaomi_sweet',
    description: 'Linux Kernel Source Code For Redmi Note 10 Pro / Pro Max (sweet/sweetin).',
    language: 'C',
    stargazers_count: 15,
    forks_count: 5,
    category: 'android',
    html_url: 'https://github.com/zaidkhan0997/android_kernel_xiaomi_sweet',
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'device_xiaomi_sweet',
    description: 'Android Device Tree For Redmi Note 10 Pro / Pro Max (sweet).',
    language: 'Makefile',
    stargazers_count: 10,
    forks_count: 3,
    category: 'android',
    html_url: 'https://github.com/zaidkhan0997/device_xiaomi_sweet',
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'KernelSU',
    description: 'Imported KernelSU kernel-level root interface and security patch drivers for Android.',
    language: 'C',
    stargazers_count: 25,
    forks_count: 8,
    category: 'android',
    html_url: 'https://github.com/zaidkhan0997/KernelSU',
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'vendor_GoogleCameraSweet',
    description: 'Stable Google Camera Mod & HDR processing config vendor tree for Redmi Note 10 Pro.',
    language: 'Makefile',
    stargazers_count: 8,
    forks_count: 2,
    category: 'android',
    html_url: 'https://github.com/zaidkhan0997/vendor_GoogleCameraSweet',
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'GoFile-Upload',
    description: 'A simple script to upload files to gofile.io via Terminal (CLI). Written in Bash.',
    language: 'Shell',
    stargazers_count: 14,
    forks_count: 3,
    category: 'shell',
    html_url: 'https://github.com/zaidkhan0997/GoFile-Upload',
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'AnyKernel3',
    description: 'Evolved Android Flashable Zip Template for Kernels with ramdisk patch scripts.',
    language: 'Shell',
    stargazers_count: 22,
    forks_count: 7,
    category: 'shell',
    html_url: 'https://github.com/zaidkhan0997/AnyKernel3',
    updated_at: new Date().toISOString(),
  },
  {
    id: 9,
    name: 'OTA',
    description: 'Over-The-Air Update Payload Delivery Configuration & Verification Engine.',
    language: 'JSON',
    stargazers_count: 6,
    forks_count: 1,
    category: 'shell',
    html_url: 'https://github.com/zaidkhan0997/OTA',
    updated_at: new Date().toISOString(),
  },
  {
    id: 10,
    name: 'zaidkhan0997.github.io',
    description: 'Personal Developer Portfolio & Repository Showcase hosted on GitHub Pages.',
    language: 'TypeScript',
    stargazers_count: 9,
    forks_count: 2,
    category: 'web',
    html_url: 'https://github.com/zaidkhan0997/zaidkhan0997.github.io',
    updated_at: new Date().toISOString(),
  },
];

export const ReposSection = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [filter, setFilter] = useState<'all' | 'android' | 'cpp' | 'shell' | 'web'>('all');
  const [search, setSearch] = useState('');

  const loadLiveRepos = async () => {
    setLoading(true);
    const liveData = await fetchGitHubRepos();
    if (liveData && liveData.length > 0) {
      setRepos(liveData);
      setIsLive(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLiveRepos();
  }, []);

  const filteredRepos = repos.filter((repo) => {
    const matchesFilter = filter === 'all' || repo.category === filter;
    const matchesSearch =
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(search.toLowerCase())) ||
      (repo.language && repo.language.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="projects" className="bg-transparent py-20 border-b border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
            <span>{isLive ? 'LIVE GITHUB REST API' : 'OPEN SOURCE PROJECTS'}</span>
          </div>

          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            GitHub Repositories
          </h2>
          <p className="text-sm text-white/60 max-w-2xl mx-auto">
            Fetched in real-time from @zaidkhan0997&apos;s GitHub profile ({repos.length} total repositories).
          </p>
        </motion.div>

        {/* Filter Controls & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all ${
                filter === 'all'
                  ? 'bg-cyan-500 text-black shadow-sm font-bold'
                  : 'bg-black/40 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              All ({repos.length})
            </button>
            <button
              onClick={() => setFilter('android')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all ${
                filter === 'android'
                  ? 'bg-cyan-500 text-black shadow-sm font-bold'
                  : 'bg-black/40 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              Android & Kernel
            </button>
            <button
              onClick={() => setFilter('shell')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all ${
                filter === 'shell'
                  ? 'bg-cyan-500 text-black shadow-sm font-bold'
                  : 'bg-black/40 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              Shell & CLI
            </button>
            <button
              onClick={() => setFilter('web')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all ${
                filter === 'web'
                  ? 'bg-cyan-500 text-black shadow-sm font-bold'
                  : 'bg-black/40 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              Web & Identity
            </button>

            <button
              onClick={loadLiveRepos}
              title="Refresh live GitHub data"
              className="p-2 rounded-xl bg-black/40 text-white/70 hover:text-cyan-400 border border-white/10 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search live repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-md pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </motion.div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRepos.map((repo, index) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.4, delay: (index % 2) * 0.1 }}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-6 shadow-sm backdrop-blur-md hover:border-cyan-500/50 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="h-4.5 w-4.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                      {repo.name}
                    </h3>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  {repo.description || 'Open source repository maintained by MOHD ZAID.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-white/60 font-mono">
                <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  {repo.language || 'Code'}
                </span>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                    <Star className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400/20" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 hover:text-white transition-colors">
                    <GitFork className="h-3.5 w-3.5" /> {repo.forks_count}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
