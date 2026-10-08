import React, { useEffect, useState, useCallback } from 'react';
import './ScrollDownIndicator.css';

/**
 * Reusable "Scroll Down" Indicator Component
 * 
 * @param {Object} props
 * @param {'default' | 'minimal'} [props.variant='default'] - Visual style ('default' 56x92px or 'minimal' 30x48px)
 * @param {string} [props.targetId='portfolio-content'] - DOM element ID to smooth-scroll to on click
 * @param {number} [props.scrollThreshold=80] - Distance in px before indicator fades out
 * @param {number} [props.externalOpacity] - Optional external opacity override (e.g. from WebGL scrubbers)
 * @param {() => void} [props.onClick] - Optional custom click handler
 * @param {string} [props.className=''] - Extra classes
 */
export const ScrollDownIndicator = ({
  variant = 'default',
  targetId,
  scrollThreshold = 80,
  externalOpacity,
  disableClick = false,
  onClick,
  className = '',
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Only bind scroll listener if externalOpacity is not provided
    if (externalOpacity !== undefined) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [externalOpacity]);

  // Compute opacity: fades out smoothly after scrolling past threshold
  const computedOpacity =
    externalOpacity !== undefined
      ? externalOpacity
      : Math.max(0, 1 - scrollY / scrollThreshold);

  const handleClick = useCallback(
    (e) => {
      if (disableClick) return;
      e.preventDefault();
      if (onClick) {
        onClick();
        return;
      }
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      // Fallback: smooth-scroll one viewport height down
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    },
    [disableClick, targetId, onClick]
  );

  // If fully faded, unmount / hide from pointer
  if (computedOpacity <= 0.02) {
    return null;
  }

  const isMinimal = variant === 'minimal';
  const ComponentTag = disableClick ? 'div' : 'button';

  return (
    <ComponentTag
      {...(!disableClick ? { type: 'button', onClick: handleClick, 'aria-label': 'Scroll down' } : {})}
      className={`fixed bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center transition-opacity duration-300 pb-[env(safe-area-inset-bottom,0px)] group select-none ${
        disableClick
          ? 'pointer-events-none'
          : 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-2xl'
      } ${className}`}
      style={{
        opacity: computedOpacity,
      }}
    >
      {/* 20% scale-down on mobile screens */}
      <div className="relative flex flex-col items-center gap-2 transform scale-80 sm:scale-100 transition-transform origin-bottom">
        {/* Mouse Icon with Centered Orbit Ring and Glow */}
        <div className="scroll-mouse-wrapper">
          {/* Soft Pulsing Radial Glow */}
          <div className="scroll-indicator-glow" />

          {/* Rotating Dashed Gradient Orbit Ring */}
          <div
            className={`scroll-orbit-ring ${isMinimal ? 'scroll-orbit-ring-minimal' : ''}`}
            aria-hidden="true"
          >
            <svg
              className="scroll-orbit-svg"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="scrollOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              {/* Dark backing track to guarantee 100% contrast over bright floors/scenes */}
              <circle
                cx="60"
                cy="60"
                r="56"
                stroke="rgba(3, 7, 18, 0.85)"
                strokeWidth="4.5"
              />
              {/* Vibrant glowing dashed orbit ring */}
              <circle
                cx="60"
                cy="60"
                r="56"
                stroke="url(#scrollOrbitGrad)"
                strokeWidth="2.4"
                strokeDasharray="8.5 11.05"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Mouse Icon Shell */}
          {isMinimal ? (
            <div className="scroll-mouse-minimal">
              <span className="scroll-wheel-dot" />
            </div>
          ) : (
            <div className="scroll-mouse-default">
              <div className="scroll-mouse-default-inner">
                <span className="scroll-wheel-bar" />
              </div>
            </div>
          )}
        </div>

        {/* Three Stacked Cascading Chevrons - High Contrast & Positioned below orbit ring */}
        <div className={`scroll-chevrons-container ${isMinimal ? 'scroll-chevrons-minimal' : ''}`}>
          {[0, 1, 2].map((idx) => (
            <svg
              key={idx}
              viewBox="0 0 16 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`scroll-chevron-arrow scroll-chevron-${idx}`}
            >
              <path
                d="M1.5 1.5L8 7L14.5 1.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>

        {/* High-Contrast Frosted 'scroll' Badge */}
        <span className="scroll-indicator-label">
          scroll
        </span>
      </div>
    </ComponentTag>
  );
};

export default ScrollDownIndicator;
