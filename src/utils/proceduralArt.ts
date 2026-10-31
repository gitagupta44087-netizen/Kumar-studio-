import { PortfolioItem } from '../config/studioConfig';

const artCache = new Map<string, string>();

/**
 * Generates high-contrast, luxury editorial SVG/Canvas data URLs for portfolio photography
 * and the Octane-style exploded lens hero backdrop. Guarantees 0 broken images and instant LCP.
 */
export function getPortfolioArtworkDataUrl(theme: PortfolioItem['artTheme'], title: string): string {
  const key = `${theme}:${title}`;
  if (artCache.has(key)) {
    return artCache.get(key)!;
  }

  const palettes: Record<
    PortfolioItem['artTheme'],
    { bg1: string; bg2: string; accent: string; highlight: string; motif: string }
  > = {
    'royal-wedding': {
      bg1: '#14090A',
      bg2: '#2D0F14',
      accent: '#C8893B',
      highlight: '#F2C27B',
      motif: 'mandap',
    },
    'ganges-prewedding': {
      bg1: '#0C1017',
      bg2: '#2A1B12',
      accent: '#FFB347',
      highlight: '#F4EFE6',
      motif: 'river',
    },
    'rembrandt-portrait': {
      bg1: '#08080A',
      bg2: '#1C1713',
      accent: '#C8893B',
      highlight: '#F4EFE6',
      motif: 'portrait',
    },
    'chronograph-product': {
      bg1: '#090A0F',
      bg2: '#191B22',
      accent: '#F2C27B',
      highlight: '#FFB347',
      motif: 'watch',
    },
    'sangeet-stage': {
      bg1: '#0E0A18',
      bg2: '#291528',
      accent: '#FFB347',
      highlight: '#F2C27B',
      motif: 'stage',
    },
    'bridal-jewels': {
      bg1: '#1A0B0E',
      bg2: '#331419',
      accent: '#F2C27B',
      highlight: '#FFB347',
      motif: 'jewels',
    },
    'editorial-monograph': {
      bg1: '#0A0A0C',
      bg2: '#1E1D1B',
      accent: '#8E8A84',
      highlight: '#F4EFE6',
      motif: 'portrait',
    },
    'perfume-macro': {
      bg1: '#0B0907',
      bg2: '#261A0E',
      accent: '#FFB347',
      highlight: '#F2C27B',
      motif: 'watch',
    },
  };

  const p = palettes[theme] || palettes['royal-wedding'];

  let motifSvg = '';
  if (p.motif === 'mandap') {
    motifSvg = `
      <circle cx="600" cy="380" r="240" fill="url(#glow)" opacity="0.75" />
      <path d="M260,680 C260,440 420,300 600,300 C780,300 940,440 940,680" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.55" />
      <path d="M320,680 C320,490 450,360 600,360 C750,360 880,490 880,680" fill="none" stroke="${p.highlight}" stroke-width="1.2" stroke-dasharray="6 8" opacity="0.5" />
      <!-- Silhouettes of couple under royal arch -->
      <path d="M540,680 C540,560 555,500 575,500 C595,500 605,560 605,680 Z" fill="#090708" stroke="${p.highlight}" stroke-width="1.2" />
      <circle cx="574" cy="468" r="24" fill="#090708" stroke="${p.highlight}" stroke-width="1.2" />
      <path d="M605,680 C605,575 620,515 640,515 C660,515 675,575 675,680 Z" fill="#090708" stroke="${p.accent}" stroke-width="1.2" />
      <circle cx="638" cy="484" r="22" fill="#090708" stroke="${p.accent}" stroke-width="1.2" />
      <!-- Floating bokeh orbs -->
      <circle cx="380" cy="280" r="34" fill="${p.highlight}" opacity="0.18" />
      <circle cx="820" cy="250" r="46" fill="${p.accent}" opacity="0.15" />
      <circle cx="740" cy="420" r="22" fill="${p.highlight}" opacity="0.22" />
      <circle cx="460" cy="410" r="18" fill="${p.accent}" opacity="0.25" />
    `;
  } else if (p.motif === 'river') {
    motifSvg = `
      <circle cx="760" cy="290" r="190" fill="url(#glow)" opacity="0.85" />
      <!-- Horizon & Ghats steps -->
      <line x1="0" y1="490" x2="1200" y2="490" stroke="${p.highlight}" stroke-width="1.2" opacity="0.45" />
      <line x1="80" y1="535" x2="1120" y2="535" stroke="${p.accent}" stroke-width="1" opacity="0.35" />
      <line x1="160" y1="580" x2="1040" y2="580" stroke="${p.accent}" stroke-width="1" opacity="0.25" />
      <!-- Sun reflection ripples -->
      <ellipse cx="760" cy="540" rx="140" ry="8" fill="${p.highlight}" opacity="0.35" />
      <ellipse cx="760" cy="575" rx="95" ry="6" fill="${p.accent}" opacity="0.3" />
      <ellipse cx="760" cy="610" rx="60" ry="4" fill="${p.highlight}" opacity="0.25" />
      <!-- Couple silhouette on sandstone steps -->
      <path d="M450,490 C455,415 470,385 485,385 C500,385 510,415 515,490 Z" fill="#0B0B0D" stroke="${p.highlight}" stroke-width="1.2" />
      <circle cx="484" cy="362" r="16" fill="#0B0B0D" stroke="${p.highlight}" stroke-width="1.2" />
      <path d="M518,490 C522,425 535,395 550,395 C565,395 585,435 610,490 Z" fill="#0B0B0D" stroke="${p.accent}" stroke-width="1.2" />
      <circle cx="546" cy="374" r="15" fill="#0B0B0D" stroke="${p.accent}" stroke-width="1.2" />
    `;
  } else if (p.motif === 'portrait') {
    motifSvg = `
      <circle cx="640" cy="340" r="260" fill="url(#glow)" opacity="0.65" />
      <!-- Sculpted Rembrandt Portrait Silhouette & Rim Light -->
      <path d="M430,720 C440,560 510,490 600,490 C690,490 760,560 770,720 Z" fill="#0D0D10" stroke="${p.highlight}" stroke-width="2" />
      <ellipse cx="600" cy="340" rx="88" ry="112" fill="#0D0D10" stroke="${p.highlight}" stroke-width="2.2" />
      <!-- Catchlight eyes & studio optical grid -->
      <circle cx="570" cy="325" r="4" fill="${p.highlight}" />
      <circle cx="630" cy="325" r="4" fill="${p.highlight}" />
      <rect x="460" y="190" width="280" height="310" fill="none" stroke="${p.accent}" stroke-width="1" stroke-dasharray="10 8" opacity="0.45" />
    `;
  } else if (p.motif === 'watch') {
    motifSvg = `
      <circle cx="600" cy="390" r="240" fill="url(#glow)" opacity="0.7" />
      <!-- Luxury Chronograph / Crystal Flacon Geometry -->
      <circle cx="600" cy="390" r="145" fill="#0B0B0E" stroke="${p.highlight}" stroke-width="2.5" />
      <circle cx="600" cy="390" r="122" fill="none" stroke="${p.accent}" stroke-width="1.2" stroke-dasharray="4 6" />
      <circle cx="600" cy="390" r="42" fill="none" stroke="${p.highlight}" stroke-width="1.5" />
      <line x1="600" y1="390" x2="600" y2="290" stroke="${p.highlight}" stroke-width="3" stroke-linecap="round" />
      <line x1="600" y1="390" x2="675" y2="390" stroke="${p.accent}" stroke-width="2.2" stroke-linecap="round" />
      <ellipse cx="600" cy="575" rx="210" ry="24" fill="none" stroke="${p.accent}" stroke-width="1.2" opacity="0.45" />
    `;
  } else {
    motifSvg = `
      <circle cx="600" cy="380" r="250" fill="url(#glow)" opacity="0.75" />
      <polygon points="220,120 520,680 680,680" fill="${p.highlight}" opacity="0.1" />
      <polygon points="980,120 520,680 680,680" fill="${p.accent}" opacity="0.12" />
      <circle cx="600" cy="390" r="120" fill="none" stroke="${p.highlight}" stroke-width="1.8" opacity="0.65" />
      <circle cx="600" cy="390" r="75" fill="none" stroke="${p.accent}" stroke-width="1.2" stroke-dasharray="6 6" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.bg1}" />
        <stop offset="60%" stop-color="${p.bg2}" />
        <stop offset="100%" stop-color="#070709" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${p.highlight}" stop-opacity="0.55" />
        <stop offset="55%" stop-color="${p.accent}" stop-opacity="0.2" />
        <stop offset="100%" stop-color="${p.bg1}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)" />
    <!-- Subtle rule-of-thirds viewfinder hairlines -->
    <line x1="400" y1="0" x2="400" y2="800" stroke="#F4EFE6" stroke-opacity="0.04" />
    <line x1="800" y1="0" x2="800" y2="800" stroke="#F4EFE6" stroke-opacity="0.04" />
    <line x1="0" y1="266" x2="1200" y2="266" stroke="#F4EFE6" stroke-opacity="0.04" />
    <line x1="0" y1="533" x2="1200" y2="533" stroke="#F4EFE6" stroke-opacity="0.04" />
    ${motifSvg}
    <!-- Optical vignette -->
    <rect x="28" y="28" width="1144" height="744" fill="none" stroke="${p.accent}" stroke-opacity="0.22" stroke-width="1" />
  </svg>`;

  const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  artCache.set(key, url);
  return url;
}

export function getHeroFallbackLensDataUrl(): string {
  const key = 'hero-exploded-lens';
  if (artCache.has(key)) {
    return artCache.get(key)!;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
    <defs>
      <radialGradient id="studioGlow" cx="62%" cy="48%" r="48%">
        <stop offset="0%" stop-color="#F2C27B" stop-opacity="0.28" />
        <stop offset="45%" stop-color="#C8893B" stop-opacity="0.11" />
        <stop offset="100%" stop-color="#0B0B0D" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F2C27B" />
        <stop offset="50%" stop-color="#C8893B" />
        <stop offset="100%" stop-color="#704719" />
      </linearGradient>
      <linearGradient id="glassCaustic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#9CE3FF" stop-opacity="0.45" />
        <stop offset="50%" stop-color="#F2C27B" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#FFB347" stop-opacity="0.4" />
      </linearGradient>
    </defs>
    <rect width="1600" height="900" fill="#0B0B0D" />
    <circle cx="980" cy="430" r="460" fill="url(#studioGlow)" />
    <!-- Volumetric bokeh orbs -->
    <circle cx="1280" cy="210" r="64" fill="#F2C27B" opacity="0.08" />
    <circle cx="1140" cy="660" r="48" fill="#FFB347" opacity="0.09" />
    <circle cx="730" cy="220" r="36" fill="#C8893B" opacity="0.1" />
    <!-- 45-degree exploded optical axis -->
    <g transform="translate(990, 440) rotate(-32)">
      <line x1="-420" y1="0" x2="420" y2="0" stroke="#F2C27B" stroke-width="1" stroke-dasharray="6 8" opacity="0.45" />
      <!-- Rear Barrel -->
      <ellipse cx="-240" cy="0" rx="52" ry="135" fill="#121216" stroke="url(#goldRim)" stroke-width="2.5" />
      <!-- Bronze Gears -->
      <ellipse cx="-95" cy="0" rx="48" ry="148" fill="none" stroke="#C8893B" stroke-width="5" stroke-dasharray="8 6" />
      <!-- Mechanical Iris Aperture -->
      <ellipse cx="45" cy="0" rx="44" ry="132" fill="#151418" stroke="#F2C27B" stroke-width="2" />
      <ellipse cx="45" cy="0" rx="22" ry="68" fill="none" stroke="#FFB347" stroke-width="1.5" />
      <!-- Front Optical Glass Element -->
      <ellipse cx="210" cy="0" rx="55" ry="142" fill="url(#glassCaustic)" stroke="#F4EFE6" stroke-width="2" />
    </g>
  </svg>`;

  const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  artCache.set(key, url);
  return url;
}
