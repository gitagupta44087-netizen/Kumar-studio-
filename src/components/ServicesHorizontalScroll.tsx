import React, { useEffect, useRef, useState } from 'react';
import { STUDIO_CONFIG, ServiceItem } from '../config/studioConfig';
import { buildServiceWhatsAppUrl } from '../utils/studioLogic';
import { ChevronLeft, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';

interface ServicesHorizontalScrollProps {
  onSelectServiceForBooking: (serviceTitle: string) => void;
}

/**
 * Renders the subtle, context-appropriate visual animation for each service card
 * when the card scrolls into view (or is focused/triggered).
 */
const ServiceContextAnimationStage: React.FC<{
  service: ServiceItem;
  isInView: boolean;
  animKey: number;
}> = ({ service, isInView, animKey }) => {
  const activeClass = isInView ? 'opacity-100' : 'opacity-40';

  switch (service.animationType) {
    case 'weddings-rings-confetti':
      return (
        <div
          key={animKey}
          className={`relative w-full h-36 bg-[#0F0E12] border border-gold-hairline rounded-lg overflow-hidden flex items-center justify-center transition-opacity duration-500 ${activeClass}`}
          data-testid={`service-anim-${service.id}`}
          data-in-view={isInView ? 'true' : 'false'}
        >
          {/* Subtle golden radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 55%, rgba(242,194,123,0.18), transparent 70%)',
            }}
          />
          {/* Floating marigold & gold confetti particles */}
          {isInView &&
            [
              { left: '18%', delay: '0s', tx: '-12px', size: 'w-2 h-2' },
              { left: '32%', delay: '0.35s', tx: '14px', size: 'w-1.5 h-2.5' },
              { left: '48%', delay: '0.15s', tx: '-8px', size: 'w-2 h-1.5' },
              { left: '64%', delay: '0.5s', tx: '12px', size: 'w-2 h-2' },
              { left: '78%', delay: '0.25s', tx: '-14px', size: 'w-1.5 h-2' },
              { left: '86%', delay: '0.65s', tx: '8px', size: 'w-2 h-1.5' },
            ].map((p, idx) => (
              <span
                key={idx}
                className={`absolute bottom-3 ${p.size} rounded-sm bg-gradient-to-tr from-[#C8893B] to-[#FFE0A3] pointer-events-none`}
                style={
                  {
                    left: p.left,
                    '--tx': p.tx,
                    animation: `confettiFloat 2.8s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay} infinite`,
                  } as React.CSSProperties
                }
              />
            ))}

          {/* Interlocking Golden Wedding Rings SVG */}
          <svg className="w-36 h-24 overflow-visible" viewBox="0 0 160 100" aria-hidden="true">
            <defs>
              <linearGradient id="weddingGoldA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F2C27B" />
                <stop offset="50%" stopColor="#C8893B" />
                <stop offset="100%" stopColor="#FFB347" />
              </linearGradient>
            </defs>
            <g
              style={{
                transformOrigin: '65px 52px',
                animation: isInView ? 'ringOrbitLeft 3.6s ease-in-out infinite' : 'none',
              }}
            >
              <circle
                cx="65"
                cy="52"
                r="26"
                fill="none"
                stroke="url(#weddingGoldA)"
                strokeWidth="4.5"
              />
              {/* Diamond solitaire crest */}
              <polygon points="65,18 71,24 65,30 59,24" fill="#F4EFE6" />
            </g>
            <g
              style={{
                transformOrigin: '95px 52px',
                animation: isInView ? 'ringOrbitRight 3.6s ease-in-out infinite' : 'none',
              }}
            >
              <circle
                cx="95"
                cy="52"
                r="26"
                fill="none"
                stroke="#F2C27B"
                strokeWidth="4"
                strokeDasharray="140 8"
              />
            </g>
          </svg>

          <span className="absolute bottom-2 right-2.5 font-mono-spec text-[11px] text-[#F2C27B]/80">
            SACRED VOWS · 4K RAW
          </span>
        </div>
      );

    case 'prewedding-cinema-flare':
      return (
        <div
          key={animKey}
          className={`relative w-full h-36 bg-[#0F0E12] border border-gold-hairline rounded-lg overflow-hidden flex items-center justify-center transition-opacity duration-500 ${activeClass}`}
          data-testid={`service-anim-${service.id}`}
          data-in-view={isInView ? 'true' : 'false'}
        >
          {/* Sweeping Anamorphic Golden Lens Flare */}
          <div
            className="absolute inset-y-0 w-44 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,179,71,0.32) 50%, transparent 100%)',
              animation: isInView ? 'anamorphicSweep 3.4s ease-in-out infinite' : 'none',
            }}
          />
          <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#FFB347] to-transparent opacity-80" />

          {/* Dual Cinema Film Reels */}
          <div className="relative z-10 flex items-center gap-6">
            {[0, 1].map((reel) => (
              <svg
                key={reel}
                className="w-14 h-14 text-[#F2C27B]"
                style={{
                  animation: isInView ? 'gearIrisSpin 5s linear infinite' : 'none',
                }}
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="#121216"
                  stroke="#C8893B"
                  strokeWidth="2.5"
                />
                <circle cx="32" cy="32" r="7" fill="none" stroke="#F2C27B" strokeWidth="2" />
                <circle cx="32" cy="15" r="4" fill="#C8893B" />
                <circle cx="32" cy="49" r="4" fill="#C8893B" />
                <circle cx="15" cy="32" r="4" fill="#C8893B" />
                <circle cx="49" cy="32" r="4" fill="#C8893B" />
              </svg>
            ))}
          </div>
          <span className="absolute bottom-2 right-2.5 font-mono-spec text-[11px] text-[#F2C27B]/80">
            2.39:1 ANAMORPHIC
          </span>
        </div>
      );

    case 'portraits-camera-flash':
      return (
        <div
          key={animKey}
          className={`relative w-full h-36 bg-[#0F0E12] border border-gold-hairline rounded-lg overflow-hidden flex items-center justify-center transition-opacity duration-500 ${activeClass}`}
          data-testid={`service-anim-${service.id}`}
          data-in-view={isInView ? 'true' : 'false'}
        >
          {/* Subtle Studio Strobe Flash Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(244,239,230,0.85) 0%, rgba(242,194,123,0.28) 45%, transparent 75%)',
              opacity: 0,
              animation: isInView ? 'portraitFlash 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite' : 'none',
            }}
          />

          {/* Sculpted Portrait Silhouette */}
          <svg className="w-28 h-28 text-[#F4EFE6]" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              cx="50"
              cy="38"
              r="16"
              fill="#16161B"
              stroke="#F2C27B"
              strokeWidth="2"
            />
            <path
              d="M24,86 C26,64 36,56 50,56 C64,56 74,64 76,86"
              fill="#16161B"
              stroke="#C8893B"
              strokeWidth="2"
            />
            {/* Catchlights */}
            <circle cx="44" cy="36" r="1.8" fill="#F4EFE6" />
            <circle cx="56" cy="36" r="1.8" fill="#F4EFE6" />
          </svg>

          {/* Eye-AF Focus Reticle Locking In */}
          <div
            className="absolute w-16 h-16 border border-[#FFB347] rounded-sm pointer-events-none flex items-center justify-center"
            style={{
              animation: isInView ? 'reticleLock 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite' : 'none',
            }}
          >
            <div className="w-2 h-2 border border-[#F4EFE6]" />
          </div>

          <span className="absolute bottom-2 right-2.5 font-mono-spec text-[11px] text-[#FFB347]">
            EYE-AF LOCKED · 1/200s
          </span>
        </div>
      );

    case 'products-turntable-glow':
      return (
        <div
          key={animKey}
          className={`relative w-full h-36 bg-[#0F0E12] border border-gold-hairline rounded-lg overflow-hidden flex items-center justify-center transition-opacity duration-500 ${activeClass}`}
          data-testid={`service-anim-${service.id}`}
          data-in-view={isInView ? 'true' : 'false'}
        >
          {/* Breathing Golden Rim Halo */}
          <div
            className="absolute w-28 h-28 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,179,71,0.34) 0%, rgba(200,137,59,0.08) 60%, transparent 75%)',
              animation: isInView ? 'productGlowHalo 3s ease-in-out infinite' : 'none',
            }}
          />

          {/* 360° Rotating Luxury Product Pedestal & Crystal Geometry */}
          <div
            className="relative z-10 flex flex-col items-center"
            style={{
              transformStyle: 'preserve-3d',
              animation: isInView ? 'productTurntable 5.5s linear infinite' : 'none',
            }}
          >
            <svg className="w-24 h-24" viewBox="0 0 100 100" aria-hidden="true">
              {/* Pedestal ellipse */}
              <ellipse
                cx="50"
                cy="80"
                rx="34"
                ry="8"
                fill="#18181F"
                stroke="#C8893B"
                strokeWidth="2"
              />
              {/* Faceted Luxury Perfume / Watch Silhouette */}
              <polygon
                points="50,16 70,34 64,74 36,74 30,34"
                fill="rgba(242,194,123,0.14)"
                stroke="#F2C27B"
                strokeWidth="2"
              />
              <line x1="50" y1="16" x2="50" y2="74" stroke="#FFB347" strokeWidth="1.5" />
              <line x1="30" y1="34" x2="70" y2="34" stroke="#C8893B" strokeWidth="1.2" />
              <rect x="43" y="8" width="14" height="8" fill="#C8893B" />
            </svg>
          </div>

          <span className="absolute bottom-2 right-2.5 font-mono-spec text-[11px] text-[#F2C27B]/80">
            360° MACRO TURNTABLE
          </span>
        </div>
      );

    case 'events-spotlight-sweep':
      return (
        <div
          key={animKey}
          className={`relative w-full h-36 bg-[#0F0E12] border border-gold-hairline rounded-lg overflow-hidden flex items-center justify-center transition-opacity duration-500 ${activeClass}`}
          data-testid={`service-anim-${service.id}`}
          data-in-view={isInView ? 'true' : 'false'}
        >
          {/* Left & Right Stage Spotlight Cones */}
          <div
            className="absolute -top-6 left-1/4 w-16 h-44 origin-top pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(242,194,123,0.42) 0%, rgba(200,137,59,0.02) 100%)',
              clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
              animation: isInView ? 'spotlightSweepLeft 3.2s ease-in-out infinite' : 'none',
            }}
          />
          <div
            className="absolute -top-6 right-1/4 w-16 h-44 origin-top pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,179,71,0.42) 0%, rgba(200,137,59,0.02) 100%)',
              clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
              animation: isInView ? 'spotlightSweepRight 3.2s ease-in-out infinite' : 'none',
            }}
          />

          {/* Stage Horizon & Live Cadence Bars */}
          <div className="relative z-10 flex items-end gap-1.5 h-14">
            {[45, 85, 60, 100, 70, 90, 50].map((h, i) => (
              <span
                key={i}
                className="w-2 bg-gradient-to-t from-[#C8893B] to-[#F2C27B] rounded-t"
                style={{
                  height: `${isInView ? h : 30}%`,
                  transition: `height 400ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms`,
                }}
              />
            ))}
          </div>

          <span className="absolute bottom-2 right-2.5 font-mono-spec text-[11px] text-[#F2C27B]/80">
            LIVE MULTI-CAM STAGE
          </span>
        </div>
      );

    case 'passport-biometric-scan':
      return (
        <div
          key={animKey}
          className={`relative w-full h-36 bg-[#0F0E12] border border-gold-hairline rounded-lg overflow-hidden flex items-center justify-center transition-opacity duration-500 ${activeClass}`}
          data-testid={`service-anim-${service.id}`}
          data-in-view={isInView ? 'true' : 'false'}
        >
          {/* ICAO Biometric Alignment Grid */}
          <div className="relative w-24 h-28 border border-[#C8893B]/60 rounded flex items-center justify-center">
            <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-[#F2C27B]/40" />
            <div className="absolute inset-x-0 top-2/3 border-t border-dashed border-[#F2C27B]/40" />
            <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-[#F2C27B]/40" />
            <svg className="w-14 h-16 text-[#F4EFE6]/80" viewBox="0 0 64 72" aria-hidden="true">
              <circle cx="32" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
              <path
                d="M14,64 C15,46 22,40 32,40 C42,40 49,46 50,64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {/* Scanning Laser Bar */}
            <div
              className="absolute inset-x-1 h-0.5 bg-[#FFB347] shadow-[0_0_8px_#FFB347]"
              style={{
                animation: isInView ? 'biometricScan 2.6s ease-in-out infinite' : 'none',
              }}
            />
          </div>
          <span className="absolute bottom-2 right-2.5 font-mono-spec text-[11px] text-[#F2C27B]/80">
            35×45MM ICAO VERIFIED
          </span>
        </div>
      );

    case 'printing-album-flip':
      return (
        <div
          key={animKey}
          className={`relative w-full h-36 bg-[#0F0E12] border border-gold-hairline rounded-lg overflow-hidden flex items-center justify-center transition-opacity duration-500 ${activeClass}`}
          data-testid={`service-anim-${service.id}`}
          data-in-view={isInView ? 'true' : 'false'}
        >
          {/* Open Lay-Flat Velvet & Gold Heirloom Album with Turning Page */}
          <div className="relative flex items-center justify-center">
            {/* Left Spread */}
            <div className="w-20 h-20 bg-[#18171C] border border-[#C8893B] rounded-l-sm flex flex-col justify-between p-2">
              <div className="w-full h-10 bg-[#25211D] border border-[#F2C27B]/30" />
              <div className="w-2/3 h-1 bg-[#8E8A84]/40" />
            </div>
            {/* Center Gold Spine */}
            <div className="w-1.5 h-22 bg-gradient-to-b from-[#F2C27B] via-[#C8893B] to-[#F2C27B] z-20" />
            {/* Right Spread Base */}
            <div className="w-20 h-20 bg-[#18171C] border border-[#C8893B] rounded-r-sm flex flex-col justify-between p-2">
              <div className="w-full h-10 bg-[#25211D] border border-[#F2C27B]/30" />
              <div className="w-3/4 h-1 bg-[#8E8A84]/40" />
            </div>
            {/* Animated Turning Page Leaf */}
            <div
              className="absolute left-1/2 w-20 h-20 bg-[#211E1A] border border-[#F2C27B] rounded-r-sm origin-left z-10 p-2 flex flex-col justify-between shadow-lg"
              style={{
                animation: isInView ? 'albumPageTurn 3.2s ease-in-out infinite' : 'none',
              }}
            >
              <div className="w-full h-10 bg-gradient-to-br from-[#C8893B]/30 to-[#141418] border border-[#F2C27B]/50" />
              <div className="w-1/2 h-1 bg-[#F2C27B]/60" />
            </div>
          </div>
          <span className="absolute bottom-2 right-2.5 font-mono-spec text-[11px] text-[#F2C27B]/80">
            300 DPI ARCHIVAL LAB
          </span>
        </div>
      );

    case 'gear-aperture-iris':
    default:
      return (
        <div
          key={animKey}
          className={`relative w-full h-36 bg-[#0F0E12] border border-gold-hairline rounded-lg overflow-hidden flex items-center justify-center transition-opacity duration-500 ${activeClass}`}
          data-testid={`service-anim-${service.id}`}
          data-in-view={isInView ? 'true' : 'false'}
        >
          {/* Rotating Mechanical Iris & Bronze Gear Ring */}
          <svg
            className="w-24 h-24"
            viewBox="0 0 100 100"
            style={{
              animation: isInView ? 'gearIrisSpin 6s ease-in-out infinite' : 'none',
            }}
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#C8893B"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <circle cx="50" cy="50" r="32" fill="#141418" stroke="#F2C27B" strokeWidth="1.5" />
            {/* 8 Iris Blades */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="50"
                x2={50 + 28 * Math.cos((deg * Math.PI) / 180)}
                y2={50 + 28 * Math.sin((deg * Math.PI) / 180)}
                stroke="#F2C27B"
                strokeWidth="1.8"
              />
            ))}
            <circle cx="50" cy="50" r="12" fill="#0B0B0D" stroke="#FFB347" strokeWidth="2" />
          </svg>
          <span className="absolute bottom-2 right-2.5 font-mono-spec text-[11px] text-[#F2C27B]/80">
            PRO RENTAL & SENSOR LAB
          </span>
        </div>
      );
  }
};

