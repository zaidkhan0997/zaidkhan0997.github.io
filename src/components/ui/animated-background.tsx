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
          topColor="#ff0000"
          bottomColor="#050000"
          intensity={1}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={10}
          pillarHeight={1.8}
          noiseIntensity={0}
          pillarRotation={198}
          interactive={false}
          mixBlendMode="screen"
          quality="medium"
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
