import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles, RefreshCw } from 'lucide-react';
import { fetchCloudStats } from '@/lib/statsApi';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

export const TerminalSection = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'neofetch',
      output: (
        <div className="space-y-1 text-xs font-mono">
          <p className="font-bold text-teal-300">
            zaidkhan0997@android-kernel-dev (MOHD ZAID)
          </p>
          <p className="text-white/80">OS: Linux (Kernel Architecture &amp; Xiaomi ROM maintainer)</p>
          <p className="text-white/60">
            Type <span className="text-teal-300 font-bold">&apos;help&apos;</span> to see available commands or <span className="text-teal-300 font-bold">&apos;whoami&apos;</span> for profile details.
          </p>
        </div>
      ),
    },
  ]);
  const [views, setViews] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            <p className="text-teal-300 font-bold">Available CLI Commands:</p>
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
            <p className="text-teal-300 font-bold">MOHD ZAID ( zaidkhan0997 )</p>
            <p>Android Custom ROM &amp; Linux Kernel Developer specializing in Xiaomi devices (lisa &amp; sweet).</p>
            <p>Passionate about AOSP bringup, C/C++, AnyKernel3 flashable zips, KernelSU root integration, and low-level system performance.</p>
            <p className="text-white/60">Location: Himachal Pradesh, India</p>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-teal-300 font-bold">Technical Skills:</p>
            <p>• Languages: C (95%), C++ (90%), Shell / Bash (92%), Python (78%), Makefile (88%)</p>
            <p>• Android Kernel: CPU Governors, DTB/DTS, KernelSU, RAM Management, Clang/GCC Toolchains</p>
            <p>• Devices: Xiaomi 11 Lite NE 5G (lisa), Redmi Note 10 Pro (sweet)</p>
          </div>
        );
        break;

      case 'repos':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-teal-300 font-bold">Featured Repositories:</p>
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
            <p className="text-teal-300 font-bold">Connect with MOHD ZAID:</p>
            <p>Email: <a href="mailto:kzaid0997@gmail.com" className="text-teal-300 underline">kzaid0997@gmail.com</a></p>
            <p>Telegram: <a href="https://t.me/zaidkhan0997" target="_blank" rel="noreferrer" className="text-teal-300 underline">t.me/zaidkhan0997</a></p>
            <p>GitHub: <a href="https://github.com/zaidkhan0997" target="_blank" rel="noreferrer" className="text-teal-300 underline">github.com/zaidkhan0997</a></p>
          </div>
        );
        break;

      case 'stats':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-teal-300">
            <p className="text-teal-300 font-bold">Analytics Overview:</p>
            <p>• Total Portfolio Visits: {views.toLocaleString()}</p>
            <p>• Total Global Likes: {likes.toLocaleString()}</p>
            <p>• Public Repositories: 58+</p>
            <p>• System Status: 100% Operational</p>
          </div>
        );
        break;

      case 'neofetch':
        outputNode = (
          <pre className="text-[10px] sm:text-xs text-teal-300 font-mono leading-tight">
{`   _____      _     _   _  ___                 
  |__  / __ _(_) __| | | |/ / |__   __ _ _ __  
    / / / _\` | |/ _\` | | ' /| '_ \\ / _\` | '_ \\ 
   / /_| (_| | | (_| | | . \\| | | | (_| | | | |
  /____|\\__,_|_|\\__,_| |_|\\_\\_| |_|\\__,_|_| |_|`}
          </pre>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        outputNode = (
          <p className="text-xs font-mono text-red-400">
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
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="inline-block rounded-full bg-teal-400/20 px-3.5 py-1 text-xs font-semibold text-teal-300 border border-teal-400/40 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            INTERACTIVE SHELL
          </span>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Developer CLI Terminal
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            Direct interactive console emulator. Test live commands like <code className="text-teal-300 font-mono bg-white/10 px-1.5 py-0.5 rounded">help</code>, <code className="text-teal-300 font-mono bg-white/10 px-1.5 py-0.5 rounded">whoami</code>, <code className="text-teal-300 font-mono bg-white/10 px-1.5 py-0.5 rounded">skills</code>, or <code className="text-teal-300 font-mono bg-white/10 px-1.5 py-0.5 rounded">stats</code>.
          </p>
        </motion.div>

        {/* Terminal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl frosted-glass-card"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/15 bg-white/[0.04] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80 border border-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80 border border-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-500/80 border border-green-400" />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-white/60">
              <TerminalIcon className="h-3.5 w-3.5 text-teal-300" />
              <span>zaidkhan0997@android-kernel:~</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Sparkles className="h-4 w-4 text-teal-300" />
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-4 sm:p-6 space-y-4 max-h-[380px] overflow-y-auto font-mono text-xs selection:bg-teal-400 selection:text-black">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-white/60">
                  <span className="text-teal-300 font-bold">mohdzaid@device-tree:~$</span>
                  <span className="text-white font-semibold">{item.command}</span>
                </div>
                <div className="pl-4 text-white/90">{item.output}</div>
              </div>
            ))}

            {/* Current Input Line */}
            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
              <span className="text-xs font-mono font-bold text-teal-300">mohdzaid@device-tree:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type a command (e.g. 'help', 'whoami')..."
                className="flex-1 bg-transparent text-xs font-mono text-white placeholder:text-white/30 focus:outline-none"
              />
              <button type="submit" className="text-white/60 hover:text-teal-300 transition-colors">
                <CornerDownLeft className="h-3.5 w-3.5" />
              </button>
            </form>
            <div ref={bottomRef} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