export const ServicesHorizontalScroll: React.FC<ServicesHorizontalScrollProps> = ({
  onSelectServiceForBooking,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Track which service cards have scrolled into view
  const [inViewMap, setInViewMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    STUDIO_CONFIG.services.forEach((s, idx) => {
      initial[s.id] = idx < 3; // First 3 visible immediately on desktop
    });
    return initial;
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [replayCounts, setReplayCounts] = useState<Record<string, number>>({});
  const [tiltState, setTiltState] = useState<Record<string, { rx: number; ry: number }>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setInViewMap((prev) => {
          const next = { ...prev };
          for (const entry of entries) {
            const id = entry.target.getAttribute('data-service-id');
            if (id) {
              next[id] = entry.isIntersecting;
            }
          }
          return next;
        });
      },
      {
        root: null,
        threshold: 0.25,
      }
    );

    cardRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToCard = (index: number) => {
    const clamped = Math.max(0, Math.min(STUDIO_CONFIG.services.length - 1, index));
    setActiveIndex(clamped);
    const targetService = STUDIO_CONFIG.services[clamped];
    setInViewMap((prev) => ({ ...prev, [targetService.id]: true }));

    const track = trackRef.current;
    const cardEl = cardRefs.current.get(targetService.id);
    if (track && cardEl) {
      const left = cardEl.offsetLeft - track.offsetLeft - 16;
      track.scrollTo({ left, behavior: 'smooth' });
    }
  };

  const handleCardPointerMove = (id: string, e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltState((prev) => ({
      ...prev,
      [id]: {
        rx: Number((-py * 8).toFixed(2)),
        ry: Number((px * 10).toFixed(2)),
      },
    }));
  };

  const handleCardPointerLeave = (id: string) => {
    setTiltState((prev) => ({
      ...prev,
      [id]: { rx: 0, ry: 0 },
    }));
  };

  const triggerReplay = (id: string) => {
    setInViewMap((prev) => ({ ...prev, [id]: true }));
    setReplayCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="py-24 px-6 lg:px-12 border-t border-gold-hairline bg-[#0B0B0D] relative"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header + Horizontal Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-mono-spec text-xs text-[#F2C27B] tracking-widest uppercase mb-2">
              03 · Studio Capabilities & Lab
            </p>
            <h2
              id="services-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#F4EFE6]"
            >
              Eight Disciplines of Visual Craft
            </h2>
            <p className="text-[#8E8A84] text-base mt-3 max-w-2xl">
              Scroll horizontally or select any discipline below. Each 3D tilt card awakens with a
              signature optical animation as it enters your viewfinder.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono-spec text-xs text-[#8E8A84] mr-2">
              0{activeIndex + 1} / 0{STUDIO_CONFIG.services.length}
            </span>
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous service card"
              className="w-10 h-10 rounded-lg border border-gold-hairline bg-[#141418] text-[#F4EFE6] flex items-center justify-center hover:border-[#F2C27B] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex + 1)}
              disabled={activeIndex === STUDIO_CONFIG.services.length - 1}
              aria-label="Next service card"
              className="w-10 h-10 rounded-lg border border-gold-hairline bg-[#141418] text-[#F4EFE6] flex items-center justify-center hover:border-[#F2C27B] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Quick-Jump Segmented Bar */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 no-scrollbar"
          role="tablist"
          aria-label="Jump to studio service"
        >
          {STUDIO_CONFIG.services.map((service, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={service.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => scrollToCard(idx)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#C8893B] text-[#0B0B0D] font-semibold'
                    : 'bg-[#141418] text-[#8E8A84] hover:text-[#F4EFE6] border border-white/5'
                }`}
              >
                {service.index}. {service.title}
              </button>
            );
          })}
        </div>

        {/* Horizontal Scroll 3D Tilt Cards Track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth"
          data-testid="services-horizontal-track"
        >
          {STUDIO_CONFIG.services.map((service, idx) => {
            const isInView = Boolean(inViewMap[service.id]);
            const tilt = tiltState[service.id] || { rx: 0, ry: 0 };
            const replayKey = replayCounts[service.id] || 0;

            return (
              <article
                key={service.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(service.id, el);
                  else cardRefs.current.delete(service.id);
                }}
                data-service-id={service.id}
                data-testid={`service-card-${service.id}`}
                onPointerMove={(e) => handleCardPointerMove(service.id, e)}
                onPointerLeave={() => handleCardPointerLeave(service.id)}
                onFocus={() => {
                  setActiveIndex(idx);
                  setInViewMap((prev) => ({ ...prev, [service.id]: true }));
                }}
                style={{
                  transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  transition: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="snap-start shrink-0 w-[86vw] sm:w-[360px] lg:w-[380px] bg-[#131317] border border-gold-hairline rounded-2xl p-6 flex flex-col justify-between viewfinder-frame"
              >
                <div>
                  {/* Top Metadata Row (Strictly single-line so all cards align horizontally) */}
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-spec text-[#8E8A84] mb-3">
                    <span className="truncate whitespace-nowrap">
                      {service.index} · {service.exifSpec}
                    </span>
                    <button
                      type="button"
                      onClick={() => triggerReplay(service.id)}
                      aria-label={`Replay ${service.title} card animation`}
                      className="inline-flex items-center gap-1 text-[#F2C27B] hover:text-[#FFB347] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Animate</span>
                    </button>
                  </div>

                  {/* Context-Appropriate Scroll-Triggered Animation Stage */}
                  <ServiceContextAnimationStage
                    service={service}
                    isInView={isInView}
                    animKey={replayKey}
                  />

                  {/* Subtle unboxed caption showing the active scroll-triggered animation motif */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-spec text-[#8E8A84]">
                    <span className="truncate">{service.animationLabel}</span>
                    <span className="text-[#C8893B] shrink-0">
                      {isInView ? 'ACTIVE IN VIEW' : 'STANDBY'}
                    </span>
                  </div>

                  {/* Service Title & Subtitle */}
                  <div className="mt-4">
                    <h3 className="text-2xl font-display font-semibold text-[#F4EFE6]">
                      {service.index}. {service.title}
                    </h3>
                    <p className="text-xs font-mono-spec text-[#F2C27B] mt-1">
                      {service.subtitle}
                    </p>
                    <p className="text-sm text-[#8E8A84] mt-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Deliverables List */}
                  <ul className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-[#F4EFE6]/90">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-[#C8893B]" aria-hidden="true">
                          +
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer: Price & Action Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[11px] font-mono-spec text-[#8E8A84]">
                      STARTING AT
                    </span>
                    <span className="text-lg font-mono-spec font-semibold text-[#F4EFE6]">
                      {service.startingPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectServiceForBooking(service.title)}
                      className="px-3.5 py-2 text-xs font-medium bg-[#1D1D24] text-[#F4EFE6] border border-gold-hairline rounded-lg hover:border-[#F2C27B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Select Shoot
                    </button>
                    <a
                      href={buildServiceWhatsAppUrl(service.title, service.startingPrice)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 text-xs font-semibold bg-gold-gradient text-[#0B0B0D] rounded-lg hover:brightness-110 transition-all inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      <span>WhatsApp</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
