import React from 'react';

export const AuroraBackground = ({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-black text-white w-full ${className}`}>
      {/* Aurora Background Layer (Fixed to screen for smooth continuous scrolling) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base aurora layer */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-950/60 via-purple-950/50 to-indigo-950/60" />
        </div>
        
        {/* Animated aurora waves */}
        <div className="absolute inset-0">
          {/* Wave 1 */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(ellipse 800px 600px at 50% 20%, rgba(59, 130, 246, 0.35) 0%, transparent 55%)',
              animation: 'aurora1 12s ease-in-out infinite alternate'
            }}
          />
          
          {/* Wave 2 */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: 'radial-gradient(ellipse 600px 400px at 80% 30%, rgba(139, 92, 246, 0.45) 0%, transparent 55%)',
              animation: 'aurora2 9s ease-in-out infinite alternate-reverse'
            }}
          />
          
          {/* Wave 3 */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse 700px 500px at 20% 60%, rgba(236, 72, 153, 0.35) 0%, transparent 55%)',
              animation: 'aurora3 14s ease-in-out infinite alternate'
            }}
          />
          
          {/* Wave 4 */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse 900px 300px at 60% 80%, rgba(34, 197, 94, 0.25) 0%, transparent 55%)',
              animation: 'aurora4 11s ease-in-out infinite alternate-reverse'
            }}
          />
        </div>
        
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Keyframe Animations */}
      <style>{`
        @keyframes aurora1 {
          0% { transform: translateX(-100px) translateY(-50px) rotate(0deg) scale(1); }
          50% { transform: translateX(50px) translateY(30px) rotate(180deg) scale(1.1); }
          100% { transform: translateX(100px) translateY(-30px) rotate(360deg) scale(0.9); }
        }
        
        @keyframes aurora2 {
          0% { transform: translateX(80px) translateY(40px) rotate(45deg) scale(0.8); }
          50% { transform: translateX(-30px) translateY(-20px) rotate(225deg) scale(1.2); }
          100% { transform: translateX(-80px) translateY(60px) rotate(405deg) scale(0.9); }
        }
        
        @keyframes aurora3 {
          0% { transform: translateX(-50px) translateY(20px) rotate(90deg) scale(1.1); }
          50% { transform: translateX(70px) translateY(-40px) rotate(270deg) scale(0.8); }
          100% { transform: translateX(-20px) translateY(50px) rotate(450deg) scale(1.0); }
        }
        
        @keyframes aurora4 {
          0% { transform: translateX(30px) translateY(-20px) rotate(135deg) scale(0.9); }
          50% { transform: translateX(-60px) translateY(10px) rotate(315deg) scale(1.1); }
          100% { transform: translateX(40px) translateY(-60px) rotate(495deg) scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default AuroraBackground;
