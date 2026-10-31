import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only enable on fine pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMove = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const target = e.target as HTMLElement | null;
      const viewCard = target?.closest('[data-cursor-view="true"]');
      setIsViewMode(Boolean(viewCard));
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="hidden lg:flex fixed top-0 left-0 z-50 pointer-events-none items-center justify-center transition-transform duration-100 ease-out"
      style={{
        transform: `translate3d(${pos.x - (isViewMode ? 32 : 16)}px, ${
          pos.y - (isViewMode ? 32 : 16)
        }px, 0)`,
        width: isViewMode ? 64 : 32,
        height: isViewMode ? 64 : 32,
      }}
      aria-hidden="true"
    >
      <div
        className={`w-full h-full rounded-full border flex items-center justify-center transition-all duration-150 ${
          isViewMode
            ? 'bg-[#C8893B]/90 border-[#F2C27B] text-[#0B0B0D] scale-100'
            : 'border-[#F2C27B]/60 bg-transparent'
        }`}
      >
        {isViewMode ? (
          <span className="font-mono-spec text-[10px] font-bold tracking-wider">VIEW</span>
        ) : (
          <span className="w-1 h-1 rounded-full bg-[#FFB347]" />
        )}
      </div>
    </div>
  );
};
