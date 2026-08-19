import React from 'react';
import LightPillar from './LightPillar';

export const AuroraBackground = ({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`relative min-h-screen overflow-hidden text-white w-full bg-[#05020a] ${className}`}
    >
      {/* 3D LightPillar Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <LightPillar
          topColor="#2d1200"
          bottomColor="#ff3047"
          intensity={0.5}
          rotationSpeed={0.1}
          glowAmount={0.003}
          pillarWidth={10}
          pillarHeight={0.3}
          noiseIntensity={0}
          pillarRotation={90}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
