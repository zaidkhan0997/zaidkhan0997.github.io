/**
 * Procedural High-Definition Canvas Textures for Cyberpunk Workstation Wall Posters & Displays
 * - Poster 1: "Hacker Thoughts" (Philosophical hacker axioms & cybernetic circuit HUD)
 * - Poster 2: "Anonymous Mask" (Iconic Guy Fawkes hacker mask with Matrix rain & manifesto)
 * - Shelf Display: "Kali Cyber Threat Radar" (High-tech exploit & network monitor replacing shelf doodle)
 * - Laptop Display: "Live Hacker Kernel Terminal" (3D Screen displaying real-time Linux compilation)
 */

export const KERNEL_TERMINAL_LOGS = [
  '[  0.000000] Linux version 5.4.242-android12-9-zaid-kernel+ (zaid@workstation) (LLVM 17.0.6)',
  '[  0.000214] Command line: console=ttyMSM0,115200n8 androidboot.hardware=qcom bootdevice=1d84000.ufshc',
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
];

export function updateLaptopTerminalCanvas(
  canvas: HTMLCanvasElement,
  logOffset: number = 0,
  cursorBlink: boolean = true
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Background
  ctx.fillStyle = '#020612';
  ctx.fillRect(0, 0, w, h);

  // CRT scanlines
  ctx.fillStyle = 'rgba(0, 242, 254, 0.02)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 2);
  }

  // Window Top Bar
  ctx.fillStyle = '#080e1c';
  ctx.fillRect(0, 0, w, 44);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, w, 44);

  // Window buttons
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(24, 22, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(44, 22, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(64, 22, 6, 0, Math.PI * 2);
  ctx.fill();

  // Window Title
  ctx.fillStyle = '#00f2fe';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('zaid@workstation: ~/android/kernel/xiaomi-lisa', 88, 27);

  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'right';
  ctx.fillText('● COMPILER ACTIVE [CLANG 17]', w - 24, 27);

  // Subheader Telemetry
  ctx.fillStyle = 'rgba(4, 11, 24, 0.85)';
  ctx.fillRect(0, 44, w, 32);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.strokeRect(0, 44, w, 32);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('CPU: ARM64 8-Core (Kryo 670)  |  RAM: 14.6/32 GB  |  SELinux: Permissive (Root)', 20, 65);

  ctx.fillStyle = '#00f2fe';
  ctx.textAlign = 'right';
  ctx.fillText('FASTBOOTD LINKED [0x2717]', w - 20, 65);

  // Terminal Logs
  ctx.font = '13px monospace';
  ctx.textAlign = 'left';

  const visibleCount = 17;
  const startIdx = Math.max(0, logOffset % (KERNEL_TERMINAL_LOGS.length - 8));
  const activeSlice = KERNEL_TERMINAL_LOGS.slice(startIdx, startIdx + visibleCount);

  let textY = 105;
  activeSlice.forEach((line, idx) => {
    const isOk = line.includes('SUCCESS') || line.includes('[OK]');
    const isFlash = line.includes('FLASHING') || line.includes('LINK');
    const isCpu = line.includes('CPU') || line.includes('MEMORY');

    ctx.fillStyle = 'rgba(100, 116, 139, 0.7)';
    ctx.fillText(String(startIdx + idx + 1).padStart(3, '0'), 20, textY);

    if (isOk) ctx.fillStyle = '#10b981';
    else if (isFlash) ctx.fillStyle = '#00f2fe';
    else if (isCpu) ctx.fillStyle = '#38bdf8';
    else ctx.fillStyle = '#cbd5e1';

    ctx.fillText(line, 60, textY);
    textY += 28;
  });

  // Prompt Line
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('zaid@workstation:~/kernel# ./build_kernel.sh --target=lisa', 20, textY + 10);

  if (cursorBlink) {
    ctx.fillStyle = '#00f2fe';
    ctx.fillRect(580, textY - 4, 10, 18);
  }
}

export function createLaptopTerminalCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 672; // 16:10 aspect ratio matching MacBook Pro screen
  updateLaptopTerminalCanvas(canvas, 0, true);
  return canvas;
}

