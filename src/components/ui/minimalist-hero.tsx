import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks: { icon: LucideIcon; href: string }[];
  locationText: string;
  className?: string;
  subBadge?: string;
  quote?: string;
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-xs font-semibold tracking-widest text-white/70 transition-colors hover:text-cyan-400 uppercase"
  >
    {children}
  </a>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 bg-black/40 text-white/80 backdrop-blur-md transition-all hover:border-cyan-400 hover:bg-cyan-500 hover:text-black hover:scale-110 shadow-sm"
  >
    <Icon className="h-4.5 w-4.5" />
  </a>
);

export const MinimalistHero = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
  subBadge = "Android Kernel & OS Developer",
  quote = '"Be happy, it drives people crazy."'
}: MinimalistHeroProps) => {
  return (
    <div
      id="hero"
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-transparent p-6 font-sans md:p-10 border-b border-white/10',
        className
      )}
    >
      {/* Header with Profile Avatar */}
      <header className="z-30 flex w-full max-w-7xl items-center justify-between py-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 text-lg md:text-xl font-bold tracking-wider text-white"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={imageSrc}
                alt="MOHD ZAID"
                className="h-9 w-9 rounded-full object-cover border border-cyan-400/50 shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-black" />
            </div>
            <span>{logoText}</span>
          </div>
          <span className="hidden sm:inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-cyan-300">
            @zaidkhan0997
          </span>
        </motion.div>
        
        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 pr-14 md:pr-16"
        >
          <a
            href="https://github.com/zaidkhan0997"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 backdrop-blur-md text-cyan-300 px-4 py-2 text-xs font-semibold transition-all hover:bg-cyan-500 hover:text-black hover:scale-105"
          >
            GitHub Profile
          </a>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-8 py-8 md:grid-cols-3">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="z-20 order-2 md:order-1 text-center md:text-left space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 shadow-sm backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            {subBadge}
          </div>

          <p className="mx-auto max-w-xs text-sm leading-relaxed text-white/80 md:mx-0 font-normal">
            {mainText}
          </p>

          {quote && (
            <p className="text-xs italic text-white/70 border-l-2 border-cyan-400 pl-3 py-0.5">
              {quote}
            </p>
          )}

          <div className="pt-2">
            <a
              href={readMoreLink}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 underline decoration-cyan-400 decoration-2 underline-offset-4 transition-all hover:text-cyan-200"
            >
              Explore Specialization &rarr;
            </a>
          </div>
        </motion.div>

        {/* Center Image with Glowing Aurora Gradient Halo */}
        <div className="relative order-1 md:order-2 flex justify-center items-center h-[320px] md:h-[420px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute z-0 h-[280px] w-[280px] rounded-full bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 opacity-75 blur-xl shadow-2xl md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="relative z-10 overflow-hidden rounded-2xl border-2 border-cyan-500/40 shadow-2xl bg-black/50 backdrop-blur-md"
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-64 w-52 md:h-80 md:w-64 lg:h-96 lg:w-72 object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Right Text - Gradient Text matching Aurora Palette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20 order-3 flex flex-col items-center justify-center text-center md:items-start md:text-left"
        >
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight select-none uppercase whitespace-nowrap">
            {overlayText.part1}{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-black">
              {overlayText.part2}
            </span>
          </h1>
          <p className="mt-2 text-xs font-mono text-cyan-300/60 tracking-widest uppercase">
            Xiaomi & Linux Kernel Architecture
          </p>
        </motion.div>
      </div>

      {/* Footer Elements */}
      <footer className="z-30 flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex items-center space-x-3"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex items-center gap-2 text-xs font-medium text-white/80"
        >
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          {locationText}
        </motion.div>
      </footer>
    </div>
  );
};
