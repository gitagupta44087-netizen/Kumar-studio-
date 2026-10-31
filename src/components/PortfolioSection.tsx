import React, { useEffect, useState } from 'react';
import { STUDIO_CONFIG, PortfolioItem } from '../config/studioConfig';
import { filterPortfolioItems } from '../utils/studioLogic';
import { getPortfolioArtworkDataUrl } from '../utils/proceduralArt';
import { X, ChevronLeft, ChevronRight, Maximize2, ArrowUpRight } from 'lucide-react';

interface PortfolioSectionProps {
  onBookStyle: (category: string) => void;
}

const CATEGORIES = ['All', 'Weddings', 'Pre-Wedding', 'Portraits', 'Products', 'Events'] as const;

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onBookStyle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  const filteredItems = filterPortfolioItems(STUDIO_CONFIG.portfolio, selectedCategory);

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
      } else if (e.key === 'ArrowRight') {
        const idx = filteredItems.findIndex((i) => i.id === lightboxItem.id);
        if (idx !== -1) {
          setLightboxItem(filteredItems[(idx + 1) % filteredItems.length]);
        }
      } else if (e.key === 'ArrowLeft') {
        const idx = filteredItems.findIndex((i) => i.id === lightboxItem.id);
        if (idx !== -1) {
          setLightboxItem(
            filteredItems[(idx - 1 + filteredItems.length) % filteredItems.length]
          );
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem, filteredItems]);

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="py-24 px-6 lg:px-12 border-t border-gold-hairline bg-[#0B0B0D]"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header & Interactive Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-mono-spec text-xs text-[#F2C27B] tracking-widest uppercase mb-2">
              04 · Curated Exhibition Archive
            </p>
            <h2
              id="portfolio-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#F4EFE6]"
            >
              Selected Works & Master Frames
            </h2>
            <p className="text-[#8E8A84] text-base mt-3 max-w-xl">
              Every photograph is captured on full-frame or medium-format glass and archival-graded
              at our Kacheri Station Road studio. Click any frame to inspect full EXIF telemetry.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div
            className="flex items-center gap-1.5 p-1.5 bg-[#131318] border border-gold-hairline rounded-xl overflow-x-auto"
            role="tablist"
            aria-label="Filter portfolio by category"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#C8893B] text-[#0B0B0D] font-semibold'
                      : 'text-[#8E8A84] hover:text-[#F4EFE6]'
                  }`}
                >
                  {category === 'All' ? 'All Works' : category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bento & Editorial Masonry Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="portfolio-grid"
        >
          {filteredItems.map((item, idx) => {
            const isWide = item.aspect === 'wide' && idx === 0;
            const artUrl = getPortfolioArtworkDataUrl(item.artTheme, item.title);

            return (
              <article
                key={item.id}
                className={`group relative rounded-2xl overflow-hidden bg-[#131317] border border-gold-hairline flex flex-col justify-between ${
                  isWide ? 'md:col-span-2' : 'col-span-1'
                }`}
                data-cursor-view="true"
              >
                <button
                  type="button"
                  onClick={() => setLightboxItem(item)}
                  aria-label={`View ${item.title} in fullscreen lightbox`}
                  className="relative w-full h-72 sm:h-80 overflow-hidden text-left block cursor-pointer focus:outline-none"
                >
                  <img
                    src={artUrl}
                    alt={`${item.title} — ${item.category} photography by Kumar Studio Chhapra`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Measured Gradient Scrim for 4.5:1 Contrast */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(11,11,13,0.94) 0%, rgba(11,11,13,0.38) 50%, rgba(11,11,13,0.12) 100%)',
                    }}
                  />

                  {/* Top EXIF Metadata Bar (Unboxed clean text with · separators) */}
                  <div className="absolute top-4 inset-x-5 flex items-center justify-between text-xs font-mono-spec text-[#F4EFE6]/85">
                    <span>
                      {item.category} · {item.date}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#F2C27B] group-hover:translate-x-0.5 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </span>
                  </div>

                  {/* Bottom Title & EXIF Caption */}
                  <div className="absolute bottom-4 inset-x-5">
                    <p className="font-mono-spec text-xs text-[#F2C27B] mb-1">{item.exif}</p>
                    <h3 className="text-2xl font-display font-semibold text-[#F4EFE6]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#8E8A84] mt-1">
                      {item.location} · {item.camera}
                    </p>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal with EXIF Captions */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          className="fixed inset-0 z-50 bg-[#0B0B0D]/95 flex items-center justify-center p-4 sm:p-8"
          data-testid="portfolio-lightbox"
        >
          <div className="relative w-full max-w-5xl bg-[#131318] border border-gold-hairline rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              aria-label="Close Lightbox"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-lg bg-[#0B0B0D]/90 border border-gold-hairline text-[#F4EFE6] flex items-center justify-center hover:border-[#F2C27B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Artwork Viewport */}
            <div className="lg:col-span-8 relative bg-[#09090B] min-h-[320px] sm:min-h-[460px] flex items-center justify-center">
              <img
                src={getPortfolioArtworkDataUrl(lightboxItem.artTheme, lightboxItem.title)}
                alt={lightboxItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Prev / Next Controls */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const idx = filteredItems.findIndex((i) => i.id === lightboxItem.id);
                    setLightboxItem(
                      filteredItems[(idx - 1 + filteredItems.length) % filteredItems.length]
                    );
                  }}
                  aria-label="Previous photograph"
                  className="px-3 py-1.5 rounded-lg bg-[#0B0B0D]/85 border border-gold-hairline text-xs font-mono-spec text-[#F4EFE6] hover:border-[#F2C27B] inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idx = filteredItems.findIndex((i) => i.id === lightboxItem.id);
                    setLightboxItem(filteredItems[(idx + 1) % filteredItems.length]);
                  }}
                  aria-label="Next photograph"
                  className="px-3 py-1.5 rounded-lg bg-[#0B0B0D]/85 border border-gold-hairline text-xs font-mono-spec text-[#F4EFE6] hover:border-[#F2C27B] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Optical EXIF & Story Column */}
            <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="font-mono-spec text-xs text-[#F2C27B] uppercase tracking-wider">
                  {lightboxItem.category} · {lightboxItem.date}
                </p>
                <h3
                  id="lightbox-title"
                  className="text-2xl sm:text-3xl font-display font-semibold text-[#F4EFE6] mt-2"
                >
                  {lightboxItem.title}
                </h3>
                <p className="text-xs font-mono-spec text-[#8E8A84] mt-1">
                  {lightboxItem.location}
                </p>

                <p className="text-sm text-[#F4EFE6]/90 mt-5 leading-relaxed">
                  {lightboxItem.story}
                </p>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-xs font-mono-spec">
                  <div className="flex justify-between">
                    <span className="text-[#8E8A84]">EXIF EXPOSURE</span>
                    <span className="text-[#F2C27B]">{lightboxItem.exif}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8A84]">CAMERA SYSTEM</span>
                    <span className="text-[#F4EFE6]">{lightboxItem.camera}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8A84]">COLOR PROFILE</span>
                    <span className="text-[#F4EFE6]">Kumar Gold LUT 16-Bit</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const cat = lightboxItem.category;
                    setLightboxItem(null);
                    onBookStyle(cat);
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-gold-gradient text-[#0B0B0D] font-semibold text-xs inline-flex items-center justify-center gap-1.5 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Book a {lightboxItem.category} Shoot</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
