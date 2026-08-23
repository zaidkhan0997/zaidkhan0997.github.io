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
    forks_count: 2,
    category: 'android',
    html_url: 'https://github.com/zaidkhan0997/OTA',
    updated_at: new Date().toISOString(),
  },
  {
    id: 10,
    name: 'android_vendor_xiaomi_lisa',
    description: 'Xiaomi lisa proprietary blobless vendor tree for AOSP 14 & 15 QPR builds.',
    language: 'Makefile',
    stargazers_count: 11,
    forks_count: 3,
    category: 'android',
    html_url: 'https://github.com/zaidkhan0997/android_vendor_xiaomi_lisa',
    updated_at: new Date().toISOString(),
  },
  {
    id: 11,
    name: 'android_hardware_xiaomi',
    description: 'Custom Hardware Abstraction Layer (HAL) implementations for Xiaomi fingerprint, vibrator, and display modes.',
    language: 'C++',
    stargazers_count: 9,
    forks_count: 2,
    category: 'android',
    html_url: 'https://github.com/zaidkhan0997/android_hardware_xiaomi',
    updated_at: new Date().toISOString(),
  },
  {
    id: 12,
    name: 'scripts_kernel_build',
    description: 'Automated CI/CD build scripts with Telegram bot notification integration and artifact uploading.',
    language: 'Shell',
    stargazers_count: 17,
    forks_count: 5,
    category: 'shell',
    html_url: 'https://github.com/zaidkhan0997/scripts_kernel_build',
    updated_at: new Date().toISOString(),
  },
];

const RepoCard3D = ({ repo, index }: { repo: GitHubRepo; index: number }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -12);
    setRotateY(((x - centerX) / centerX) * 12);
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
      initial={{ opacity: 0, y: 35, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className="group relative flex flex-col justify-between rounded-3xl frosted-glass-card p-5 sm:p-6"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 backdrop-blur-md group-hover:bg-rose-500 group-hover:text-white transition-colors shadow-sm shrink-0">
              <FolderGit2 className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors font-mono tracking-tight truncate">
              {repo.name}
            </h3>
          </div>
          <ExternalLink className="h-4 w-4 text-rose-300/80 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </div>

        <p className="text-xs text-white/70 line-clamp-2 mb-4 leading-relaxed font-sans">
          {repo.description || 'Custom Android Kernel / Tree repository maintained by @zaidkhan0997.'}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-white/60 pt-3 border-t border-white/10 font-mono">
        <span className="inline-flex items-center gap-1.5 font-semibold text-rose-300">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(255,48,71,0.8)]" />
          {repo.language || 'Source'}
        </span>
        
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 hover:text-rose-300 transition-colors">
            <Star className="h-3.5 w-3.5 text-rose-400 fill-rose-400/20" /> {repo.stargazers_count}
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
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<'all' | 'android' | 'c-cpp' | 'shell'>('all');
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [showAllRepos, setShowAllRepos] = useState(false);

  const loadLiveRepos = async () => {
    setLoading(true);
    const live = await fetchGitHubRepos();
    if (live && live.length > 0) {
      setRepos(live);
      setIsLive(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLiveRepos();
  }, []);

  const filtered = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (selectedCat === 'all') return true;
    if (selectedCat === 'android') return repo.category === 'android' || repo.name.includes('xiaomi') || repo.name.includes('kernel') || repo.name.includes('device');
    if (selectedCat === 'c-cpp') return repo.language === 'C' || repo.language === 'C++';
    if (selectedCat === 'shell') return repo.language === 'Shell' || repo.language === 'Bash' || repo.name.includes('script');
    return true;
  });

  const displayedRepos = showAllRepos ? filtered : filtered.slice(0, 3);
  const hasMoreRepos = filtered.length > 3;

  return (
    <section id="projects" className="bg-transparent py-20 border-b border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3.5 py-1 text-xs font-semibold text-rose-300 border border-rose-400/40 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-rose-400 animate-pulse' : 'bg-rose-500'}`} />
            {isLive ? 'LIVE GITHUB API SYNC' : 'ACTIVE REPOSITORIES'}
          </div>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Repositories &amp; Projects
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            Android kernels, device trees, custom ROM sources, hardware vendor trees, and automation tools.
          </p>
        </motion.div>

        {/* Filter & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setSelectedCat('all'); setShowAllRepos(false); }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                selectedCat === 'all'
                  ? 'bg-rose-500 text-white font-bold shadow-md'
                  : 'frosted-glass-pill text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              All ({repos.length})
            </button>
            <button
              onClick={() => { setSelectedCat('android'); setShowAllRepos(false); }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                selectedCat === 'android'
                  ? 'bg-rose-500 text-white font-bold shadow-md'
                  : 'frosted-glass-pill text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              Android &amp; Kernel
            </button>
            <button
              onClick={() => { setSelectedCat('c-cpp'); setShowAllRepos(false); }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                selectedCat === 'c-cpp'
                  ? 'bg-rose-500 text-white font-bold shadow-md'
                  : 'frosted-glass-pill text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              C / C++
            </button>
            <button
              onClick={() => { setSelectedCat('shell'); setShowAllRepos(false); }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                selectedCat === 'shell'
                  ? 'bg-rose-500 text-white font-bold shadow-md'
                  : 'frosted-glass-pill text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              Shell Scripts
            </button>
            
            <button
              onClick={loadLiveRepos}
              title="Sync Latest from GitHub"
              className="p-2 rounded-2xl frosted-glass-pill text-white/80 hover:text-rose-300 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-rose-400' : ''}`} />
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowAllRepos(false); }}
              className="w-full rounded-2xl frosted-glass-pill pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
            />
          </div>
        </motion.div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedRepos.map((repo, index) => (
              <RepoCard3D key={repo.id || repo.name} repo={repo} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less Button */}
        {hasMoreRepos && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex justify-center"
          >
            <button
              onClick={() => setShowAllRepos(!showAllRepos)}
              className="group flex items-center gap-2 rounded-full frosted-glass-pill px-6 py-3 text-xs font-bold text-rose-300 transition-all hover:border-rose-300 hover:bg-rose-500 hover:text-white hover:scale-105 shadow-md"
            >
              <span>
                {showAllRepos
                  ? 'Show Less Repositories'
                  : `Show All Repositories (${filtered.length} Total)`}
              </span>
              {showAllRepos ? (
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
