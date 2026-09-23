import React, { useState, useEffect, useRef } from 'react';
import { Shield, Cpu, Activity, Zap, FastForward, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';

interface BootSequenceProps {
  onBootComplete: () => void;
  isForced?: boolean;
}

// User gesture tracker to respect browser autoplay policy without console warnings
let hasUserGesture = false;
if (typeof window !== 'undefined') {
  const markGesture = () => {
    hasUserGesture = true;
    window.removeEventListener('pointerdown', markGesture);
    window.removeEventListener('keydown', markGesture);
    window.removeEventListener('touchstart', markGesture);
  };
  window.addEventListener('pointerdown', markGesture, { passive: true });
  window.addEventListener('keydown', markGesture, { passive: true });
  window.addEventListener('touchstart', markGesture, { passive: true });
}

const canPlayAudio = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if ('userActivation' in navigator && navigator.userActivation) {
    return navigator.userActivation.hasBeenActive;
  }
  return hasUserGesture;
};

// Synthesizer for cyber sound effects via Web Audio API
class CyberSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!canPlayAudio()) return;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          // Audio policy safe
        }
      }
    }
  }

  // Deep cyber bass boom
  playBootBoom() {
    if (!this.enabled || !canPlayAudio()) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch {
      // AudioContext policy safe
    }
  }

  // Sci-fi data transmission chirp
  playDataChirp() {
    if (!this.enabled || !canPlayAudio()) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const freq = 1400 + Math.random() * 900;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq + 400, this.ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch {
      // AudioContext policy safe
    }
  }

  // Power up crescendo
  playPowerUp() {
    if (!this.enabled || !canPlayAudio()) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch {
      // AudioContext policy safe
    }
  }
}

const cyberSynth = new CyberSynth();

// Real AOSP Linux Kernel & Android flashing telemetry
const HACKER_TERMINAL_LOGS = [
  { text: 'AOSP BOOTLOADER v5.12 // UNLOCKED KEY: 0x9AF84C', type: 'info' },
  { text: 'Probing hardware architecture: aarch64', type: 'info' },
  { text: 'Clang 18.1.0 (https://android.googlesource.com/toolchain/llvm-project) LTO=thin', type: 'system' },
  { text: 'sched/core: SMP 8 cores initialized @ 2.42GHz [schedutil]', type: 'system' },
  { text: 'KernelSU: Intercepting sys_execve, sys_finit_module hooks... [GRANTED UID 0]', type: 'success' },
  { text: 'dtb: Applying devicetree overlay perf-disp-120hz-amoled.dtbo [CRC32: 0x8BE391]', type: 'system' },
  { text: 'qcom,ufs: Micron 128GB UFS 2.2 probed @ 1150 MB/s read / 850 MB/s write', type: 'system' },
  { text: 'mm: Initializing 12288MB LPDDR5X RAM: LowMem 8192MB, ZRAM 4096MB with LZ4', type: 'system' },
  { text: 'SELinux: enforcing=0 (Permissive engineering mode for AOSP custom development)', type: 'warning' },
  { text: 'kgsl: Adreno GPU driver online (Vulkan 1.3, OpenGL ES 3.2)', type: 'system' },
  { text: 'surfaceflinger: Primary display composition initialized 1080x2400 @ 120Hz', type: 'system' },
  { text: 'vold: Mounting dynamic logical partitions /super: [/system, /vendor, /product, /system_ext]', type: 'system' },
  { text: 'init: Starting AOSP core daemons: zygote64, servicemanager, hwservicemanager', type: 'system' },
  { text: 'binder: 64-bit IPC bus ready. Maximum 32 thread worker pool allocated', type: 'system' },
  { text: 'AOSP Environment ready for developer: MOHD ZAID (zaidkhan0997)', type: 'success' },
  { text: 'LAUNCHING SYSTEM GUI // REDIRECTING DISPLAY BUFFER TO PORTFOLIO...', type: 'success' },
];

