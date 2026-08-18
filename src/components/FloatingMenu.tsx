import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Menu,
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
  const [visible, setVisible] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 120 && !isOpen) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      {/* Scroll-Aware Floating 3-Line Menu Trigger Button */}
      <motion.button
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: visible || isOpen ? 0 : -20,
          opacity: visible || isOpen ? 1 : 0.4,
          scale: visible || isOpen ? 1 : 0.9,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1, opacity: 1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 right-5 z-[100] flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/40 bg-black/90 text-white shadow-2xl backdrop-blur-xl transition-all hover:border-cyan-400 hover:bg-cyan-500 hover:text-black focus:outline-none"
        aria-label="Toggle Navigation Menu"
        title={isOpen ? "Close Menu" : "Open Navigation Menu"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6 stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="h-6 w-6 stroke-[2.5]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating High-Tech Drawer Overlay & Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            />

            {/* Menu Panel Drawer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-20 right-5 z-[100] max-h-[82vh] w-[calc(100vw-2.5rem)] max-w-sm overflow-y-auto rounded-3xl border border-cyan-500/30 bg-[#090d16]/95 p-6 text-white shadow-2xl backdrop-blur-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-4 mb-5">
                <div className="relative">
                  <img
                    src="/assets/profile.jpg"
                    alt="MOHD ZAID"
                    className="h-11 w-11 rounded-2xl object-cover border border-cyan-400/40 shadow-md"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-[#090d16]" />
                </div>

                <div>
                  <h3 className="text-base font-bold tracking-wide text-white leading-tight">
                    MOHD ZAID
                  </h3>
                  <p className="text-xs font-mono text-cyan-400 font-medium">
                    ( zaidkhan0997 )
                  </p>
                  <p className="text-[11px] text-cyan-400/80 font-medium mt-0.5">
                    Android Custom ROM & Kernel Developer
                  </p>
                </div>
              </div>

              {/* NAVIGATION Section */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
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
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-white/50">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* TECHNICAL SPECIALIZATION Tags */}
              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Technical Specialization</span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-medium hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Layers className="h-3 w-3 text-cyan-400" /> All Skills
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-medium hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Code className="h-3 w-3 text-cyan-400" /> Languages (C/C++, Shell)
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-medium hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Smartphone className="h-3 w-3 text-cyan-400" /> Android & Kernel Trees
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-medium hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Wrench className="h-3 w-3 text-cyan-400" /> Build & AOSP Tools
                  </a>
                  <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-medium hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <HardDrive className="h-3 w-3 text-cyan-400" /> Hardware & Devices
                  </a>
                </div>
              </div>

              {/* REPOSITORY CATEGORIES Tags */}
              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>Repository Categories</span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <a
                    href="#projects"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-medium hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <FolderGit2 className="h-3 w-3 text-cyan-400" /> All Repos (58+)
                  </a>
                  <a
                    href="#projects"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-medium hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Smartphone className="h-3 w-3 text-cyan-400" /> Android & Kernel
                  </a>
                </div>
              </div>

              {/* Engagement Stats & GitHub Button */}
              <div className="space-y-3 border-t border-cyan-500/20 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2.5 px-3 text-cyan-400 font-bold font-mono text-xs">
                    <Eye className="h-4 w-4" /> 1.75M
                  </div>

                  <div className="flex items-center justify-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/10 py-2.5 px-3 text-pink-400 font-bold font-mono text-xs">
                    <Heart className="h-4 w-4 fill-pink-500/20" /> 1.52M
                  </div>
                </div>

                <a
                  href="https://github.com/zaidkhan0997"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
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
