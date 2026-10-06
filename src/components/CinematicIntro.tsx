import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, ShieldAlert, Cpu, ArrowDown, FastForward, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const FRAME_PATH = (index: number) =>
  `/cinematic/frames/frame_${String(index).padStart(4, '0')}.jpg`;

interface TerminalLog {
  time: string;
  type: 'info' | 'warn' | 'error' | 'success';
  text: string;
}

const TERMINAL_LOGS: TerminalLog[] = [
  { time: '00:00:01', type: 'info', text: 'BOOTING VISUAL RECON KERNEL v6.8.0...' },
  { time: '00:00:02', type: 'info', text: 'INITIALIZING MULTI-HEAD DISPLAY PROBE...' },
  { time: '00:00:03', type: 'info', text: 'TARGETING PRIMARY WORKSTATION DISPLAY [DELL U2723QE]...' },
  { time: '00:00:04', type: 'info', text: 'CORRELATING AOSP / LINUX KERNEL MODULES...' },
  { time: '00:00:05', type: 'warn', text: '[WARN] SYNTHETIC TIMEOUT: NODE 125.108.1.25 UNRESPONSIVE' },
  { time: '00:00:06', type: 'error', text: '[ERROR 0x7A1D] PACKET DESTABILIZATION IN RECON LAYER' },
  { time: '00:00:07', type: 'info', text: '[RETRY] DEPLOYING AUTO-RECOVERY PROTOCOL...' },
  { time: '00:00:08', type: 'success', text: '[OK] WORKSPACE NODE SYNCHRONIZED // ID: MOHD ZAID' },
  { time: '00:00:09', type: 'success', text: 'NODE VERIFIED: zaidkhan0997.github.io' },
];

