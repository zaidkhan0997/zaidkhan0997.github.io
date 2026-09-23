import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CornerDownLeft, Sparkles, Volume2, VolumeX, Terminal as TerminalIcon } from 'lucide-react';
import { fetchCloudStats } from '@/lib/statsApi';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

// Subtle mechanical key sound synthesizer using Web Audio API (Zero external assets)
class SoundFx {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    if ('userActivation' in navigator && navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          // Safe
        }
      }
    }
  }

  playKey() {
    if (!this.enabled) return;
    if (typeof navigator !== 'undefined' && 'userActivation' in navigator && navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Low mechanical thud frequency
      osc.frequency.setValueAtTime(140 + Math.random() * 40, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext policy safe
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.06); // A5
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // AudioContext policy safe
    }
  }
}

const sound = new SoundFx();

const ASCII_ANDROID = `
       __    __
      /  \\  /  \\
     |    \\/    |
   .----------------.
  /  [•]      [•]   \\    zaidkhan0997@android-kernel-dev
 |                    |   -------------------------------
 |    ============    |   OS: Android / Linux 6.1.75-zaidkhan-perf+
  \\                  /    Host: Xiaomi 11 Lite 5G NE (lisa) & sweet
   '----------------'     Kernel: Clang 17.0.2 + ThinLTO + Polly
    |  |  ||  |  |        Root: KernelSU v0.9.5 Hook Active
    |  |  ||  |  |        Uptime: 247 days, 13 hours, 37 mins
    '--'  ''  '--'        Shell: zsh 5.9 / custom AOSP recovery
`;

const DMESG_SAMPLE = [
  '[    0.000000] Linux version 6.1.75-zaidkhan-perf+ (zaid@build-box) (clang version 17.0.2)',
  '[    0.000000] Command line: console=ttyMSM0,115200n8 earlycon androidboot.hardware=qcom',
  '[    0.014291] smp: Bringing up secondary CPUs ...',
  '[    0.021040] smp: Brought up 1 node, 8 CPUs (Kryo 670 Gold/Silver)',
  '[    0.082103] devicetree: overlay applied: lisa-perf-overlay.dtbo (ok)',
  '[    0.142099] ufs: scsi 0:0:0:0: Direct-Access UFS Micron 128GB (ufs-bsg ready)',
  '[    0.312984] KernelSU: v0.9.5-release hook installed into sys_execve successfully',
  '[    0.450121] init: starting service \'adbd\'...',
  '[    0.612019] init: mounting /dev/block/by-name/system_ext -> /system_ext (ext4, ro)',
  '[    0.781204] init: mounting /dev/block/by-name/vendor -> /vendor (ext4, ro)',
  '[    1.120401] surfaceflinger: Display 1080x2400 @ 120Hz HDR10+ calibrated',
  '[    1.500312] [ OK ] Reached target Graphical Interface & Web Runtime.',
];

interface TerminalSectionProps {
  onTriggerMatrix?: () => void;
  onTriggerKernelPanic?: () => void;
  onTriggerReboot?: () => void;
}