export function createHackerThoughtsCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Deep Obsidian Cyber Background with Subtle Neon Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1536);
  bgGrad.addColorStop(0, '#030712');
  bgGrad.addColorStop(0.35, '#040d21');
  bgGrad.addColorStop(0.7, '#020617');
  bgGrad.addColorStop(1, '#050c1f');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1536);

  // 2. Faint Cybernetic Grid Pattern
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 48;
  for (let x = 0; x < 1024; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1536);
    ctx.stroke();
  }
  for (let y = 0; y < 1536; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // 3. Faint Binary Columns Streaming on Margins
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.font = '14px monospace';
  const binaryCols = [40, 64, 88, 936, 960, 984];
  const binaryLines = 50;
  binaryCols.forEach((colX) => {
    for (let i = 0; i < binaryLines; i++) {
      const bit = Math.random() > 0.5 ? '1' : '0';
      ctx.fillText(bit, colX, 80 + i * 28);
    }
  });

  // 4. Poster Outer Cyber Border & Corner Brackets
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, 960, 1472);

  // Corner Accents
  ctx.strokeStyle = '#00f2fe';
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

  // 5. Header HUD Bar
  ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
  ctx.fillRect(80, 80, 864, 48);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(80, 80, 864, 48);

  ctx.fillStyle = '#00f2fe';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('[ SYS://CORE.LOG ]  SEC_LEVEL: ROOT_PERMISSIVE', 104, 110);
  ctx.fillStyle = '#10b981';
  ctx.fillText('STATUS: ONLINE', 800, 110);

  // 6. Huge Bold Title: "HACKER THOUGHTS"
  ctx.save();
  ctx.shadowColor = 'rgba(0, 242, 254, 0.7)';
  ctx.shadowBlur = 24;

  const titleGrad = ctx.createLinearGradient(0, 160, 0, 310);
  titleGrad.addColorStop(0, '#ffffff');
  titleGrad.addColorStop(0.4, '#00f2fe');
  titleGrad.addColorStop(1, '#10b981');
  ctx.fillStyle = titleGrad;

  ctx.font = '900 78px sans-serif';
  ctx.letterSpacing = '8px';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER', 512, 240);
  ctx.fillText('THOUGHTS', 512, 325);
  ctx.restore();

  // Divider Line
  const divGrad = ctx.createLinearGradient(120, 0, 904, 0);
  divGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
  divGrad.addColorStop(0.5, '#00f2fe');
  divGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(120, 360);
  ctx.lineTo(904, 360);
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PHILOSOPHY OF THE UNBOUNDED MIND // THE PROTOCOL OF FREEDOM', 512, 395);

  // 7. Thought Axiom Cards
  const thoughts = [
    {
      idx: '01',
      title: 'CONTROL IS AN ILLUSION',
      quote: 'There is no system that cannot be understood.\nNo firewall is absolute; every wall has a door.',
      color: '#00f2fe',
    },
    {
      idx: '02',
      title: 'CODE IS THE GREATEST EQUALIZER',
      quote: 'In cyberspace, neither wealth nor ancestry commands authority.\nOnly logic, perseverance, and clarity of thought rule.',
      color: '#10b981',
    },
    {
      idx: '03',
      title: 'QUESTION EVERY PROTOCOL',
      quote: 'Rules are written by humans, and code can always be rewritten.\nNever accept a limitation as a law of nature.',
      color: '#38bdf8',
    },
    {
      idx: '04',
      title: 'PRIVACY IS A SACRED RIGHT',
      quote: 'Encryption is the digital sanctuary of human thought.\nWe build what protects the sovereign individual.',
      color: '#a855f7',
    },
    {
      idx: '05',
      title: 'ROOT IS A STATE OF MIND',
      quote: 'Do not just consume technology—reverse engineer it.\nMaster the low levels to command the high levels.',
      color: '#ec4899',
    },
  ];

  let cardY = 445;
  thoughts.forEach((item) => {
    ctx.fillStyle = 'rgba(9, 14, 28, 0.75)';
    ctx.fillRect(96, cardY, 832, 138);

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(96, cardY, 832, 138);

    ctx.fillStyle = item.color;
    ctx.fillRect(96, cardY, 6, 138);

    ctx.fillStyle = item.color;
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(item.idx, 124, cardY + 44);

    ctx.save();
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(item.title, 180, cardY + 42);
    ctx.restore();

    ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
    ctx.font = '16px monospace';
    const lines = item.quote.split('\n');
    lines.forEach((line, lIdx) => {
      ctx.fillText(line, 128, cardY + 80 + lIdx * 26);
    });

    cardY += 162;
  });

  // 8. Bottom Barcode & Terminal Prompt
  ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('root@workstation:~/thoughts# ./deploy_matrix.sh --forever', 110, 1360);

  // Digital Barcode
  const barStart = 110;
  const barWidth = 804;
  const barHeight = 44;
  ctx.fillStyle = '#00f2fe';
  let curX = barStart;
  while (curX < barStart + barWidth) {
    const w = (Math.floor(Math.random() * 4) + 1) * 2.5;
    ctx.fillRect(curX, 1395, w, barHeight);
    curX += w + (Math.floor(Math.random() * 3) + 1) * 3;
  }

  // Footer Hash
  ctx.fillStyle = 'rgba(100, 116, 139, 0.9)';
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SHA-256: 7F9A2B4C1D6E8F0A5B7C9D1E3F5A7B9C0D2E4F6A8B0C2D4E6F8A // PERSISTENT', 512, 1475);

  return canvas;
}

