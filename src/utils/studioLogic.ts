import { STUDIO_CONFIG, PortfolioItem } from '../config/studioConfig';

export interface BookingFormData {
  name: string;
  eventType: string;
  date: string;
  phone: string;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof BookingFormData, string>>;
}

export interface LensExplosionState {
  progress: number;
  glassOffset: number;
  irisOffset: number;
  gearsOffset: number;
  barrelOffset: number;
  apertureBladesOpen: number;
  fStopLabel: string;
  activePartId: 'glass' | 'iris' | 'gears' | 'barrel';
}

export function validateBookingForm(data: BookingFormData): BookingValidationResult {
  const errors: Partial<Record<keyof BookingFormData, string>> = {};
  const trimmedName = (data.name || '').trim();
  const trimmedEvent = (data.eventType || '').trim();
  const trimmedDate = (data.date || '').trim();
  const cleanedPhone = (data.phone || '').replace(/[^\d+]/g, '');

  if (!trimmedName || trimmedName.length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }
  if (!trimmedEvent) {
    errors.eventType = 'Please select an event or shoot type.';
  }
  if (!trimmedDate) {
    errors.date = 'Please choose your preferred event date.';
  }
  if (!cleanedPhone || cleanedPhone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Please enter a valid 10-digit phone or WhatsApp number.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppBookingUrl(data: BookingFormData): string {
  const name = data.name.trim();
  const eventType = data.eventType.trim();
  const date = data.date.trim();
  const phone = data.phone.trim();

  const message = `Hi Kumar Studio, I want to book a shoot.\n\n*Name:* ${name}\n*Event Type:* ${eventType}\n*Preferred Date:* ${date}\n*Phone:* ${phone}\n*Studio Location:* Kacheri Station Road, Chhapra`;
  return `https://wa.me/${STUDIO_CONFIG.business.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function buildServiceWhatsAppUrl(serviceTitle: string, startingPrice: string): string {
  const message = `Hi Kumar Studio, I want to enquire about your *${serviceTitle}* service (Starting at ${startingPrice}).`;
  return `https://wa.me/${STUDIO_CONFIG.business.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function buildGearWhatsAppUrl(gearName: string, pricePerDay: string): string {
  const message = `Hi Kumar Studio, I want to enquire about renting/buying *${gearName}* (${pricePerDay}) from your Kacheri Station Road shop.`;
  return `https://wa.me/${STUDIO_CONFIG.business.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function buildPackageWhatsAppUrl(packageName: string, price: string): string {
  const message = `Hi Kumar Studio, I want to book the *${packageName} Package* (${price}) for my upcoming event.`;
  return `https://wa.me/${STUDIO_CONFIG.business.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function filterPortfolioItems(
  items: PortfolioItem[],
  category: string
): PortfolioItem[] {
  if (!category || category === 'All') {
    return items;
  }
  return items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
}

export function computeLensExplosionState(rawProgress: number): LensExplosionState {
  const progress = Math.max(0, Math.min(1, Number.isFinite(rawProgress) ? rawProgress : 0));

  // Smooth bell/ramp curve so user can inspect fully exploded view
  const glassOffset = Number((progress * 2.35).toFixed(3));
  const irisOffset = Number((progress * 0.85).toFixed(3));
  const gearsOffset = Number((-progress * 0.75).toFixed(3));
  const barrelOffset = Number((-progress * 2.1).toFixed(3));

  // Iris blades cycle smoothly as scroll changes
  const apertureBladesOpen = Number((0.25 + 0.75 * Math.abs(Math.cos(progress * Math.PI))).toFixed(3));

  const fStops = ['f/1.2', 'f/1.4', 'f/2.0', 'f/2.8', 'f/4.0', 'f/5.6', 'f/8.0', 'f/11', 'f/16'];
  const stopIdx = Math.min(fStops.length - 1, Math.floor(progress * fStops.length));
  const fStopLabel = fStops[stopIdx];

  let activePartId: 'glass' | 'iris' | 'gears' | 'barrel' = 'glass';
  if (progress >= 0.75) {
    activePartId = 'barrel';
  } else if (progress >= 0.5) {
    activePartId = 'gears';
  } else if (progress >= 0.25) {
    activePartId = 'iris';
  }

  return {
    progress,
    glassOffset,
    irisOffset,
    gearsOffset,
    barrelOffset,
    apertureBladesOpen,
    fStopLabel,
    activePartId,
  };
}

export function computeFocusPullState(rawScrollProgress: number): {
  blurPx: number;
  sharpnessPercent: number;
  inFocus: boolean;
} {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(rawScrollProgress) ? rawScrollProgress : 1));
  // Starts blurred (10px) at progress 0 and pulls into razor-sharp 0px focus by progress 0.45
  const defocusFactor = Math.max(0, 1 - clamped / 0.45);
  const blurPx = Number((defocusFactor * 10).toFixed(2));
  const sharpnessPercent = Math.round((1 - defocusFactor) * 100);
  return {
    blurPx,
    sharpnessPercent,
    inFocus: blurPx <= 1.2,
  };
}
