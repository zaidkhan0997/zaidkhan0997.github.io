import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CornerDownLeft, Sparkles } from 'lucide-react';
import { fetchCloudStats } from '@/lib/statsApi';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

const renderNeofetch = () => (
  <div className="space-y-1 text-xs font-mono">
    <p className="font-bold text-rose-400">
      zaidkhan0997@android-kernel-dev (MOHD ZAID)
    </p>
    <p className="text-white/80">OS: Linux (Kernel Architecture &amp; Xiaomi ROM maintainer)</p>
    <p className="text-white/60">
      Type <span className="text-rose-400 font-bold">&apos;help&apos;</span> to see available commands or <span className="text-rose-400 font-bold">&apos;whoami&apos;</span> for profile details.
    </p>
  </div>
);

export const TerminalSection = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'neofetch',
      output: renderNeofetch(),
    },
  ]);
  const [views, setViews] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);

  const historyContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    fetchCloudStats().then((data) => {
      setViews(data.views);
      setLikes(data.likes);
    });

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (typeof customEvent.detail.views === 'number') setViews(customEvent.detail.views);
        if (typeof customEvent.detail.likes === 'number') setLikes(customEvent.detail.likes);
      }
    };
    window.addEventListener('portfolio-cloud-stats-updated', handleSync);
    return () => window.removeEventListener('portfolio-cloud-stats-updated', handleSync);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop = historyContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let outputNode: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-rose-400 font-bold">Available CLI Commands:</p>
            <p><span className="text-white font-semibold">whoami</span> - Display Mohd Zaid developer bio &amp; focus</p>
            <p><span className="text-white font-semibold">skills</span> - List low-level languages, AOSP &amp; kernel stack</p>
            <p><span className="text-white font-semibold">repos</span> - List featured GitHub trees (lisa, sweet, KernelSU)</p>
            <p><span className="text-white font-semibold">stats</span> - View real-time views &amp; engagement metrics</p>
            <p><span className="text-white font-semibold">contact</span> - Display email, Telegram &amp; socials</p>
            <p><span className="text-white font-semibold">clear</span> - Clear terminal session output</p>
            <p><span className="text-white font-semibold">neofetch</span> - Re-display developer system banner</p>
          </div>
        );
        break;

      case 'whoami':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-rose-400 font-bold">MOHD ZAID ( zaidkhan0997 )</p>
            <p>Android Custom ROM &amp; Linux Kernel Developer specializing in Xiaomi devices (lisa &amp; sweet).</p>
            <p>Passionate about AOSP bringup, C/C++, AnyKernel3 flashable zips, KernelSU root integration, and low-level system performance.</p>
            <p className="text-white/60">Location: Himachal Pradesh, India</p>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-rose-400 font-bold">Technical Skills:</p>
            <p>• Languages: C (95%), C++ (90%), Shell / Bash (92%), Python (78%), Makefile (88%)</p>
            <p>• Android Kernel: CPU Governors, DTB/DTS, KernelSU, RAM Management, Clang/GCC Toolchains</p>
            <p>• Devices: Xiaomi 11 Lite NE 5G (lisa), Redmi Note 10 Pro (sweet)</p>
          </div>
        );
        break;

      case 'repos':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-rose-400 font-bold">Featured Repositories:</p>
            <p>• device_xiaomi_lisa - Android Device Tree For Xiaomi 11 Lite NE 5G</p>
            <p>• kernel_xiaomi_lisa - Linux Kernel Tree with performance tweaks</p>
            <p>• android_kernel_xiaomi_sweet - Kernel Source for Redmi Note 10 Pro</p>
            <p>• KernelSU - Android kernel-level root solution</p>
            <p>• GoFile-Upload - CLI file upload tool in Shell</p>
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-rose-400 font-bold">Connect with MOHD ZAID:</p>
            <p>Email: <a href="mailto:kzaid0997@gmail.com" className="text-rose-400 underline">kzaid0997@gmail.com</a></p>
            <p>Telegram: <a href="https://t.me/zaidkhan0997" target="_blank" rel="noreferrer" className="text-rose-400 underline">t.me/zaidkhan0997</a></p>
            <p>GitHub: <a href="https://github.com/zaidkhan0997" target="_blank" rel="noreferrer" className="text-rose-400 underline">github.com/zaidkhan0997</a></p>
          </div>
        );
        break;

      case 'stats':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-rose-300">
            <p className="text-rose-400 font-bold">Analytics Overview:</p>
            <p>• Total Portfolio Visits: {views.toLocaleString()}</p>
            <p>• Total Global Likes: {likes.toLocaleString()}</p>
            <p>• Public Repositories: 58+</p>
            <p>• System Status: 100% Operational</p>
          </div>
        );
        break;

      case 'neofetch':
        outputNode = renderNeofetch();
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        outputNode = (
          <p className="text-xs font-mono text-rose-300">
            Command not recognized: &apos;{input}&apos;. Type &apos;help&apos; for list of commands.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: input, output: outputNode }]);
    setInput('');
  };

  return (
    <section id="terminal" className="bg-transparent py-20 border-b border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="inline-block rounded-full bg-rose-500/20 px-3.5 py-1 text-xs font-semibold text-rose-300 border border-rose-400/40 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            INTERACTIVE SHELL
          </span>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Developer CLI
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            Interact with MOHD ZAID&apos;s developer workstation directly from your browser.
          </p>
        </motion.div>

        {/* Terminal Window - Pure Frosted Glass Card matching reference exactly */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto rounded-3xl frosted-glass-card overflow-hidden flex flex-col h-[280px] sm:h-[300px]"
        >
          {/* Header Bar */}
          <div className="grid grid-cols-3 items-center px-4 sm:px-5 py-3.5 border-b border-white/10 bg-white/[0.02] shrink-0">
            {/* Left: macOS dots */}
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-sm" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-sm" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-sm" />
            </div>

            {/* Center: Centered command prompt title */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-white/90 truncate">
              <span className="text-rose-400 font-bold">&gt;_</span>
              <span className="truncate">zaidkhan0997@android-kernel-dev:~</span>
            </div>

            {/* Right: Sparkle & Version pill */}
            <div className="flex items-center justify-end gap-1 text-xs font-mono text-rose-300/90">
              <Sparkles className="h-3 w-3 text-rose-400" />
              <span>v2.5</span>
            </div>
          </div>

          {/* Terminal Body - Single seamless container with bottom input */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex-1 p-4 sm:p-6 flex flex-col justify-between font-mono text-xs cursor-text overflow-hidden"
          >
            {/* History Output Area */}
            <div
              ref={historyContainerRef}
              className="overflow-y-auto space-y-4 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {history.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="text-rose-400 font-bold">zaidkhan0997@dev:~$</span>
                    <span>{item.command}</span>
                  </div>
                  <div className="text-white/80 pl-3 sm:pl-4 border-l-2 border-rose-500/30">
                    {item.output}
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt Input Form at the bottom without any divider line */}
            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-4 shrink-0">
              <span className="text-rose-400 font-bold shrink-0">zaidkhan0997@dev:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type 'help', 'whoami', 'skills'..."
                className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none font-mono text-xs caret-rose-400"
              />
              <button
                type="submit"
                className="text-white/40 hover:text-rose-400 transition-colors p-1"
                title="Execute Command"
              >
                <CornerDownLeft className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
