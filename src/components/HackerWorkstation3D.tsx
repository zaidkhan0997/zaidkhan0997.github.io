import React, { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Sparkles } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HackerScreen } from './HackerScreen';
import { FastForward, ChevronDown, Terminal, Sparkles as SparklesIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Pre-load the renamed 3D hacker workstation model
const MODEL_PATH = '/models/hacksetup.glb';
useGLTF.preload(MODEL_PATH);

const SCREEN_MATERIAL = 'Display.002';
const SCREEN_PX_W = 1440;
const NOTCH_W = 0.12;
const NOTCH_H = 0.0355;
const NOTCH_R = 0.006;
const SCREEN_R = 0.009;

// Fixed world coordinates of the hacking workstation
const WORKSTATION_TARGET = new THREE.Vector3(0.5, 2.65, -2.7);
const END_CAMERA_POS = new THREE.Vector3(0.5, 2.731, -1.35);

const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

// Multi-device responsive camera configuration
// Supports ultra-wide, laptops, tablets (iPad/Android), folding phones, and smartphones
function getResponsiveCameraConfig(aspect: number) {
  const isPortrait = aspect < 1;
  // Dynamic distance pullback for tall screens (phones & narrow foldables)
  const pullBack = Math.max(0, 1.25 - aspect);
  const startX = 0.55;
  const startY = 3.32 + pullBack * 0.45;
  const startZ = 2.70 + pullBack * 2.15;

  let baseFov = 46;
  if (aspect < 0.48) {
    baseFov = 56; // Narrow folding outer screens (Galaxy Fold)
  } else if (aspect < 0.75) {
    baseFov = 52; // Standard phones (iPhone, Android)
  } else if (aspect < 1.0) {
    baseFov = 50; // Tablets portrait (iPad)
  } else if (aspect > 2.0) {
    baseFov = 42; // Ultra-wide monitors
  }

  const startPos = new THREE.Vector3(startX, startY, startZ);
  const tempCam = new THREE.PerspectiveCamera(baseFov, aspect, 0.1, 100);
  tempCam.position.copy(startPos);
  tempCam.lookAt(WORKSTATION_TARGET);

  return {
    startPos,
    startRot: tempCam.rotation.clone(),
    startFov: baseFov,
    endFov: 40,
  };
}

const easeInOut = gsap.parseEase('power2.inOut');
const CORNERS = [
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, -1],
];

interface LaptopSceneProps {
  onUpdateOverlay: (
    bounds: { minX: number; minY: number; w0: number; h0: number } | null,
    expand: number,
    progress: number
  ) => void;
  scrollProgressRef: React.MutableRefObject<number>;
  expandRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

const LaptopScene: React.FC<LaptopSceneProps> = ({
  onUpdateOverlay,
  scrollProgressRef,
  expandRef,
  pointerRef,
}) => {
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);

  const model = useGLTF(MODEL_PATH);
  const { actions } = useAnimations(model.animations, model.scene);

  const clipDuration = useRef(0);
  const anchorRef = useRef<THREE.Object3D | null>(null);
  const screenDimsRef = useRef<{ pxW: number; pxH: number }>({ pxW: 1440, pxH: 900 });

