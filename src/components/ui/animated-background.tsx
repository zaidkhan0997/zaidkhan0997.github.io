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
    <div className={`relative min-h-screen overflow-hidden bg-[#14234d] text-white w-full ${className}`}>
      {/* Lighter Luminous Ambient CSS Radial Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Left Bright Cyan Aura */}
        <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-cyan-400/40 blur-[140px]" />
        {/* Center-Right Vibrant Purple Luminous Aura */}
        <div className="absolute top-1/4 -right-40 h-[800px] w-[800px] rounded-full bg-purple-500/40 blur-[150px]" />
        {/* Bottom Bright Teal Luminous Glow */}
        <div className="absolute -bottom-40 left-1/3 h-[650px] w-[650px] rounded-full bg-cyan-500/35 blur-[130px]" />
        {/* Center Luminous Royal Blue Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[850px] w-[850px] rounded-full bg-indigo-500/30 blur-[160px]" />
      </div>

      {/* 3D LightPillar active on Desktop */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-70">
          <LightPillar
            topColor="#06b6d4"
            bottomColor="#c084fc"
            intensity={1.2}
            rotationSpeed={0.2}
            glowAmount={0.005}
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

      {/* Whole-Website Background Glass Blur Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 backdrop-blur-[50px] bg-black/10" />

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
