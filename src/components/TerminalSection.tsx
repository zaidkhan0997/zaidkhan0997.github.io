import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles } from 'lucide-react';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

export const TerminalSection = () => {
  const [input, setInput] = useState('');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'welcome',
      output: (
        <div className="space-y-1 text-emerald-400 font-mono text-xs">
          <p className="font-bold text-cyan-300">
            Welcome to MOHD ZAID&apos;s Interactive Terminal! (zaidkhan0997)
          </p>
          <p className="text-white/70">
            Type <span className="text-cyan-300 font-bold">&apos;help&apos;</span> to see available commands or <span className="text-cyan-300 font-bold">&apos;whoami&apos;</span> for profile details.
          </p>
        </div>
      ),
    },
  ]);

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    let outputNode: React.ReactNode = null;

    switch (trimmed) {
      case 'help':
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-cyan-300 font-bold">Available CLI Commands:</p>
            <p><span className="text-purple-300 w-24 inline-block">whoami</span> - Display developer profile summary</p>
            <p><span className="text-purple-300 w-24 inline-block">skills</span> - List core technical skills</p>
            <p><span className="text-purple-300 w-24 inline-block">repos</span> - Show top open source repositories</p>
            <p><span className="text-purple-300 w-24 inline-block">contact</span> - Get direct email & Telegram handle</p>
            <p><span className="text-purple-300 w-24 inline-block">stats</span> - View portfolio engagement analytics</p>
            <p><span className="text-purple-300 w-24 inline-block">banner</span> - Show ascii terminal banner</p>
            <p><span className="text-purple-300 w-24 inline-block">clear</span> - Clear terminal screen</p>
          </div>
        );
        break;

      case 'whoami':
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-cyan-300 font-bold">MOHD ZAID ( zaidkhan0997 )</p>
            <p className="text-white/70">Role: Android Kernel Maintainer & C/C++ Developer</p>
            <p className="text-white/70">Location: Himachal Pradesh, India</p>
            <p className="text-white/70">Devices: Xiaomi 11 Lite NE 5G (lisa), Redmi Note 10 Pro (sweet)</p>
            <p className="text-emerald-400 italic">&quot;Be happy, it drives people crazy.&quot;</p>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-cyan-300 font-bold">Technical Skills:</p>
            <p>- C & C++ Low Level System Programming</p>
            <p>- Linux Kernel Optimization & Driver Patches</p>
            <p>- Device Tree Bringup (DTB / DTS)</p>
            <p>- KernelSU & Root Interface Driver Integration</p>
            <p>- Shell Scripting & AnyKernel3 Packaging</p>
          </div>
        );
        break;

      case 'repos':
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-cyan-300 font-bold">Featured Repositories:</p>
            <p>1. device_xiaomi_lisa [C++] - Xiaomi 11 Lite NE 5G Device Tree</p>
            <p>2. kernel_xiaomi_lisa [C] - Xiaomi 11 Lite NE 5G Linux Kernel</p>
            <p>3. android_kernel_xiaomi_sweet [C] - Redmi Note 10 Pro Kernel</p>
            <p>4. KernelSU [C] - Kernel Root Drivers & Patches</p>
            <p>5. AnyKernel3 [Shell] - Flashable Zip Kernel Patch Template</p>
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-cyan-300 font-bold">Connect with MOHD ZAID:</p>
            <p>Email: <a href="mailto:kzaid0997@gmail.com" className="text-cyan-300 underline">kzaid0997@gmail.com</a></p>
            <p>Telegram: <a href="https://t.me/zaidkhan0997" target="_blank" rel="noreferrer" className="text-cyan-300 underline">t.me/zaidkhan0997</a></p>
            <p>GitHub: <a href="https://github.com/zaidkhan0997" target="_blank" rel="noreferrer" className="text-cyan-300 underline">github.com/zaidkhan0997</a></p>
          </div>
        );
        break;

      case 'stats':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-cyan-300">
            <p className="text-cyan-300 font-bold">Analytics Overview:</p>
            <p>Total Views: 1,753,123</p>
            <p>Portfolio Likes: 1,518,437</p>
            <p>Public Repositories: 58+</p>
            <p>Commits & Trees: 100+</p>
          </div>
        );
        break;

      case 'banner':
        outputNode = (
          <pre className="text-[10px] sm:text-xs text-cyan-300 font-mono leading-tight">
{`  _______     _____ _____    ______       _    _  _____ _   _ 
 |___  /\\   |_   _|  __ \\  |___  /  /\\  |_|  | |/ ____| \\ | |
    / /  \\    | | | |  | |    / /  /  \\  _  __| | (___ |  \\| |
   / / /\\ \\   | | | |  | |   / /  / /\\ \\| |/ _\` |\\___ \\| . \` |
  / / ____ \\ _| |_| |__| |  / /__/ ____ \\ | (_| |____) | |\\  |
 /_/_/    \\_\\_____|_____/  /_____/_/    \\_|_|\\__,_|_____/|_| \\_|`}
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
            Command not found: &apos;{trimmed}&apos;. Type &apos;help&apos; for assistance.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: input, output: outputNode }]);
    setInput('');
  };

  return (
    <section id="terminal" className="bg-transparent py-20 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="inline-block rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/40 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            DEVELOPER INTERFACE
          </span>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Interactive CLI Terminal
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            Interact with MOHD ZAID&apos;s developer shell directly in your browser.
          </p>
        </motion.div>

        {/* 3D Translucent Glass Terminal Window Container */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/[0.03] backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_20px_50px_rgba(0,0,0,0.5)] hover:border-cyan-300/80 transition-all duration-300 ease-out"
        >
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between border-b border-white/15 bg-white/[0.06] px-5 py-3.5 backdrop-blur-3xl">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />
              <span className="h-3 w-3 rounded-full bg-yellow-500 shadow-sm" />
              <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white/80">
              <TerminalIcon className="h-3.5 w-3.5 text-cyan-300" />
              <span>mohdzaid@device-tree:~ (bash)</span>
            </div>

            <Sparkles className="h-4 w-4 text-cyan-300" />
          </div>

          {/* Terminal Output Body */}
          <div ref={terminalBodyRef} className="h-80 overflow-y-auto p-6 space-y-4 font-mono text-sm bg-black/35 backdrop-blur-2xl">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                {item.command !== 'welcome' && (
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span className="text-cyan-300 font-bold">mohdzaid@device-tree:~$</span>
                    <span>{item.command}</span>
                  </div>
                )}
                <div>{item.output}</div>
              </div>
            ))}
          </div>

          {/* Terminal Input Row */}
          <form onSubmit={handleCommand} className="border-t border-white/15 bg-white/[0.04] px-5 py-3.5 backdrop-blur-3xl">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-cyan-300">mohdzaid@device-tree:~$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type 'help' or 'whoami'..."
                className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-white/40 focus:outline-none"
              />
              <button type="submit" className="text-white/60 hover:text-cyan-300 transition-colors">
                <CornerDownLeft className="h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
