import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FastForward, ChevronDown } from 'lucide-react';

const TOTAL_FRAMES = 240;
const FRAME_PATH = (index: number) =>
  `/cinematic/frames/frame_${String(index).padStart(4, '0')}.jpg`;

export const CinematicIntro: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isPastIntro, setIsPastIntro] = useState<boolean>(false);
  const [framesLoaded, setFramesLoaded] = useState<number>(0);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  // Frame cache
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const currentRenderedFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);

  // Render a specific frame onto canvas keeping 16:9 cover
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let img = framesRef.current[frameIdx];

    // Find closest loaded frame if requested frame isn't ready yet
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = framesRef.current[frameIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = framesRef.current[frameIdx + offset];
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

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.drawImage(img, nx, ny, nw, nh);
  }, []);

  // Canvas size sync
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(currentRenderedFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawFrame]);

  // Preload all frames progressively
  useEffect(() => {
    let cancelled = false;

    // Load Frame 1 immediately
    const firstImg = new Image();
    firstImg.src = FRAME_PATH(1);
    firstImg.onload = () => {
      if (cancelled) return;
      framesRef.current[1] = firstImg;
      setFramesLoaded(1);
      drawFrame(1);

      // Priority 1: Keyframes (every 4th frame for instant scrub response)
      const keyframes: number[] = [];
      for (let i = 5; i <= TOTAL_FRAMES; i += 4) {
        keyframes.push(i);
      }

      let loadedCount = 1;
      const loadBatch = (list: number[], onDone: () => void) => {
        let remaining = list.length;
        if (remaining === 0) return onDone();

        list.forEach((idx) => {
          const img = new Image();
          img.src = FRAME_PATH(idx);
          img.onload = () => {
            if (cancelled) return;
            framesRef.current[idx] = img;
            loadedCount++;
            setFramesLoaded(loadedCount);
            remaining--;
            if (remaining === 0) onDone();
          };
          img.onerror = () => {
            if (cancelled) return;
            remaining--;
            if (remaining === 0) onDone();
          };
        });
      };

      loadBatch(keyframes, () => {
        if (cancelled) return;
        // Priority 2: Rest of frames
        const remainingFrames: number[] = [];
        for (let i = 2; i <= TOTAL_FRAMES; i++) {
          if (!framesRef.current[i]) remainingFrames.push(i);
        }
        loadBatch(remainingFrames, () => {});
      });
    };

    return () => {
      cancelled = true;
    };
  }, [drawFrame]);

  // Smooth scroll listener (Fixed position + Spacer pattern like chahalarsh.in)
  useEffect(() => {
    let ticking = false;

    // Smooth frame lerp loop
    const lerpLoop = () => {
      const current = currentRenderedFrameRef.current;
      const target = targetFrameRef.current;

      if (Math.abs(current - target) > 0.05) {
        // Fast responsive lerp towards target frame
        const next = current + (target - current) * 0.35;
        const rounded = Math.round(next);
        currentRenderedFrameRef.current = next;
        drawFrame(Math.min(TOTAL_FRAMES, Math.max(1, rounded)));
      }

      animFrameIdRef.current = requestAnimationFrame(lerpLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(lerpLoop);

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const spacer = spacerRef.current;
          if (spacer) {
            const spacerHeight = spacer.offsetHeight;
            const scrollY = window.scrollY;
            const maxScroll = spacerHeight - window.innerHeight;

            if (scrollY > 40) {
              setHasScrolled(true);
            } else {
              setHasScrolled(false);
            }

            if (maxScroll > 0) {
              const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
              setScrollProgress(progress);

              // Map progress directly to frame 1 -> 240
              const calcTarget = Math.min(
                TOTAL_FRAMES,
                Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1)
              );
              targetFrameRef.current = calcTarget;

              // Hide fixed intro layer completely when past intro
              setIsPastIntro(scrollY >= spacerHeight - 50);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [drawFrame]);

  const handleSkip = () => {
    const spacer = spacerRef.current;
    if (spacer) {
      window.scrollTo({
        top: spacer.offsetHeight,
        behavior: 'smooth',
      });
    }
  };

  // Monitor immersion bezel scale (scale 1.5 -> scale 1.0 as progress hits 0.70 -> 1.0)
  const isImmersionActive = scrollProgress >= 0.7;
  const immersionScale = isImmersionActive
    ? Math.max(1, 1.4 - ((scrollProgress - 0.7) / 0.3) * 0.4)
    : 1.4;

  return (
    <>
      {/* 1. FIXED BACKGROUND CANVAS & HUD LAYER (like #office on chahalarsh.in) */}
      <div
        className={`fixed inset-0 w-full h-[100dvh] z-20 pointer-events-none transition-opacity duration-500 overflow-hidden bg-black ${
          isPastIntro ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Hardware Canvas Scrub Renderer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover select-none"
        />

        {/* Subtle Scanlines Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 3px, rgba(0, 0, 0, 0.5) 4px)',
          }}
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-radial-[ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%]" />

        {/* 2. MONITOR IMMERSION BEZEL (like #macImmersion on chahalarsh.in) */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out flex items-center justify-center ${
            isImmersionActive && !isPastIntro ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="w-[98%] h-[96%] border-[12px] sm:border-[20px] border-zinc-950/90 rounded-[28px] sm:rounded-[36px] shadow-[0_0_80px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-out flex flex-col justify-between"
            style={{
              transform: `scale(${immersionScale})`,
            }}
          >
            {/* Top Monitor Webcam/Sensor Pill */}
            <div className="w-full flex justify-center pt-1.5">
              <div className="h-1.5 w-16 rounded-full bg-zinc-800/80" />
            </div>

            {/* Bottom Monitor Chin Dell Logo */}
            <div className="w-full flex justify-center pb-1 text-[9px] font-mono tracking-widest text-zinc-600 font-bold uppercase">
              DELL ULTRASHARP
            </div>
          </div>
        </div>

        {/* 3. TOP HUD BAR */}
        <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between text-xs font-mono backdrop-blur-[2px] bg-gradient-to-b from-black/80 to-transparent border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-white">MOHD ZAID // WORKSPACE</span>
              <span className="text-[10px] text-zinc-400">FRAME RECON SYSTEM</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-mono transition-all cursor-pointer backdrop-blur-md active:scale-95"
            >
              <span>Skip Intro</span>
              <FastForward className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* 4. BOTTOM TELEMETRY */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex items-end justify-between font-mono text-[10px] text-zinc-400 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex flex-col">
            <span className="text-white font-semibold">
              FRAME {String(Math.round(currentRenderedFrameRef.current)).padStart(3, '0')} / {TOTAL_FRAMES}
            </span>
            <span>BUFFERED: {framesLoaded}/{TOTAL_FRAMES}</span>
          </div>
          <div className="hidden sm:block text-zinc-500 tracking-widest uppercase">
            PHYSICAL CAMERA TRAVEL
          </div>
        </div>
      </div>

      {/* 5. VIRTUAL SCROLL SPACER (like #office2 & #office3 on chahalarsh.in) */}
      <div
        ref={spacerRef}
        className="relative w-full h-[280vh] pointer-events-none select-none"
      >
        {/* Floating "Scroll down" guide (Visible only at the top of the track) */}
        <div
          className={`fixed bottom-12 sm:bottom-16 inset-x-0 z-30 flex flex-col items-center justify-center gap-2 text-white transition-all duration-500 ease-out pointer-events-none ${
            hasScrolled ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 animate-bounce'
          }`}
        >
          <span className="font-mono text-xs sm:text-sm tracking-widest uppercase text-white font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Scroll down to enter
          </span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 border border-white/20 text-cyan-400 backdrop-blur-md shadow-lg">
            <ChevronDown className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </div>
    </>
  );
};