export const TerminalSection: React.FC<TerminalSectionProps> = ({
  onTriggerMatrix,
  onTriggerKernelPanic,
  onTriggerReboot,
}) => {
  const [input, setInput] = useState('');
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashProgress, setFlashProgress] = useState(0);
  const [flashDevice, setFlashDevice] = useState<'lisa' | 'sweet' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Command history buffer for up/down arrows
  const [commandHistory, setCommandHistory] = useState<string[]>(['neofetch']);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'neofetch',
      output: (
        <div className="space-y-1 text-xs font-mono">
          <pre className="text-cyan-400 font-bold overflow-x-auto text-[10px] sm:text-xs leading-tight">
            {ASCII_ANDROID}
          </pre>
          <p className="text-white/70 pt-1">
            Type <span className="text-cyan-400 font-bold">&apos;help&apos;</span> to explore interactive kernel commands, or run <span className="text-emerald-400 font-bold">&apos;flash lisa&apos;</span>.
          </p>
        </div>
      ),
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
  }, [history, flashProgress]);

  // Flash simulator timer
  useEffect(() => {
    if (!isFlashing || !flashDevice) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFlashProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsFlashing(false);
        sound.playSuccess();
        setHistory((prev) => [
          ...prev,
          {
            command: `flash ${flashDevice}`,
            output: (
              <div className="space-y-1.5 text-xs font-mono text-emerald-400">
                <p className="font-bold">[SUCCESS] Flashed Kernel &amp; Modules for {flashDevice.toUpperCase()}</p>
                <p className="text-white/80">&gt; Target Partition: boot_a &amp; vendor_boot_a</p>
                <p className="text-white/80">&gt; Image: kernel-6.1.75-zaidkhan-perf+.img (Size: 64MB)</p>
                <p className="text-amber-300">&gt; KernelSU Module: Hook verified and granted root permissions.</p>
                <p className="text-cyan-400 font-bold">&gt; Device rebooting into Android 14 (AOSP)... 🚀</p>
              </div>
            ),
          },
        ]);
        setFlashDevice(null);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [isFlashing, flashDevice]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  const executeCommandString = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    sound.playKey();
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const lower = cmd.toLowerCase();

    // 1. Matrix
    if (lower === 'matrix') {
      if (onTriggerMatrix) onTriggerMatrix();
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: <p className="text-emerald-400 font-mono text-xs">Launching Matrix glyph rain simulation...</p>,
        },
      ]);
      setInput('');
      return;
    }

    // 2. Kernel Panic
    if (lower === 'kernel panic' || lower === 'panic') {
      if (onTriggerKernelPanic) onTriggerKernelPanic();
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: (
            <p className="text-red-400 font-mono text-xs font-bold animate-pulse">
              [CRITICAL] Kernel panic triggered! Injecting page fault...
            </p>
          ),
        },
      ]);
      setInput('');
      return;
    }

    // 3. Reboot (Boot Sequence)
    if (lower === 'reboot' || lower === 'fastboot reboot' || lower === 'boot') {
      if (onTriggerReboot) onTriggerReboot();
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: <p className="text-cyan-400 font-mono text-xs">Rebooting system into Boot Sequence...</p>,
        },
      ]);
      setInput('');
      return;
    }

    // 4. Flash device simulator
    if (lower === 'flash lisa' || lower === 'flash sweet') {
      const dev = lower.includes('lisa') ? 'lisa' : 'sweet';
      setFlashDevice(dev);
      setIsFlashing(true);
      setFlashProgress(0);
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: (
            <div className="space-y-1 text-xs font-mono text-cyan-300">
              <p className="text-white font-semibold">&gt; Connecting to Fastboot device: {dev.toUpperCase()}...</p>
              <p>&gt; Validating signature &amp; partition tables...</p>
              <p className="text-amber-300 animate-pulse">&gt; Flashing boot image. Please do not disconnect device...</p>
            </div>
          ),
        },
      ]);
      setInput('');
      return;
    }

    let outputNode: React.ReactNode = null;

    switch (lower) {
      case 'help':
        outputNode = (
          <div className="space-y-3 text-xs font-mono">
            <div className="text-cyan-400 font-bold border-b border-cyan-500/30 pb-1">
              AVAILABLE WORKSTATION COMMANDS:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/80">
              <div>
                <p className="text-cyan-300 font-semibold mb-1">⚙️ Kernel &amp; Hardware</p>
                <p><span className="text-white font-bold">flash lisa</span> - Flash kernel on Xiaomi 11 Lite 5G</p>
                <p><span className="text-white font-bold">flash sweet</span> - Flash kernel on Redmi Note 10 Pro</p>
                <p><span className="text-white font-bold">dmesg</span> - Stream kernel ring buffer logs</p>
                <p><span className="text-white font-bold">kernel panic</span> - Simulate system crash &amp; recovery</p>
              </div>
              <div>
                <p className="text-cyan-300 font-semibold mb-1">🎮 Visual FX &amp; System</p>
                <p><span className="text-white font-bold">matrix</span> - Full-screen digital rain</p>
                <p><span className="text-white font-bold">reboot</span> - Re-trigger cinematic boot sequence</p>
                <p><span className="text-white font-bold">neofetch</span> - System specs &amp; ASCII art</p>
                <p><span className="text-white font-bold">clear</span> - Clear current terminal buffer</p>
              </div>
              <div>
                <p className="text-cyan-300 font-semibold mb-1">👤 Developer Bio</p>
                <p><span className="text-white font-bold">whoami</span> - Developer summary</p>
                <p><span className="text-white font-bold">whoami --full</span> - Deep dive &amp; hardware specs</p>
                <p><span className="text-white font-bold">cat README.md</span> - Print portfolio README</p>
              </div>
              <div>
                <p className="text-cyan-300 font-semibold mb-1">🔗 Project &amp; Social</p>
                <p><span className="text-white font-bold">ls</span> / <span className="text-white font-bold">repos</span> - List GitHub trees</p>
                <p><span className="text-white font-bold">skills</span> - Full low-level stack</p>
                <p><span className="text-white font-bold">contact</span> - Email, Telegram &amp; GitHub links</p>
                <p><span className="text-white font-bold">stats</span> - Real-time cloud visits &amp; likes</p>
              </div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-cyan-400 font-bold">MOHD ZAID ( zaidkhan0997 )</p>
            <p>Android Custom ROM &amp; Linux Kernel Developer specializing in Xiaomi devices (lisa &amp; sweet).</p>
            <p>Passionate about AOSP bringup, C/C++, AnyKernel3 flashable zips, KernelSU root integration, and low-level system performance.</p>
            <p className="text-white/60">Location: Himachal Pradesh, India</p>
            <p className="text-cyan-300/80 pt-1">Tip: Run <span className="font-bold underline text-cyan-300">&apos;whoami --full&apos;</span> for hardware specs &amp; philosophy.</p>
          </div>
        );
        break;

      case 'whoami --full':
        outputNode = (
          <div className="space-y-2 text-xs font-mono text-white/80">
            <p className="text-cyan-400 font-bold">MOHD ZAID // FULL DEVELOPER PROFILE</p>
            <p>
              Developer dedicated to high-performance Android kernels, low-latency CPU governor tuning, display overclocking, and clean upstream merges.
            </p>
            <div className="space-y-0.5 text-white/70">
              <p>&bull; Primary Devices: Xiaomi 11 Lite 5G NE (<span className="text-cyan-300">lisa</span>), Redmi Note 10 Pro (<span className="text-cyan-300">sweet</span>)</p>
              <p>&bull; Specializations: AnyKernel3, KernelSU, DTB/DTS patches, Clang/ThinLTO optimization, binder IPC</p>
              <p>&bull; Development Box: Arch Linux / Pop!_OS x86_64, Ryzen 7, 32GB RAM</p>
              <p>&bull; Motto: &ldquo;Be happy, it drives people crazy.&rdquo;</p>
            </div>
          </div>
        );
        break;

      case 'cat readme.md':
      case 'cat readme':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80 border-l-2 border-cyan-400/40 pl-3">
            <p className="text-cyan-400 font-bold"># MOHD ZAID &mdash; Portfolio README</p>
            <p>Welcome to my personal developer workstation and portfolio.</p>
            <p>Here you will find my custom kernel sources, AOSP device trees, and low-level tools.</p>
            <p className="text-emerald-400 font-semibold">&gt; Website: https://zaidkhan0997.pages.dev/</p>
            <p className="text-white/60">&gt; Built with React, Tailwind CSS, Framer Motion &amp; Linux Aesthetics.</p>
          </div>
        );
        break;

      case 'dmesg':
        outputNode = (
          <div className="space-y-0.5 text-[11px] sm:text-xs font-mono text-cyan-300/90">
            {DMESG_SAMPLE.map((line, i) => (
              <p key={i} className={line.includes('[ OK ]') ? 'text-emerald-400' : line.includes('KernelSU') ? 'text-amber-400 font-semibold' : ''}>
                {line}
              </p>
            ))}
          </div>
        );
        break;

      case 'ls':
      case 'ls repos':
      case 'repos':
        outputNode = (
          <div className="space-y-1.5 text-xs font-mono text-white/80">
            <p className="text-cyan-400 font-bold">REPOSITORIES &amp; DEVICE TREES (drwxr-xr-x):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <a href="https://github.com/zaidkhan0997/device_xiaomi_lisa" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
                📁 device_xiaomi_lisa <span className="text-white/50">(AOSP Device Tree)</span>
              </a>
              <a href="https://github.com/zaidkhan0997/kernel_xiaomi_lisa" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
                📁 kernel_xiaomi_lisa <span className="text-white/50">(Perf Kernel Source)</span>
              </a>
              <a href="https://github.com/zaidkhan0997/android_kernel_xiaomi_sweet" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
                📁 android_kernel_xiaomi_sweet <span className="text-white/50">(RN10 Pro Kernel)</span>
              </a>
              <a href="https://github.com/zaidkhan0997/KernelSU" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
                📁 KernelSU <span className="text-white/50">(Kernel-level Root Solution)</span>
              </a>
              <a href="https://github.com/zaidkhan0997/GoFile-Upload" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">
                📁 GoFile-Upload <span className="text-white/50">(Shell Uploader Tool)</span>
              </a>
            </div>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-cyan-400 font-bold">TECHNICAL SKILLS MATRIX:</p>
            <p>&bull; Languages: C (95%), C++ (90%), Shell / Bash (92%), Python (78%), Makefile (88%)</p>
            <p>&bull; Android Kernel: CPU Governors, DTB/DTS, KernelSU, RAM Management, Clang/GCC Toolchains</p>
            <p>&bull; Devices: Xiaomi 11 Lite NE 5G (lisa), Redmi Note 10 Pro (sweet)</p>
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-white/80">
            <p className="text-cyan-400 font-bold">CONNECT WITH MOHD ZAID:</p>
            <p>Email: <a href="mailto:kzaid0997@gmail.com" className="text-cyan-400 underline">kzaid0997@gmail.com</a></p>
            <p>Telegram: <a href="https://t.me/zaidkhan0997" target="_blank" rel="noreferrer" className="text-cyan-400 underline">t.me/zaidkhan0997</a></p>
            <p>GitHub: <a href="https://github.com/zaidkhan0997" target="_blank" rel="noreferrer" className="text-cyan-400 underline">github.com/zaidkhan0997</a></p>
          </div>
        );
        break;

      case 'stats':
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-cyan-300">
            <p className="text-cyan-400 font-bold">LIVE TELEMETRY OVERVIEW:</p>
            <p>&bull; Total Portfolio Visits: {views.toLocaleString()}</p>
            <p>&bull; Total Global Likes: {likes.toLocaleString()}</p>
            <p>&bull; Public Repositories: 58+</p>
            <p>&bull; Kernel Status: 100% Operational</p>
          </div>
        );
        break;

      case 'neofetch':
        outputNode = (
          <div className="space-y-1 text-xs font-mono">
            <pre className="text-cyan-400 font-bold overflow-x-auto text-[10px] sm:text-xs leading-tight">
              {ASCII_ANDROID}
            </pre>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        outputNode = (
          <p className="text-xs font-mono text-amber-300">
            bash: command not found: &apos;{cmd}&apos; &mdash; did you mean <span className="text-cyan-400 font-bold cursor-pointer underline" onClick={() => executeCommandString('flash lisa')}>&apos;flash lisa&apos;</span> or <span className="text-cyan-400 font-bold cursor-pointer underline" onClick={() => executeCommandString('help')}>&apos;help&apos;</span>?
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: cmd, output: outputNode }]);
    setInput('');
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommandString(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const quickCommands = ['help', 'neofetch', 'flash lisa', 'dmesg', 'matrix', 'kernel panic', 'reboot'];

  return (
    <section id="terminal" className="bg-transparent py-20 border-b border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-10"
        >
          <span className="inline-block rounded-full bg-cyan-500/15 px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/40 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            INTERACTIVE SHELL
          </span>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Developer CLI &amp; Kernel Terminal
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            Real Linux commands, flashing simulator, hardware specs &amp; interactive developer tools.
          </p>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto rounded-3xl frosted-glass-card overflow-hidden flex flex-col h-[380px] sm:h-[440px]"
        >
          {/* Header Bar */}
          <div className="grid grid-cols-3 items-center px-4 sm:px-5 py-3.5 border-b border-white/10 bg-white/[0.02] shrink-0">
            {/* Left: macOS dots */}
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-sm cursor-pointer" onClick={() => executeCommandString('kernel panic')} title="Simulate Panic" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-sm cursor-pointer" onClick={() => executeCommandString('reboot')} title="Reboot Sequence" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-sm cursor-pointer" onClick={() => executeCommandString('matrix')} title="Matrix Rain" />
            </div>

            {/* Center: Title */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-white/90 truncate">
              <TerminalIcon className="h-3.5 w-3.5 text-cyan-400" />
              <span className="truncate">zaidkhan0997@android-kernel-dev:~</span>
            </div>

            {/* Right: Sound toggle & version */}
            <div className="flex items-center justify-end gap-3 text-xs font-mono text-cyan-300/90">
              <button
                onClick={toggleSound}
                className="flex items-center gap-1 hover:text-white transition-colors"
                title={soundEnabled ? 'Mute typing sound' : 'Enable typing sound'}
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-white/40" />}
                <span className="hidden sm:inline text-[11px]">{soundEnabled ? 'Audio' : 'Muted'}</span>
              </button>
              <div className="hidden sm:flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>v3.0</span>
              </div>
            </div>
          </div>

          {/* Terminal Body */}
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
                    <span className="text-cyan-400 font-bold">zaidkhan0997@dev:~$</span>
                    <span>{item.command}</span>
                  </div>
                  <div className="text-white/80 pl-3 sm:pl-4 border-l-2 border-cyan-500/30">
                    {item.output}
                  </div>
                </div>
              ))}

              {/* Live Flashing Progress Bar */}
              {isFlashing && (
                <div className="space-y-1.5 pl-3 sm:pl-4 border-l-2 border-cyan-500/40">
                  <div className="flex justify-between text-cyan-300 text-[11px]">
                    <span>Flashing {flashDevice?.toUpperCase()} Kernel Partition...</span>
                    <span>{flashProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${flashProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input Form at the bottom */}
            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-4 shrink-0">
              <label htmlFor="terminal-command-input" className="sr-only">
                Terminal command prompt
              </label>
              <span className="text-cyan-400 font-bold shrink-0 select-none">zaidkhan0997@dev:~$</span>
              <input
                id="terminal-command-input"
                name="terminal-command"
                ref={inputRef}
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                aria-label="Terminal command input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type 'help', 'flash lisa', 'neofetch', 'dmesg'..."
                className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none font-mono text-xs caret-cyan-400"
              />
              <button
                type="submit"
                className="text-white/40 hover:text-cyan-400 transition-colors p-1"
                title="Execute Command"
                aria-label="Execute command"
              >
                <CornerDownLeft className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Quick Command Suggestions (Helpful for mobile & fast click) */}
        <div className="max-w-5xl mx-auto mt-4 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="text-xs text-white/40 font-mono">Suggested:</span>
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommandString(cmd)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-cyan-500/20 text-cyan-300/80 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
