/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { STUDIO_CONFIG } from './config/studioConfig';
import {
  BookingFormData,
  buildPackageWhatsAppUrl,
  buildWhatsAppBookingUrl,
  computeFocusPullState,
  validateBookingForm,
} from './utils/studioLogic';
import { ExplodedLensCanvas } from './components/ExplodedLensCanvas';
import { ServicesHorizontalScroll } from './components/ServicesHorizontalScroll';
import { PortfolioSection } from './components/PortfolioSection';
import { GearShop3DViewer } from './components/GearShop3DViewer';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import {
  Aperture,
  ArrowUpRight,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('autostart') === '1';
    }
    return false;
  });

  // Scroll-driven states
  const [heroLensProgress, setHeroLensProgress] = useState<number>(0.18);
  const [selectedLensPart, setSelectedLensPart] = useState<'glass' | 'iris' | 'gears' | 'barrel'>(
    'glass'
  );
  const [focusPullProgress, setFocusPullProgress] = useState<number>(0.65);
  const [manualFocusOverride, setManualFocusOverride] = useState<number | null>(null);
  const [navHidden, setNavHidden] = useState<boolean>(false);

  // Interactive section states
  const [activeProcessIdx, setActiveProcessIdx] = useState<number>(0);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);
  const [shutterFlashActive, setShutterFlashActive] = useState<boolean>(false);

  // 4-Field Booking Form State
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    name: '',
    eventType: 'Weddings',
    date: '',
    phone: '',
  });
  const [bookingErrors, setBookingErrors] = useState<
    Partial<Record<keyof BookingFormData, string>>
  >({});
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string | null>(null);

  const heroSectionRef = useRef<HTMLElement | null>(null);
  const aboutSectionRef = useRef<HTMLElement | null>(null);
  const bookingSectionRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef<number>(0);

  // Initialize Lenis smooth scroll + scroll progress listeners
  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      try {
        lenis = new Lenis({
          duration: 1.05,
          smoothWheel: true,
        });
        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {
        // Fallback to native smooth scroll
      }
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      // Sticky minimal nav hides on scroll down and returns on scroll up
      if (currentY > 140 && currentY > lastScrollYRef.current + 8) {
        setNavHidden(true);
      } else if (currentY < lastScrollYRef.current - 8 || currentY <= 100) {
        setNavHidden(false);
      }
      lastScrollYRef.current = currentY;

      // Compute Hero / Exploded Lens scroll progress
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        const totalScrollable = Math.max(1, rect.height - window.innerHeight * 0.4);
        const raw = Math.max(0, Math.min(1, -rect.top / totalScrollable));
        setHeroLensProgress(raw);
      }

      // Compute Focus Pull About section progress
      if (aboutSectionRef.current) {
        const rect = aboutSectionRef.current.getBoundingClientRect();
        const viewportH = window.innerHeight || 800;
        const entered = (viewportH - rect.top) / (viewportH * 0.85);
        setFocusPullProgress(Math.max(0, Math.min(1, entered)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Slow automatic testimonial carousel rotation
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % STUDIO_CONFIG.testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const triggerShutterFlash = () => {
    setShutterFlashActive(false);
    window.setTimeout(() => setShutterFlashActive(true), 10);
    window.setTimeout(() => setShutterFlashActive(false), 700);
  };

  const handleJumpToBookingWithTopic = (eventType: string) => {
    triggerShutterFlash();
    setBookingForm((prev) => ({ ...prev, eventType }));
    setGeneratedWhatsAppUrl(null);
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingForm(bookingForm);
    setBookingErrors(validation.errors);

    if (!validation.valid) {
      return;
    }

    triggerShutterFlash();
    const waUrl = buildWhatsAppBookingUrl(bookingForm);
    setGeneratedWhatsAppUrl(waUrl);
  };

  const effectiveFocusProgress =
    manualFocusOverride !== null ? manualFocusOverride : focusPullProgress;
  const focusState = computeFocusPullState(effectiveFocusProgress);

  const currentTestimonial = STUDIO_CONFIG.testimonials[activeTestimonialIdx];

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F4EFE6] film-grain relative">
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      <CustomCursor />

      {/* Shutter-Click Flash Overlay */}
      {shutterFlashActive && (
        <div
          className="fixed inset-0 z-50 bg-[#F4EFE6] pointer-events-none animate-shutter-flash"
          aria-hidden="true"
        />
      )}

      {/* Strictly 3-Zone Top Navigation Bar (Hides on scroll down, returns on scroll up) */}
      <header
        className={`fixed top-0 inset-x-0 z-40 bg-[#0B0B0D]/90 border-b border-gold-hairline transition-transform duration-200 ${
          navHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#hero"
            className="text-xl font-display font-semibold tracking-wider text-[#F4EFE6] whitespace-nowrap shrink-0"
          >
            {STUDIO_CONFIG.business.brandUpper}
          </a>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-xs font-medium text-[#8E8A84]"
          >
            <a
              href="#about"
              className="hover:text-[#F4EFE6] transition-colors whitespace-nowrap shrink-0"
            >
              About
            </a>
            <a
              href="#services"
              className="hover:text-[#F4EFE6] transition-colors whitespace-nowrap shrink-0"
            >
              Services
            </a>
            <a
              href="#portfolio"
              className="hover:text-[#F4EFE6] transition-colors whitespace-nowrap shrink-0"
            >
              Portfolio
            </a>
            <a
              href="#gear-shop"
              className="hover:text-[#F4EFE6] transition-colors whitespace-nowrap shrink-0"
            >
              Gear Shop
            </a>
            <a
              href="#packages"
              className="hover:text-[#F4EFE6] transition-colors whitespace-nowrap shrink-0"
            >
              Packages
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <a
              href="#booking"
              onClick={() => triggerShutterFlash()}
              className="px-4 py-2 text-xs font-semibold bg-gold-gradient text-[#0B0B0D] rounded-lg hover:brightness-110 transition-all whitespace-nowrap shrink-0"
            >
              Book a Shoot
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO + SCROLL STORY 1: 3D EXPLODED CAMERA LENS */}
        <section
          id="hero"
          ref={heroSectionRef}
          className="relative min-h-[125vh] flex flex-col justify-between pt-16"
        >
          <div className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-hidden flex items-center">
            {/* Full-Viewport 3D Exploded Camera Lens Canvas & Bottom Dock */}
            <div className="absolute inset-0">
              <ExplodedLensCanvas
                scrollProgress={heroLensProgress}
                onSelectPart={(partId) => setSelectedLensPart(partId)}
              />
            </div>

            {/* Left Editorial Content Overlay */}
            <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 lg:px-12 pointer-events-none">
              <div className="max-w-xl pointer-events-auto">
                <p className="font-mono-spec text-xs text-[#F2C27B] tracking-widest uppercase mb-3">
                  {STUDIO_CONFIG.business.established} · MASTER OPTICAL ARCHIVE
                </p>

                {/* Letter-by-letter luxury serif headline */}
                <h1
                  aria-label="KUMAR STUDIO"
                  className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold tracking-tight text-[#F4EFE6] leading-[1.04]"
                >
                  {'KUMAR STUDIO'.split('').map((char, index) => (
                    <span
                      key={index}
                      className="inline-block transition-transform duration-300 hover:-translate-y-1"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h1>

                <p className="text-2xl sm:text-3xl font-display italic text-[#F2C27B] mt-3">
                  {STUDIO_CONFIG.business.tagline}
                </p>

                <p className="text-sm font-mono-spec text-[#8E8A84] mt-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C8893B] shrink-0" />
                  <span>{STUDIO_CONFIG.business.address}</span>
                </p>

                <p className="text-sm sm:text-base text-[#F4EFE6]/85 mt-5 leading-relaxed max-w-lg">
                  Crafted with the optical precision of a flagship cinema prime. From royal Bihar
                  weddings to tethered medium-format portraits and pro camera rentals right on
                  Kacheri Station Road.
                </p>

                {/* Primary Hero CTAs */}
                <div className="mt-7 flex flex-wrap items-center gap-3.5">
                  <a
                    href={STUDIO_CONFIG.business.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-gold-gradient text-[#0B0B0D] font-semibold text-sm inline-flex items-center gap-2 hover:brightness-110 transition-all whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Book on WhatsApp</span>
                  </a>

                  <a
                    href="#portfolio"
                    className="px-6 py-3.5 rounded-xl bg-[#121216]/90 border border-[#C8893B] text-[#F4EFE6] font-medium text-sm hover:border-[#F2C27B] hover:text-[#F2C27B] transition-colors whitespace-nowrap shrink-0"
                  >
                    View Portfolio
                  </a>
                </div>

                {/* Scroll Cue: Animated Aperture Icon with "Scroll to focus" */}
                <div className="mt-8 hidden sm:inline-flex items-center gap-2.5 text-xs font-mono-spec text-[#8E8A84]">
                  <Aperture className="w-4 h-4 text-[#FFB347] animate-spin" style={{ animationDuration: '9s' }} />
                  <span>Scroll to focus · Explode 45° Optical Assembly</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Story 1 Part Callout Bar (Glass, Iris, Gears, Barrel) */}
          <div className="relative z-20 max-w-[1280px] w-full mx-auto px-6 lg:px-12 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STUDIO_CONFIG.lensParts.map((part) => {
                const isSelected = selectedLensPart === part.id;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() =>
                      setSelectedLensPart(part.id as 'glass' | 'iris' | 'gears' | 'barrel')
                    }
                    className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#171512] border-[#F2C27B]'
                        : 'bg-[#121216]/95 border-gold-hairline hover:border-[#C8893B]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-spec text-xs text-[#F2C27B]">
                      <span>{part.code}</span>
                      <span>{part.name.toUpperCase()}</span>
                    </div>
                    <h3 className="text-lg font-display font-semibold text-[#F4EFE6] mt-1.5">
                      {part.fullTitle}
                    </h3>
                    <p className="text-xs font-mono-spec text-[#8E8A84] mt-1">{part.spec}</p>
                    <p className="text-xs text-[#F4EFE6]/80 mt-2 leading-relaxed">
                      {part.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SCROLL STORY 2: FOCUS PULL ABOUT SECTION & HERITAGE METRICS */}
        <section
          id="about"
          ref={aboutSectionRef}
          aria-labelledby="about-heading"
          className="py-24 px-6 lg:px-12 border-t border-gold-hairline bg-[#0E0E12]"
        >
          <div className="max-w-[1280px] mx-auto">
            {/* Optical Focus Ring Interactive Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-10 border-b border-white/10">
              <div className="font-mono-spec text-xs text-[#F2C27B] flex items-center gap-3">
                <span>02 · OPTICAL FOCUS PULL</span>
                <span>·</span>
                <span>SHARPNESS: {focusState.sharpnessPercent}%</span>
                <span>·</span>
                <span>{focusState.inFocus ? 'AF-C LOCKED' : 'PULLING FOCUS'}</span>
              </div>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="manual-focus-ring"
                  className="text-xs font-mono-spec text-[#8E8A84] whitespace-nowrap"
                >
                  Manual Focus Ring:
                </label>
                <input
                  id="manual-focus-ring"
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(effectiveFocusProgress * 100)}
                  onChange={(e) => setManualFocusOverride(Number(e.target.value) / 100)}
                  className="w-28 accent-[#C8893B] cursor-pointer"
                />
                {manualFocusOverride !== null && (
                  <button
                    type="button"
                    onClick={() => setManualFocusOverride(null)}
                    className="text-xs font-mono-spec text-[#F2C27B] hover:underline cursor-pointer"
                  >
                    Auto
                  </button>
                )}
              </div>
            </div>

            {/* Focus-Pull Content Block */}
            <div
              style={{
                filter: `blur(${focusState.blurPx}px)`,
                transition: 'filter 180ms ease-out',
              }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              data-testid="about-focus-container"
            >
              <div className="lg:col-span-7">
                <p className="font-mono-spec text-xs text-[#C8893B] uppercase tracking-widest mb-3">
                  HERITAGE · KACHERI STATION ROAD, CHHAPRA
                </p>
                <h2
                  id="about-heading"
                  className="text-3xl sm:text-5xl font-display font-semibold text-[#F4EFE6] leading-tight"
                >
                  {STUDIO_CONFIG.business.trustHeadline}
                </h2>
                <p className="text-base sm:text-lg text-[#F4EFE6]/90 mt-5 leading-relaxed">
                  For over two decades, families across Saran and Bihar have entrusted{' '}
                  <strong className="text-[#F2C27B] font-medium">Kumar Studio</strong> with their
                  most irreplaceable milestones. We combine medium-format digital clarity, cinema
                  prime lenses, and an in-house archival printing press under one roof on Kacheri
                  Station Road.
                </p>
                <p className="text-sm text-[#8E8A84] mt-4 leading-relaxed">
                  Whether orchestrating a five-day royal wedding, lighting an executive studio
                  portrait, printing a velvet lay-flat Karizma album, or outfitting local filmmakers
                  with flagship camera gear, every frame is engineered to endure for generations.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href={STUDIO_CONFIG.business.callLink}
                    className="px-5 py-3 rounded-xl bg-[#18181F] border border-gold-hairline text-xs font-mono-spec text-[#F4EFE6] hover:border-[#F2C27B] inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C8893B]" />
                    <span>Call Studio: {STUDIO_CONFIG.business.phoneDisplay}</span>
                  </a>
                  <a
                    href={STUDIO_CONFIG.business.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-[#18181F] border border-gold-hairline text-xs font-mono-spec text-[#F2C27B] hover:border-[#F2C27B] inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Visit Kacheri Station Road</span>
                  </a>
                </div>
              </div>

              {/* Right Quantitative Proof Grid */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STUDIO_CONFIG.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-6 rounded-2xl bg-[#141419] border border-gold-hairline viewfinder-frame"
                  >
                    <div className="text-3xl font-display font-semibold text-[#F2C27B] font-mono-spec">
                      {m.value}
                    </div>
                    <div className="text-sm font-semibold text-[#F4EFE6] mt-2">{m.label}</div>
                    <div className="text-xs font-mono-spec text-[#8E8A84] mt-1">{m.context}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SCROLL STORY 3: HORIZONTAL SCROLL 3D TILT SERVICE CARDS WITH SCROLL-INTO-VIEW ANIMATIONS */}
        <ServicesHorizontalScroll onSelectServiceForBooking={handleJumpToBookingWithTopic} />

        {/* SCROLL STORY 4: PORTFOLIO GALLERY & LIGHTBOX */}
        <PortfolioSection onBookStyle={handleJumpToBookingWithTopic} />

        {/* SCROLL STORY 5: 3D GEAR SHOP */}
        <GearShop3DViewer />

        {/* SCROLL STORY 6: FILM-STRIP TIMELINE PROCESS (Consult -> Shoot -> Edit -> Deliver) */}
        <section
          id="process"
          aria-labelledby="process-heading"
          className="py-24 px-6 lg:px-12 border-t border-gold-hairline bg-[#0E0E12]"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-12">
              <p className="font-mono-spec text-xs text-[#F2C27B] tracking-widest uppercase mb-2">
                06 · 35MM Production Workflow
              </p>
              <h2
                id="process-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#F4EFE6]"
              >
                From First Chai to Heirloom Vault
              </h2>
            </div>

            {/* Film-Strip Top Sprocket Holes */}
            <div
              className="hidden sm:flex items-center justify-between py-2 px-4 bg-[#141418] border-y border-gold-hairline mb-6"
              aria-hidden="true"
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="w-4 h-2.5 rounded-xs border border-[#C8893B]/40 bg-[#0B0B0D]"
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STUDIO_CONFIG.processSteps.map((step, idx) => {
                const isSelected = activeProcessIdx === idx;
                return (
                  <article
                    key={step.step}
                    onClick={() => setActiveProcessIdx(idx)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#181613] border-[#F2C27B]'
                        : 'bg-[#131317] border-gold-hairline hover:border-[#C8893B]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono-spec text-[#F2C27B] mb-4">
                        <span>{step.frameCode}</span>
                        <span>STEP {step.step}</span>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-[#F4EFE6]">
                        {step.step}. {step.title}
                      </h3>
                      <p className="text-xs font-mono-spec text-[#C8893B] mt-1">{step.subtitle}</p>
                      <p className="text-sm text-[#8E8A84] mt-3 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 font-mono-spec text-xs text-[#F4EFE6]">
                      {step.metric}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* SCROLL STORY 7: TESTIMONIALS CAROUSEL */}
        <section
          id="testimonials"
          aria-labelledby="testimonials-heading"
          className="py-24 px-6 lg:px-12 border-t border-gold-hairline bg-[#0B0B0D]"
        >
          <div className="max-w-[1080px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="font-mono-spec text-xs text-[#F2C27B] tracking-widest uppercase mb-2">
                  07 · Verified Client Stories
                </p>
                <h2
                  id="testimonials-heading"
                  className="text-3xl sm:text-4xl font-display font-semibold text-[#F4EFE6]"
                >
                  Trusted Across Generation & Ceremony
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTestimonialIdx(
                      (prev) =>
                        (prev - 1 + STUDIO_CONFIG.testimonials.length) %
                        STUDIO_CONFIG.testimonials.length
                    )
                  }
                  aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-lg border border-gold-hairline bg-[#141418] text-[#F4EFE6] flex items-center justify-center hover:border-[#F2C27B] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveTestimonialIdx(
                      (prev) => (prev + 1) % STUDIO_CONFIG.testimonials.length
                    )
                  }
                  aria-label="Next testimonial"
                  className="w-10 h-10 rounded-lg border border-gold-hairline bg-[#141418] text-[#F4EFE6] flex items-center justify-center hover:border-[#F2C27B] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-12 rounded-2xl bg-[#131317] border border-gold-hairline viewfinder-frame">
              <p className="font-mono-spec text-xs text-[#F2C27B] mb-4">
                {currentTestimonial.exifTag} · {currentTestimonial.outcome}
              </p>

              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-display italic text-[#F4EFE6] leading-relaxed">
                “{currentTestimonial.quote}”
              </blockquote>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-[#F4EFE6]">
                    {currentTestimonial.author}
                  </div>
                  <div className="text-xs font-mono-spec text-[#8E8A84] mt-0.5">
                    {currentTestimonial.role}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {STUDIO_CONFIG.testimonials.map((t, idx) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTestimonialIdx(idx)}
                      aria-label={`Show testimonial ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeTestimonialIdx
                          ? 'w-8 bg-[#F2C27B]'
                          : 'w-2 bg-[#8E8A84]/40 hover:bg-[#8E8A84]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SCROLL STORY 8: PACKAGES (SILVER, GOLD GLOWING, PLATINUM) */}
        <section
          id="packages"
          aria-labelledby="packages-heading"
          className="py-24 px-6 lg:px-12 border-t border-gold-hairline bg-[#0E0E12]"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="font-mono-spec text-xs text-[#F2C27B] tracking-widest uppercase mb-2">
                08 · Transparent Investment Tiers
              </p>
              <h2
                id="packages-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#F4EFE6]"
              >
                Curated Collections for Every Milestone
              </h2>
              <p className="text-sm sm:text-base text-[#8E8A84] mt-3">
                All packages include dual-card backup, color-calibrated grading at Kacheri Station
                Road, and dedicated creative direction.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {STUDIO_CONFIG.packages.map((pkg) => {
                const isGold = pkg.featured;
                return (
                  <article
                    key={pkg.id}
                    className={`rounded-2xl p-8 flex flex-col justify-between relative transition-transform duration-200 ${
                      isGold
                        ? 'bg-[#181510] border-2 border-[#F2C27B] shadow-[0_0_45px_rgba(200,137,59,0.22)]'
                        : 'bg-[#131317] border border-gold-hairline'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono-spec text-[#F2C27B] mb-2">
                        <span>{pkg.name.toUpperCase()} COLLECTION</span>
                        {isGold && <span className="text-[#FFB347]">MOST CHOSEN IN CHHAPRA</span>}
                      </div>

                      <h3 className="text-3xl font-display font-semibold text-[#F4EFE6]">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-[#8E8A84] mt-1">{pkg.subtitle}</p>

                      <div className="mt-6 pb-6 border-b border-white/10">
                        <span className="text-4xl font-mono-spec font-semibold text-[#F4EFE6]">
                          {pkg.price}
                        </span>
                        <span className="block text-xs font-mono-spec text-[#F2C27B] mt-1.5">
                          {pkg.duration}
                        </span>
                      </div>

                      <ul className="mt-6 space-y-3 text-xs sm:text-sm text-[#F4EFE6]/90">
                        {pkg.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#F2C27B] shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-5 border-t border-white/10">
                      <p className="text-xs font-mono-spec text-[#8E8A84] mb-4">
                        TURNAROUND: {pkg.turnaround}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleJumpToBookingWithTopic(`${pkg.name} Package`)}
                          className="flex-1 py-3 px-4 rounded-xl bg-[#1D1D24] border border-gold-hairline text-xs font-semibold text-[#F4EFE6] hover:border-[#F2C27B] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Reserve Dates
                        </button>
                        <a
                          href={buildPackageWhatsAppUrl(pkg.name, pkg.price)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                            isGold
                              ? 'bg-gold-gradient text-[#0B0B0D] hover:brightness-110'
                              : 'bg-[#C8893B]/20 text-[#F2C27B] border border-[#C8893B]/40 hover:bg-[#C8893B]/30'
                          }`}
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

        {/* SCROLL STORY 9: FINAL CTA ("Let's capture your story") & 4-FIELD WHATSAPP BOOKING FORM */}
        <section
          id="booking"
          ref={bookingSectionRef}
          aria-labelledby="booking-heading"
          className="py-24 px-6 lg:px-12 border-t border-gold-hairline bg-[#0B0B0D]"
        >
          <div className="max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Editorial Callout */}
            <div className="lg:col-span-6">
              <p className="font-mono-spec text-xs text-[#F2C27B] tracking-widest uppercase mb-2">
                09 · Instant Studio Reservation
              </p>
              <h2
                id="booking-heading"
                className="text-4xl sm:text-5xl font-display font-semibold text-[#F4EFE6]"
              >
                Let&apos;s capture your story.
              </h2>
              <p className="text-base text-[#8E8A84] mt-4 leading-relaxed">
                Dates for the upcoming Bihar wedding and festive season fill months in advance.
                Complete the 4-field dispatch below to trigger our studio shutter and generate your
                prefilled WhatsApp booking message directly to our senior producer.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-[#131317] border border-gold-hairline space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#F2C27B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-[#F4EFE6]">Studio Showroom</div>
                    <div className="text-xs text-[#8E8A84] mt-0.5">
                      {STUDIO_CONFIG.business.fullAddress}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#F2C27B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-[#F4EFE6]">Direct Line & WhatsApp</div>
                    <a
                      href={STUDIO_CONFIG.business.callLink}
                      className="text-xs font-mono-spec text-[#F2C27B] hover:underline mt-0.5 block"
                    >
                      {STUDIO_CONFIG.business.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#F2C27B] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-[#F4EFE6]">Studio Hours</div>
                    <div className="text-xs font-mono-spec text-[#8E8A84] mt-0.5">
                      {STUDIO_CONFIG.business.openingHours}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 4-Field WhatsApp Booking Form */}
            <div className="lg:col-span-6 bg-[#131317] border border-gold-hairline rounded-2xl p-6 sm:p-8 viewfinder-frame">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono-spec text-xs text-[#F2C27B]">
                  SHUTTER DISPATCH · 4 FIELDS MAX
                </span>
                <Camera className="w-4 h-4 text-[#C8893B]" />
              </div>

              <form onSubmit={handleBookingSubmit} noValidate className="space-y-5">
                {/* Field 1: Name */}
                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-xs font-mono-spec text-[#F4EFE6] mb-1.5"
                  >
                    1. Your Name *
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    placeholder="e.g. Aditya Narayan Singh"
                    value={bookingForm.name}
                    onChange={(e) => {
                      setBookingForm((prev) => ({ ...prev, name: e.target.value }));
                      setBookingErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-white/15 text-sm text-[#F4EFE6] focus:border-[#F2C27B] focus:outline-none"
                  />
                  {bookingErrors.name && (
                    <p className="text-xs text-[#FFB347] mt-1" role="alert">
                      {bookingErrors.name}
                    </p>
                  )}
                </div>

                {/* Field 2: Event Type */}
                <div>
                  <label
                    htmlFor="booking-event-type"
                    className="block text-xs font-mono-spec text-[#F4EFE6] mb-1.5"
                  >
                    2. Event or Shoot Type *
                  </label>
                  <select
                    id="booking-event-type"
                    value={bookingForm.eventType}
                    onChange={(e) =>
                      setBookingForm((prev) => ({ ...prev, eventType: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-white/15 text-sm text-[#F4EFE6] focus:border-[#F2C27B] focus:outline-none"
                  >
                    {STUDIO_CONFIG.services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title} ({s.startingPrice})
                      </option>
                    ))}
                    <option value="Silver Package">Silver Package (₹28,000)</option>
                    <option value="Gold Package">Gold Package (₹74,000)</option>
                    <option value="Platinum Package">Platinum Package (₹1,35,000)</option>
                  </select>
                </div>

                {/* Field 3: Preferred Date */}
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-mono-spec text-[#F4EFE6] mb-1.5"
                  >
                    3. Event Date *
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => {
                      setBookingForm((prev) => ({ ...prev, date: e.target.value }));
                      setBookingErrors((prev) => ({ ...prev, date: undefined }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-white/15 text-sm text-[#F4EFE6] focus:border-[#F2C27B] focus:outline-none"
                  />
                  {bookingErrors.date && (
                    <p className="text-xs text-[#FFB347] mt-1" role="alert">
                      {bookingErrors.date}
                    </p>
                  )}
                </div>

                {/* Field 4: Phone / WhatsApp Number */}
                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block text-xs font-mono-spec text-[#F4EFE6] mb-1.5"
                  >
                    4. Phone / WhatsApp Number *
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={bookingForm.phone}
                    onChange={(e) => {
                      setBookingForm((prev) => ({ ...prev, phone: e.target.value }));
                      setBookingErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-white/15 text-sm text-[#F4EFE6] focus:border-[#F2C27B] focus:outline-none"
                  />
                  {bookingErrors.phone && (
                    <p className="text-xs text-[#FFB347] mt-1" role="alert">
                      {bookingErrors.phone}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gold-gradient text-[#0B0B0D] font-semibold text-sm inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Prepare WhatsApp Booking</span>
                </button>
              </form>

              {/* Prefilled WhatsApp Confirmation Dispatch */}
              {generatedWhatsAppUrl && (
                <div
                  className="mt-5 p-4 rounded-xl bg-[#1A1712] border border-[#F2C27B] space-y-3"
                  data-testid="booking-whatsapp-ready"
                >
                  <div className="text-xs font-mono-spec text-[#F2C27B]">
                    SHUTTER LOCKED · PREFILLED MESSAGE READY FOR {bookingForm.name.toUpperCase()}
                  </div>
                  <p className="text-xs text-[#F4EFE6]/90">
                    Your booking details ({bookingForm.eventType} on {bookingForm.date}) have been
                    formatted for Kumar Studio (+91 74887 24299).
                  </p>
                  <a
                    href={generatedWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#25D366] text-[#0B0B0D] font-semibold text-xs inline-flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp with Prefilled Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SCROLL STORY 10: CONTACT / GOOGLE MAP & FOOTER */}
        <footer
          id="contact"
          className="pt-20 pb-24 sm:pb-16 px-6 lg:px-12 border-t border-gold-hairline bg-[#08080A]"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
              {/* Studio Info & Links */}
              <div className="lg:col-span-5 space-y-5">
                <div className="text-3xl font-display font-semibold text-[#F4EFE6]">
                  {STUDIO_CONFIG.business.brandUpper}
                </div>
                <p className="text-sm font-display italic text-[#F2C27B]">
                  {STUDIO_CONFIG.business.tagline}
                </p>
                <p className="text-sm text-[#8E8A84] leading-relaxed">
                  {STUDIO_CONFIG.business.fullAddress}
                </p>

                <div className="space-y-2 text-xs font-mono-spec">
                  <div>
                    <span className="text-[#8E8A84]">PHONE / WHATSAPP: </span>
                    <a
                      href={STUDIO_CONFIG.business.callLink}
                      className="text-[#F4EFE6] hover:text-[#F2C27B]"
                    >
                      {STUDIO_CONFIG.business.phoneDisplay}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#8E8A84]">INSTAGRAM: </span>
                    <a
                      href={STUDIO_CONFIG.business.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F4EFE6] hover:text-[#F2C27B]"
                    >
                      {STUDIO_CONFIG.business.instagramHandle}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#8E8A84]">HOURS: </span>
                    <span className="text-[#F4EFE6]">{STUDIO_CONFIG.business.openingHours}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={STUDIO_CONFIG.business.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-gold-gradient text-[#0B0B0D] font-semibold text-xs inline-flex items-center gap-1.5 hover:brightness-110 transition-all whitespace-nowrap shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={STUDIO_CONFIG.business.callLink}
                    className="px-4 py-2.5 rounded-xl bg-[#141418] border border-gold-hairline text-[#F4EFE6] text-xs font-mono-spec hover:border-[#F2C27B] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C8893B]" />
                    <span>Tap to Call</span>
                  </a>
                </div>
              </div>

              {/* Embedded Google Map for Kacheri Station Road, Chhapra */}
              <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-gold-hairline bg-[#121216] h-72 sm:h-80 relative">
                <iframe
                  title="Google Map for Kumar Studio, Kacheri Station Road, Chhapra, Bihar"
                  src={STUDIO_CONFIG.business.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 filter grayscale contrast-125 opacity-85"
                />
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8A84]">
              <p>
                © {new Date().getFullYear()} {STUDIO_CONFIG.business.name} ·{' '}
                {STUDIO_CONFIG.business.address}. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#services" className="hover:text-[#F4EFE6]">
                  Services
                </a>
                <a href="#portfolio" className="hover:text-[#F4EFE6]">
                  Portfolio
                </a>
                <a href="#gear-shop" className="hover:text-[#F4EFE6]">
                  Gear Shop
                </a>
                <a href="#booking" className="hover:text-[#F4EFE6]">
                  Book Shoot
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Mobile Call + WhatsApp Action Bar (Strictly <= 15% Viewport Height) */}
      <div className="md:hidden fixed bottom-3 inset-x-4 z-40 flex items-center gap-2.5 bg-[#121216]/95 border border-gold-hairline rounded-xl p-2 shadow-2xl">
        <a
          href={STUDIO_CONFIG.business.callLink}
          className="flex-1 py-2.5 px-3 rounded-lg bg-[#1A1A22] text-[#F4EFE6] text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-[#F2C27B]" />
          <span>Call Studio</span>
        </a>
        <a
          href={STUDIO_CONFIG.business.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-3 rounded-lg bg-gold-gradient text-[#0B0B0D] text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
