import React, { useState, useEffect } from 'react';
import LightPillar from './LightPillar';

export const AuroraBackground = ({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        typeof window !== 'undefined' &&
          (window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent))
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden bg-[#070c1e] text-white w-full ${className}`}>
      {/* Ambient CSS Radial Glow Mesh for Consistent Rich Color Across Desktop & Mobile */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Left Cyan Aura */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />
        {/* Center-Right Purple Aura */}
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-purple-600/15 blur-[140px]" />
        {/* Bottom Cyan Glow */}
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[130px]" />
      </div>

      {/* 3D LightPillar active only on Desktop for 60 FPS Lag-Free Mobile Performance */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
          <LightPillar
            topColor="#06b6d4"
            bottomColor="#a855f7"
            intensity={0.8}
            rotationSpeed={0.2}
            glowAmount={0.003}
            pillarWidth={8.4}
            pillarHeight={0.5}
            noiseIntensity={0.05}
            pillarRotation={15}
            interactive={true}
            mixBlendMode="screen"
            quality="medium"
          />
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
