import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Github, Send, Mail, Instagram, Linkedin } from 'lucide-react';

// Reusable 3D Translucent Glass Tilt Card Wrapper for Footer Bar
const FooterGlassCard3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 768) return;
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
      className={`frosted-glass-card rounded-3xl p-6 ${className}`}
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
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
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

              {/* Enlarged Social Links Pill */}
              <div className="flex items-center space-x-3 rounded-full border border-white/20 bg-white/[0.03] p-2.5 sm:p-3 backdrop-blur-md shadow-md">
                <a
                  href="https://github.com/zaidkhan0997"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/90 hover:border-rose-300 hover:bg-rose-500 hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="GitHub"
                >
                  <Github className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </a>
                <a
                  href="https://www.instagram.com/zaidkhan0997"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/90 hover:border-rose-300 hover:bg-rose-500 hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </a>
                <a
                  href="https://t.me/zaidkhan0997"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/90 hover:border-rose-300 hover:bg-rose-500 hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="Telegram"
                >
                  <Send className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/zaid-khan-a74948212/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/90 hover:border-rose-300 hover:bg-rose-500 hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </a>
                <a
                  href="mailto:kzaid0997@gmail.com"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/90 hover:border-rose-300 hover:bg-rose-500 hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="Email"
                >
                  <Mail className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </a>
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-white/80 hover:border-rose-300 hover:bg-rose-500 hover:text-white transition-all hover:scale-105 shadow-sm"
              >
                <span>Back to top</span>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/50">
              <p>&copy; 2026 MOHD ZAID (zaidkhan0997). All rights reserved.</p>
              <p className="mt-2 md:mt-0 font-mono text-rose-300/80">
                Built with React, Tailwind CSS, Framer Motion &amp; Three.js
              </p>
            </div>
          </FooterGlassCard3D>
        </motion.div>
      </div>
    </footer>
  );
};
