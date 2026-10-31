# Kumar Studio — Luxury 3D Photography Studio & Camera Shop (Chhapra, Bihar)

Award-winning, 3D scroll-driven single-page web application for **Kumar Studio** (`Kacheri Station Road, Chhapra, Bihar · +91 74887 24299`).

## Architecture & Configuration

All business details, services, pricing packages, portfolio items, and 3D gear specs are centralized in a single configuration file:

- **`src/config/studioConfig.ts`** — Edit studio name, phone (`+91 74887 24299`), WhatsApp link, address (`Kacheri Station Road, Chhapra, Bihar`), services, packages, and portfolio items.
- **`src/components/ExplodedLensCanvas.tsx`** — Real-time Three.js 3D exploded camera lens floating at 45° with a 9-blade mechanical iris aperture, molten bronze gears, carbon-fiber barrel, and optical glass doublets, plus automatic 2D Lite fallback.
- **`src/components/ServicesHorizontalScroll.tsx`** — Horizontal-scroll 3D tilt cards for all 8 services, each with context-appropriate scroll-into-view animations (interlocking wedding rings & confetti, studio portrait flash & Eye-AF lock, 360° product turntable glow, anamorphic cinema flare, stage spotlights, ICAO biometric scan, heirloom album page flip, and mechanical gear iris).
- **`src/components/GearShop3DViewer.tsx`** — Interactive 360° drag-to-rotate 3D product viewers with direct WhatsApp enquiry.

## Local Development & Testing

```bash
npm install
npx --yes tsx --test src/utils/studioLogic.test.ts
npm run dev
```

## Deploying to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com/new).
3. Vercel automatically detects **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.
