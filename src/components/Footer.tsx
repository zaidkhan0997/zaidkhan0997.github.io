import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Github, Send, Mail, Instagram, Linkedin } from 'lucide-react';

// Reusable 3D Translucent Glass Tilt Card Wrapper for Footer Bar
const FooterGlassCard3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -6);
    setRotateY(((x - centerX) / centerX) * 6);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={`rounded-3xl border border-white/20 bg-white/[0.04] p-6 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.35)] hover:border-rose-300/80 hover:bg-white/[0.09] hover:shadow-[0_0_35px_rgba(244,63,94,0.4)] transition-all duration-300 ease-out ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent py-10 text-xs text-white/70 relative z-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <FooterGlassCard3D>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                <span>MOHD ZAID</span>
                <span className="rounded-full border border-rose-400/30 bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-mono text-rose-300 backdrop-blur-md">
                  zaidkhan0997
                </span>
              </p>
              <p className="text-xs text-white/60">
                Android Kernel &amp; OS Developer &bull; Himachal Pradesh, India
              </p>
            </div>

            {/* Social Links Pill */}
            <div className="flex items-center space-x-2.5 rounded-full border border-white/20 bg-white/[0.03] p-2 backdrop-blur-md shadow-sm">
              <a
                href="https://github.com/zaidkhan0997"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 hover:border-rose-300 hover:bg-rose-400 hover:text-black transition-all hover:scale-110"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/zaidkhan0997"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 hover:border-rose-300 hover:bg-rose-400 hover:text-black transition-all hover:scale-110"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/zaidkhan0997"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 hover:border-rose-300 hover:bg-rose-400 hover:text-black transition-all hover:scale-110"
                title="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/zaid-khan-a74948212/"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 hover:border-rose-300 hover:bg-rose-400 hover:text-black transition-all hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:kzaid0997@gmail.com"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 hover:border-rose-300 hover:bg-rose-400 hover:text-black transition-all hover:scale-110"
                title="Email Inbox"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-[11px] font-medium text-white/60">
                &copy; {currentYear} MOHD ZAID (zaidkhan0997). All rights reserved.
              </p>

              <button
                onClick={scrollToTop}
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 backdrop-blur-md transition-all hover:border-rose-300 hover:bg-rose-400 hover:text-black hover:scale-110 shadow-sm"
                title="Back to top"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </FooterGlassCard3D>
      </div>
    </footer>
  );
};