  // Animated matrix canvas texture for dual background screens
  const matrixCanvas = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    return canvas;
  }, []);

  const matrixTexture = useMemo(() => {
    if (!matrixCanvas) return null;
    const tex = new THREE.CanvasTexture(matrixCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [matrixCanvas]);

  // Set up ACES Filmic tone mapping and colors
  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.35;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  // Set initial camera view based on current aspect ratio
  useLayoutEffect(() => {
    const aspect = size.width / size.height;
    const config = getResponsiveCameraConfig(aspect);
    camera.position.copy(config.startPos);
    camera.rotation.copy(config.startRot);
    camera.fov = config.startFov;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  // Configure laptop lid opening animation clip
  useEffect(() => {
    const action = actions['EmptyAction.001'];
    if (action) {
      action.play();
      action.paused = true;
      clipDuration.current = action.getClip().duration;
      ScrollTrigger.refresh();
    }
  }, [actions]);

  // Find screen mesh, attach anchor, and setup materials
  useEffect(() => {
    let foundMesh: THREE.Mesh | null = null;

    model.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          // Identify laptop display
          if (mat.name === SCREEN_MATERIAL) {
            foundMesh = mesh;
          }
          // Enhance background desktop monitors with glowing matrix screens
          if (mat.name === 'screen' || mat.name === 'screen.001') {
            mat.emissive = new THREE.Color(0x00f2fe);
            mat.emissiveIntensity = 2.5;
            if (matrixTexture) {
              mat.emissiveMap = matrixTexture;
              mat.needsUpdate = true;
            }
          }
          // Enhance PC tower fan LED with glowing cyber red
          if (mat.name === 'fan_led') {
            mat.emissive = new THREE.Color(0xff1544);
            mat.emissiveIntensity = 5.0;
            mat.needsUpdate = true;
          }
        }
      }
    });

    const screenMesh = foundMesh as THREE.Mesh | null;
    if (!screenMesh) {
      console.warn(`[Workstation3D] Mesh with material "${SCREEN_MATERIAL}" not found.`);
      return;
    }

    const geo = screenMesh.geometry;
    geo.computeBoundingBox();
    const box = geo.boundingBox || new THREE.Box3();
    const meshSize = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const pxW = SCREEN_PX_W;
    const pxH = Math.round((pxW * meshSize.y) / meshSize.x);
    screenDimsRef.current = { pxW, pxH };

    const anchor = new THREE.Object3D();
    anchor.position.copy(center);
    anchor.scale.setScalar(meshSize.x / pxW);
    screenMesh.add(anchor);
    anchorRef.current = anchor;

    // Dark reflective glass finish for 3D laptop screen
    const originalMaterial = screenMesh.material;
    screenMesh.material = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.15,
      metalness: 0.85,
    });

    return () => {
      if (screenMesh) {
        screenMesh.remove(anchor);
        screenMesh.material = originalMaterial;
      }
      anchorRef.current = null;
    };
  }, [model, matrixTexture]);

  // GSAP ScrollTrigger timeline to drive scroll scrubbing
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#hacker-workstation-intro',
        endTrigger: '#hacker-workstation-spacer',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.1,
      },
    });

    // 1. Scrub scroll progress from 0 (full workstation) to 1 (zoomed in)
    tl.to(
      scrollProgressRef.current ? scrollProgressRef : { current: 0 },
      {
        current: 1,
        duration: 2.2,
        onUpdate: function () {
          scrollProgressRef.current = this.targets()[0].current;
        },
      },
      0
    );

    // 2. Expand screen into full viewport at climax
    tl.to(
      expandRef.current ? expandRef : { current: 0 },
      {
        current: 1,
        duration: 1.0,
        onUpdate: function () {
          expandRef.current = this.targets()[0].current;
        },
      },
      2.0
    );

    return () => {
      tl.kill();
    };
  }, [scrollProgressRef, expandRef]);

  // Frame loop: update matrix textures, camera swoop, parallax, and screen projection
  const matrixFrameRef = useRef(0);
  const matrixCols = useRef<number[]>(new Array(32).fill(0).map(() => Math.floor(Math.random() * 20)));

  useFrame(() => {
    const p = scrollProgressRef.current;
    const aspect = size.width / size.height;
    const config = getResponsiveCameraConfig(aspect);

    // 1. Animate matrix canvas texture periodically
    matrixFrameRef.current++;
    if (matrixCanvas && matrixTexture && matrixFrameRef.current % 3 === 0) {
      const ctx = matrixCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.18)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctx.fillStyle = '#00f2fe';
        ctx.font = '10px monospace';
        const glyphs = '0123456789ABCDEF<>/:;*%$#@!&';
        for (let i = 0; i < matrixCols.current.length; i++) {
          const char = glyphs[Math.floor(Math.random() * glyphs.length)];
          const x = i * 16;
          const y = matrixCols.current[i] * 12;
          ctx.fillText(char, x, y);
          if (y > matrixCanvas.height && Math.random() > 0.95) {
            matrixCols.current[i] = 0;
          } else {
            matrixCols.current[i]++;
          }
        }
        matrixTexture.needsUpdate = true;
      }
    }

    // 2. Sync laptop lid opening animation clip with scroll
    const action = actions['EmptyAction.001'];
    if (action && clipDuration.current > 0) {
      action.time = clamp(p * 1.4, 0, 1) * clipDuration.current;
    }

    // 3. Smooth camera swoop from workstation view into the screen
    // Ease progress for cinematic feel
    const t = clamp(p, 0, 1);
    const easeT = easeInOut(t);

    // Subtle interactive parallax from mouse / touch (dampened to 0 as we zoom into screen)
    const parallaxDampen = 1 - easeT;
    const px = pointerRef.current.x * 0.18 * parallaxDampen;
    const py = pointerRef.current.y * 0.10 * parallaxDampen;

    camera.position.x = lerp(config.startPos.x + px, END_CAMERA_POS.x, easeT);
    camera.position.y = lerp(config.startPos.y + py, END_CAMERA_POS.y, easeT);
    camera.position.z = lerp(config.startPos.z, END_CAMERA_POS.z, easeT);

    camera.rotation.x = lerp(config.startRot.x, 0, easeT);
    camera.rotation.y = lerp(config.startRot.y, 0, easeT);
    camera.rotation.z = lerp(config.startRot.z, 0, easeT);

    camera.fov = lerp(config.startFov, config.endFov, easeT);
    camera.updateProjectionMatrix();

    // 4. Calculate screen projection onto 2D viewport
    const anchor = anchorRef.current;
    if (!anchor) return;

    const v = new THREE.Vector3();
    const { pxW, pxH } = screenDimsRef.current;
    camera.updateMatrixWorld();
    anchor.updateWorldMatrix(true, false);

    const canvasEl = gl.domElement;
    const r = canvasEl.getBoundingClientRect();

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const [sx, sy] of CORNERS) {
      v.set((sx * pxW) / 2, (sy * pxH) / 2, 0).applyMatrix4(anchor.matrixWorld).project(camera);
      const x = r.left + (v.x * 0.5 + 0.5) * r.width;
      const y = r.top + (-v.y * 0.5 + 0.5) * r.height;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    const w0 = maxX - minX;
    const h0 = maxY - minY;

    onUpdateOverlay(
      { minX, minY, w0, h0 },
      expandRef.current,
      scrollProgressRef.current
    );
  });

  return (
    <>
      {/* 3D Hacker Workstation Room Model */}
      <primitive object={model.scene} position={[0, 0, 0]} scale={[1, 1, 1]} />

      {/* Cyberpunk Room Lighting Architecture */}
      <ambientLight intensity={0.7} color="#080e21" />

      {/* Cyan Monitor Glow (Casts light from screens onto desk & keyboard) */}
      <pointLight
        position={[0.5, 3.2, -2.5]}
        intensity={8.0}
        color="#00f2fe"
        distance={10}
        decay={2}
      />

      {/* Emerald Green Keyboard Terminal Light */}
      <pointLight
        position={[0.5, 2.3, -2.1]}
        intensity={4.5}
        color="#10b981"
        distance={6}
        decay={2}
      />

      {/* Neon Red Gaming PC Rig Accent Glow */}
      <pointLight
        position={[4.3, 1.4, -2.4]}
        intensity={7.0}
        color="#ff1544"
        distance={8}
        decay={2}
      />

      {/* Deep Violet / Indigo Rim Light (Back wall ambience) */}
      <pointLight
        position={[-3.2, 3.5, -2.8]}
        intensity={6.0}
        color="#818cf8"
        distance={12}
        decay={2}
      />

      {/* Overhead Cyber Cyan Soft Spot */}
      <pointLight
        position={[0.5, 5.0, 0.5]}
        intensity={2.8}
        color="#38bdf8"
        distance={12}
        decay={2}
      />

      {/* Floating Cyber Particle Embers */}
      <Sparkles
        count={65}
        scale={[7, 4, 6]}
        position={[0.5, 2.8, -1.5]}
        size={2.2}
        speed={0.35}
        color="#00f2fe"
        opacity={0.4}
      />
    </>
  );
};

