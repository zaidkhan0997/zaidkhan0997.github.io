import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Cpu, ShieldCheck, Zap, Disc3, Layers } from 'lucide-react';

interface HackerScreenProps {
  expandProgress?: number; // 0 to 1
  isCompleted?: boolean;
}

const KERNEL_LOG_STREAM = [
  '[  0.000000] Linux version 5.4.242-android12-9-zaid-kernel+ (zaid@workstation) (LLVM 17.0.6)',
  '[  0.000214] Command line: console=ttyMSM0,115200n8 androidboot.hardware=qcom androidboot.bootdevice=1d84000.ufshc',
  '[  0.001048] DTS: Loading device tree blob arch/arm64/boot/dts/qcom/sm7325-lisa.dtb',
  '[  0.003912] CPU: ARMv8.2-A (Kryo 670 Octa-Core: 4x Silver @ 1.8GHz, 3x Gold @ 2.2GHz, 1x Prime @ 2.4GHz)',
  '[  0.010892] MEMORY: Initializing buddy allocator 8192MB lowmem + 8192MB highmem',
  '[  0.024510] AOSP: SELinux enforcing mode primed; root namespace bypass hook injected',
  '[  0.041029] QCOM: Adreno 642L GPU clock frequency table loaded [490MHz - 840MHz]',
  '[  0.068200] COMPILING: drivers/android/binder.c -> [OK] (zero overhead dispatch)',
  '[  0.098412] COMPILING: drivers/misc/kernel_su.c -> [OK] (safetynet / play integrity spoof)',
  '[  0.134590] COMPILING: fs/f2fs/segment.c -> [OK] (rapid flash storage acceleration)',
  '[  0.180210] LINK: vmlinux -> generating uncompressed image.gz',
  '[  0.220912] FASTBOOT: Waiting for USB target enumeration on vendor 0x2717 (Xiaomi)...',
  '[  0.281004] USB: Target linked: Xiaomi 11 Lite 5G NE [lisa] via protocol fastbootd',
  '[  0.340112] FLASHING: fastboot flash boot boot.img [38,912,416 bytes] -> SUCCESS (1.18s)',
  '[  0.410982] FLASHING: fastboot flash dtbo dtbo.img -> SUCCESS (0.12s)',
  '[  0.489100] VERIFY: Cryptographic hash SHA-256 match: e3b0c44298fc1c149afbf4c8996fb924',
  '[  0.590120] REBOOT: Bootloader handoff to OS kernel completed.',
  '[  0.690810] TELEMETRY: Thermal governor active. Max temperature: 38.2°C.',
  '[  0.810940] STATUS: Kernel execution verified. Core pipeline synchronized.',
  '[  0.920100] HANDSHAKE: Authenticating developer workstation handshake...',
];