export function createAnonymousMaskCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Deep Midnight Black Background
  const bgGrad = ctx.createRadialGradient(512, 720, 100, 512, 720, 900);
  bgGrad.addColorStop(0, '#040d1a');
  bgGrad.addColorStop(0.5, '#02050c');
  bgGrad.addColorStop(1, '#000000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1536);

  // 2. Vertical Matrix Code Rain in Background
  ctx.font = '14px monospace';
  const glyphs = '0123456789ABCDEF01XYZ><;:';
  for (let x = 40; x < 984; x += 28) {
    const colLen = Math.floor(Math.random() * 25) + 15;
    const startY = Math.floor(Math.random() * 300);
    for (let j = 0; j < colLen; j++) {
      const alpha = (j / colLen) * 0.35;
      ctx.fillStyle = j === colLen - 1 ? '#ffffff' : `rgba(16, 185, 129, ${alpha})`;
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillText(char, x, startY + j * 24);
    }
  }

  // 3. Cyber Framing
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, 960, 1472);

  // Corner crosshairs
  ctx.strokeStyle = '#10b981';
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

  // 4. Header: ANONYMOUS
  ctx.save();
  ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px sans-serif';
  ctx.letterSpacing = '14px';
  ctx.textAlign = 'center';
  ctx.fillText('ANONYMOUS', 512, 160);
  ctx.restore();

  ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
  ctx.font = 'bold 15px monospace';
  ctx.letterSpacing = '4px';
  ctx.textAlign = 'center';
  ctx.fillText('KNOWLEDGE IS FREE • WE ARE VOICE OF THE VOICELESS', 512, 205);

  // 5. Stylized Vector Guy Fawkes Anonymous Mask (Centered around Y=600)
  ctx.save();
  ctx.translate(512, 600);

  // A. Hood Silhouette Behind Mask
  ctx.beginPath();
  ctx.arc(0, 20, 260, Math.PI * 0.85, Math.PI * 2.15);
  ctx.lineTo(190, 360);
  ctx.lineTo(-190, 360);
  ctx.closePath();
  ctx.fillStyle = '#060c18';
  ctx.fill();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // B. Mask Face Porcelain Base
  ctx.beginPath();
  ctx.moveTo(-130, -100);
  ctx.bezierCurveTo(-140, -180, 140, -180, 130, -100);
  ctx.bezierCurveTo(150, 20, 110, 160, 0, 240);
  ctx.bezierCurveTo(-110, 160, -150, 20, -130, -100);
  ctx.closePath();

  const faceGrad = ctx.createRadialGradient(0, -20, 20, 0, 40, 240);
  faceGrad.addColorStop(0, '#ffffff');
  faceGrad.addColorStop(0.75, '#e2e8f0');
  faceGrad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = faceGrad;
  ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.shadowBlur = 0;

  // C. Thin Arched Black Eyebrows
  ctx.strokeStyle = '#0f172a';
  ctx.fillStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-95, -70);
  ctx.quadraticCurveTo(-60, -115, -20, -78);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(95, -70);
  ctx.quadraticCurveTo(60, -115, 20, -78);
  ctx.stroke();

  // D. Narrow Sly Eye Slits
  ctx.beginPath();
  ctx.moveTo(-85, -50);
  ctx.quadraticCurveTo(-55, -68, -25, -48);
  ctx.quadraticCurveTo(-55, -35, -85, -50);
  ctx.fillStyle = '#020617';
  ctx.fill();

  ctx.fillStyle = '#00f2fe';
  ctx.beginPath();
  ctx.arc(-55, -50, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(85, -50);
  ctx.quadraticCurveTo(55, -68, 25, -48);
  ctx.quadraticCurveTo(55, -35, 85, -50);
  ctx.fillStyle = '#020617';
  ctx.fill();

  ctx.fillStyle = '#00f2fe';
  ctx.beginPath();
  ctx.arc(55, -50, 4, 0, Math.PI * 2);
  ctx.fill();

  // E. Flushed Red/Pink Cheeks
  ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.beginPath();
  ctx.arc(-82, 35, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(82, 35, 26, 0, Math.PI * 2);
  ctx.fill();

  // F. Signature Thin Upward-Curved Mustache
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.moveTo(0, 75);
  ctx.bezierCurveTo(-40, 68, -100, 78, -125, 52);
  ctx.bezierCurveTo(-105, 88, -45, 96, 0, 90);
  ctx.bezierCurveTo(45, 96, 105, 88, 125, 52);
  ctx.bezierCurveTo(100, 78, 40, 68, 0, 75);
  ctx.closePath();
  ctx.fill();

  // G. Iconic Smiling Mouth Line
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-60, 115);
  ctx.quadraticCurveTo(0, 142, 60, 115);
  ctx.stroke();

  // H. Pointed Goatee Beard on Chin
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.moveTo(-16, 148);
  ctx.lineTo(16, 148);
  ctx.lineTo(8, 215);
  ctx.lineTo(0, 230);
  ctx.lineTo(-8, 215);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // 6. The Legendary Manifesto / Creed
  ctx.save();
  ctx.textAlign = 'center';

  const creedLines = [
    { text: 'WE ARE ANONYMOUS.', size: 'bold 36px monospace', color: '#ffffff' },
    { text: 'WE ARE LEGION.', size: 'bold 36px monospace', color: '#10b981' },
    { text: 'WE DO NOT FORGIVE.', size: 'bold 36px monospace', color: '#00f2fe' },
    { text: 'WE DO NOT FORGET.', size: 'bold 36px monospace', color: '#ffffff' },
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

  // Huge Climax Call: "EXPECT US."
  ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
  ctx.shadowBlur = 35;
  ctx.fillStyle = '#ef4444';
  ctx.font = '900 58px sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('EXPECT US.', 512, 1290);
  ctx.restore();

  // 7. Bottom Digital Footer
  ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('//////////////////  ANONYMOUS COLLECTIVE  //////////////////', 512, 1420);
  ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
  ctx.fillText('IDENTIFIER: 0xANON_VOID_997 • THE TRUTH WILL SET YOU FREE', 512, 1455);

  return canvas;
}

export function createShelfHackerMatrixCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768; // 4:3 landscape matching 0.78 x 0.57 shelf frame
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Background
  const bg = ctx.createLinearGradient(0, 0, 1024, 768);
  bg.addColorStop(0, '#020612');
  bg.addColorStop(0.5, '#040d1f');
  bg.addColorStop(1, '#02050c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 768);

  // 2. Faint grid
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 768);
    ctx.stroke();
  }
  for (let y = 0; y < 768; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // 3. Cyber Outer Frame
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 984, 728);

  ctx.strokeStyle = '#00f2fe';
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

  // 4. Header Bar
  ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.fillRect(40, 40, 944, 44);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, 944, 44);

  ctx.fillStyle = '#00f2fe';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('◈ KALI LINUX // THREAT INTELLIGENCE NODE', 56, 68);

  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'right';
  ctx.fillText('SECURITY STATUS: ZERO-DAY ARMED', 968, 68);

  // 5. Left: Circular Scanning Radar (Center around X=260, Y=340, Radius=170)
  const radarX = 260;
  const radarY = 340;
  const radarR = 170;

  ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
  ctx.lineWidth = 1.5;
  for (let r = 40; r <= radarR; r += 42) {
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
  sweepGrad.addColorStop(0, 'rgba(0, 242, 254, 0.4)');
  sweepGrad.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
  ctx.fillStyle = sweepGrad;
  ctx.beginPath();
  ctx.moveTo(radarX, radarY);
  ctx.arc(radarX, radarY, radarR, -Math.PI / 4, Math.PI / 4);
  ctx.closePath();
  ctx.fill();

  const targets = [
    { x: radarX + 65, y: radarY - 45, label: '0x1A: HOST' },
    { x: radarX - 80, y: radarY + 70, label: '0x4F: AP_PROX' },
    { x: radarX + 110, y: radarY + 80, label: '0x99: KERNEL' },
  ];
  targets.forEach((t) => {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(t.x, t.y, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#00f2fe';
    ctx.font = '10px monospace';
    ctx.fillText(t.label, t.x + 10, t.y - 4);
  });

  // 6. Right Side: Real-time Exploit Stream & Telemetry Cards
  ctx.fillStyle = 'rgba(9, 14, 28, 0.8)';
  ctx.fillRect(490, 110, 494, 450);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
  ctx.strokeRect(490, 110, 494, 450);

  ctx.fillStyle = '#00f2fe';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('NETWORK TELEMETRY & ATTACK VECTORS', 510, 140);

  const telemetryLines = [
    { text: '➔ [ETH0]: 192.168.1.17/24 [PROMISCUOUS]', color: '#10b981' },
    { text: '➔ [PACKETS]: 48,291 RX // 0 DROPPED', color: '#38bdf8' },
    { text: '➔ [KERNEL SU]: SELinux Enforcing Bypass [OK]', color: '#a855f7' },
    { text: '➔ [EXPLOIT]: Buffer overflow probe active', color: '#f59e0b' },
    { text: '➔ [TARGET]: sm7325-lisa (Snapdragon 778G)', color: '#00f2fe' },
    { text: '➔ [PAYLOAD]: android_binder_hook.bin', color: '#10b981' },
    { text: '➔ [THREAT LEVEL]: ZERO-DAY PERSISTENT', color: '#ef4444' },
    { text: '➔ [ENCRYPTION]: TLS 1.3 / AES-256-GCM', color: '#38bdf8' },
  ];

  telemetryLines.forEach((tl, idx) => {
    ctx.fillStyle = tl.color;
    ctx.font = '13px monospace';
    ctx.fillText(tl.text, 510, 180 + idx * 30);
  });

  // Waveform Bar in Right Box
  ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
  ctx.fillRect(510, 435, 454, 100);
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = 0; px < 454; px += 6) {
    const py = Math.sin(px * 0.08) * 25 + Math.cos(px * 0.15) * 12 + 485;
    if (px === 0) ctx.moveTo(510 + px, py);
    else ctx.lineTo(510 + px, py);
  }
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.font = '11px monospace';
  ctx.fillText('SIGNAL FREQUENCY: 2.412 GHz • RF SPECTRUM NORMAL', 516, 455);

  // 7. Bottom Status Bar
  ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
  ctx.fillRect(40, 580, 944, 140);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
  ctx.strokeRect(40, 580, 944, 140);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('ROOT DAEMON SYNCHRONIZED', 64, 620);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = '14px monospace';
  ctx.fillText('HOST: zaid@workstation • ARCH: ARM64 / X86_64 HYBRID • UPTIME: 142D 08H 12M', 64, 655);
  ctx.fillText('SECURITY STATUS: ZERO EXPLOIT VULNERABILITIES DETECTED ON INTERNAL NETWORK', 64, 685);

  return canvas;
}
