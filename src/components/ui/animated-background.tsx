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
    <div
      className={`relative min-h-screen overflow-hidden text-white w-full ${className}`}
      style={{
        background: 'radial-gradient(circle at center bottom, #3b0b15 0%, #0d080a 65%)',
      }}
    >
      {/* Fixed Ambient Crimson/Wine Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[750px] w-[750px] rounded-full bg-[#3b0b15]/60 blur-[160px]" />
        <div className="absolute top-1/3 left-1/4 h-[600px] w-[600px] rounded-full bg-[#3b0b15]/30 blur-[150px]" />
      </div>

      {/* 3D LightPillar active on Desktop */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
          <LightPillar
            topColor="#fb7185"
            bottomColor="#3b0b15"
            intensity={1.0}
            rotationSpeed={0.2}
            glowAmount={0.004}
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
