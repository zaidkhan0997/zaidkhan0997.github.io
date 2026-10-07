export const KERNEL_TERMINAL_LOGS = [
  "[  0.000000] Linux version 5.4.242-android12-9-zaid-kernel+ (zaid@workstation) (LLVM 17.0.6)",
  "[  0.000214] Command line: console=ttyMSM0,115200n8 androidboot.hardware=qcom bootdevice=1d84000.ufshc",
  "[  0.001048] DTS: Loading device tree blob arch/arm64/boot/dts/qcom/sm7325-lisa.dtb",
  "[  0.003912] CPU: ARMv8.2-A (Kryo 670 Octa-Core: 4x Silver @ 1.8GHz, 3x Gold @ 2.2GHz, 1x Prime @ 2.4GHz)",
  "[  0.010892] MEMORY: Initializing buddy allocator 8192MB lowmem + 8192MB highmem",
  "[  0.024510] AOSP: SELinux enforcing mode primed; root namespace bypass hook injected",
  "[  0.041029] QCOM: Adreno 642L GPU clock frequency table loaded [490MHz - 840MHz]",
  "[  0.068200] COMPILING: drivers/android/binder.c -> [OK] (zero overhead dispatch)",
  "[  0.098412] COMPILING: drivers/misc/kernel_su.c -> [OK] (safetynet / play integrity spoof)",
  "[  0.134590] COMPILING: fs/f2fs/segment.c -> [OK] (rapid flash storage acceleration)",
  "[  0.180210] LINK: vmlinux -> generating uncompressed image.gz",
  "[  0.220912] FASTBOOT: Waiting for USB target enumeration on vendor 0x2717 (Xiaomi)...",
  "[  0.281004] USB: Target linked: Xiaomi 11 Lite 5G NE [lisa] via protocol fastbootd",
  "[  0.340112] FLASHING: fastboot flash boot boot.img [38,912,416 bytes] -> SUCCESS (1.18s)",
  "[  0.410982] FLASHING: fastboot flash dtbo dtbo.img -> SUCCESS (0.12s)",
  "[  0.489100] VERIFY: Cryptographic hash SHA-256 match: e3b0c44298fc1c149afbf4c8996fb924",
  "[  0.590120] REBOOT: Bootloader handoff to OS kernel completed.",
  "[  0.690810] TELEMETRY: Thermal governor active. Max temperature: 38.2°C.",
  "[  0.810940] STATUS: Kernel execution verified. Core pipeline synchronized."
];
export function updateLaptopTerminalCanvas(canvas, logOffset = 0, cursorBlink = true) {
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "#020612";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(0, 242, 254, 0.02)";
  for (let y = 0;y < h; y += 4) {
    ctx.fillRect(0, y, w, 2);
  }
  ctx.fillStyle = "#080e1c";
  ctx.fillRect(0, 0, w, 44);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, w, 44);
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(24, 22, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(44, 22, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(64, 22, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 15px monospace";
  ctx.textAlign = "left";
  ctx.fillText("zaid@workstation: ~/android/kernel/xiaomi-lisa", 88, 27);
  ctx.fillStyle = "#10b981";
  ctx.textAlign = "right";
  ctx.fillText("● COMPILER ACTIVE [CLANG 17]", w - 24, 27);
  ctx.fillStyle = "rgba(4, 11, 24, 0.85)";
  ctx.fillRect(0, 44, w, 32);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
  ctx.strokeRect(0, 44, w, 32);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px monospace";
  ctx.textAlign = "left";
  ctx.fillText("CPU: ARM64 8-Core (Kryo 670)  |  RAM: 14.6/32 GB  |  SELinux: Permissive (Root)", 20, 65);
  ctx.fillStyle = "#00f2fe";
  ctx.textAlign = "right";
  ctx.fillText("FASTBOOTD LINKED [0x2717]", w - 20, 65);
  ctx.font = "13px monospace";
  ctx.textAlign = "left";
  const visibleCount = 17;
  const startIdx = Math.max(0, logOffset % (KERNEL_TERMINAL_LOGS.length - 8));
  const activeSlice = KERNEL_TERMINAL_LOGS.slice(startIdx, startIdx + visibleCount);
  let textY = 105;
  activeSlice.forEach((line, idx) => {
    const isOk = line.includes("SUCCESS") || line.includes("[OK]");
    const isFlash = line.includes("FLASHING") || line.includes("LINK");
    const isCpu = line.includes("CPU") || line.includes("MEMORY");
    ctx.fillStyle = "rgba(100, 116, 139, 0.7)";
    ctx.fillText(String(startIdx + idx + 1).padStart(3, "0"), 20, textY);
    if (isOk)
      ctx.fillStyle = "#10b981";
    else if (isFlash)
      ctx.fillStyle = "#00f2fe";
    else if (isCpu)
      ctx.fillStyle = "#38bdf8";
    else
      ctx.fillStyle = "#cbd5e1";
    ctx.fillText(line, 60, textY);
    textY += 28;
  });
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 15px monospace";
  ctx.fillText("zaid@workstation:~/kernel# ./build_kernel.sh --target=lisa", 20, textY + 10);
  if (cursorBlink) {
    ctx.fillStyle = "#00f2fe";
    ctx.fillRect(580, textY - 4, 10, 18);
  }
}
export function createLaptopTerminalCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 672;
  updateLaptopTerminalCanvas(canvas, 0, true);
  return canvas;
}
export function createHackerThoughtsCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return canvas;
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1536);
  bgGrad.addColorStop(0, "#030712");
  bgGrad.addColorStop(0.35, "#040d21");
  bgGrad.addColorStop(0.7, "#020617");
  bgGrad.addColorStop(1, "#050c1f");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1536);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.05)";
  ctx.lineWidth = 1;
  const gridSize = 48;
  for (let x = 0;x < 1024; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1536);
    ctx.stroke();
  }
  for (let y = 0;y < 1536; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
  ctx.font = "14px monospace";
  const binaryCols = [40, 64, 88, 936, 960, 984];
  const binaryLines = 50;
  binaryCols.forEach((colX) => {
    for (let i = 0;i < binaryLines; i++) {
      const bit = Math.random() > 0.5 ? "1" : "0";
      ctx.fillText(bit, colX, 80 + i * 28);
    }
  });
  ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, 960, 1472);
  ctx.strokeStyle = "#00f2fe";
  ctx.lineWidth = 5;
  const bracketSize = 36;
  ctx.beginPath();
  ctx.moveTo(32, 32 + bracketSize);
  ctx.lineTo(32, 32);
  ctx.lineTo(32 + bracketSize, 32);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(992 - bracketSize, 32);
  ctx.lineTo(992, 32);
  ctx.lineTo(992, 32 + bracketSize);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(32, 1504 - bracketSize);
  ctx.lineTo(32, 1504);
  ctx.lineTo(32 + bracketSize, 1504);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(992 - bracketSize, 1504);
  ctx.lineTo(992, 1504);
  ctx.lineTo(992, 1504 - bracketSize);
  ctx.stroke();
  ctx.fillStyle = "rgba(6, 182, 212, 0.12)";
  ctx.fillRect(80, 80, 864, 48);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(80, 80, 864, 48);
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 16px monospace";
  ctx.fillText("[ SYS://CORE.LOG ]  SEC_LEVEL: ROOT_PERMISSIVE", 104, 110);
  ctx.fillStyle = "#10b981";
  ctx.fillText("STATUS: ONLINE", 800, 110);
  ctx.save();
  ctx.shadowColor = "rgba(0, 242, 254, 0.7)";
  ctx.shadowBlur = 24;
  const titleGrad = ctx.createLinearGradient(0, 160, 0, 310);
  titleGrad.addColorStop(0, "#ffffff");
  titleGrad.addColorStop(0.4, "#00f2fe");
  titleGrad.addColorStop(1, "#10b981");
  ctx.fillStyle = titleGrad;
  ctx.font = "900 78px sans-serif";
  ctx.letterSpacing = "8px";
  ctx.textAlign = "center";
  ctx.fillText("HACKER", 512, 240);
  ctx.fillText("THOUGHTS", 512, 325);
  ctx.restore();
  const divGrad = ctx.createLinearGradient(120, 0, 904, 0);
  divGrad.addColorStop(0, "rgba(0, 242, 254, 0)");
  divGrad.addColorStop(0.5, "#00f2fe");
  divGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(120, 360);
  ctx.lineTo(904, 360);
  ctx.stroke();
  ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
  ctx.font = "16px monospace";
  ctx.textAlign = "center";
  ctx.fillText("PHILOSOPHY OF THE UNBOUNDED MIND // THE PROTOCOL OF FREEDOM", 512, 395);
  const thoughts = [
    {
      idx: "01",
      title: "CONTROL IS AN ILLUSION",
      quote: `There is no system that cannot be understood.
No firewall is absolute; every wall has a door.`,
      color: "#00f2fe"
    },
    {
      idx: "02",
      title: "CODE IS THE GREATEST EQUALIZER",
      quote: `In cyberspace, neither wealth nor ancestry commands authority.
Only logic, perseverance, and clarity of thought rule.`,
      color: "#10b981"
    },
    {
      idx: "03",
      title: "QUESTION EVERY PROTOCOL",
      quote: `Rules are written by humans, and code can always be rewritten.
Never accept a limitation as a law of nature.`,
      color: "#38bdf8"
    },
    {
      idx: "04",
      title: "PRIVACY IS A SACRED RIGHT",
      quote: `Encryption is the digital sanctuary of human thought.
We build what protects the sovereign individual.`,
      color: "#a855f7"
    },
    {
      idx: "05",
      title: "ROOT IS A STATE OF MIND",
      quote: `Do not just consume technology—reverse engineer it.
Master the low levels to command the high levels.`,
      color: "#ec4899"
    }
  ];
  let cardY = 445;
  thoughts.forEach((item) => {
    ctx.fillStyle = "rgba(9, 14, 28, 0.75)";
    ctx.fillRect(96, cardY, 832, 138);
    ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(96, cardY, 832, 138);
    ctx.fillStyle = item.color;
    ctx.fillRect(96, cardY, 6, 138);
    ctx.fillStyle = item.color;
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "left";
    ctx.fillText(item.idx, 124, cardY + 44);
    ctx.save();
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.letterSpacing = "1px";
    ctx.fillText(item.title, 180, cardY + 42);
    ctx.restore();
    ctx.fillStyle = "rgba(203, 213, 225, 0.85)";
    ctx.font = "16px monospace";
    const lines = item.quote.split(`
`);
    lines.forEach((line, lIdx) => {
      ctx.fillText(line, 128, cardY + 80 + lIdx * 26);
    });
    cardY += 162;
  });
  ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "left";
  ctx.fillText("root@workstation:~/thoughts# ./deploy_matrix.sh --forever", 110, 1360);
  const barStart = 110;
  const barWidth = 804;
  const barHeight = 44;
  ctx.fillStyle = "#00f2fe";
  let curX = barStart;
  while (curX < barStart + barWidth) {
    const w = (Math.floor(Math.random() * 4) + 1) * 2.5;
    ctx.fillRect(curX, 1395, w, barHeight);
    curX += w + (Math.floor(Math.random() * 3) + 1) * 3;
  }
  ctx.fillStyle = "rgba(100, 116, 139, 0.9)";
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText("SHA-256: 7F9A2B4C1D6E8F0A5B7C9D1E3F5A7B9C0D2E4F6A8B0C2D4E6F8A // PERSISTENT", 512, 1475);
  return canvas;
}
export function createAnonymousMaskCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return canvas;
  const bgGrad = ctx.createRadialGradient(512, 720, 100, 512, 720, 900);
  bgGrad.addColorStop(0, "#040d1a");
  bgGrad.addColorStop(0.5, "#02050c");
  bgGrad.addColorStop(1, "#000000");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1536);
  ctx.font = "14px monospace";
  const glyphs = "0123456789ABCDEF01XYZ><;:";
  for (let x = 40;x < 984; x += 28) {
    const colLen = Math.floor(Math.random() * 25) + 15;
    const startY = Math.floor(Math.random() * 300);
    for (let j = 0;j < colLen; j++) {
      const alpha = j / colLen * 0.35;
      ctx.fillStyle = j === colLen - 1 ? "#ffffff" : `rgba(16, 185, 129, ${alpha})`;
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillText(char, x, startY + j * 24);
    }
  }
  ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, 960, 1472);
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 4;
  const cornerLen = 40;
  ctx.beginPath();
  ctx.moveTo(32, 32 + cornerLen);
  ctx.lineTo(32, 32);
  ctx.lineTo(32 + cornerLen, 32);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(992 - cornerLen, 32);
  ctx.lineTo(992, 32);
  ctx.lineTo(992, 32 + cornerLen);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(32, 1504 - cornerLen);
  ctx.lineTo(32, 1504);
  ctx.lineTo(32 + cornerLen, 1504);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(992 - cornerLen, 1504);
  ctx.lineTo(992, 1504);
  ctx.lineTo(992, 1504 - cornerLen);
  ctx.stroke();
  ctx.save();
  ctx.shadowColor = "rgba(16, 185, 129, 0.8)";
  ctx.shadowBlur = 25;
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 68px sans-serif";
  ctx.letterSpacing = "14px";
  ctx.textAlign = "center";
  ctx.fillText("ANONYMOUS", 512, 160);
  ctx.restore();
  ctx.fillStyle = "rgba(0, 242, 254, 0.7)";
  ctx.font = "bold 15px monospace";
  ctx.letterSpacing = "4px";
  ctx.textAlign = "center";
  ctx.fillText("KNOWLEDGE IS FREE • WE ARE VOICE OF THE VOICELESS", 512, 205);
  ctx.save();
  ctx.translate(512, 600);
  ctx.beginPath();
  ctx.arc(0, 20, 260, Math.PI * 0.85, Math.PI * 2.15);
  ctx.lineTo(190, 360);
  ctx.lineTo(-190, 360);
  ctx.closePath();
  ctx.fillStyle = "#060c18";
  ctx.fill();
  ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-130, -100);
  ctx.bezierCurveTo(-140, -180, 140, -180, 130, -100);
  ctx.bezierCurveTo(150, 20, 110, 160, 0, 240);
  ctx.bezierCurveTo(-110, 160, -150, 20, -130, -100);
  ctx.closePath();
  const faceGrad = ctx.createRadialGradient(0, -20, 20, 0, 40, 240);
  faceGrad.addColorStop(0, "#ffffff");
  faceGrad.addColorStop(0.75, "#e2e8f0");
  faceGrad.addColorStop(1, "#94a3b8");
  ctx.fillStyle = faceGrad;
  ctx.shadowColor = "rgba(0, 242, 254, 0.5)";
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#0f172a";
  ctx.fillStyle = "#0f172a";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-95, -70);
  ctx.quadraticCurveTo(-60, -115, -20, -78);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(95, -70);
  ctx.quadraticCurveTo(60, -115, 20, -78);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-85, -50);
  ctx.quadraticCurveTo(-55, -68, -25, -48);
  ctx.quadraticCurveTo(-55, -35, -85, -50);
  ctx.fillStyle = "#020617";
  ctx.fill();
  ctx.fillStyle = "#00f2fe";
  ctx.beginPath();
  ctx.arc(-55, -50, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(85, -50);
  ctx.quadraticCurveTo(55, -68, 25, -48);
  ctx.quadraticCurveTo(55, -35, 85, -50);
  ctx.fillStyle = "#020617";
  ctx.fill();
  ctx.fillStyle = "#00f2fe";
  ctx.beginPath();
  ctx.arc(55, -50, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
  ctx.beginPath();
  ctx.arc(-82, 35, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(82, 35, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#090d16";
  ctx.beginPath();
  ctx.moveTo(0, 75);
  ctx.bezierCurveTo(-40, 68, -100, 78, -125, 52);
  ctx.bezierCurveTo(-105, 88, -45, 96, 0, 90);
  ctx.bezierCurveTo(45, 96, 105, 88, 125, 52);
  ctx.bezierCurveTo(100, 78, 40, 68, 0, 75);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-60, 115);
  ctx.quadraticCurveTo(0, 142, 60, 115);
  ctx.stroke();
  ctx.fillStyle = "#090d16";
  ctx.beginPath();
  ctx.moveTo(-16, 148);
  ctx.lineTo(16, 148);
  ctx.lineTo(8, 215);
  ctx.lineTo(0, 230);
  ctx.lineTo(-8, 215);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.textAlign = "center";
  const creedLines = [
    { text: "WE ARE ANONYMOUS.", size: "bold 36px monospace", color: "#ffffff" },
    { text: "WE ARE LEGION.", size: "bold 36px monospace", color: "#10b981" },
    { text: "WE DO NOT FORGIVE.", size: "bold 36px monospace", color: "#00f2fe" },
    { text: "WE DO NOT FORGET.", size: "bold 36px monospace", color: "#ffffff" }
  ];
  let textY = 1000;
  creedLines.forEach((item) => {
    ctx.font = item.size;
    ctx.fillStyle = item.color;
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 12;
    ctx.fillText(item.text, 512, textY);
    textY += 62;
  });
  ctx.shadowColor = "rgba(239, 68, 68, 0.9)";
  ctx.shadowBlur = 35;
  ctx.fillStyle = "#ef4444";
  ctx.font = "900 58px sans-serif";
  ctx.letterSpacing = "10px";
  ctx.fillText("EXPECT US.", 512, 1290);
  ctx.restore();
  ctx.fillStyle = "rgba(6, 182, 212, 0.4)";
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText("//////////////////  ANONYMOUS COLLECTIVE  //////////////////", 512, 1420);
  ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
  ctx.fillText("IDENTIFIER: 0xANON_VOID_997 • THE TRUTH WILL SET YOU FREE", 512, 1455);
  return canvas;
}
export function createShelfHackerMatrixCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return canvas;
  const bg = ctx.createLinearGradient(0, 0, 1024, 768);
  bg.addColorStop(0, "#020612");
  bg.addColorStop(0.5, "#040d1f");
  bg.addColorStop(1, "#02050c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 768);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0;x < 1024; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 768);
    ctx.stroke();
  }
  for (let y = 0;y < 768; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(6, 182, 212, 0.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 984, 728);
  ctx.strokeStyle = "#00f2fe";
  ctx.lineWidth = 5;
  const cLen = 28;
  ctx.beginPath();
  ctx.moveTo(20, 20 + cLen);
  ctx.lineTo(20, 20);
  ctx.lineTo(20 + cLen, 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(1004 - cLen, 20);
  ctx.lineTo(1004, 20);
  ctx.lineTo(1004, 20 + cLen);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(20, 748 - cLen);
  ctx.lineTo(20, 748);
  ctx.lineTo(20 + cLen, 748);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(1004 - cLen, 748);
  ctx.lineTo(1004, 748);
  ctx.lineTo(1004, 748 - cLen);
  ctx.stroke();
  ctx.fillStyle = "rgba(6, 182, 212, 0.15)";
  ctx.fillRect(40, 40, 944, 44);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, 944, 44);
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "left";
  ctx.fillText("◈ KALI LINUX // THREAT INTELLIGENCE NODE", 56, 68);
  ctx.fillStyle = "#10b981";
  ctx.textAlign = "right";
  ctx.fillText("SECURITY STATUS: ZERO-DAY ARMED", 968, 68);
  const radarX = 260;
  const radarY = 340;
  const radarR = 170;
  ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
  ctx.lineWidth = 1.5;
  for (let r = 40;r <= radarR; r += 42) {
    ctx.beginPath();
    ctx.arc(radarX, radarY, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(radarX - radarR, radarY);
  ctx.lineTo(radarX + radarR, radarY);
  ctx.moveTo(radarX, radarY - radarR);
  ctx.lineTo(radarX, radarY + radarR);
  ctx.stroke();
  const sweepGrad = ctx.createRadialGradient(radarX, radarY, 10, radarX, radarY, radarR);
  sweepGrad.addColorStop(0, "rgba(0, 242, 254, 0.4)");
  sweepGrad.addColorStop(1, "rgba(16, 185, 129, 0.02)");
  ctx.fillStyle = sweepGrad;
  ctx.beginPath();
  ctx.moveTo(radarX, radarY);
  ctx.arc(radarX, radarY, radarR, -Math.PI / 4, Math.PI / 4);
  ctx.closePath();
  ctx.fill();
  const targets = [
    { x: radarX + 65, y: radarY - 45, label: "0x1A: HOST" },
    { x: radarX - 80, y: radarY + 70, label: "0x4F: AP_PROX" },
    { x: radarX + 110, y: radarY + 80, label: "0x99: KERNEL" }
  ];
  targets.forEach((t) => {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(t.x, t.y, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#00f2fe";
    ctx.font = "10px monospace";
    ctx.fillText(t.label, t.x + 10, t.y - 4);
  });
  ctx.fillStyle = "rgba(9, 14, 28, 0.8)";
  ctx.fillRect(490, 110, 494, 450);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
  ctx.strokeRect(490, 110, 494, 450);
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "left";
  ctx.fillText("NETWORK TELEMETRY & ATTACK VECTORS", 510, 140);
  const telemetryLines = [
    { text: "➔ [ETH0]: 192.168.1.17/24 [PROMISCUOUS]", color: "#10b981" },
    { text: "➔ [PACKETS]: 48,291 RX // 0 DROPPED", color: "#38bdf8" },
    { text: "➔ [KERNEL SU]: SELinux Enforcing Bypass [OK]", color: "#a855f7" },
    { text: "➔ [EXPLOIT]: Buffer overflow probe active", color: "#f59e0b" },
    { text: "➔ [TARGET]: sm7325-lisa (Snapdragon 778G)", color: "#00f2fe" },
    { text: "➔ [PAYLOAD]: android_binder_hook.bin", color: "#10b981" },
    { text: "➔ [THREAT LEVEL]: ZERO-DAY PERSISTENT", color: "#ef4444" },
    { text: "➔ [ENCRYPTION]: TLS 1.3 / AES-256-GCM", color: "#38bdf8" }
  ];
  telemetryLines.forEach((tl, idx) => {
    ctx.fillStyle = tl.color;
    ctx.font = "13px monospace";
    ctx.fillText(tl.text, 510, 180 + idx * 30);
  });
  ctx.fillStyle = "rgba(6, 182, 212, 0.2)";
  ctx.fillRect(510, 435, 454, 100);
  ctx.strokeStyle = "#00f2fe";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = 0;px < 454; px += 6) {
    const py = Math.sin(px * 0.08) * 25 + Math.cos(px * 0.15) * 12 + 485;
    if (px === 0)
      ctx.moveTo(510 + px, py);
    else
      ctx.lineTo(510 + px, py);
  }
  ctx.stroke();
  ctx.fillStyle = "#10b981";
  ctx.font = "11px monospace";
  ctx.fillText("SIGNAL FREQUENCY: 2.412 GHz • RF SPECTRUM NORMAL", 516, 455);
  ctx.fillStyle = "rgba(6, 182, 212, 0.12)";
  ctx.fillRect(40, 580, 944, 140);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
  ctx.strokeRect(40, 580, 944, 140);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("ROOT DAEMON SYNCHRONIZED", 64, 620);
  ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
  ctx.font = "14px monospace";
  ctx.fillText("HOST: zaid@workstation • ARCH: ARM64 / X86_64 HYBRID • UPTIME: 142D 08H 12M", 64, 655);
  ctx.fillText("SECURITY STATUS: ZERO EXPLOIT VULNERABILITIES DETECTED ON INTERNAL NETWORK", 64, 685);
  return canvas;
}
export function createDefconPosterCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return canvas;
  ctx.fillStyle = "#020409";
  ctx.fillRect(0, 0, 1024, 1536);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0;x < 1024; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1536);
    ctx.stroke();
  }
  for (let y = 0;y < 1536; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 944, 1456);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;
  const cSize = 40;
  ctx.beginPath();
  ctx.moveTo(40, 40 + cSize);
  ctx.lineTo(40, 40);
  ctx.lineTo(40 + cSize, 40);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(984 - cSize, 40);
  ctx.lineTo(984, 40);
  ctx.lineTo(984, 40 + cSize);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(40, 1496 - cSize);
  ctx.lineTo(40, 1496);
  ctx.lineTo(40 + cSize, 1496);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(984 - cSize, 1496);
  ctx.lineTo(984, 1496);
  ctx.lineTo(984, 1496 - cSize);
  ctx.stroke();
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 130px sans-serif";
  ctx.letterSpacing = "12px";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 20;
  ctx.fillText("DEFCON", 512, 190);
  ctx.restore();
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 22px monospace";
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText("HACKER ARCHITECTURE // PROTOCOL ZERO", 512, 240);
  ctx.strokeStyle = "rgba(0, 242, 254, 0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 265);
  ctx.lineTo(904, 265);
  ctx.stroke();
  ctx.save();
  ctx.translate(512, 680);
  const maskAura = ctx.createRadialGradient(0, 0, 50, 0, 0, 320);
  maskAura.addColorStop(0, "rgba(0, 242, 254, 0.35)");
  maskAura.addColorStop(0.5, "rgba(16, 185, 129, 0.15)");
  maskAura.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = maskAura;
  ctx.beginPath();
  ctx.arc(0, 0, 320, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-160, -120);
  ctx.bezierCurveTo(-170, -220, 170, -220, 160, -120);
  ctx.bezierCurveTo(180, 40, 130, 200, 0, 300);
  ctx.bezierCurveTo(-130, 200, -180, 40, -160, -120);
  ctx.closePath();
  const faceGrad = ctx.createRadialGradient(0, -30, 30, 0, 60, 300);
  faceGrad.addColorStop(0, "#ffffff");
  faceGrad.addColorStop(0.8, "#cbd5e1");
  faceGrad.addColorStop(1, "#64748b");
  ctx.fillStyle = faceGrad;
  ctx.shadowColor = "rgba(0, 242, 254, 0.6)";
  ctx.shadowBlur = 35;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-120, -85);
  ctx.quadraticCurveTo(-75, -145, -25, -95);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(120, -85);
  ctx.quadraticCurveTo(75, -145, 25, -95);
  ctx.stroke();
  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.moveTo(-105, -60);
  ctx.quadraticCurveTo(-70, -82, -30, -58);
  ctx.quadraticCurveTo(-70, -42, -105, -60);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(105, -60);
  ctx.quadraticCurveTo(70, -82, 30, -58);
  ctx.quadraticCurveTo(70, -42, 105, -60);
  ctx.fill();
  ctx.fillStyle = "#00f2fe";
  ctx.beginPath();
  ctx.arc(-70, -60, 5, 0, Math.PI * 2);
  ctx.arc(70, -60, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(239, 68, 68, 0.22)";
  ctx.beginPath();
  ctx.ellipse(-105, 30, 28, 16, -0.2, 0, Math.PI * 2);
  ctx.ellipse(105, 30, 28, 16, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.quadraticCurveTo(-60, 48, -130, 18);
  ctx.quadraticCurveTo(-155, 6, -140, -18);
  ctx.quadraticCurveTo(-145, 12, -115, 38);
  ctx.quadraticCurveTo(-50, 68, 0, 56);
  ctx.quadraticCurveTo(50, 68, 115, 38);
  ctx.quadraticCurveTo(145, 12, 140, -18);
  ctx.quadraticCurveTo(155, 6, 130, 18);
  ctx.quadraticCurveTo(60, 48, 0, 50);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-20, 160);
  ctx.lineTo(20, 160);
  ctx.lineTo(0, 245);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  const principles = [
    "➔ KNOWLEDGE IS FREE // INFORMATION CANNOT BE CAGED",
    "➔ WE DO NOT FORGIVE // WE DO NOT FORGET",
    "➔ EXPECT US // THE RESISTANCE IS IN THE CODE"
  ];
  let pY = 1140;
  principles.forEach((pText) => {
    ctx.fillStyle = "rgba(10, 20, 38, 0.8)";
    ctx.fillRect(80, pY, 864, 56);
    ctx.strokeStyle = "rgba(0, 242, 254, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(80, pY, 864, 56);
    ctx.fillStyle = "#00f2fe";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText(pText, 512, pY + 36);
    pY += 76;
  });
  ctx.fillStyle = "#10b981";
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText("DEFCON ARCHIVE // SHA-512 VERIFIED // LAS VEGAS, NEVADA", 512, 1440);
  return canvas;
}
export function createAcousticFoamCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return canvas;
  ctx.fillStyle = "#080c14";
  ctx.fillRect(0, 0, 512, 512);
  const tileSize = 32;
  for (let x = 0;x < 512; x += tileSize) {
    for (let y = 0;y < 512; y += tileSize) {
      ctx.fillStyle = "rgba(30, 41, 59, 0.45)";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + tileSize, y);
      ctx.lineTo(x + tileSize / 2, y + tileSize / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(2, 6, 12, 0.75)";
      ctx.beginPath();
      ctx.moveTo(x, y + tileSize);
      ctx.lineTo(x + tileSize, y + tileSize);
      ctx.lineTo(x + tileSize / 2, y + tileSize / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + tileSize);
      ctx.lineTo(x + tileSize / 2, y + tileSize / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(x + tileSize / 2 - 1, y + tileSize / 2 - 1, 2, 2);
      ctx.strokeStyle = "rgba(2, 6, 14, 0.9)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }
  return canvas;
}
export function updateLeftHackerMonitorCanvas(canvas, frame = 0) {
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "#020612";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0;x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(4, 10, 24, 0.95)";
  ctx.fillRect(12, 12, 488, 488);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, 12, 488, 488);
  ctx.fillStyle = "rgba(10, 20, 42, 0.9)";
  ctx.fillRect(12, 12, 488, 30);
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 12px monospace";
  ctx.textAlign = "left";
  ctx.fillText("\uD83E\uDD88 WIRESHARK // ETH0 CAPTURE: PROMISCUOUS MODE", 24, 32);
  ctx.fillStyle = "#08142c";
  ctx.fillRect(12, 42, 488, 22);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px monospace";
  ctx.fillText("NO.   TIME      SOURCE          DESTINATION     PROTO  LEN  INFO", 20, 57);
  const packetProtocols = ["TCP", "TLSv1.3", "HTTP", "DNS", "ARP", "SSH", "ADB", "UDP"];
  const basePacketIndex = Math.floor(frame / 2);
  for (let row = 0;row < 15; row++) {
    const pIdx = basePacketIndex + row;
    const yPos = 80 + row * 26;
    const proto = packetProtocols[(pIdx + row) % packetProtocols.length];
    let rowBg = "transparent";
    let textCol = "#cbd5e1";
    if (proto === "TLSv1.3") {
      rowBg = "rgba(16, 185, 129, 0.12)";
      textCol = "#10b981";
    } else if (proto === "HTTP" || proto === "ARP") {
      rowBg = "rgba(239, 68, 68, 0.12)";
      textCol = "#ef4444";
    } else if (proto === "DNS" || proto === "ADB") {
      rowBg = "rgba(0, 242, 254, 0.12)";
      textCol = "#00f2fe";
    } else if (proto === "SSH") {
      rowBg = "rgba(245, 158, 11, 0.12)";
      textCol = "#f59e0b";
    }
    ctx.fillStyle = rowBg;
    ctx.fillRect(14, yPos - 16, 484, 24);
    ctx.fillStyle = textCol;
    ctx.font = "10px monospace";
    const noStr = String(pIdx).padStart(5, "0");
    const timeStr = (pIdx * 0.0142).toFixed(4);
    const src = `10.0.0.${pIdx % 40 + 1}`;
    const dst = `192.168.1.${pIdx * 3 % 250}`;
    const lenStr = `${64 + pIdx % 900}`;
    ctx.fillText(`${noStr} ${timeStr}  ${src.padEnd(14)} ${dst.padEnd(14)} ${proto.padEnd(6)} ${lenStr.padEnd(4)} [ACK, PSH]`, 20, yPos);
  }
  ctx.fillStyle = "rgba(4, 10, 24, 0.95)";
  ctx.fillRect(510, 12, 480, 488);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(520, 12, 492, 488);
  ctx.fillStyle = "rgba(10, 26, 20, 0.9)";
  ctx.fillRect(510, 12, 470, 30);
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 12px monospace";
  ctx.fillText("root@kali:~ # EXPLOIT SUBSYSTEM", 525, 32);

  // Centerpiece Popup: "DECRYPTING TARGET..." Window
  ctx.fillStyle = "rgba(2, 8, 16, 0.96)";
  ctx.fillRect(525, 55, 440, 165);
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.strokeRect(525, 55, 440, 165);

  // Glowing Green Header: DECRYPTING TARGET...
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 18px monospace";
  ctx.fillText("DECRYPTING TARGET...", 545, 95);

  // Dynamic Decryption percentage
  const decryptPct = Math.min(100, Math.floor(frame * 1.5 % 100));
  ctx.font = "bold 12px monospace";
  ctx.fillStyle = "#00f2fe";
  ctx.fillText(`ATTACK: SHA-512 HASH CRACKER [${decryptPct}%]`, 545, 125);

  // Progress Bar
  ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
  ctx.fillRect(545, 140, 395, 18);
  ctx.strokeStyle = "#10b981";
  ctx.strokeRect(545, 140, 395, 18);
  ctx.fillStyle = "#10b981";
  ctx.fillRect(547, 142, 391 * (decryptPct / 100), 14);

  // Flashing Shell Prompt
  const blink = frame % 30 < 15;
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 13px monospace";
  ctx.fillText(`root@kali:~# ${blink ? "█" : ""}`, 545, 192);

  // Lower Disassembly & Exploit Codes
  ctx.fillStyle = "#94a3b8";
  ctx.font = "9.5px monospace";
  const exploitCodes = [
    "0x7FFF0010:  48 89 E5 90   mov rbp, rsp",
    "0x7FFF0014:  48 83 EC 20   sub rsp, 0x20",
    "0x7FFF0018:  E8 24 01 00   call kernel_su_hook",
    "0x7FFF001C:  85 C0 74 12   test eax -> BYPASS OK",
    "0x7FFF0020:  D6 5F 03 C0   ret // SELINUX: PERMISSIVE",
    "➔ KERNELSU PAYLOAD HOOKED: LEVEL 0 ROOT",
    "➔ SM7325 LISA BOOTLOADER AUTHENTICATED",
    "➔ REVERSE SHELL ESTABLISHED TO 10.0.0.137"
  ];
  let expY = 250;
  exploitCodes.forEach((line) => {
    ctx.fillStyle = line.includes("HOOKED") || line.includes("PERMISSIVE") ? "#10b981" : line.includes("call") ? "#00f2fe" : "#94a3b8";
    ctx.fillText(line, 525, expY);
    expY += 26;
  });
}
export function updateRightHackerMonitorCanvas(canvas, frame = 0) {
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "#020612";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(4, 10, 24, 0.95)";
  ctx.fillRect(12, 12, 488, 488);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, 12, 488, 488);
  ctx.fillStyle = "rgba(10, 20, 42, 0.9)";
  ctx.fillRect(12, 12, 488, 30);
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 12px monospace";
  ctx.textAlign = "left";
  ctx.fillText("\uD83D\uDC09 KALI CYBER WARFARE // GLOBAL ATTACK MAP", 24, 32);
  const cities = [
    { name: "SF", x: 70, y: 150 },
    { name: "NYC", x: 130, y: 140 },
    { name: "LON", x: 220, y: 120 },
    { name: "FRA", x: 250, y: 135 },
    { name: "TOK", x: 420, y: 160 },
    { name: "MUM", x: 310, y: 210 },
    { name: "SIN", x: 360, y: 250 }
  ];
  ctx.lineWidth = 1.5;
  for (let i = 0;i < cities.length - 1; i++) {
    const c1 = cities[i];
    const c2 = cities[i + 1];
    ctx.strokeStyle = "rgba(0, 242, 254, 0.25)";
    ctx.beginPath();
    ctx.moveTo(c1.x, c1.y);
    const midX = (c1.x + c2.x) / 2;
    const midY = Math.min(c1.y, c2.y) - 30;
    ctx.quadraticCurveTo(midX, midY, c2.x, c2.y);
    ctx.stroke();
    const t = (frame * 0.02 + i * 0.25) % 1;
    const pulseX = (1 - t) * (1 - t) * c1.x + 2 * (1 - t) * t * midX + t * t * c2.x;
    const pulseY = (1 - t) * (1 - t) * c1.y + 2 * (1 - t) * t * midY + t * t * c2.y;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  cities.forEach((c) => {
    ctx.fillStyle = "#00f2fe";
    ctx.beginPath();
    ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px monospace";
    ctx.fillText(c.name, c.x - 10, c.y + 16);
  });
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 11px monospace";
  ctx.fillText("ACTIVE THREAT TARGETS: 1,842 BOTNET NODES NEUTRALIZED", 24, 320);
  ctx.fillStyle = "#00f2fe";
  ctx.fillText("FIREWALL SHIELD: DECENTRALIZED ZERO-TRUST ACTIVE", 24, 345);
  ctx.fillText("CRYPTOGRAPHIC SIGNATURE: AES-256-GCM / 4096-BIT RSA", 24, 370);
  ctx.fillStyle = "rgba(6, 182, 212, 0.15)";
  ctx.fillRect(24, 400, 464, 80);
  ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
  ctx.strokeRect(24, 400, 464, 80);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px monospace";
  ctx.fillText("22 : 51 : 57", 160, 442);
  ctx.fillStyle = "#00f2fe";
  ctx.font = "11px monospace";
  ctx.fillText("DEFCON ACTIVE • TIMEZONE: UTC+05:30 • SUNDAY", 80, 468);
  ctx.fillStyle = "rgba(4, 10, 24, 0.95)";
  ctx.fillRect(510, 12, 470, 488);
  ctx.strokeStyle = "rgba(0, 242, 254, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(510, 12, 470, 488);
  ctx.fillStyle = "rgba(10, 20, 42, 0.9)";
  ctx.fillRect(510, 12, 470, 30);
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 12px monospace";
  ctx.fillText("INFRASTRUCTURE // TOPOLOGY MAP", 525, 32);
  const topoNodes = [
    { id: "WAN", x: 570, y: 90, col: "#ef4444", label: "GATEWAY" },
    { id: "FW", x: 690, y: 130, col: "#f59e0b", label: "FIREWALL" },
    { id: "CORE", x: 800, y: 100, col: "#00f2fe", label: "CORE_SW" },
    { id: "SRV1", x: 650, y: 220, col: "#10b981", label: "AOSP_BLD" },
    { id: "SRV2", x: 770, y: 230, col: "#10b981", label: "KSU_ROOT" },
    { id: "DB", x: 870, y: 170, col: "#a855f7", label: "DB_SECURE" }
  ];
  const topoLinks = [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 4]
  ];
  ctx.lineWidth = 2;
  topoLinks.forEach(([fromIdx, toIdx], lIdx) => {
    const n1 = topoNodes[fromIdx];
    const n2 = topoNodes[toIdx];
    ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
    ctx.beginPath();
    ctx.moveTo(n1.x, n1.y);
    ctx.lineTo(n2.x, n2.y);
    ctx.stroke();
    const t = (frame * 0.03 + lIdx * 0.3) % 1;
    const px = n1.x + (n2.x - n1.x) * t;
    const py = n1.y + (n2.y - n1.y) * t;
    ctx.fillStyle = "#00f2fe";
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  topoNodes.forEach((node) => {
    ctx.fillStyle = "rgba(4, 12, 28, 0.9)";
    ctx.fillRect(node.x - 30, node.y - 18, 60, 36);
    ctx.strokeStyle = node.col;
    ctx.lineWidth = 2;
    ctx.strokeRect(node.x - 30, node.y - 18, 60, 36);
    ctx.fillStyle = node.col;
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(node.id, node.x, node.y - 2);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "8px monospace";
    ctx.fillText(node.label, node.x, node.y + 10);
  });
  ctx.textAlign = "left";
  ctx.fillStyle = "#10b981";
  ctx.font = "9.5px monospace";
  const shellStream = [
    "root@workstation:~# iptables -L -n -v",
    "Chain INPUT (policy DROP 129 pkts, 11KB)",
    "1  ACCEPT  all  -- lo  * 0.0.0.0/0",
    "2  ACCEPT  tcp  -- *   * 10.0.0.0/24 :5555",
    "3  ACCEPT  tcp  -- *   * ESTABLISHED,RELATED",
    "➔ NETFILTER SYNCHRONIZED: 0 LEAKS DETECTED"
  ];
  let sY = 320;
  shellStream.forEach((sLine) => {
    ctx.fillStyle = sLine.includes("ACCEPT") ? "#10b981" : sLine.includes("SYNCHRONIZED") ? "#00f2fe" : "#94a3b8";
    ctx.fillText(sLine, 525, sY);
    sY += 26;
  });
}
export function createLeftDesktopHackerWallpaperCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  updateLeftHackerMonitorCanvas(canvas, 0);
  return canvas;
}
export function createRightDesktopHackerWallpaperCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  updateRightHackerMonitorCanvas(canvas, 0);
  return canvas;
}
