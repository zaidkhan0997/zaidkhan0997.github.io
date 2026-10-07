import React, { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Sparkles, useProgress } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Sparkles as SparklesIcon, ArrowRight, ShieldCheck, Zap, Terminal } from 'lucide-react';
import {
  createHackerThoughtsCanvas,
  createAnonymousMaskCanvas,
  createShelfHackerMatrixCanvas,
  createLaptopTerminalCanvas,
  updateLaptopTerminalCanvas,
  createLeftDesktopHackerWallpaperCanvas,
  createRightDesktopHackerWallpaperCanvas,
  createDefconPosterCanvas,
  createAcousticFoamCanvas,
  updateLeftHackerMonitorCanvas,
  updateRightHackerMonitorCanvas,
} from './workstationPosters';

gsap.registerPlugin(ScrollTrigger);

// Pre-load 3D hacker workstation model with local 100% offline Draco decoders
const MODEL_PATH = '/models/hacksetup.glb';
const DRACO_PATH = '/draco/';
useGLTF.preload(MODEL_PATH, DRACO_PATH);

// Cyberpunk 3D Scene Loader HUD
const Cyber3DLoader: React.FC = () => {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#02050e] text-cyan-400 font-mono pointer-events-none transition-opacity duration-300">
      <div className="relative mb-4 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
        <Terminal className="w-6 h-6 text-emerald-400 absolute animate-pulse" />
      </div>
      <div className="text-xs tracking-widest uppercase text-cyan-300 font-semibold mb-2">
        INITIALIZING HACKER WORKSTATION // {Math.round(progress)}%
      </div>
      <div className="w-52 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-150"
          style={{ width: `${Math.max(8, progress)}%` }}
        />
      </div>
    </div>
  );
};

const SCREEN_MATERIAL = 'Display.002';
const SCREEN_PX_W = 1440;

// Center target of the hacker workstation (centered between dual monitors, shelf, and laptop)
const WORKSTATION_TARGET = new THREE.Vector3(0.5, 3.02, -2.7);

const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

// Multi-device responsive camera configuration
// Supports ultra-wide, laptops, tablets (iPad/Android), folding phones, and smartphones
// Fully displays the entire hacking battlestation (all monitors, shelf, and desk) on any screen!
function getResponsiveCameraConfig(aspect: number) {
  const isPortrait = aspect < 1.0;
  const pullBack = Math.max(0, 1.25 - aspect);

  // 1. Initial wide room view (startPos)
  const startX = 0.50; // Perfectly centered horizontally with the hacker setup
  const startY = 3.12 + (isPortrait ? pullBack * 0.12 : 0.15); // Level with monitors & desk, not pointing down at floor
  const startZ = 2.70 + (isPortrait ? pullBack * 0.85 : 0); // Smooth distance revealing the entire workstation

  // 2. Docked laptop view (endPos)
  const endX = 0.50;
  const endY = 2.731;
  const endZ = -1.35;

  let baseFov = 46;
  if (aspect < 0.48) {
    baseFov = 84; // Galaxy Z Fold outer screen (~0.42 aspect)
  } else if (aspect < 0.65) {
    baseFov = 76; // Standard smartphones portrait (iPhone, Android)
  } else if (aspect < 0.85) {
    baseFov = 68; // Foldables inner screen / small tablets
  } else if (aspect < 1.2) {
    baseFov = 56; // Tablets (iPad portrait/landscape)
  } else if (aspect > 2.0) {
    baseFov = 42; // Ultra-wide monitors
  }

  const targetEndFov = isPortrait ? Math.min(65, Math.round(baseFov * 0.82)) : 40;

  const startPos = new THREE.Vector3(startX, startY, startZ);
  const endPos = new THREE.Vector3(endX, endY, endZ);
  const tempCam = new THREE.PerspectiveCamera(baseFov, aspect, 0.1, 100);
  tempCam.position.copy(startPos);
  tempCam.lookAt(WORKSTATION_TARGET);

  return {
    startPos,
    endPos,
    startRot: tempCam.rotation.clone(),
    startFov: baseFov,
    endFov: targetEndFov,
  };
}

const easeInOut = gsap.parseEase('power2.inOut');

interface LaptopSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