export const HackerScreen: React.FC<HackerScreenProps> = ({ expandProgress = 0 }) => {
  const [logs, setLogs] = useState<string[]>(KERNEL_LOG_STREAM.slice(0, 8));
  const [cpuUsage, setCpuUsage] = useState<number[]>([72, 85, 91, 64, 78, 88, 94, 98]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Streaming real-time script logs
  useEffect(() => {
    let index = 8;
    const interval = setInterval(() => {
      if (index < KERNEL_LOG_STREAM.length) {
        const nextLine = KERNEL_LOG_STREAM[index];
        setLogs((prev) => [...prev, nextLine]);
        index++;
      } else {
        // Continuous cycle of live compiler output
        const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
        const timestamp = (performance.now() / 1000).toFixed(6);
        const dynamicLogs = [
          `[  ${timestamp}] KTHREAD: Core dispatch thread [PID: ${Math.floor(Math.random() * 9000 + 1000)}] affinity set`,
          `[  ${timestamp}] IPC: Binder transaction 0x${randomHex} completed with zero latency`,
          `[  ${timestamp}] BUFFER: DMA buffer sync for display surface pipeline #0`,
          `[  ${timestamp}] SYS: Lisa SD778G frequency governor locked to optimal performance`,
        ];
        const nextRandom = dynamicLogs[Math.floor(Math.random() * dynamicLogs.length)];
        setLogs((prev) => [...prev.slice(-14), nextRandom]);
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // Fluctuating CPU load
  useEffect(() => {
    const cpuTimer = setInterval(() => {
      setCpuUsage([
        Math.floor(65 + Math.random() * 30),
        Math.floor(70 + Math.random() * 28),
        Math.floor(80 + Math.random() * 19),
        Math.floor(60 + Math.random() * 35),
        Math.floor(75 + Math.random() * 24),
        Math.floor(82 + Math.random() * 17),
        Math.floor(88 + Math.random() * 12),
        Math.floor(92 + Math.random() * 8),
      ]);
    }, 500);

    return () => clearInterval(cpuTimer);
  }, []);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Expand phase trigger
  const isEnteringWorld = expandProgress > 0.65;

  return (
    <div
      id="mac-screen"
      className="relative w-full h-full bg-[#030712] text-slate-100 flex flex-col overflow-hidden font-mono select-none"
      style={{
        boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.95)',
      }}
    >
      {/* CRT Scanline & Grain Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.6) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))',
          backgroundSize: '100% 3px, 6px 100%',
        }}
      />

      {/* Terminal Top Window Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2 bg-[#090d16]/90 border-b border-emerald-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="ml-2 text-[11px] tracking-wider text-emerald-400/90 font-semibold flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-emerald-400" />
            zaid@workstation: ~/android/kernel/xiaomi-lisa
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400">
            <Disc3 className="w-3 h-3 animate-spin text-cyan-400" />
            BUILD ACTIVE
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
            TARGET: lisa (SD778G)
          </span>
        </div>
      </div>

      {/* Subsystem Telemetry Bar */}
      <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-2 bg-[#060a12]/80 border-b border-cyan-500/10 text-[10px]">
        <div className="flex items-center gap-2 text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>ARM64 8-Core:</span>
          <div className="flex items-center gap-0.5">
            {cpuUsage.map((val, i) => (
              <div
                key={i}
                className="w-1.5 rounded-sm transition-all duration-300"
                style={{
                  height: `${Math.max(6, (val / 100) * 16)}px`,
                  backgroundColor:
                    val > 90 ? '#ef4444' : val > 75 ? '#06b6d4' : '#10b981',
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>RAM:</span>
          <span className="text-purple-300 font-bold">14.6 / 32 GB</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SELinux:</span>
          <span className="text-emerald-400 font-bold">PERMISSIVE (ROOT)</span>
        </div>

        <div className="hidden sm:flex items-center justify-end gap-1.5 text-cyan-400">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>FASTBOOT DAEMON READY</span>
        </div>
      </div>

      {/* Main Terminal Code Stream */}
      <div
        ref={logContainerRef}
        className="relative z-10 flex-1 p-4 overflow-y-auto font-mono text-[11px] sm:text-[12px] leading-relaxed space-y-1 text-slate-300"
        style={{
          textShadow: '0 0 3px rgba(16, 185, 129, 0.4)',
        }}
      >
        <div className="text-cyan-400/90 font-semibold mb-2">
          $ ./build_kernel.sh --target=lisa --arch=arm64 --compiler=clang-17 -j$(nproc)
        </div>

        {logs.map((log, idx) => {
          const isError = log.includes('ERROR');
          const isSuccess = log.includes('SUCCESS') || log.includes('[OK]');
          const isFlash = log.includes('FLASHING') || log.includes('LINK');

          return (
            <div
              key={idx}
              className={`flex items-start gap-2 ${
                isError
                  ? 'text-red-400'
                  : isSuccess
                  ? 'text-emerald-300'
                  : isFlash
                  ? 'text-cyan-300 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              <span className="text-slate-600 select-none">{String(idx + 1).padStart(3, '0')}</span>
              <span className="flex-1 break-all">{log}</span>
            </div>
          );
        })}

        <div className="flex items-center gap-1.5 text-emerald-400 pt-1">
          <span>zaid@workstation:~/kernel#</span>
          <span className="w-2 h-4 bg-emerald-400 inline-block animate-pulse" />
        </div>
      </div>

      {/* "ENTERING ZAID'S DIGITAL WORLD" HUD Overlay on Zoom/Expand */}
      {expandProgress > 0.2 && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-md transition-all duration-300"
          style={{
            opacity: Math.min(1, (expandProgress - 0.2) / 0.4),
          }}
        >
          {/* Cyber Ring Graphic */}
          <div className="relative mb-6 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-cyan-500/40 animate-spin border-t-cyan-400 border-r-transparent" />
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-emerald-500/50 animate-ping border-b-emerald-400 border-l-transparent" />
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 absolute animate-pulse" />
          </div>

          {/* Access Banner */}
          <div className="text-center space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-[11px] sm:text-xs text-emerald-400 font-semibold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              AUTHENTICATION VERIFIED • LEVEL 0
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)] uppercase">
              ENTERING ZAID&apos;S DIGITAL WORLD
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-wide pt-1">
              INITIALIZING LINUX KERNEL SUBSYSTEMS &amp; ANDROID ARCHITECTURE
            </p>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-cyan-500/30 mt-4">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 transition-all duration-150"
                style={{
                  width: `${Math.min(100, Math.max(5, ((expandProgress - 0.2) / 0.75) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Screen Glare Highlight */}
      <div
        data-glare
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 35%), radial-gradient(ellipse at center, rgba(0,0,0,0) 65%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
};