export const HackerWorkstation3D: React.FC = () => {
  const scrollProgressRef = useRef(0);
  const expandRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const overlayRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);
  const [expandProgress, setExpandProgress] = useState(0);
  const [introDismissed, setIntroDismissed] = useState(false);

  // Parallax pointer handler (works seamlessly for mouse and touch)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        pointerRef.current = {
          x: (touch.clientX / window.innerWidth) * 2 - 1,
          y: -(touch.clientY / window.innerHeight) * 2 + 1,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleUpdateOverlay = useCallback(
    (
      bounds: { minX: number; minY: number; w0: number; h0: number } | null,
      expand: number,
      progress: number
    ) => {
      setExpandProgress(expand);

      const overlay = overlayRef.current;
      const notch = notchRef.current;
      if (!overlay || !notch || !bounds) return;

      // Show screen overlay once lid starts opening
      if (progress < 0.22) {
        overlay.style.visibility = 'hidden';
        return;
      }
      overlay.style.visibility = 'visible';

      const { minX, minY, w0, h0 } = bounds;
      const t = clamp(expand, 0, 1);
      const e = easeInOut(t);

      const w = lerp(w0, window.innerWidth, e);
      const h = lerp(h0, window.innerHeight, e);
      const left = lerp(minX, 0, e);
      const top = lerp(minY, 0, e);
      const borderRadius = lerp(w0 * SCREEN_R, 0, e);

      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;
      overlay.style.width = `${w}px`;
      overlay.style.height = `${h}px`;
      overlay.style.borderRadius = `${borderRadius}px`;

      // Notch slides up off screen when expanding
      const nh = h0 * NOTCH_H;
      const nr = w0 * NOTCH_R;
      notch.style.width = `${w0 * NOTCH_W}px`;
      notch.style.height = `${nh}px`;
      notch.style.borderRadius = `0 0 ${nr}px ${nr}px`;
      notch.style.transform = `translate(-50%, ${-nh * clamp(e / 0.5, 0, 1)}px)`;
    },
    []
  );

  const skipIntro = () => {
    setIntroDismissed(true);
    const target = document.getElementById('portfolio-content');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="hacker-workstation-intro" className="relative w-full">
      {/* 3D WebGL Background Canvas (Fixed, dynamic viewport height compatible) */}
      <div
        id="hacker-workstation-canvas-wrapper"
        className="fixed inset-0 z-0 w-full h-[100dvh] bg-[#02050e] pointer-events-none transition-opacity duration-700"
        style={{
          opacity: introDismissed || expandProgress >= 0.99 ? 0 : 1,
        }}
      >
        <Canvas
          dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2)]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.35,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <React.Suspense fallback={null}>
            <LaptopScene
              onUpdateOverlay={handleUpdateOverlay}
              scrollProgressRef={scrollProgressRef}
              expandRef={expandRef}
              pointerRef={pointerRef}
            />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Floating 3D Laptop Screen Overlay */}
      <div
        ref={overlayRef}
        className="fixed z-20 overflow-hidden pointer-events-auto transition-[visibility] duration-200 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.3)]"
        style={{
          visibility: 'hidden',
          background: '#030712',
          opacity: introDismissed || expandProgress >= 0.99 ? 0 : 1,
        }}
      >
        <HackerScreen expandProgress={expandProgress} />

        {/* Mac / Laptop Camera Notch */}
        <div
          ref={notchRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-30 pointer-events-none transition-transform"
        />
      </div>

      {/* Top Floating Controls with Safe Area Support for iPhone / Android / Foldables */}
      <div
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40 flex items-center gap-3 transition-opacity duration-300 pt-[env(safe-area-inset-top,0px)] pr-[env(safe-area-inset-right,0px)]"
        style={{
          opacity: introDismissed || expandProgress >= 0.95 ? 0 : 1,
          pointerEvents: introDismissed || expandProgress >= 0.95 ? 'none' : 'auto',
        }}
      >
        {/* Terminal Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md text-[11px] font-mono text-cyan-300 shadow-md">
          <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>WORKSTATION ONLINE</span>
        </div>

        {/* Skip Recon CTA Button (44px min touch target for mobile thumb reach) */}
        <button
          onClick={skipIntro}
          className="flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 backdrop-blur-md text-xs font-mono font-semibold tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
          title="Skip 3D Intro directly to Portfolio"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>SKIP RECON</span>
        </button>
      </div>

      {/* Bottom Scroll Indicator with Mobile Safe Area Support */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-cyan-400 font-mono text-xs tracking-widest pointer-events-none transition-all duration-300 pb-[env(safe-area-inset-bottom,0px)]"
        style={{
          opacity: introDismissed || expandProgress > 0.25 ? 0 : 1,
          transform: `translate(-50%, ${expandProgress * 30}px)`,
        }}
      >
        <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.25)] text-[10px] sm:text-xs">
          <SparklesIcon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          SCROLL TO INITIALIZE WORKSTATION
        </span>
        <ChevronDown className="w-5 h-5 text-cyan-400 animate-bounce" />
      </div>

      {/* Tall Scroll Spacer (Enables Smooth Scrubbing) */}
      <div
        id="hacker-workstation-spacer"
        className="relative w-full h-[260vh] pointer-events-none"
      />
    </div>
  );
};
