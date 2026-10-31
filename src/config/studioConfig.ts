export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  startingPrice: string;
  exifSpec: string;
  deliverables: string[];
  animationType:
    | 'weddings-rings-confetti'
    | 'prewedding-cinema-flare'
    | 'portraits-camera-flash'
    | 'products-turntable-glow'
    | 'events-spotlight-sweep'
    | 'passport-biometric-scan'
    | 'printing-album-flip'
    | 'gear-aperture-iris';
  animationLabel: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Pre-Wedding' | 'Portraits' | 'Products' | 'Events';
  location: string;
  date: string;
  exif: string;
  camera: string;
  story: string;
  aspect: 'wide' | 'tall' | 'standard';
  artTheme:
    | 'royal-wedding'
    | 'ganges-prewedding'
    | 'rembrandt-portrait'
    | 'chronograph-product'
    | 'sangeet-stage'
    | 'bridal-jewels'
    | 'editorial-monograph'
    | 'perfume-macro';
}

export interface GearProduct {
  id: string;
  name: string;
  category: string;
  tagline: string;
  pricePerDay: string;
  purchasePrice: string;
  specs: string[];
  modelType: 'cinema-prime' | 'medium-format-body' | 'carbon-gimbal' | 'studio-strobe';
  exifBadge: string;
}

export interface PackageTier {
  id: string;
  name: 'Silver' | 'Gold' | 'Platinum';
  subtitle: string;
  price: string;
  duration: string;
  featured: boolean;
  deliverables: string[];
  turnaround: string;
}

