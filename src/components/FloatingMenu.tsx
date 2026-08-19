import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Compass,
  Home,
  Wrench,
  FolderGit2,
  Terminal,
  Mail,
  Cpu,
  GitBranch,
  Eye,
  Heart,
  Github,
  ChevronRight,
  Code,
  Smartphone,
  Layers,
  HardDrive
} from 'lucide-react';
import { BASE_VIEWS, BASE_LIKES, fetchCloudStats, updateCloudStats } from '@/lib/statsApi';

export const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(BASE_LIKES);
  const [views, setViews] = useState(BASE_VIEWS);

  useEffect(() => {
    // Persistent Local Like State
    const savedLiked = localStorage.getItem('portfolio_has_liked_v1') === 'true';
    setHasLiked(savedLiked);

    // Sync real-time stats from Cloud API
    fetchCloudStats().then((data) => {
      setViews(data.views);
      setLikes(data.likes);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const handleToggleEvent = () => {
      setIsOpen((prev) => !prev);
    };
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (typeof customEvent.detail.views === 'number') setViews(customEvent.detail.views);
        if (typeof customEvent.detail.likes === 'number') setLikes(customEvent.detail.likes);
        if (typeof customEvent.detail.hasLiked === 'boolean') setHasLiked(customEvent.detail.hasLiked);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-floating-menu', handleToggleEvent);
    window.addEventListener('portfolio-cloud-stats-updated', handleSync);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-floating-menu', handleToggleEvent);
      window.removeEventListener('portfolio-cloud-stats-updated', handleSync);
    };
  }, []);

  const handleLike = async () => {
    const nextState = !hasLiked;
    setHasLiked(nextState);
    localStorage.setItem('portfolio_has_liked_v1', nextState ? 'true' : 'false');

    const nextLikes = nextState ? likes + 1 : Math.max(BASE_LIKES, likes - 1);
    setLikes(nextLikes);

    const updated = await updateCloudStats({ views, likes: nextLikes });
    setLikes(updated.likes);

    window.dispatchEvent(
      new CustomEvent('portfolio-cloud-stats-updated', {
        detail: { views, likes: updated.likes, hasLiked: nextState },
      })
    );
  };

  const navItems = [
    {
      label: 'Home',
      desc: 'Intro, hero & metrics showcase',
      href: '#hero',
      icon: Home,
    },
    {
      label: 'Specialization & Skills',
      desc: 'Technical mastery, AOSP & tools',
      href: '#skills',
      icon: Wrench,
    },
    {
      label: 'Repositories & Projects',
      desc: '58+ GitHub source trees & ROMs',
      href: '#projects',
      icon: FolderGit2,
    },
    {
      label: 'CLI Terminal',
      desc: 'Interactive developer prompt',
      href: '#terminal',
      icon: Terminal,
    },
    {
      label: 'Contact & Socials',
      desc: 'Email, Instagram & GitHub links',
      href: '#contact',
      icon: Mail,
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            />

            {/* Main Outer Drawer Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 md:right-10 z-[100] max-h-[85vh] w-[calc(100vw-2rem)] sm:w-96 overflow-y-auto rounded-[32px] frosted-glass-card p-4 sm:p-5 text-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Profile Embossed Pill Header */}
              <div className="flex items-center justify-between rounded-full frosted-glass-pill p-2.5 sm:p-3 mb-4">
                <div className="flex items-center gap-3 min-w-0 pl-1">
                  <div className="relative shrink-0">
                    <img
                      src="/assets/profile.jpg"
                      alt="MOHD ZAID"
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-rose-400/50 shadow-md"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500 ring-2 ring-black" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black tracking-widest font-display uppercase text-white leading-tight truncate">
                      MOHD ZAID
                    </h3>
                    <p className="text-xs font-mono text-rose-300 font-medium">
                      ( zaidkhan0997 )
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full frosted-glass-pill text-white/80 hover:border-rose-300 hover:bg-rose-500 hover:text-white hover:scale-105 transition-all shrink-0 shadow-md"
                  title="Close Navigation Drawer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* NAVIGATION Card Section */}
              <div className="rounded-3xl frosted-glass-card p-3.5 sm:p-4 mb-4 space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-rose-300 uppercase pl-1">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Navigation</span>
                </div>

                <div className="space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between rounded-full frosted-glass-pill p-2 sm:p-2.5 transition-all hover:border-rose-400/80 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-white/60 truncate">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-rose-300 group-hover:translate-x-1 transition-all shrink-0 mr-1.5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* TECHNICAL SPECIALIZATION Card Section */}
              <div className="rounded-3xl frosted-glass-card p-3.5 sm:p-4 mb-4 space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-rose-300 uppercase pl-1">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Technical Specialization</span>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-full frosted-glass-pill px-3 py-1.5 font-medium text-white/90 hover:border-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Layers className="h-3 w-3 text-rose-300" /> All Skills
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-full frosted-glass-pill px-3 py-1.5 font-medium text-white/90 hover:border-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Code className="h-3 w-3 text-rose-300" /> Languages (C/C++, Shell)
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-full frosted-glass-pill px-3 py-1.5 font-medium text-white/90 hover:border-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Smartphone className="h-3 w-3 text-rose-300" /> Android &amp; Kernel Trees
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-full frosted-glass-pill px-3 py-1.5 font-medium text-white/90 hover:border-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Wrench className="h-3 w-3 text-rose-300" /> Build &amp; AOSP Tools
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-full frosted-glass-pill px-3 py-1.5 font-medium text-white/90 hover:border-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <HardDrive className="h-3 w-3 text-rose-300" /> Hardware &amp; Devices
                  </a>
                </div>
              </div>

              {/* REPOSITORY CATEGORIES Card Section */}
              <div className="rounded-3xl frosted-glass-card p-3.5 sm:p-4 mb-4 space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-rose-300 uppercase pl-1">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>Repository Categories</span>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  <a
                    href="#projects"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-full frosted-glass-pill px-3 py-1.5 font-medium text-white/90 hover:border-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <FolderGit2 className="h-3 w-3 text-rose-300" /> All Repos (58+)
                  </a>
                  <a
                    href="#projects"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-full frosted-glass-pill px-3 py-1.5 font-medium text-white/90 hover:border-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Smartphone className="h-3 w-3 text-rose-300" /> Android &amp; Kernel
                  </a>
                </div>
              </div>

              {/* Engagement Stats & GitHub Button Card Section */}
              <div className="rounded-3xl frosted-glass-card p-3.5 sm:p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center justify-center gap-2 rounded-full frosted-glass-pill py-2.5 px-3 text-rose-300 font-bold font-mono text-xs" title="Total Views">
                    <Eye className="h-3.5 w-3.5 animate-pulse" /> {(views / 1000000).toFixed(2)}M
                  </div>

                  {/* Synchronized Persistent Interactive Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center justify-center gap-2 rounded-full frosted-glass-pill py-2.5 px-3 font-bold font-mono text-xs transition-all active:scale-95 ${
                      hasLiked
                        ? 'border-rose-400 bg-rose-500 text-white shadow-[0_0_15px_rgba(255,48,71,0.5)]'
                        : 'text-rose-300 hover:bg-rose-500/20'
                    }`}
                    title={hasLiked ? 'Liked!' : 'Click to Like'}
                  >
                    <Heart className={`h-3.5 w-3.5 ${hasLiked ? 'fill-current text-white' : 'fill-rose-400/20 text-rose-300'}`} />
                    <span>{(likes / 1000000).toFixed(2)}M</span>
                  </button>
                </div>

                <a
                  href="https://github.com/zaidkhan0997"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 py-3 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
