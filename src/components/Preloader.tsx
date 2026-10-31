import React, { useEffect, useState } from 'react';
import { STUDIO_CONFIG } from '../config/studioConfig';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      onComplete();
      return;
    }

    const start = performance.now();
    const duration = 900; // Fast <1s preloader for <2.5s LCP
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        window.setTimeout(onComplete, 120);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  const irisOpenRadius = 8 + (progress / 100) * 32;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B0B0D] flex flex-col items-center justify-center p-6 select-none"
      role="status"
      aria-label="Loading Kumar Studio"
    >
      {/* Animated Mechanical Aperture Iris Opening */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#C8893B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#F2C27B" strokeWidth="1" />
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle) => (
            <line
              key={angle}
              x1="50"
              y1="50"
              x2={50 + 38 * Math.cos(((angle + progress * 0.6) * Math.PI) / 180)}
              y2={50 + 38 * Math.sin(((angle + progress * 0.6) * Math.PI) / 180)}
              stroke="#C8893B"
              strokeWidth="1.5"
              opacity={1 - progress / 130}
            />
          ))}
          <circle
            cx="50"
            cy="50"
            r={irisOpenRadius}
            fill="#0B0B0D"
            stroke="#FFB347"
            strokeWidth="2"
          />
        </svg>
        <span className="absolute font-mono-spec text-sm font-semibold text-[#F4EFE6]">
          {progress}%
        </span>
      </div>

      <p className="font-display text-2xl tracking-widest text-[#F4EFE6]">
        {STUDIO_CONFIG.business.brandUpper}
      </p>
      <p className="font-mono-spec text-xs text-[#8E8A84] mt-1">
        CALIBRATING OPTICS · KACHERI STATION ROAD, CHHAPRA
      </p>

      <button
        type="button"
        onClick={onComplete}
        className="mt-6 px-4 py-1.5 text-xs font-mono-spec text-[#F2C27B] border border-gold-hairline rounded hover:border-[#F2C27B] transition-colors cursor-pointer"
      >
        Skip Intro
      </button>
    </div>
  );
};