export const STUDIO_CONFIG = {
  business: {
    name: 'Kumar Studio',
    brandUpper: 'KUMAR STUDIO',
    tagline: 'Every frame, a legacy.',
    established: 'Est. 1998 · Chhapra, Bihar',
    trustHeadline: "Chhapra's most trusted photography studio",
    address: 'Kacheri Station Road, Chhapra, Bihar',
    fullAddress: 'Near Kacheri Railway Station, Kacheri Station Road, Chhapra, Saran, Bihar 841301',
    phoneDisplay: '+91 74887 24299',
    phoneRaw: '917488724299',
    callLink: 'tel:+917488724299',
    whatsappLink:
      'https://wa.me/917488724299?text=Hi%20Kumar%20Studio%2C%20I%20want%20to%20book%20a%20shoot',
    instagramUrl: 'https://instagram.com/kumarstudio_chhapra',
    instagramHandle: '@kumarstudio_chhapra',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Kacheri+Station+Road+Chhapra+Bihar',
    mapEmbedUrl:
      'https://maps.google.com/maps?q=Kacheri%20Station%20Road,%20Chhapra,%20Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed',
    openingHours: 'Mon – Sun · 09:00 AM – 09:00 PM',
  },

  metrics: [
    { value: '2,800+', label: 'Royal Weddings Archived', context: 'Across Bihar & UP Since 1998' },
    { value: '85mm f/1.2', label: 'Master Prime Optical Standard', context: 'Full-Frame & Medium Format' },
    { value: '48 Hours', label: 'Express Preview Delivery', context: 'Color-Graded Digital Gallery' },
    { value: '4.9 / 5.0', label: 'Client Legacy Rating', context: '640+ Verified Families in Saran' },
  ],

  lensParts: [
    {
      id: 'glass',
      code: 'OPT-01',
      name: 'Glass',
      fullTitle: 'Fluorite Aspherical Glass Doublet',
      spec: 'nD 1.85 · Multi-Layer Amber Nano-Coating · Zero Chromatic Aberration',
      description:
        'Hand-polished high-refractive optical elements engineered for edge-to-edge sharpness and creamy nocturnal bokeh.',
    },
    {
      id: 'iris',
      code: 'APR-02',
      name: 'Iris',
      fullTitle: '9-Blade Circular Mechanical Iris Aperture',
      spec: 'f/1.2 – f/16 Continuous Stop Control · Titanium Leaf Blades',
      description:
        'Nine curved matte-titanium blades form a near-perfect circle at every stop, rendering specular highlights as soft golden orbs.',
    },
    {
      id: 'gears',
      code: 'MEC-03',
      name: 'Gears',
      fullTitle: 'Molten Bronze Helicoid Drive Gears',
      spec: '0.8 MOD Cine Pitch · 300° Focus Throw · Zero-Backlash Brass Pinion',
      description:
        'Precision-machined phosphor-bronze focus rings deliver damped manual focus pulls with micron-level repeatability.',
    },
    {
      id: 'barrel',
      code: 'CHS-04',
      name: 'Barrel',
      fullTitle: 'Woven Carbon-Fiber & Anodized Alloy Barrel',
      spec: 'Weather-Sealed 11-Ring Chassis · Engraved Gold Distance Scale',
      description:
        'Aerospace carbon-composite housing shields internal optics against monsoon humidity, dust, and thermal shift.',
    },
  ],

  services: [
    {
      id: 'weddings',
      index: '01',
      title: 'Weddings',
      subtitle: 'Royal Bihari & Destination Wedding Cinema',
      description:
        'Multi-camera editorial documentation from Haldi & Mehendi to Sindoor Daan, graded in our signature timeless warm film LUT.',
      startingPrice: '₹65,000',
      exifSpec: '50mm · f/1.2 · 1/400s · ISO 160',
      deliverables: ['4K 60fps Dolby-Graded Wedding Film', '800+ Master Retouched Frames', 'Italian Lay-Flat Velvet Heirloom Album'],
      animationType: 'weddings-rings-confetti',
      animationLabel: 'Interlocking Gold Rings & Marigold Confetti',
    },
    {
      id: 'pre-wedding',
      index: '02',
      title: 'Pre-wedding',
      subtitle: 'Cinematic Storyboards & Golden Hour Shoots',
      description:
        'Editorial couple portraits across heritage ghats, forts, and curated studio sets with anamorphic lenses and aerial drone sweeps.',
      startingPrice: '₹24,000',
      exifSpec: '35mm Anamorphic · f/1.4 · 1/800s · ISO 100',
      deliverables: ['3-Minute Cinema Teaser Reel', '120 Editorial Graded Stills', 'Wardrobe & Location Styling Direction'],
      animationType: 'prewedding-cinema-flare',
      animationLabel: 'Anamorphic Gold Flare & Dual Film Reel',
    },
    {
      id: 'portraits',
      index: '03',
      title: 'Portraits',
      subtitle: 'Fine-Art Studio & Executive Portraiture',
      description:
        'Controlled multi-strobe Rembrandt and butterfly lighting in our Kacheri Station Road studio for families, artists, and leaders.',
      startingPrice: '₹4,500',
      exifSpec: '85mm · f/1.4 · 1/200s · ISO 64',
      deliverables: ['Tethered Live Medium-Format Capture', 'High-Frequency Skin Retouching', 'Museum-Grade Archival Framed Prints'],
      animationType: 'portraits-camera-flash',
      animationLabel: 'Studio Strobe Flash & Eye-AF Reticle Lock',
    },
    {
      id: 'products',
      index: '04',
      title: 'Products',
      subtitle: 'Commercial E-Commerce & Luxury Tabletop',
      description:
        'Macro optical precision for jewelry, textiles, electronics, and regional brands seeking national-grade campaign visuals.',
      startingPrice: '₹8,000',
      exifSpec: '90mm Macro · f/8.0 · 1/160s · ISO 100',
      deliverables: ['Focus-Stacked Razor-Sharp Macros', '360° Turntable Spins', 'Pure Matte & Specular Hero Composites'],
      animationType: 'products-turntable-glow',
      animationLabel: '360° Pedestal Rotation & Rim Glow',
    },
    {
      id: 'events',
      index: '05',
      title: 'Events',
      subtitle: 'Corporate Galas, Cultural Shows & Anniversaries',
      description:
        'Rapid-response dual-body coverage with live same-day social media highlights and broadcast-grade audio capture.',
      startingPrice: '₹15,000',
      exifSpec: '24-70mm · f/2.8 · 1/320s · ISO 400',
      deliverables: ['Same-Day Highlight Edit', 'Full Stage & Candid Coverage', 'Cloud Gallery with Face-Recognition Access'],
      animationType: 'events-spotlight-sweep',
      animationLabel: 'Dual Stage Spotlight Beams & Acoustic Cadence',
    },
    {
      id: 'passport-studio',
      index: '06',
      title: 'Passport & Studio',
      subtitle: 'Biometric Visa, OCI & Instant Studio IDs',
      description:
        'ICAO-compliant international visa, passport, and official portfolio headshots printed in 10 minutes on archival lustre paper.',
      startingPrice: '₹250',
      exifSpec: '70mm · f/5.6 · 1/125s · ISO 100',
      deliverables: ['US / UK / Schengen / Indian Biometric Compliance', '10-Minute Express Lab Print', 'Softcopy Sent Directly to WhatsApp'],
      animationType: 'passport-biometric-scan',
      animationLabel: 'Biometric Alignment Grid & Focus Scan',
    },
    {
      id: 'printing-albums',
      index: '07',
      title: 'Photo Printing & Albums',
      subtitle: 'Bespoke Karizma, Metallic & Canvas Lab',
      description:
        'In-house color-calibrated printing press producing museum-grade acrylic frames, metallic spreads, and gold-embossed wedding books.',
      startingPrice: '₹1,200',
      exifSpec: '300 DPI · AdobeRGB · 12-Color Archival Pigment',
      deliverables: ['100-Year Fade-Resistant Archival Inks', 'Custom Gold-Foil Embossed Leather Covers', 'Large-Format Canvas & Acrylic Mounting'],
      animationType: 'printing-album-flip',
      animationLabel: 'Heirloom Album Page Fan & Gold Spine Foil',
    },
    {
      id: 'camera-gear',
      index: '08',
      title: 'Camera & Gear',
      subtitle: 'Pro Bodies, L-Series Glass, Drones & Lighting Shop',
      description:
        'Authorized sales, rentals, and sensor maintenance on Kacheri Station Road for creators across Saran and North Bihar.',
      startingPrice: '₹1,500 / day',
      exifSpec: 'RF / E / Z Mount · Sensor Clean & Calibration',
      deliverables: ['Mirrorless & Cinema Body Rentals', 'Genuine Batteries, SD/CFexpress Cards & Gimbals', 'Same-Day Optical & Sensor Cleaning'],
      animationType: 'gear-aperture-iris',
      animationLabel: 'Mechanical Iris Blades & Bronze Gear Drive',
    },
  ] as ServiceItem[],

  portfolio: [
    {
      id: 'pf-1',
      title: 'The Royal Mandap of Rajendra Sarovar',
      category: 'Weddings',
      location: 'Chhapra Heritage Palace, Bihar',
      date: 'December 2025',
      exif: 'f/1.2 · 1/250s · ISO 160 · 85mm',
      camera: 'Full-Frame Master Prime',
      story:
        'Captured amidst drifting marigold petals and ancestral brass lamps during a winter midnight wedding ceremony in Chhapra.',
      aspect: 'wide',
      artTheme: 'royal-wedding',
    },
    {
      id: 'pf-2',
      title: 'Golden Hour at Sonepur Confluence',
      category: 'Pre-Wedding',
      location: 'Gandak River Ghats, Saran',
      date: 'November 2025',
      exif: 'f/1.4 · 1/1000s · ISO 100 · 35mm',
      camera: 'Anamorphic Cinema Rig',
      story:
        'A sweeping widescreen pre-wedding sequence shot at dawn as river mist rose against warm sandstone steps.',
      aspect: 'wide',
      artTheme: 'ganges-prewedding',
    },
    {
      id: 'pf-3',
      title: 'Sovereign Gaze — Studio Monograph',
      category: 'Portraits',
      location: 'Kumar Studio Stage A, Kacheri Station Rd',
      date: 'January 2026',
      exif: 'f/1.4 · 1/200s · ISO 64 · 85mm',
      camera: 'Medium Format 100MP',
      story:
        'Sculpted with a single 150cm octagonal key light and warm bronze rim reflector to celebrate timeless character.',
      aspect: 'tall',
      artTheme: 'rembrandt-portrait',
    },
    {
      id: 'pf-4',
      title: 'Horology & Oud — Commercial Still Life',
      category: 'Products',
      location: 'Kumar Studio Macro Table, Chhapra',
      date: 'February 2026',
      exif: 'f/8.0 · 1/160s · ISO 100 · 90mm Macro',
      camera: 'Focus-Stacking Rail System',
      story:
        'Twelve focus-stacked frames merged for edge-to-edge crystalline clarity across brushed gold bezels and cut glass.',
      aspect: 'standard',
      artTheme: 'chronograph-product',
    },
    {
      id: 'pf-5',
      title: 'Symphony of Lights — Sangeet Night',
      category: 'Events',
      location: 'Maurya Banquet Lawn, Chhapra',
      date: 'January 2026',
      exif: 'f/1.8 · 1/500s · ISO 640 · 50mm',
      camera: 'Dual-Body Low-Light Setup',
      story:
        'High-shutter choreography freeze capturing airborne silk lehengas and golden pyrotechnic reflections.',
      aspect: 'standard',
      artTheme: 'sangeet-stage',
    },
    {
      id: 'pf-6',
      title: 'Heirloom Kundan & Crimson Velvet',
      category: 'Weddings',
      location: 'Bridal Suite, Chhapra',
      date: 'December 2025',
      exif: 'f/2.0 · 1/160s · ISO 200 · 50mm',
      camera: 'Full-Frame Prime',
      story:
        'Intimate bridal preparation study balancing natural window chiaroscuro with warm golden jewelry speculars.',
      aspect: 'tall',
      artTheme: 'bridal-jewels',
    },
    {
      id: 'pf-7',
      title: 'Chiaroscuro Classical Maestro',
      category: 'Portraits',
      location: 'Kumar Studio Stage B, Chhapra',
      date: 'October 2025',
      exif: 'f/2.8 · 1/160s · ISO 100 · 135mm',
      camera: 'Telephoto Portrait Prime',
      story:
        'Editorial portrait honoring Bihar’s classical musical heritage with tactile silver-gelatin contrast.',
      aspect: 'standard',
      artTheme: 'editorial-monograph',
    },
    {
      id: 'pf-8',
      title: 'Saffron Elixir — Luxury Packaging Campaign',
      category: 'Products',
      location: 'Kumar Studio Tabletop Suite',
      date: 'March 2026',
      exif: 'f/11 · 1/200s · ISO 64 · 100mm Macro',
      camera: 'Optical Snoot & Rim Rig',
      story:
        'Precision optical caustics projected through amber crystal onto honed black slate.',
      aspect: 'standard',
      artTheme: 'perfume-macro',
    },
  ] as PortfolioItem[],

  gearShop: [
    {
      id: 'gear-85mm',
      name: 'K-Master 85mm f/1.2 Cine Prime',
      category: 'Optical Lens',
      tagline: 'Signature portrait & wedding bokeh powerhouse with 0.8 MOD bronze focus gears.',
      pricePerDay: '₹1,800 / day',
      purchasePrice: '₹1,89,000',
      specs: ['f/1.2 – f/16 9-Blade Iris', 'Fluorite Doublet Optics', 'Weather-Sealed Carbon Barrel'],
      modelType: 'cinema-prime',
      exifBadge: '85mm · T1.3 · Ø82mm',
    },
    {
      id: 'gear-camera',
      name: 'Alpha-FX Full-Frame 8K Cinema Body',
      category: 'Camera Body',
      tagline: '15+ stops of dynamic range with dual-native ISO 800/4000 for moonlit wedding mandaps.',
      pricePerDay: '₹3,500 / day',
      purchasePrice: '₹3,45,000',
      specs: ['50.1MP Stacked CMOS Sensor', '4K 120p 10-bit 4:2:2 Internal', '5-Axis In-Body Stabilization'],
      modelType: 'medium-format-body',
      exifBadge: '8K RAW · 15+ Stops DR',
    },
    {
      id: 'gear-gimbal',
      name: 'AeroCarbon 3-Axis Pro Gimbal Rig',
      category: 'Stabilizer',
      tagline: 'Featherweight woven carbon-fiber stabilizer with LiDAR autofocus & wireless thumb wheel.',
      pricePerDay: '₹1,400 / day',
      purchasePrice: '₹78,500',
      specs: ['4.5 kg Payload Capacity', '14-Hour Dual Battery Grip', 'Automated Orbit & Timelapse Modes'],
      modelType: 'carbon-gimbal',
      exifBadge: '3-Axis · 4.5kg Payload',
    },
    {
      id: 'gear-strobe',
      name: 'Solaris 600Ws TTL Battery Monolight',
      category: 'Studio Lighting',
      tagline: 'High-speed sync 1/8000s outdoor strobe that overpowers midday sun for dramatic pre-wedding skies.',
      pricePerDay: '₹1,200 / day',
      purchasePrice: '₹64,000',
      specs: ['600Ws Color-Stable 5600K±75K', '0.01–0.9s Recycle Time', '30W Warm LED Modeling Lamp'],
      modelType: 'studio-strobe',
      exifBadge: '600Ws · 1/8000s HSS',
    },
  ] as GearProduct[],

  processSteps: [
    {
      step: '01',
      frameCode: 'FRM · 001A',
      title: 'Consult',
      subtitle: 'Storyboarding & Optical Blueprint',
      description:
        'Meet our creative director at Kacheri Station Road over chai to map your rituals, lighting moodboards, lens choices, and family schedule.',
      metric: 'Custom Shot-List & Timeline',
    },
    {
      step: '02',
      frameCode: 'FRM · 002B',
      title: 'Shoot',
      subtitle: 'Unobtrusive Multi-Cam Production',
      description:
        'Our disciplined crew arrives early with backup full-frame bodies, cinema primes, and wireless lighting rigs to capture candid emotion without disruption.',
      metric: 'Dual-Card Instant Backup',
    },
    {
      step: '03',
      frameCode: 'FRM · 003C',
      title: 'Edit',
      subtitle: 'Master Color Grading & Sound Design',
      description:
        'Every selected frame is individually color-graded on hardware-calibrated OLED reference monitors and paired with licensed cinematic scores.',
      metric: '16-Bit Color Pipeline',
    },
    {
      step: '04',
      frameCode: 'FRM · 004D',
      title: 'Deliver',
      subtitle: 'Heirloom Album & 4K Cloud Vault',
      description:
        'Receive your handcrafted Italian velvet lay-flat album, engraved brass USB box, and private family cloud gallery within promised timelines.',
      metric: '10-Year Cloud Archive',
    },
  ],

  testimonials: [
    {
      id: 't-1',
      quote:
        'Before meeting Kumar Studio, we worried our three-day Chhapra wedding would look overly staged. Their team blended in like family, and delivered 950 editorial frames plus a 4K film that brought my grandparents to tears.',
      author: 'Dr. Ananya & Vikash Singh',
      role: 'Royal Wedding Clients · Chhapra & Patna',
      outcome: '950+ Graded Stills & 45-Min Cinema Film Delivered in 21 Days',
      exifTag: 'Shot on 85mm f/1.2 & 35mm Anamorphic',
    },
    {
      id: 't-2',
      quote:
        'Our jewellery showroom needed national-level campaign visuals without flying a crew from Mumbai. Kumar Studio shot 140 macro pieces right on Kacheri Station Road—our festive catalog inquiries grew by 65% in one season.',
      author: 'Rajeshwar Prasad Gupta',
      role: 'Managing Director · Saran Heritage Jewellers',
      outcome: '+65% Festive Catalog Enquiries Across North Bihar',
      exifTag: 'Shot on 90mm Macro f/8 Focus-Stacked',
    },
    {
      id: 't-3',
      quote:
        'From renting a 85mm GM lens for my documentary to printing my sister’s metallic wedding album, Kumar Studio is the undisputed heartbeat of photography in Chhapra. Impeccable gear and honest guidance.',
      author: 'Siddharth Verma',
      role: 'Independent Filmmaker & Commercial Creator',
      outcome: 'Zero Equipment Downtime Over 18+ Rental Productions',
      exifTag: 'Verified Pro Gear & Lab Partner',
    },
  ],

  packages: [
    {
      id: 'pkg-silver',
      name: 'Silver',
      subtitle: 'Intimate Ceremonies, Portraits & Engagements',
      price: '₹28,000',
      duration: '1 Full Day Coverage · 2 Crew Members',
      featured: false,
      deliverables: [
        '1 Candid Photographer + 1 Traditional Cinematographer',
        '300+ Master Color-Graded High-Res Photographs',
        '3-Minute Cinematic Highlight Reel + Full Event HD Film',
        '30-Sheet Premium Matte Karizma Album (12×36 inch)',
        'Private Password-Protected Online Gallery',
      ],
      turnaround: '14-Day Digital Delivery',
    },
    {
      id: 'pkg-gold',
      name: 'Gold',
      subtitle: 'Signature Royal Wedding & Pre-Wedding Experience',
      price: '₹74,000',
      duration: '2–3 Days Complete Coverage · 4 Crew Members',
      featured: true,
      deliverables: [
        'Senior Candid Photographer + Cinema Director (Gimbal & 4K 60fps)',
        'Complimentary Golden-Hour Pre-Wedding Shoot in Saran',
        '4K Aerial Drone Coverage + Crane/Jib Setup for Mandap',
        '800+ Master Graded Stills + 45-Min Documentary Feature Film',
        '2 Luxury Italian Velvet Lay-Flat Albums + Engraved Brass USB Box',
      ],
      turnaround: '48-Hr Teaser + 21-Day Master Delivery',
    },
    {
      id: 'pkg-platinum',
      name: 'Platinum',
      subtitle: 'Bespoke Multi-Day Destination & Heritage Legacy',
      price: '₹1,35,000',
      duration: 'Up to 5 Days · 6 Senior Specialists',
      featured: false,
      deliverables: [
        'Creative Director + 2 Candid Primes + 2 Cinema Rigs + Drone Pilot',
        'Multi-Location Pre-Wedding Short Film with Stylist Consultation',
        'Same-Day Edit Screened Live on Reception LED Wall',
        '1,500+ Archival Stills + Dolby-Graded 4K Cinema Master',
        '3 Museum-Grade Acrylic Metallic Albums + Framed Family Portrait',
      ],
      turnaround: 'Same-Day Reception Screening + Priority Lab',
    },
  ] as PackageTier[],
};