const HEX_DUMP = [
  '0x7FFF5F00: 4A 61 6E 65 44 6F 65 00  4B 65 72 6E 65 6C 53 55  JaneDoe.KernelSU',
  '0x7FFF5F10: 61 61 72 63 68 36 34 2B  00 00 00 00 4B 45 52 4E  aarch64+....KERN',
  '0x7FFF5F20: 01 00 00 00 FF FF FF FF  00 00 00 00 1D 84 00 00  ................',
  '0x7FFF5F30: 41 4F 53 50 2D 4F 53 00  43 6C 61 6E 67 31 38 00  AOSP-OS.Clang18.',
  '0x7FFF5F40: DE AD BE EF CA FE BA BE  00 00 13 37 08 00 20 00  ........7.. ....',
  '0x7FFF5F50: 5A 41 49 44 4B 48 41 4E  30 39 39 37 41 4F 53 50  ZAIDKHAN0997AOSP',
  '0x7FFF5F60: 41 44 52 45 4E 4F 36 34  32 4C 56 55 4C 4B 41 4E  ADRENO642LVULKAN',
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onBootComplete }) => {
  const [logs, setLogs] = useState<typeof HACKER_TERMINAL_LOGS>([]);
  const [progress, setProgress] = useState(0);
  const [hexLineOffset, setHexLineOffset] = useState(0);
  const [isWarpingOut, setIsWarpingOut] = useState(false);
  const [audioActive, setAudioActive] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logBoxRef = useRef<HTMLDivElement>(null);
  const isTerminatedRef = useRef(false);

  // Complete and exit boot cleanly
  const finishBoot = () => {
    if (isTerminatedRef.current) return;
    isTerminatedRef.current = true;
    cyberSynth.playPowerUp();
    setIsWarpingOut(true);

    try {
      sessionStorage.removeItem('hasBooted');
      localStorage.removeItem('hasBooted');
    } catch {
      // ignore
    }

    setTimeout(() => {
      onBootComplete();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('scroll'));
      }
    }, 600);
  };

  // 3D Canvas Wireframe & Cyber Layer (Rendered transparently over Neural Vortex background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Particles flowing toward camera
    const PARTICLE_COUNT = 80;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1500 + 100,
      code: ['0x1', '0x0', 'MOV', 'SUB', 'JMP', 'aarch64', '0xFF', 'vmlinux'][Math.floor(Math.random() * 8)],
      speed: Math.random() * 3 + 2,
    }));

    // 3D Cube / Polyhedron Nodes for central 3D wireframe core
    const cubeVertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    const render = () => {
      // Clear transparently so the portfolio's Neural Vortex shows through
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 400;

      // 1. Render 3D Flying Data Particles
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= p.speed * 2.5;
        if (p.z <= 10) {
          p.z = 1500;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 2000;
        }

        const k = fov / p.z;
        const px = cx + p.x * k;
        const py = cy + p.y * k;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, Math.max(0.05, 1 - p.z / 1500));
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.55})`;
          ctx.font = `${Math.max(9, Math.floor(13 * k))}px monospace`;
          ctx.fillText(p.code, px, py);
        }
      }
      ctx.restore();

      // 2. Central 3D Rotating Holographic Tesseract Wireframe
      ctx.save();
      angleX += 0.012;
      angleY += 0.016;
      angleZ += 0.008;

      const size = Math.min(width, height) * 0.18;
      const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ), sinZ = Math.sin(angleZ);

      // Transform and project vertices
      const projected = cubeVertices.map(([vx, vy, vz]) => {
        let x = vx * size;
        let y = vy * size;
        let z = vz * size;

        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;

        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        let x3 = x1 * cosZ - y2 * sinZ;
        let y3 = x1 * sinZ + y2 * cosZ;

        const pScale = 500 / (500 + z2 + 300);
        return {
          x: cx + x3 * pScale,
          y: cy + y3 * pScale,
          z: z2,
        };
      });

      // Draw wireframe edges
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#06b6d4';
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';

      for (const [start, end] of cubeEdges) {
        const p1 = projected[start];
        const p2 = projected[end];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Draw vertex nodes
      for (const p of projected) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Orbiting 3D rings around the tesseract
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
      ctx.shadowColor = '#34d399';
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 1.5, size * 0.45, angleY * 0.8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 1.7, size * 0.5, -angleX * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // 3. CRT Horizontal Laser Scan Line
      const scanY = (Date.now() * 0.25) % height;
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, width, 60);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Keyboard shortcut & audio initialization
  useEffect(() => {
    cyberSynth.playBootBoom();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finishBoot();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX - innerWidth / 2) / (innerWidth / 2),
        y: (e.clientY - innerHeight / 2) / (innerHeight / 2),
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    // Hard safety timer: guarantee portfolio opens within 7s
    const hardTimer = setTimeout(() => {
      finishBoot();
    }, 7000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hardTimer);
    };
  }, []);

  // Streaming log engine
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < HACKER_TERMINAL_LOGS.length) {
        const item = HACKER_TERMINAL_LOGS[index];
        if (item) {
          setLogs((prev) => [...prev, item]);
          setProgress(Math.round(((index + 1) / HACKER_TERMINAL_LOGS.length) * 100));
          setHexLineOffset((prev) => (prev + 1) % HEX_DUMP.length);
          cyberSynth.playDataChirp();
        }
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          finishBoot();
        }, 650);
      }
    }, 155);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal log window
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  const toggleAudio = () => {
    cyberSynth.enabled = !audioActive;
    setAudioActive(!audioActive);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-transparent text-cyan-400 font-mono select-none overflow-hidden flex flex-col justify-between transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isWarpingOut ? 'opacity-0 scale-[1.08] blur-lg pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 3D WebGL/Canvas Layer Viewport (renders transparently over Neural Vortex) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 pointer-events-none" />

      {/* TOP TACTICAL HUD BAR */}
      <header className={`relative z-20 mx-3 sm:mx-6 mt-3 sm:mt-5 p-3 rounded-2xl frosted-glass-card flex items-center justify-between text-xs transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isWarpingOut ? '-translate-y-28 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[11px] font-bold text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AOSP KERNEL LOADER // LIVE</span>
          </div>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="hidden md:inline text-white/70 text-[11px]">
            HOST: <span className="text-cyan-300">zaid@workstation</span> &bull; TARGET: <span className="text-cyan-300 font-bold">aarch64</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-white/80 text-[11px]">
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>RAM: <span className="text-cyan-300 font-bold">7.4GB / 12GB</span> LPDDR5X</span>
          </div>

          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 hover:border-cyan-400/30 text-white/80 hover:text-cyan-300 transition-colors text-[11px]"
            title="Toggle Synthesizer Audio"
          >
            {audioActive ? <Volume2 className="h-3.5 w-3.5 text-cyan-400" /> : <VolumeX className="h-3.5 w-3.5 text-white/40" />}
            <span className="hidden sm:inline">{audioActive ? 'AUDIO ON' : 'MUTED'}</span>
          </button>
        </div>
      </header>

      {/* MAIN 3D HACKING COCKPIT */}
      <main className="relative z-20 flex-1 my-3 sm:my-5 mx-3 sm:mx-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch max-w-7xl lg:mx-auto w-auto overflow-hidden">
        {/* LEFT COLUMN: Fullscreen Live Hacking / Compilation Terminal */}
        <div className={`col-span-1 lg:col-span-7 flex flex-col justify-between rounded-3xl frosted-glass-card p-4 sm:p-6 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isWarpingOut ? '-translate-x-36 opacity-0' : 'translate-x-0 opacity-100'
        }`}>
          {/* Terminal Window Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-[11px] text-white/80">
                terminal -- aosp-kernel-build.sh
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              TTY0 @ 115200 8N1
            </span>
          </div>

          {/* Streaming Log Lines */}
          <div
            ref={logBoxRef}
            className="flex-1 my-3 overflow-y-auto space-y-1.5 text-xs font-mono pr-2 max-h-[260px] sm:max-h-[320px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="text-white/40 text-[11px] select-none">
              $ make O=out ARCH=arm64 CC=clang LLVM=1 defconfig &amp;&amp; make -j$(nproc)
            </div>
            {logs.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-cyan-400/60 select-none text-[10px] pt-0.5">&gt;&gt;</span>
                <span
                  className={`text-[11px] sm:text-xs ${
                    item.type === 'success'
                      ? 'text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                      : item.type === 'warning'
                      ? 'text-amber-400 font-semibold'
                      : item.type === 'info'
                      ? 'text-sky-300 font-semibold'
                      : 'text-cyan-300/90'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 pt-1 text-cyan-400">
              <span className="text-emerald-400 font-bold">zaid@aosp:#</span>
              <span className="h-4 w-2 bg-cyan-400 animate-pulse inline-block" />
            </div>
          </div>

          {/* Micro Telemetry Indicators */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>KernelSU Hooks Injected</span>
            </span>
            <span className="text-white/60">BUILD: SUCCESS</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Holographic Profile Badge & Hardware Telemetry */}
        <div className={`col-span-1 lg:col-span-5 flex flex-col justify-between gap-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isWarpingOut ? 'translate-x-36 opacity-0' : 'translate-x-0 opacity-100'
        }`}>
          {/* Tactical Android Developer ID Card with User's Photo */}
          <div className="rounded-3xl frosted-glass-card p-5">
            <div className="flex items-center gap-3.5">
              {/* User Photo Frame matching portfolio aesthetic */}
              <div className="relative h-14 w-14 rounded-2xl p-0.5 border border-white/20 bg-white/[0.04] shadow-md shrink-0 overflow-hidden">
                <img
                  src="/assets/profile.jpg"
                  alt="MOHD ZAID"
                  className="h-full w-full object-cover object-[50%_12%] rounded-[14px]"
                />
              </div>

              <div>
                <h1 className="text-base sm:text-lg font-black tracking-widest text-white leading-tight font-display uppercase">
                  MOHD{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-cyan-400 font-black drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]">
                    ZAID
                  </span>
                </h1>
                <p className="text-xs text-cyan-300 font-bold tracking-wider font-mono mt-0.5">
                  Android Custom ROM &amp; Linux Kernel Developer
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                    <Zap className="h-3 w-3 text-emerald-400" /> UNLOCKED BOOTLOADER
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs Matrix */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[10px]">
              <div className="border border-white/10 bg-white/[0.03] p-2 text-center rounded-2xl">
                <div className="text-white/50 text-[9px] uppercase tracking-wider">ARCHITECTURE</div>
                <div className="text-cyan-300 font-bold text-xs mt-0.5">aarch64</div>
              </div>
              <div className="border border-white/10 bg-white/[0.03] p-2 text-center rounded-2xl">
                <div className="text-white/50 text-[9px] uppercase tracking-wider">ACTIVE DISPLAY</div>
                <div className="text-emerald-400 font-bold text-xs mt-0.5">120Hz OLED HDR10+</div>
              </div>
            </div>
          </div>

          {/* Real-time Hex Memory Stream */}
          <div className="hidden sm:flex flex-col flex-1 rounded-3xl frosted-glass-card p-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] font-bold text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400" /> PHYSICAL MEMORY DUMP
              </span>
              <span className="text-white/40 font-normal">HEX 16-BYTE ALIGNED</span>
            </div>

            <div className="flex-1 mt-2 text-[10px] font-mono leading-tight space-y-1 text-cyan-300/80 bg-black/30 p-2.5 rounded-2xl border border-white/10">
              {HEX_DUMP.slice(0, 5).map((line, i) => (
                <div
                  key={i}
                  className={`px-1 py-0.5 rounded transition-colors ${
                    i === hexLineOffset % 5 ? 'bg-cyan-500/20 text-white font-bold' : ''
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM FOOTER & SYSTEM PROGRESS BAR */}
      <footer className={`relative z-20 mx-3 sm:mx-6 mb-3 sm:mb-5 p-3 sm:p-4 rounded-2xl frosted-glass-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isWarpingOut ? 'translate-y-28 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        {/* Progress Bar & Status */}
        <div className="w-full sm:w-1/2 space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/70">
              Decompressing Image.gz-dtb &amp; Mounting Partitions...
            </span>
            <span className="font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-black/40 h-2.5 rounded-full border border-white/15 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-150 shadow-[0_0_15px_rgba(6,182,212,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip & Enter Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={finishBoot}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition-all duration-200 text-xs font-mono font-bold cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95 group"
          >
            <span>Skip Boot Sequence</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] rounded bg-white/10 border border-white/20 text-white/70">
              ESC
            </kbd>
            <FastForward className="h-3.5 w-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </footer>
    </div>
  );
};
