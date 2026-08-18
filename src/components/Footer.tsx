import React from 'react';
import { ArrowUp, Github, Send, Mail, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent py-10 text-xs text-white/60 border-t border-white/10 relative z-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-white text-sm mb-1">
              MOHD ZAID <span className="text-cyan-400 font-mono">( zaidkhan0997 )</span>
            </p>
            <p className="text-xs text-white/60">
              Android Kernel & OS Developer &bull; Himachal Pradesh, India
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/zaidkhan0997"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors"
              title="GitHub"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://www.instagram.com/zaidkhan0997"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 transition-colors"
              title="Instagram"
            >
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://t.me/zaidkhan0997"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors"
              title="Telegram"
            >
              <Send className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/zaid-khan-a74948212/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
            <a
              href="mailto:kzaid0997@gmail.com"
              className="hover:text-cyan-400 transition-colors"
              title="Email"
            >
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-[11px] font-medium text-white/60">
              &copy; {currentYear} MOHD ZAID (zaidkhan0997). All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all hover:scale-110 shadow-sm"
              title="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
