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

export const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const handleToggleEvent = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-floating-menu', handleToggleEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-floating-menu', handleToggleEvent);
    };
  }, []);

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
      {/* Pure 3D Translucent Glass Blur Drawer Panel - Zero Solid Color, Pure Glass & Backdrop Blur */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-md"
            />

            {/* Pure 3D Translucent Glass Card Drawer Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 md:right-10 z-[100] max-h-[85vh] w-[calc(100vw-2rem)] sm:w-96 overflow-y-auto rounded-3xl border border-white/20 bg-white/[0.03] p-4 sm:p-5 text-white backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_20px_60px_rgba(0,0,0,0.5)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Profile 3D Glass Pill Card */}
              <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/[0.04] p-3.5 backdrop-blur-2xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2)] mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src="/assets/profile.jpg"
                      alt="MOHD ZAID"
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-cyan-400/50 shadow-md"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-cyan-400 ring-2 ring-black" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black tracking-widest font-display uppercase text-white leading-tight truncate">
                      MOHD ZAID
                    </h3>
                    <p className="text-xs font-mono text-cyan-300 font-medium">
                      ( zaidkhan0997 )
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-cyan-400/40 bg-white/[0.08] text-cyan-300 backdrop-blur-md hover:bg-cyan-400 hover:text-black transition-all shrink-0 shadow-sm"
                  title="Close Menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* NAVIGATION 3D Glass Card Container */}
              <div className="rounded-2xl border border-white/20 bg-white/[0.04] p-3.5 backdrop-blur-2xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2)] mb-4 space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Navigation</span>
                </div>

                <div className="space-y-2">
                  {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.04] p-2.5 sm:p-3 transition-all hover:border-cyan-300/80 hover:bg-white/[0.09] group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/40 bg-white/[0.08] text-cyan-300 group-hover:bg-cyan-400 group-hover:text-black transition-colors shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-white/60">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all shrink-0" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* TECHNICAL SPECIALIZATION 3D Glass Card Container */}
              <div className="rounded-2xl border border-white/20 bg-white/[0.04] p-3.5 backdrop-blur-2xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2)] mb-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Technical Specialization</span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-medium text-white/90 hover:border-cyan-300 hover:bg-white/[0.09] hover:text-cyan-300 transition-colors"
                  >
                    <Layers className="h-3 w-3 text-cyan-300" /> All Skills
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-medium text-white/90 hover:border-cyan-300 hover:bg-white/[0.09] hover:text-cyan-300 transition-colors"
                  >
                    <Code className="h-3 w-3 text-cyan-300" /> Languages (C/C++, Shell)
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-medium text-white/90 hover:border-cyan-300 hover:bg-white/[0.09] hover:text-cyan-300 transition-colors"
                  >
                    <Smartphone className="h-3 w-3 text-cyan-300" /> Android &amp; Kernel Trees
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-medium text-white/90 hover:border-cyan-300 hover:bg-white/[0.09] hover:text-cyan-300 transition-colors"
                  >
                    <Wrench className="h-3 w-3 text-cyan-300" /> Build &amp; AOSP Tools
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-medium text-white/90 hover:border-cyan-300 hover:bg-white/[0.09] hover:text-cyan-300 transition-colors"
                  >
                    <HardDrive className="h-3 w-3 text-cyan-300" /> Hardware &amp; Devices
                  </a>
                </div>
              </div>

              {/* REPOSITORY CATEGORIES 3D Glass Card Container */}
              <div className="rounded-2xl border border-white/20 bg-white/[0.04] p-3.5 backdrop-blur-2xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2)] mb-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>Repository Categories</span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <a
                    href="#projects"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-medium text-white/90 hover:border-cyan-300 hover:bg-white/[0.09] hover:text-cyan-300 transition-colors"
                  >
                    <FolderGit2 className="h-3 w-3 text-cyan-300" /> All Repos (58+)
                  </a>
                  <a
                    href="#projects"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-medium text-white/90 hover:border-cyan-300 hover:bg-white/[0.09] hover:text-cyan-300 transition-colors"
                  >
                    <Smartphone className="h-3 w-3 text-cyan-300" /> Android &amp; Kernel
                  </a>
                </div>
              </div>

              {/* Engagement Stats & GitHub Button Card */}
              <div className="rounded-2xl border border-white/20 bg-white/[0.04] p-3.5 backdrop-blur-2xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2)] space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-white/[0.08] py-2 px-3 text-cyan-300 font-bold font-mono text-xs">
                    <Eye className="h-3.5 w-3.5" /> 1.75M
                  </div>

                  <div className="flex items-center justify-center gap-2 rounded-xl border border-pink-400/40 bg-white/[0.08] py-2 px-3 text-pink-300 font-bold font-mono text-xs">
                    <Heart className="h-3.5 w-3.5 fill-pink-400/20" /> 1.52M
                  </div>
                </div>

                <a
                  href="https://github.com/zaidkhan0997"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-2.5 text-xs font-bold text-black shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
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
