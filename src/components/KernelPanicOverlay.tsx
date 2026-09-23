import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KernelPanicOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

export const KernelPanicOverlay: React.FC<KernelPanicOverlayProps> = ({
  isActive,
  onComplete,
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isActive) return;

    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: [0, -6, 6, -3, 3, 0],
            y: [0, 4, -4, 2, -2, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{
            x: { repeat: Infinity, duration: 0.25, ease: 'easeInOut' },
            y: { repeat: Infinity, duration: 0.25, ease: 'easeInOut' },
            opacity: { duration: 0.2 },
          }}
          className="fixed inset-0 z-50 bg-[#0f0204]/95 text-red-500 font-mono p-4 sm:p-8 flex flex-col justify-between overflow-hidden select-none pointer-events-auto"
        >
          {/* CRT Scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_4px] opacity-40" />

          {/* Panic Header */}
          <div className="relative z-10 border-b border-red-500/40 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-red-600 animate-ping" />
              <span className="font-bold tracking-wider text-sm sm:text-base text-red-400">
                CRITICAL KERNEL PANIC // SYSTEM HALT
              </span>
            </div>
            <span className="text-xs text-red-400/80 bg-red-950/60 px-3 py-1 rounded border border-red-500/30">
              ERR_CODE: 0xDEADBEEF
            </span>
          </div>

          {/* Realistic Kernel Panic Log */}
          <div className="relative z-10 text-xs sm:text-sm space-y-2 text-red-400/90 overflow-hidden leading-relaxed my-auto">
            <p className="font-bold text-red-300">
              [ 13.370420] Kernel panic - not syncing: Fatal Exception in Interrupt (CPU 3)
            </p>
            <p className="text-red-400/80">
              [ 13.370428] CPU: 3 PID: 1337 Comm: zaidkhan0997 Tainted: P        O      6.1.75-zaidkhan-perf+ #1
            </p>
            <p className="text-red-400/80">
              [ 13.370435] Hardware name: Qualcomm Technologies, Inc. lisa (Xiaomi 11 Lite 5G NE)
            </p>
            <p className="text-red-400/80">
              [ 13.370442] Resetting GPU/KGSL contexts &amp; unmapping page tables...
            </p>

            <div className="pt-2 text-red-300/70 font-mono text-[11px] sm:text-xs pl-2 border-l-2 border-red-500/40 space-y-1">
              <p>Call trace:</p>
              <p>&nbsp;&nbsp;[&lt;ffffffc008214c80&gt;] dump_backtrace+0x0/0x1ec</p>
              <p>&nbsp;&nbsp;[&lt;ffffffc008214e8c&gt;] show_stack+0x20/0x2c</p>
              <p>&nbsp;&nbsp;[&lt;ffffffc0089c3140&gt;] panic+0x18c/0x3cc</p>
              <p>&nbsp;&nbsp;[&lt;ffffffc008218abc&gt;] die+0x288/0x2c0</p>
              <p>&nbsp;&nbsp;[&lt;ffffffc008d32104&gt;] xiaomi_lisa_thermal_trip+0x64/0x90</p>
            </div>

            <div className="pt-3 flex items-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
              <span className="inline-block animate-spin">⚙</span>
              <span>Watchdog engaged. Thermal cooldown complete. Auto-recovery in: {countdown}s</span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 pt-4 border-t border-red-500/30 flex justify-between items-center text-xs text-red-400/70">
            <span>AOSP Watchdog Timer Active</span>
            <button
              onClick={onComplete}
              className="px-3 py-1 bg-red-900/40 hover:bg-red-800/60 border border-red-500/50 rounded text-red-200 transition-colors"
            >
              Force Reboot Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
