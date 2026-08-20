import React, { useState, useEffect } from 'react';
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
    className="px-3.5 py-1.5 rounded-2xl text-xs font-semibold tracking-wider text-white/85 transition-all hover:text-rose-300 frosted-glass-pill hover:bg-white/15 uppercase font-ubuntu"
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
    className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full frosted-glass-pill text-white/90 transition-all hover:border-rose-300 hover:bg-rose-500 hover:text-white hover:scale-110 shadow-md shrink-0 p-0 leading-none"
  >
    <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5.5 lg:w-5.5 shrink-0" />
  </a>
);

// Reusable Frosted Glass 3D Card for Hero
const HeroCard3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 1024) return;

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
        'frosted-glass-card rounded-3xl p-3.5 sm:p-5 lg:p-8 [transform:translateZ(0)]',
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-floating-menu'));
  };

  return (
    <div
      id="hero"
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-transparent p-3.5 sm:p-6 md:p-6 lg:p-10 pt-20 sm:pt-24 md:pt-28 font-sans border-b border-white/10',
        className
      )}
    >
      {/* Floating Animated Sticky Header Wrapper (Shrinks on Scroll) */}
      <div className="fixed top-2.5 sm:top-4 left-0 right-0 z-40 px-3 sm:px-6 flex justify-center pointer-events-none">
        <motion.div
          layout
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className={cn(
            'pointer-events-auto flex w-full items-center justify-between gap-2.5 sm:gap-3 transition-all duration-300 ease-out',
            isScrolled ? 'max-w-4xl' : 'max-w-7xl'
          )}
        >
          {/* Main Frosted Glass Header Bar */}
          <motion.header
            layout
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className={cn(
              'flex-1 flex items-center justify-between rounded-3xl frosted-glass-card transition-all duration-300 ease-out',
              isScrolled ? 'h-11 sm:h-12 px-3.5 sm:px-5' : 'h-12 sm:h-14 px-4 sm:px-6'
            )}
          >
            <div className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base md:text-lg font-bold tracking-wider text-white min-w-0">
              <div className="relative shrink-0">
                <img
                  src={imageSrc}
                  alt="MOHD ZAID"
                  className={cn(
                    'rounded-full object-cover border border-rose-400/50 shadow-md transition-all duration-300',
                    isScrolled ? 'h-7 w-7 sm:h-8 sm:w-8' : 'h-8 w-8 sm:h-9 sm:w-9'
                  )}
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500 ring-2 ring-black" />
              </div>
              <span className="whitespace-nowrap font-display font-black tracking-widest text-white uppercase text-xs sm:text-sm md:text-base">
                {logoText}
              </span>
              <span
                className={cn(
                  'rounded-full border border-rose-400/30 bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-mono font-medium text-rose-300 transition-all duration-300',
                  isScrolled ? 'hidden' : 'hidden xl:inline-block'
                )}
              >
                @zaidkhan0997
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden items-center space-x-1.5 lg:flex">
              {navLinks.map((link) => (
                <NavLink key={link.label} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <a
                href="https://github.com/zaidkhan0997"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full frosted-glass-pill text-rose-300 font-semibold transition-all hover:bg-rose-500 hover:text-white hover:scale-105 shadow-sm font-ubuntu',
                  isScrolled ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'
                )}
              >
                GitHub Profile
              </a>
            </div>
          </motion.header>

          {/* Separate Frosted Glass Menu Pill Button */}
          <button
            onClick={triggerMenu}
            className={cn(
              'shrink-0 flex items-center justify-center rounded-3xl frosted-glass-card text-rose-300 transition-all duration-300 ease-out hover:border-rose-300/80 hover:bg-rose-500 hover:text-white hover:scale-105 focus:outline-none',
              isScrolled ? 'h-11 w-11 sm:h-12 sm:w-12' : 'h-12 w-12 sm:h-14 sm:w-14'
            )}
            title="Open Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-5 w-5 stroke-[2.5]" />
          </button>
        </motion.div>
      </div>

      {/* Main Content Area - Tuned Grid Spacing for Tablet & Desktop */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-4 sm:gap-6 lg:gap-8 py-3 sm:py-6 lg:grid-cols-3">
        {/* Left Text Content - Frosted Glass Card matching reference */}
        <motion.div
          initial={{ opacity: 0, x: -35, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="z-20 order-3 lg:order-1 flex justify-center lg:justify-start w-full max-w-xl lg:max-w-none min-w-0 mx-auto lg:mx-0"
        >
          <HeroCard3D className="space-y-4 sm:space-y-5 text-left w-full !p-6 sm:!p-7">
            {/* Top Badge Pill */}
            <div>
              <div className="inline-flex items-center gap-2.5 rounded-full frosted-glass-pill px-4 py-1.5 text-xs font-semibold text-rose-300 font-ubuntu tracking-wide">
                <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(255,48,71,0.8)]" />
                <span>{subBadge}</span>
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-rose-300 leading-snug font-ubuntu">
                Android Custom ROM &amp; Linux Kernel Developer
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal font-ubuntu">
                specializing in <span className="text-rose-300 font-bold">Xiaomi devices (lisa &amp; sweet)</span>, AOSP bringup, C/C++, and low-level system software.
              </p>
            </div>

            {/* Quote Pill */}
            {quote && (
              <div>
                <div className="inline-flex items-center rounded-full frosted-glass-pill px-4 py-2">
                  <span className="text-xs font-normal text-white/80 font-ubuntu italic">
                    &quot;Be happy, <span className="text-rose-300 font-bold not-italic">it drives people crazy.</span>&quot;
                  </span>
                </div>
              </div>
            )}

            {/* Explore Specialization Link */}
            <div className="pt-1">
              <a
                href="#skills"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-300 underline decoration-rose-400 decoration-2 underline-offset-8 transition-all hover:text-rose-200 font-ubuntu"
              >
                Explore Specialization &rarr;
              </a>
            </div>
          </HeroCard3D>
        </motion.div>

        {/* Center Image - Frosted Circle Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 lg:order-2 flex justify-center items-center py-2"
        >
          <HeroCard3D className="!p-2 overflow-hidden !rounded-full frosted-glass-card shrink-0">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-52 w-52 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-[380px] lg:w-[380px] xl:h-[400px] xl:w-[400px] aspect-square object-cover object-[50%_12%] rounded-full transition-transform duration-700 hover:scale-105"
            />
          </HeroCard3D>
        </motion.div>

        {/* Right Column - Name Card + Aligned Social Links Pill Container */}
        <motion.div
          initial={{ opacity: 0, x: 35, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="z-20 order-2 lg:order-3 flex flex-col gap-2.5 sm:gap-3.5 items-center lg:items-start w-full max-w-xl lg:max-w-none min-w-0 mx-auto lg:mx-0"
        >
          {/* MOHD ZAID Name Card */}
          <HeroCard3D className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left w-full min-w-0">
            <h1 className="text-xl font-black tracking-widest text-white sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight select-none uppercase font-display">
              {overlayText.part1}{' '}
              <span className="text-rose-400 font-black drop-shadow-[0_0_14px_rgba(255,48,71,0.8)]">
                {overlayText.part2}
              </span>
            </h1>
            <p className="mt-1.5 sm:mt-2 text-[9px] sm:text-xs font-mono text-rose-300/80 tracking-widest uppercase flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(255,48,71,0.8)] shrink-0" />
              <span>Xiaomi &amp; Linux Kernel Architecture</span>
            </p>
          </HeroCard3D>

          {/* Separate Social Links Pill Container */}
          <div className="flex items-center justify-evenly w-full rounded-3xl frosted-glass-card px-1 py-2 sm:px-2.5 sm:py-2.5 [transform:translateZ(0)]">
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <HeroCard3D className="!p-2.5 !px-4 sm:!p-3 sm:!px-5 !rounded-full">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90 font-ubuntu">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(255,48,71,0.8)]" />
              <span>{locationText}</span>
            </div>
          </HeroCard3D>
        </motion.div>
      </footer>
    </div>
  );
};
