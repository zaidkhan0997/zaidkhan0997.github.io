import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, GitFork, ExternalLink, FolderGit2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
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

// Interactive 3D Translucent Glass Tilt Card Component
const RepoCard3D = ({ repo, index }: { repo: GitHubRepo; index: number }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateXVal = ((y - centerY) / centerY) * -12;
    const rotateYVal = ((x - centerX) / centerX) * 12;
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className="group relative flex flex-col justify-between rounded-3xl border border-white/20 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.35)] hover:border-cyan-300/80 hover:bg-white/[0.09] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300 ease-out"
    >
      {/* Glossy Top Specular Lighting Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-3xl" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-2xl border border-cyan-400/40 bg-white/[0.08] text-cyan-300 backdrop-blur-md group-hover:bg-cyan-400 group-hover:text-black transition-colors shadow-sm shrink-0">
              <FolderGit2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-mono tracking-tight truncate">
              {repo.name}
            </h3>
          </div>
          <ExternalLink className="h-4 w-4 text-cyan-300/80 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </div>

        <p className="text-xs text-white/75 leading-relaxed mb-5 font-normal">
          {repo.description || 'Open source repository maintained by MOHD ZAID.'}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/15 text-xs text-white/75 font-mono">
        <span className="inline-flex items-center gap-1.5 font-semibold text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          {repo.language || 'Code'}
        </span>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
            <Star className="h-3.5 w-3.5 text-cyan-300 fill-cyan-300/20" /> {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1 hover:text-white transition-colors">
            <GitFork className="h-3.5 w-3.5" /> {repo.forks_count}
          </span>
        </div>
      </div>
    </motion.a>
  );
};

export const ReposSection = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [filter, setFilter] = useState<'all' | 'android' | 'cpp' | 'shell' | 'web'>('all');
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

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

  const displayedRepos = showAll ? filteredRepos : filteredRepos.slice(0, 4);
  const hasMore = filteredRepos.length > 4;

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
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/20 px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/40 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
            <span>{isLive ? 'LIVE GITHUB REST API' : 'OPEN SOURCE PROJECTS'}</span>
          </div>

          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            GitHub Repositories
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
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
              onClick={() => { setFilter('all'); setShowAll(false); }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold backdrop-blur-3xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] ${
                filter === 'all'
                  ? 'bg-cyan-400 text-black font-bold shadow-md'
                  : 'bg-white/[0.03] text-white/80 hover:text-white border border-white/20 hover:bg-white/10'
              }`}
            >
              All ({repos.length})
            </button>
            <button
              onClick={() => { setFilter('android'); setShowAll(false); }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold backdrop-blur-3xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] ${
                filter === 'android'
                  ? 'bg-cyan-400 text-black font-bold shadow-md'
                  : 'bg-white/[0.03] text-white/80 hover:text-white border border-white/20 hover:bg-white/10'
              }`}
            >
              Android & Kernel
            </button>
            <button
              onClick={() => { setFilter('shell'); setShowAll(false); }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold backdrop-blur-3xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] ${
                filter === 'shell'
                  ? 'bg-cyan-400 text-black font-bold shadow-md'
                  : 'bg-white/[0.03] text-white/80 hover:text-white border border-white/20 hover:bg-white/10'
              }`}
            >
              Shell & CLI
            </button>
            <button
              onClick={() => { setFilter('web'); setShowAll(false); }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold backdrop-blur-3xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] ${
                filter === 'web'
                  ? 'bg-cyan-400 text-black font-bold shadow-md'
                  : 'bg-white/[0.03] text-white/80 hover:text-white border border-white/20 hover:bg-white/10'
              }`}
            >
              Web & Identity
            </button>

            <button
              onClick={loadLiveRepos}
              title="Refresh live GitHub data"
              className="p-1.5 rounded-2xl bg-white/[0.03] text-white/80 hover:text-cyan-300 border border-white/20 backdrop-blur-3xl transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-cyan-300' : ''}`} />
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
            <input
              type="text"
              placeholder="Search live repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/[0.03] backdrop-blur-3xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] resize-none"
            />
          </div>
        </motion.div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedRepos.map((repo, index) => (
              <RepoCard3D key={repo.id} repo={repo} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex justify-center"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-2 rounded-full border border-cyan-400/50 bg-white/[0.05] px-6 py-3 text-xs font-bold text-cyan-300 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3),0_10px_25px_rgba(0,0,0,0.4)] transition-all hover:border-cyan-300 hover:bg-cyan-400 hover:text-black hover:scale-105"
            >
              <span>
                {showAll
                  ? 'Show Less Repositories'
                  : `Show All Repositories (${filteredRepos.length} Total)`}
              </span>
              {showAll ? (
                <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
