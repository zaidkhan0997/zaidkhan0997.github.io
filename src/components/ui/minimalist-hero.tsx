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
    className="px-3.5 py-1.5 rounded-2xl text-xs font-semibold tracking-wider text-white/80 transition-all hover:text-cyan-300 border border-white/15 hover:border-cyan-400/50 bg-white/[0.03] hover:bg-white/[0.09] [transform:translateZ(0)] uppercase"
  >
    {children}
  </a>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-white/[0.08] text-white/80 backdrop-blur-md transition-all hover:border-cyan-300 hover:bg-cyan-400 hover:text-black hover:scale-110 shadow-sm"
  >
    <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
  </a>
);

// Reusable 3D Translucent Glass Tilt Card for Hero (GPU hardware accelerated to prevent mobile blinking)
const HeroCard3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable 3D tilt calculation on mobile to prevent GPU backdrop-filter re-paint blinking
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

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
        'rounded-3xl border border-white/20 bg-white/[0.04] p-5 sm:p-8 backdrop-blur-xl [transform:translateZ(0)] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.35)] hover:border-cyan-300/80 hover:bg-white/[0.09] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300 ease-out',
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
  const triggerMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-floating-menu'));
  };

  return (
    <div
      id="hero"
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-transparent p-4 sm:p-6 md:p-10 font-sans border-b border-white/10',
        className
      )}
    >
      {/* Top Flex Navigation Row - Header Bar + Separate Menu Pill aligned in ONE horizontal line */}
      <div className="z-30 flex w-full max-w-7xl items-center justify-between gap-3 mb-4">
        {/* Main 3D Glass Header Bar */}
        <header className="flex-1 flex h-12 items-center justify-between px-4 sm:px-6 rounded-3xl border border-white/20 bg-white/[0.04] backdrop-blur-xl [transform:translateZ(0)] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_8px_32px_rgba(0,0,0,0.35)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 sm:gap-2.5 text-base sm:text-lg md:text-xl font-bold tracking-wider text-white min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={imageSrc}
                  alt="MOHD ZAID"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-cyan-400/50 shadow-md"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-cyan-400 ring-2 ring-black" />
              </div>
              <span className="truncate">{logoText}</span>
            </div>
            <span className="hidden lg:inline-block rounded-full border border-cyan-400/30 bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-mono font-medium text-cyan-300">
              @zaidkhan0997
            </span>
          </motion.div>
          
          <div className="hidden items-center space-x-2 md:flex">
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
            className="hidden md:flex items-center gap-3 shrink-0"
          >
            <a
              href="https://github.com/zaidkhan0997"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/[0.08] text-cyan-300 px-4 py-2 text-xs font-semibold transition-all hover:bg-cyan-400 hover:text-black hover:scale-105 shadow-sm"
            >
              GitHub Profile
            </a>
          </motion.div>
        </header>

        {/* Separate 3D Glass Menu Pill Button (Aligned in ONE line with Header) */}
        <button
          onClick={triggerMenu}
          className="shrink-0 h-12 w-12 flex items-center justify-center rounded-3xl border border-white/20 bg-white/[0.04] text-cyan-300 backdrop-blur-xl [transform:translateZ(0)] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_8px_32px_rgba(0,0,0,0.35)] hover:border-cyan-300/80 hover:bg-cyan-400 hover:text-black hover:scale-105 transition-all focus:outline-none"
          title="Open Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-6 sm:gap-8 py-4 sm:py-8 md:grid-cols-3">
        {/* Left Text Content - 3D Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="z-20 order-2 md:order-1 flex justify-center md:justify-start"
        >
          <HeroCard3D className="space-y-4 text-center md:text-left w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/[0.08] px-3 py-1 text-xs font-medium text-cyan-300 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              {subBadge}
            </div>

            <p className="mx-auto max-w-xs text-xs sm:text-sm leading-relaxed text-white/80 md:mx-0 font-normal">
              {mainText}
            </p>

            {/* Glowing Colorful Highlighted Quote */}
            {quote && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/40 bg-white/[0.08] px-3.5 py-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <span className="text-xs font-medium text-white/90">
                  &quot;Be happy, <span className="text-cyan-300 font-extrabold not-italic drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">it drives people crazy.</span>&quot;
                </span>
              </div>
            )}

            <div className="pt-1">
              <a
                href={readMoreLink}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-300 underline decoration-cyan-400 decoration-2 underline-offset-4 transition-all hover:text-cyan-200"
              >
                Explore Specialization &rarr;
              </a>
            </div>
          </HeroCard3D>
        </motion.div>

        {/* Center Image - Spacious Circular 3D Glass Frame with Head Visible */}
        <div className="relative order-1 md:order-2 flex justify-center items-center h-[300px] sm:h-[380px] md:h-[460px]">
          <HeroCard3D className="!p-1.5 overflow-hidden !rounded-full border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.4)] bg-white/[0.04] backdrop-blur-xl">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-64 w-64 sm:h-76 sm:w-76 md:h-[340px] md:w-[340px] lg:h-[400px] lg:w-[400px] object-cover object-[50%_12%] rounded-full transition-transform duration-700 hover:scale-105"
            />
          </HeroCard3D>
        </div>

        {/* Right Text - 3D Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20 order-3 flex justify-center md:justify-start"
        >
          <HeroCard3D className="flex flex-col items-center justify-center text-center md:items-start md:text-left w-full">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl leading-tight select-none uppercase">
              {overlayText.part1}{' '}
              <span className="text-cyan-300 font-black">
                {overlayText.part2}
              </span>
            </h1>
            <p className="mt-2.5 text-[11px] sm:text-xs font-mono text-cyan-300/80 tracking-widest uppercase flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              Xiaomi &amp; Linux Kernel Architecture
            </p>
          </HeroCard3D>
        </motion.div>
      </div>

      {/* Footer Elements with 3D Glass Pills */}
      <footer className="z-30 flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex items-center space-x-2.5 rounded-full border border-white/20 bg-white/[0.03] p-1.5 sm:p-2 backdrop-blur-xl [transform:translateZ(0)] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25)]"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <HeroCard3D className="!p-2.5 !px-4 sm:!p-3 sm:!px-5 !rounded-full">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span>{locationText}</span>
            </div>
          </HeroCard3D>
        </motion.div>
      </footer>
    </div>
  );
};
