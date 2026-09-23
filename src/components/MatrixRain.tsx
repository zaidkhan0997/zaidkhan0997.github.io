import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatrixRainProps {
  isActive: boolean;
  onComplete: () => void;
  durationMs?: number;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  isActive,
  onComplete,
  durationMs = 5000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Characters: Katakana, hex and kernel symbols
    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜKERNELSU-AOSP-LISA-SWEET-6.1';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black background creates fade trail
      ctx.fillStyle = 'rgba(2, 4, 10, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#06b6d4'; // Cyan neon
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Random head character in bright white/cyan
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#ffffff';
        } else if (Math.random() > 0.4) {
          ctx.fillStyle = '#22d3ee';
        } else {
          ctx.fillStyle = '#0891b2';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const timer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [isActive, durationMs, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onComplete}
          className="fixed inset-0 z-50 pointer-events-auto cursor-pointer bg-black/90 backdrop-blur-sm flex flex-col items-center justify-between p-6"
        >
          <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
          
          <div className="relative z-10 w-full flex justify-between items-center text-xs font-mono text-cyan-400">
            <span className="bg-black/60 px-3 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-md">
              [ MATRIX GLYPH RAIN ENGINE ACTIVE ]
            </span>
            <button
              onClick={onComplete}
              className="bg-black/60 hover:bg-cyan-500/20 text-white/80 hover:text-cyan-300 px-3.5 py-1.5 rounded-full border border-white/20 transition-all font-mono text-xs"
            >
              Exit (Click or wait 5s)
            </button>
          </div>

          <div className="relative z-10 text-center font-mono text-[11px] text-cyan-300/70 bg-black/60 px-4 py-1 rounded-full border border-cyan-500/20 backdrop-blur-md">
            zaidkhan0997 // Xiaomi Kernel Architecture Stream
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