const LaptopScene: React.FC<LaptopSceneProps> = ({
  scrollProgressRef,
  pointerRef,
}) => {
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);

  const model = useGLTF(MODEL_PATH, DRACO_PATH);
  const { actions } = useAnimations(model.animations, model.scene);

  const clipDuration = useRef(0);
  const anchorRef = useRef<THREE.Object3D | null>(null);

  // 1. Procedural Wall Frame Posters, Shelf Display, Acoustic Foam, and Dual Desktop Wallpapers
  const {
    thoughtsTexture,
    maskTexture,
    shelfTexture,
    defconTexture,
    acousticFoamTexture,
    leftCanvas,
    leftWallpaperTexture,
    rightCanvas,
    rightWallpaperTexture,
  } = useMemo(() => {
    if (typeof document === 'undefined') {
      return {
        thoughtsTexture: null,
        maskTexture: null,
        shelfTexture: null,
        defconTexture: null,
        acousticFoamTexture: null,
        leftCanvas: null,
        leftWallpaperTexture: null,
        rightCanvas: null,
        rightWallpaperTexture: null,
      };
    }
    const thoughtsCanvas = createHackerThoughtsCanvas();
    const tTex = new THREE.CanvasTexture(thoughtsCanvas);
    tTex.colorSpace = THREE.SRGBColorSpace;
    tTex.flipY = true;

    const maskCanvas = createAnonymousMaskCanvas();
    const mTex = new THREE.CanvasTexture(maskCanvas);
    mTex.colorSpace = THREE.SRGBColorSpace;
    mTex.flipY = true;

    const sCanvas = createShelfHackerMatrixCanvas();
    const sTex = new THREE.CanvasTexture(sCanvas);
    sTex.colorSpace = THREE.SRGBColorSpace;
    sTex.flipY = true;

    // Iconic DEFCON Poster with Anonymous Mask from reference photo
    const defconCanvas = createDefconPosterCanvas();
    const dTex = new THREE.CanvasTexture(defconCanvas);
    dTex.colorSpace = THREE.SRGBColorSpace;
    dTex.flipY = true;

    // Charcoal 3D Acoustic Pyramid Soundproofing Foam for Studio Walls
    const foamCanvas = createAcousticFoamCanvas();
    const fTex = new THREE.CanvasTexture(foamCanvas);
    fTex.wrapS = THREE.RepeatWrapping;
    fTex.wrapT = THREE.RepeatWrapping;
    fTex.repeat.set(12, 8);
    fTex.colorSpace = THREE.SRGBColorSpace;

    // Dual Monitor Authentic Hacker Desktop Wallpapers (Wireshark + Kali Cyber Attack Map)
    const lCanvas = createLeftDesktopHackerWallpaperCanvas();
    const lTex = new THREE.CanvasTexture(lCanvas);
    lTex.colorSpace = THREE.SRGBColorSpace;
    lTex.flipY = true;
    lTex.needsUpdate = true;

    const rCanvas = createRightDesktopHackerWallpaperCanvas();
    const rTex = new THREE.CanvasTexture(rCanvas);
    rTex.colorSpace = THREE.SRGBColorSpace;
    rTex.flipY = true;
    rTex.needsUpdate = true;

    return {
      thoughtsTexture: tTex,
      maskTexture: mTex,
      shelfTexture: sTex,
      defconTexture: dTex,
      acousticFoamTexture: fTex,
      leftCanvas: lCanvas,
      leftWallpaperTexture: lTex,
      rightCanvas: rCanvas,
      rightWallpaperTexture: rTex,
    };
  }, []);

  // 2. Procedural Live Streaming 3D Terminal Canvas for Laptop Display
  const terminalCanvas = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return createLaptopTerminalCanvas();
  }, []);

  const terminalTexture = useMemo(() => {
    if (!terminalCanvas) return null;
    const tex = new THREE.CanvasTexture(terminalCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = true;
    return tex;
  }, [terminalCanvas]);

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

  // Find screen mesh, attach anchor with 3D terminal plane, replace wall posters, remove clutter from desk
  useEffect(() => {
    let foundMesh: THREE.Mesh | null = null;

    model.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const matName = mat?.name || '';
        const meshName = mesh.name || '';

        // 1. Identify laptop display
        if (matName === SCREEN_MATERIAL || meshName === SCREEN_MATERIAL) {
          foundMesh = mesh;
        }

        // 2. Replace Wall Poster 1 ("FEAR THE DARK KNIGHT" -> DEFCON Anonymous Hacker Poster)
        if (
          matName === 'fear_the_dark' ||
          matName === 'fear_the_dark.001' ||
          matName === 'fear_the_dark.002' ||
          meshName === 'Object_24' ||
          meshName === 'Object_22' ||
          meshName === 'Object_23'
        ) {
          if (defconTexture) {
            mesh.material = new THREE.MeshStandardMaterial({
              map: defconTexture,
              emissive: new THREE.Color(0xffffff),
              emissiveMap: defconTexture,
              emissiveIntensity: 0.55,
              roughness: 0.25,
              metalness: 0.1,
            });
          }
        }

        // 3. Replace Wall Poster 2 ("OBEY THE FALSE GOD" -> Hacker Thoughts & Axioms)
        if (matName === 'obey_the_god' || meshName === 'Object_36' || meshName === 'Object_34') {
          if (thoughtsTexture) {
            mesh.material = new THREE.MeshStandardMaterial({
              map: thoughtsTexture,
              emissive: new THREE.Color(0x00f2fe),
              emissiveMap: thoughtsTexture,
              emissiveIntensity: 0.45,
              roughness: 0.25,
              metalness: 0.1,
            });
          }
        }

        // 4. Replace Shelf Frame ("doodle canvas" -> Anonymous Mask illuminated plaque)
        if (matName === 'canvas' || meshName === 'Object_12' || meshName === 'Object_14') {
          if (maskTexture) {
            mesh.material = new THREE.MeshStandardMaterial({
              map: maskTexture,
              emissive: new THREE.Color(0x10b981),
              emissiveMap: maskTexture,
              emissiveIntensity: 0.75,
              roughness: 0.2,
              metalness: 0.1,
            });
            mesh.visible = true;
          }
        }

        // Hide invisible camera occlusion wall (walls_invis / Object_49), sofa, and hanging banners
        if (
          matName === 'walls_invis' ||
          meshName === 'Object_49' ||
          matName.startsWith('banner') ||
          meshName === 'Object_5' ||
          meshName === 'Object_6' ||
          matName === 'sofa' ||
          meshName === 'Object_108'
        ) {
          mesh.visible = false;
        }

        // 5. Studio Acoustic Soundproofing Pyramid Foam Walls (Back wall & structural walls only)
        const isRealWall =
          (matName === 'walls' ||
            matName === 'walls.001' ||
            matName === 'walls.002' ||
            meshName === 'Object_47' ||
            meshName === 'Object_48' ||
            meshName === 'Object_111') &&
          matName !== 'walls_invis' &&
          meshName !== 'Object_49';

        if (isRealWall) {
          if (acousticFoamTexture) {
            mesh.material = new THREE.MeshStandardMaterial({
              map: acousticFoamTexture,
              roughness: 0.92,
              metalness: 0.05,
              color: new THREE.Color(0x151c28),
            });
            mesh.visible = true;
          }
        }

        // 6. Deep Dark Walnut Wood Desk finish (Matches reference photo)
        if (matName === 'desk_wood' || matName === 'coffee_table' || meshName === 'Object_80' || meshName === 'Object_81') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x1e1914),
            roughness: 0.45,
            metalness: 0.06,
          });
        }

        // 7. Remove BOTH White Speakers (Cabinets + Cones) - Note: Object_109 is speaker, Object_111 is walls.001!
        const isSpeaker =
          matName === 'speaker_2' ||
          matName === 'Material.018' ||
          meshName === 'Object_109' ||
          meshName === 'Object_53';

        // 8. Remove Headphones
        const isHeadphone =
          matName === 'headphone' ||
          matName === 'headphone_snger' ||
          meshName === 'Object_87' ||
          meshName === 'Object_90';

        // 9. Remove Juice Glass & Coaster
        const isJuiceGlass =
          matName.startsWith('drink') ||
          matName === 'Material.019' ||
          meshName === 'Object_19' ||
          meshName === 'Object_21';

        if (isSpeaker || isHeadphone || isJuiceGlass) {
          mesh.visible = false;
        }

        // 10. Replace dual background monitors with HD Animated Hacker Displays
        const isRightMonitor =
          matName === 'screen' ||
          meshName === 'Object_44' ||
          (matName.startsWith('screen') && !matName.includes('001'));

        const isLeftMonitor =
          matName === 'screen.001' ||
          meshName === 'Object_45' ||
          matName.includes('screen.001');

        if (isRightMonitor) {
          if (leftWallpaperTexture) {
            mesh.material = new THREE.MeshStandardMaterial({
              map: leftWallpaperTexture,
              emissive: new THREE.Color(0xffffff),
              emissiveMap: leftWallpaperTexture,
              emissiveIntensity: 0.95,
              roughness: 0.2,
              metalness: 0.1,
              side: THREE.DoubleSide,
            });
            mesh.material.needsUpdate = true;
          }
        }

        if (isLeftMonitor) {
          if (rightWallpaperTexture) {
            mesh.material = new THREE.MeshStandardMaterial({
              map: rightWallpaperTexture,
              emissive: new THREE.Color(0xffffff),
              emissiveMap: rightWallpaperTexture,
              emissiveIntensity: 0.95,
              roughness: 0.2,
              metalness: 0.1,
              side: THREE.DoubleSide,
            });
            mesh.material.needsUpdate = true;
          }
        }

        // 11. Enhance PC tower fan LED with glowing cyber red
        if (matName === 'fan_led') {
          mat.emissive = new THREE.Color(0xff1544);
          mat.emissiveIntensity = 5.0;
          mat.needsUpdate = true;
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

    const anchor = new THREE.Object3D();
    anchor.position.copy(center);
    anchor.scale.setScalar(meshSize.x / pxW);
    screenMesh.add(anchor);
    anchorRef.current = anchor;

    // Attach high-res 3D terminal display plane directly to anchor
    // This renders the live terminal directly in WebGL on the laptop screen
    let terminalPlaneMesh: THREE.Mesh | null = null;
    if (terminalTexture) {
      const planeGeo = new THREE.PlaneGeometry(pxW * 0.965, pxH * 0.965);
      const planeMat = new THREE.MeshBasicMaterial({
        map: terminalTexture,
        side: THREE.DoubleSide,
        transparent: false,
      });
      planeMat.polygonOffset = true;
      planeMat.polygonOffsetFactor = -4;
      planeMat.polygonOffsetUnits = -4;

      terminalPlaneMesh = new THREE.Mesh(planeGeo, planeMat);
      terminalPlaneMesh.name = 'LaptopTerminal3DPlane';
      terminalPlaneMesh.position.set(0, 0, 0.5);
      terminalPlaneMesh.renderOrder = 50;
      anchor.add(terminalPlaneMesh);
    }

    // Give backing screen casing a dark cyber finish
    const originalMaterial = screenMesh.material;
    screenMesh.material = new THREE.MeshStandardMaterial({
      color: 0x050b14,
      roughness: 0.2,
      metalness: 0.8,
    });

    return () => {
      if (screenMesh) {
        screenMesh.remove(anchor);
        screenMesh.material = originalMaterial;
      }
      if (terminalPlaneMesh) {
        terminalPlaneMesh.geometry.dispose();
      }
      anchorRef.current = null;
    };
  }, [
    model,
    thoughtsTexture,
    maskTexture,
    shelfTexture,
    defconTexture,
    acousticFoamTexture,
    terminalTexture,
    leftWallpaperTexture,
    rightWallpaperTexture,
  ]);

  // Frame loop: update live terminal texture, camera swoop, and parallax
  const frameRef = useRef(0);

  useFrame(() => {
    frameRef.current++;
    const p = scrollProgressRef.current;
    const aspect = size.width / size.height;
    const config = getResponsiveCameraConfig(aspect);

    const isMobile = aspect < 1.0 || (typeof window !== 'undefined' && window.innerWidth < 768);

    // 1. Update live streaming terminal canvas on laptop screen (staggered on mobile)
    const terminalInterval = isMobile ? 8 : 4;
    if (terminalCanvas && terminalTexture && frameRef.current % terminalInterval === 0) {
      const logOffset = Math.floor(frameRef.current / (isMobile ? 10 : 6));
      const cursorBlink = (frameRef.current % 30) < 15;
      updateLaptopTerminalCanvas(terminalCanvas, logOffset, cursorBlink);
      terminalTexture.needsUpdate = true;
    }

    // Only update desktop monitors when they are in view (p <= 0.55) to conserve mobile GPU
    if (p <= 0.55) {
      // 2. Animate Left Hacker Monitor (Wireshark Packet Sniffer + Decrypting Target cracking)
      const leftInterval = isMobile ? 10 : 5;
      if (leftCanvas && leftWallpaperTexture && frameRef.current % leftInterval === (isMobile ? 2 : 0)) {
        updateLeftHackerMonitorCanvas(leftCanvas, frameRef.current);
        leftWallpaperTexture.needsUpdate = true;
      }

      // 3. Animate Right Hacker Monitor (Kali Global Cyber Attack Map + Infrastructure Topology)
      const rightInterval = isMobile ? 10 : 5;
      if (rightCanvas && rightWallpaperTexture && frameRef.current % rightInterval === (isMobile ? 6 : 2)) {
        updateRightHackerMonitorCanvas(rightCanvas, frameRef.current);
        rightWallpaperTexture.needsUpdate = true;
      }
    }

    // 4. Sync laptop lid opening animation clip with scroll
    const action = actions['EmptyAction.001'];
    if (action && clipDuration.current > 0) {
      action.time = clamp(p * 1.35, 0, 1) * clipDuration.current;
    }

    // 5. Smooth camera swoop from workstation view into the laptop screen
    const t = clamp(p / 0.85, 0, 1);
    const easeT = easeInOut(t);

    // Subtle interactive parallax from mouse / touch (dampened to 0 as we zoom into screen)
    const parallaxDampen = Math.max(0, 1 - p * 1.5);
    const px = pointerRef.current.x * 0.18 * parallaxDampen;
    const py = pointerRef.current.y * 0.10 * parallaxDampen;

    camera.position.x = lerp(config.startPos.x + px, config.endPos.x, easeT);
    camera.position.y = lerp(config.startPos.y + py, config.endPos.y, easeT);
    camera.position.z = lerp(config.startPos.z, config.endPos.z, easeT);

    camera.rotation.x = lerp(config.startRot.x, 0, easeT);
    camera.rotation.y = lerp(config.startRot.y, 0, easeT);
    camera.rotation.z = lerp(config.startRot.z, 0, easeT);

    camera.fov = lerp(config.startFov, config.endFov, easeT);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      {/* 3D Hacker Workstation Room Model */}
      <primitive object={model.scene} position={[0, 0, 0]} scale={[1, 1, 1]} />

      {/* Cyberpunk Room Lighting Architecture */}
      <ambientLight intensity={0.65} color="#060c1d" />

      {/* Cyan Monitor Glow (Casts light from screens onto desk & keyboard) */}
      <pointLight
        position={[0.5, 3.2, -2.5]}
        intensity={9.0}
        color="#00f2fe"
        distance={10}
        decay={2}
      />

      {/* Emerald Green Keyboard Terminal Light */}
      <pointLight
        position={[0.5, 2.3, -2.1]}
        intensity={5.0}
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

      {/* Deep Violet / Indigo Back Wall Ambience */}
      <pointLight
        position={[-3.2, 3.5, -2.8]}
        intensity={6.0}
        color="#818cf8"
        distance={12}
        decay={2}
      />

      {/* Vertical Cyber Neon LED Tube Lightbar on shelf (Matches reference image) */}
      <group position={[-0.8, 4.38, -3.15]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 0.76, 24]} />
          <meshStandardMaterial
            color="#f0f9ff"
            emissive="#38bdf8"
            emissiveIntensity={6.0}
            roughness={0.1}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.39, 0]}>
          <cylinderGeometry args={[0.052, 0.052, 0.03, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.39, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.04, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        {/* Dedicated White/Cyan Light Emission from the Tube */}
        <pointLight
          position={[0, 0, 0.1]}
          intensity={5.5}
          color="#bae6fd"
          distance={6}
          decay={2}
        />
      </group>

      {/* Shelf Top-Right Purple / Violet Accent Rim Light (Exact match to reference photo) */}
      <pointLight
        position={[2.4, 4.65, -3.1]}
        intensity={6.5}
        color="#c084fc"
        distance={7}
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
        count={typeof window !== 'undefined' && window.innerWidth < 768 ? 35 : 75}
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
  const pointerRef = useRef({ x: 0, y: 0 });

  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgressState, setScrollProgressState] = useState(0);

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

  const lastProgressRef = useRef(0);

  // GSAP ScrollTrigger to scrub progress smoothly
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const st = ScrollTrigger.create({
      trigger: '#hacker-workstation-intro',
      endTrigger: '#hacker-workstation-spacer',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        const p = self.progress;
        // Throttle React state updates on mobile to prevent 120Hz thread starvation and stutter
        if (
          Math.abs(p - lastProgressRef.current) > 0.02 ||
          (p < 0.15 && lastProgressRef.current >= 0.15) ||
          (p >= 0.15 && lastProgressRef.current < 0.15) ||
          (p < 0.82 && lastProgressRef.current >= 0.82) ||
          (p >= 0.82 && lastProgressRef.current < 0.82) ||
          (p < 0.98 && lastProgressRef.current >= 0.98) ||
          (p >= 0.98 && lastProgressRef.current < 0.98)
        ) {
          lastProgressRef.current = p;
          setScrollProgressState(p);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  // Smooth scroll down to portfolio
  const scrollToPortfolio = useCallback(() => {
    const el = document.getElementById('portfolio-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll indicator opacity: fades smoothly when scrolling starts
  const scrollPromptOpacity = Math.max(0, 1 - scrollProgressState * 8);

  // Intro wrapper fade-out into portfolio:
  // Stays 100% visible and on top (z-40) through the 3D intro
  // Between progress 0.92 and 0.98, cleanly dissolves into portfolio
  // Past 0.98, completely unmounts/hides so portfolio has 0 obstruction!
  const introOpacity =
    scrollProgressState >= 0.98
      ? 0
      : scrollProgressState >= 0.92
      ? Math.max(0, 1 - (scrollProgressState - 0.92) / 0.06)
      : 1;

  const isIntroHidden = scrollProgressState >= 0.98;

  const isMobile =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 || 'ontouchstart' in window);

  return (
    <div id="hacker-workstation-intro" className="relative w-full">
      {/* 3D WebGL Background Canvas (Fixed at z-40 so it stays ON TOP of portfolio until transition finishes) */}
      <div
        ref={canvasWrapperRef}
        id="hacker-workstation-canvas-wrapper"
        className="fixed inset-0 z-40 w-full pointer-events-none transition-opacity duration-300"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: '-120px', // Overscan extends 120px past the screen bottom, eliminating any gap when mobile address bar hides or on bounce
          height: 'calc(100% + 120px)',
          minHeight: 'calc(100vh + 120px)',
          backgroundColor: '#02050e',
          opacity: introOpacity,
          display: isIntroHidden ? 'none' : 'block',
        }}
      >
        <Cyber3DLoader />
        <Canvas
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          dpr={[1, isMobile ? 1.5 : 2]}
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
              scrollProgressRef={scrollProgressRef}
              pointerRef={pointerRef}
            />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Full-Screen Cyber Transition Portal HUD (Reveals at zoom climax, charges to 100%, then dissolves cleanly) */}
      {scrollProgressState >= 0.82 && scrollProgressState < 0.98 && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-md pointer-events-none transition-opacity duration-200"
          style={{
            opacity:
              scrollProgressState < 0.88
                ? clamp((scrollProgressState - 0.82) / 0.05, 0, 1)
                : clamp(1 - (scrollProgressState - 0.92) / 0.06, 0, 1),
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
                  width: `${Math.min(100, Math.max(5, ((scrollProgressState - 0.82) / 0.12) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Top-Right "Skip Intro / Enter Portfolio" Button */}
      {scrollProgressState < 0.90 && (
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={scrollToPortfolio}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/40 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all text-xs font-mono tracking-wider cursor-pointer active:scale-95"
          >
            <span>ENTER PORTFOLIO</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Bottom Scroll Indicator: Sleek, compact, clickable, fades upon scrolling */}
      {scrollPromptOpacity > 0.05 && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-auto transition-opacity duration-200 pb-[env(safe-area-inset-bottom,0px)]"
          style={{
            opacity: scrollPromptOpacity,
            transform: `translate(-50%, ${scrollProgressState * 15}px)`,
          }}
        >
          <button
            onClick={scrollToPortfolio}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)] text-[10px] sm:text-[11px] text-cyan-400 font-mono tracking-widest hover:border-cyan-400 hover:text-cyan-300 cursor-pointer active:scale-95 transition-all"
          >
            <SparklesIcon className="w-3 h-3 text-cyan-400 animate-pulse" />
            SCROLL OR CLICK TO ENTER
          </button>
          <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
        </div>
      )}

      {/* Tall Scroll Spacer (Enables Smooth Scrubbing) */}
      <div
        id="hacker-workstation-spacer"
        className="relative w-full h-[220vh] pointer-events-none"
      />
    </div>
  );
};