export const CinematicIntro: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [visibleLogs, setVisibleLogs] = useState<TerminalLog[]>([]);
  const [glitchActive, setGlitchActive] = useState<boolean>(false);

  // Cached frame images
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const activeFrameIndexRef = useRef<number>(1);

  // Draw a frame to canvas keeping 16:9 cover ratio
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let img = framesRef.current[frameIndex];
    // Fallback to nearest loaded frame if current isn't ready
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = framesRef.current[frameIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = framesRef.current[frameIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover math
    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.drawImage(img, nx, ny, nw, nh);
  }, []);

  // Update canvas dimensions on resize
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(activeFrameIndexRef.current);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [renderFrame]);

  // Progressive frame loader
  useEffect(() => {
    let isCancelled = false;

    // 1. Immediately load frame 1 for instant first paint
    const firstImg = new Image();
    firstImg.src = FRAME_PATH(1);
    firstImg.onload = () => {
      if (isCancelled) return;
      framesRef.current[1] = firstImg;
      setLoadedCount(1);
      setIsReady(true);
      renderFrame(1);

      // 2. Load keyframes (every 4th frame: 5, 9, 13...) for fast scrub responsiveness
      const keyframes: number[] = [];
      for (let i = 5; i <= TOTAL_FRAMES; i += 4) {
        keyframes.push(i);
      }

      let loadedSoFar = 1;

      const loadBatch = (indices: number[], onDone: () => void) => {
        let remaining = indices.length;
        if (remaining === 0) {
          onDone();
          return;
        }
        indices.forEach((idx) => {
          const img = new Image();
          img.src = FRAME_PATH(idx);
          img.onload = () => {
            if (isCancelled) return;
            framesRef.current[idx] = img;
            loadedSoFar++;
            setLoadedCount(loadedSoFar);
            remaining--;
            if (remaining === 0) onDone();
          };
          img.onerror = () => {
            if (isCancelled) return;
            remaining--;
            if (remaining === 0) onDone();
          };
        });
      };

      // Load keyframes first
      loadBatch(keyframes, () => {
        if (isCancelled) return;
        // 3. Load remaining intermediate frames
        const remainingFrames: number[] = [];
        for (let i = 2; i <= TOTAL_FRAMES; i++) {
          if (!framesRef.current[i]) {
            remainingFrames.push(i);
          }
        }
        loadBatch(remainingFrames, () => {
          // All frames loaded
        });
      });
    };

    return () => {
      isCancelled = true;
    };
  }, [renderFrame]);

  // ScrollTrigger Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      renderFrame(1);
      return;
    }

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = self.progress;
        setCurrentProgress(progress);

        // Frame selection
        const frameIdx = Math.min(
          TOTAL_FRAMES,
          Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1)
        );
        activeFrameIndexRef.current = frameIdx;
        renderFrame(frameIdx);

        // Terminal logs timeline (progress 0.65 -> 0.95)
        if (progress >= 0.65) {
          const logProgress = Math.min(1, (progress - 0.65) / 0.30);
          const numLogsToShow = Math.floor(logProgress * TERMINAL_LOGS.length);
          setVisibleLogs(TERMINAL_LOGS.slice(0, numLogsToShow));

          // Simulated glitch on error (progress ~0.78 to ~0.83)
          if (progress >= 0.77 && progress <= 0.83) {
            setGlitchActive(true);
          } else {
            setGlitchActive(false);
          }
        } else {
          setVisibleLogs([]);
          setGlitchActive(false);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [renderFrame]);

  const handleSkip = () => {
    const portfolio = document.getElementById('portfolio-content');
    if (portfolio) {
      portfolio.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentStage =
    currentProgress < 0.3
      ? '01 // APPROACH'
      : currentProgress < 0.65
      ? '02 // MONITOR LOCK'
      : currentProgress < 0.9
      ? '03 // RECON SIMULATION'
      : '04 // NODE DISCOVERED';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380vh] bg-black selection:bg-cyan-500/30 select-none"
    >
      {/* Sticky Fullscreen Cinematic Viewport */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden bg-black">
        {/* Canvas Frame Renderer */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover transition-filter duration-100 ${
            glitchActive ? 'invert-[0.15] hue-rotate-90 saturate-200 contrast-125' : ''
          }`}
        />

        {/* Subtle Scanlines & CRT Mesh Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 3px, rgba(0, 0, 0, 0.4) 4px)',
          }}
        />

        {/* Ambient Dark Vignette & Cyber Radial Glow */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-radial-[ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%]" />

        {/* Glitch Distortion Slice */}
        {glitchActive && (
          <div
            className="pointer-events-none absolute inset-x-0 h-16 z-20 bg-cyan-500/20 mix-blend-color-dodge animate-pulse"
            style={{ top: '48%' }}
          />
        )}

        {/* --- Top HUD Header --- */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 sm:p-6 text-xs font-mono backdrop-blur-[2px] bg-gradient-to-b from-black/80 to-transparent border-b border-white/5">
          {/* Identity & Status */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-white">ZAID // WORKSPACE RECON</span>
              <span className="text-[10px] text-zinc-400">TARGET: DELL 4K IPS [CENTER]</span>
            </div>
          </div>

          {/* Center Stage Tracker */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-semibold tracking-wider text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{currentStage}</span>
          </div>

          {/* Simulation Mode Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase tracking-wider font-semibold">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Simulation Mode</span>
            </div>
            <button
              onClick={handleSkip}
              className="group flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-mono transition-colors cursor-pointer"
              title="Skip intro directly to portfolio"
            >
              <span>Skip Intro</span>
              <FastForward className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* --- In-Monitor Fictional Terminal Simulation (Progress 0.65 -> 0.95) --- */}
        {currentProgress >= 0.65 && (
          <div
            className={`absolute inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 bottom-24 sm:bottom-28 z-20 w-auto sm:w-[540px] max-w-full p-4 rounded-lg bg-black/85 border border-cyan-500/30 backdrop-blur-md shadow-2xl font-mono text-[11px] sm:text-xs transition-opacity duration-300 ${
              glitchActive ? 'border-red-500/50 shadow-red-500/20' : ''
            }`}
          >
            {/* Terminal Titlebar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-zinc-400 text-[10px]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-zinc-200 font-bold">tty1 // synthetic-kernel.sh</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                ACTIVE
              </span>
            </div>

            {/* Log Stream */}
            <div className="flex flex-col gap-1 max-h-36 overflow-hidden">
              {visibleLogs.map((log, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 leading-relaxed ${
                    log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'warn'
                      ? 'text-amber-400'
                      : log.type === 'success'
                      ? 'text-emerald-300 font-semibold'
                      : 'text-zinc-300'
                  }`}
                >
                  <span className="text-zinc-500 shrink-0 select-none">[{log.time}]</span>
                  <span>{log.text}</span>
                </div>
              ))}
              {visibleLogs.length === 0 && (
                <div className="text-zinc-500 italic">Connecting synthetic console session...</div>
              )}
            </div>

            {/* Terminal Prompt Bar */}
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <span>root@zaid-workstation:~$</span>
                <span className="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse" />
              </div>
              {currentProgress >= 0.88 && (
                <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>IDENTITY LOADED</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Bottom Telemetry & Scroll Prompt --- */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-4 sm:p-6 flex items-end justify-between font-mono text-[11px] text-zinc-400 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
          {/* Left Telemetry */}
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-semibold">
              FRAME: {String(activeFrameIndexRef.current).padStart(3, '0')} / {TOTAL_FRAMES}
            </span>
            <span className="text-[10px] text-zinc-400">
              BUFFER: {loadedCount} / {TOTAL_FRAMES} ({Math.round((loadedCount / TOTAL_FRAMES) * 100)}%)
            </span>
          </div>

          {/* Center Scroll Prompt */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="tracking-widest uppercase text-white font-bold text-[10px] sm:text-xs animate-pulse">
              {currentProgress < 0.9 ? 'Scroll Down To Travel Inside' : 'Node Reached // Enter Portfolio'}
            </span>
            <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
          </div>

          {/* Right Disclaimer */}
          <div className="hidden sm:flex flex-col text-right text-[10px] text-zinc-400">
            <span>STATIC VISUAL SIMULATION</span>
            <span>ZERO DATA HARVESTING</span>
          </div>
        </div>

        {/* --- Light Bloom Transition at End (Progress > 0.94) --- */}
        <div
          className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-t from-black via-cyan-950/20 to-transparent transition-opacity duration-300"
          style={{
            opacity: currentProgress >= 0.92 ? (currentProgress - 0.92) / 0.08 : 0,
          }}
        />
      </div>
    </div>
  );
};
