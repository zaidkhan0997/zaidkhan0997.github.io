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
    <div className={`relative min-h-screen overflow-hidden bg-[#030712] text-white w-full ${className}`}>
      {/* React Bits LightPillar Interactive 3D Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <LightPillar
          topColor="#06b6d4"
          bottomColor="#a855f7"
          intensity={1.2}
          rotationSpeed={0.3}
          glowAmount={0.005}
          pillarWidth={8.4}
          pillarHeight={0.5}
          noiseIntensity={0.1}
          pillarRotation={15}
          interactive={true}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      {/* MacOS / iOS Glass Blur Background Overlay Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 backdrop-blur-[35px] bg-[#030712]/50" />

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
