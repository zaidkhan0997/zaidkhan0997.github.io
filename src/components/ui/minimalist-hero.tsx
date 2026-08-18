import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Menu } from 'lucide-react';
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
    className="px-3.5 py-1.5 rounded-2xl text-xs font-semibold tracking-wider text-white/80 transition-all hover:text-rose-300 border border-white/15 hover:border-rose-400/50 bg-white/[0.03] hover:bg-white/[0.09] [transform:translateZ(0)] uppercase font-ubuntu"
  >
    {children}
  </a>
);

// Responsive optically centered Social Icon button (guaranteed 100% inside card bounds on all screens)
const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-8 w-8 sm:h-10 sm:w-10 md:h-7.5 md:w-7.5 lg:h-11 lg:w-11 items-center justify-center rounded-full border border-rose-400/40 bg-white/[0.08] text-white/90 backdrop-blur-md transition-all hover:border-rose-300 hover:bg-rose-400 hover:text-black hover:scale-110 shadow-md shrink-0 p-0 leading-none"
  >
    <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-3.5 md:w-3.5 lg:h-5.5 lg:w-5.5 shrink-0" />
  </a>
);

// Reusable 3D Translucent Glass Tilt Card for Hero (GPU hardware accelerated to prevent mobile blinking)
const HeroCard3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable 3D tilt calculation on small screens to prevent GPU backdrop-filter re-paint blinking
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={cn(
        'rounded-3xl border border-white/20 bg-white/[0.04] p-3.5 sm:p-5 lg:p-8 backdrop-blur-xl [transform:translateZ(0)] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.35)] hover:border-rose-300/80 hover:bg-white/[0.09] hover:shadow-[0_0_40px_rgba(244,63,94,0.4)] transition-all duration-300 ease-out',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MinimalistHero = ({
  logoText,
  navLinks,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
  subBadge = "Android Kernel & OS Developer",
  quote = '"Be happy, it drives people crazy."'
}: MinimalistHeroProps) => {
  const triggerMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-floating-menu'));
  };

  return (
    <div
      id="hero"
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-transparent p-3.5 sm:p-6 md:p-6 lg:p-10 font-sans border-b border-white/10',
        className
      )}
    >
      {/* Top Flex Navigation Row - Header Bar + Separate Menu Pill aligned in ONE horizontal line */}
      <div className="z-30 flex w-full max-w-7xl items-center justify-between gap-3 mb-3 sm:mb-4">
        {/* Main 3D Glass Header Bar */}
        <header className="flex-1 flex h-12 items-center justify-between px-3.5 sm:px-6 rounded-3xl border border-white/20 bg-white/[0.04] backdrop-blur-xl [transform:translateZ(0)] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_8px_32px_rgba(0,0,0,0.35)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wider text-white min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={imageSrc}
                  alt="MOHD ZAID"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-rose-400/50 shadow-md"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-400 ring-2 ring-black" />
              </div>
              {/* High-Contrast Elegist Serif for MOHD ZAID name - Full display without truncation */}
              <span className="whitespace-nowrap font-display font-black tracking-widest text-white uppercase">{logoText}</span>
            </div>
            <span className="hidden xl:inline-block rounded-full border border-rose-400/30 bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-mono font-medium text-rose-300">
              @zaidkhan0997
            </span>
          </motion.div>
          
          {/* Navigation Links - Hidden on Tablet (lg:flex) to leave header clean for floating drawer menu */}
          <div className="hidden items-center space-x-2 lg:flex">
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
            className="hidden lg:flex items-center gap-3 shrink-0"
          >
            <a
              href="https://github.com/zaidkhan0997"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-white/[0.08] text-rose-300 px-4 py-2 text-xs font-semibold transition-all hover:bg-rose-400 hover:text-black hover:scale-105 shadow-sm font-ubuntu"
            >
              GitHub Profile
            </a>
          </motion.div>
        </header>

        {/* Separate 3D Glass Menu Pill Button */}
        <button
          onClick={triggerMenu}
          className="shrink-0 h-12 w-12 flex items-center justify-center rounded-3xl border border-white/20 bg-white/[0.04] text-rose-300 backdrop-blur-xl [transform:translateZ(0)] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_8px_32px_rgba(0,0,0,0.35)] hover:border-rose-300/80 hover:bg-rose-400 hover:text-black hover:scale-105 transition-all focus:outline-none"
          title="Open Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Content Area - Tuned Grid Spacing for Tablet & Desktop */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-4 sm:gap-6 md:gap-3 lg:gap-8 py-3 sm:py-6 md:grid-cols-3">
        {/* Left Text Content - 3D Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="z-20 order-2 md:order-1 flex justify-center md:justify-start min-w-0"
        >
          <HeroCard3D className="space-y-2.5 sm:space-y-4 text-center md:text-left w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-white/[0.08] px-3 py-1 text-[10px] sm:text-xs font-semibold text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)] font-ubuntu tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
              {subBadge}
            </div>

            <p className="mx-auto max-w-xs text-xs sm:text-sm leading-relaxed text-white/80 md:mx-0 font-normal font-ubuntu">
              <span className="text-rose-300 font-extrabold drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">Android Custom ROM &amp; Linux Kernel Developer</span> specializing in <span className="text-rose-300 font-bold">Xiaomi devices (lisa &amp; sweet)</span>, AOSP bringup, C/C++, and low-level system software.
            </p>

            {/* Quote with Rose Pink Highlight */}
            {quote && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/40 bg-white/[0.08] px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <span className="text-[10px] sm:text-xs font-medium text-white/90 font-ubuntu italic">
                  &quot;Be happy, <span className="text-rose-300 font-extrabold not-italic drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">it drives people crazy.</span>&quot;
                </span>
              </div>
            )}

            <div className="pt-0.5">
              <a
                href="#skills"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-300 underline decoration-rose-400 decoration-2 underline-offset-4 transition-all hover:text-rose-200 font-ubuntu"
              >
                Explore Specialization &rarr;
              </a>
            </div>
          </HeroCard3D>
        </motion.div>

        {/* Center Image - Perfectly Proportioned Aspect Square Circle Frame */}
        <div className="relative order-1 md:order-2 flex justify-center items-center py-2">
          <HeroCard3D className="!p-1.5 overflow-hidden !rounded-full border-2 border-rose-400/50 shadow-[0_0_50px_rgba(244,63,94,0.4)] bg-white/[0.04] backdrop-blur-xl shrink-0">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-52 w-52 sm:h-64 sm:w-64 md:h-48 md:w-48 lg:h-[380px] lg:w-[380px] xl:h-[400px] xl:w-[400px] aspect-square object-cover object-[50%_12%] rounded-full transition-transform duration-700 hover:scale-105"
            />
          </HeroCard3D>
        </div>

        {/* Right Column - Name Card + Separate Aligned Social Links Pill Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20 order-3 flex flex-col gap-2.5 sm:gap-3.5 items-center md:items-start w-full min-w-0"
        >
          {/* MOHD ZAID Name Card */}
          <HeroCard3D className="flex flex-col items-center justify-center text-center md:items-start md:text-left w-full min-w-0">
            <h1 className="text-xl font-black tracking-widest text-white sm:text-3xl md:text-xl lg:text-4xl xl:text-5xl leading-tight select-none uppercase font-display">
              {overlayText.part1}{' '}
              <span className="text-rose-300 font-black drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]">
                {overlayText.part2}
              </span>
            </h1>
            <p className="mt-1.5 sm:mt-2 text-[9px] sm:text-xs font-mono text-rose-300/80 tracking-widest uppercase flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)] shrink-0" />
              <span>Xiaomi &amp; Linux Kernel Architecture</span>
            </p>
          </HeroCard3D>

          {/* Separate Social Links Pill Container - Symmetrically even spacing guarantees 100% inner fit on tablet */}
          <div className="flex items-center justify-evenly w-full rounded-3xl border border-white/20 bg-white/[0.04] px-1 py-2 sm:px-2.5 sm:py-2.5 backdrop-blur-xl [transform:translateZ(0)] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.3)]">
            {socialLinks.map((link, index) => (
              <SocialIcon key={index} href={link.href} icon={link.icon} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Row */}
      <footer className="z-30 flex w-full max-w-7xl items-center justify-end gap-3 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <HeroCard3D className="!p-2.5 !px-4 sm:!p-3 sm:!px-5 !rounded-full">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90 font-ubuntu">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <span>{locationText}</span>
            </div>
          </HeroCard3D>
        </motion.div>
      </footer>
    </div>
  );
};
