import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateBookingForm,
  buildWhatsAppBookingUrl,
  filterPortfolioItems,
  computeLensExplosionState,
  computeFocusPullState,
} from './studioLogic';
import { STUDIO_CONFIG } from '../config/studioConfig';

test('validateBookingForm rejects empty fields and accepts valid 4-field submission', () => {
  const invalidResult = validateBookingForm({
    name: 'A',
    eventType: '',
    date: '',
    phone: '12345',
  });
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.name);
  assert.ok(invalidResult.errors.eventType);
  assert.ok(invalidResult.errors.date);
  assert.ok(invalidResult.errors.phone);

  const validResult = validateBookingForm({
    name: 'Rohan Kumar',
    eventType: 'Weddings',
    date: '2026-11-24',
    phone: '+91 98765 43210',
  });
  assert.equal(validResult.valid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('buildWhatsAppBookingUrl encodes Kumar Studio phone and all 4 booking fields', () => {
  const url = buildWhatsAppBookingUrl({
    name: 'Priya Singh',
    eventType: 'Pre-wedding',
    date: '2026-12-10',
    phone: '9876543210',
  });
  assert.ok(url.startsWith('https://wa.me/917488724299?text='));
  assert.ok(url.includes(encodeURIComponent('Priya Singh')));
  assert.ok(url.includes(encodeURIComponent('Pre-wedding')));
  assert.ok(url.includes(encodeURIComponent('2026-12-10')));
});

test('filterPortfolioItems filters by category and returns all for All', () => {
  const all = filterPortfolioItems(STUDIO_CONFIG.portfolio, 'All');
  assert.equal(all.length, STUDIO_CONFIG.portfolio.length);

  const weddings = filterPortfolioItems(STUDIO_CONFIG.portfolio, 'Weddings');
  assert.ok(weddings.length > 0);
  assert.ok(weddings.every((item) => item.category === 'Weddings'));
});

test('computeLensExplosionState interpolates offsets and part labels accurately', () => {
  const closed = computeLensExplosionState(0);
  assert.equal(closed.glassOffset, 0);
  assert.equal(closed.barrelOffset, 0);
  assert.equal(closed.activePartId, 'glass');

  const mid = computeLensExplosionState(0.55);
  assert.ok(mid.glassOffset > 1);
  assert.ok(mid.barrelOffset < -1);
  assert.equal(mid.activePartId, 'gears');

  const full = computeLensExplosionState(1);
  assert.equal(full.glassOffset, 2.35);
  assert.equal(full.activePartId, 'barrel');
});

test('computeFocusPullState transitions from blurred to sharp focus', () => {
  const start = computeFocusPullState(0);
  assert.equal(start.blurPx, 10);
  assert.equal(start.sharpnessPercent, 0);
  assert.equal(start.inFocus, false);

  const focused = computeFocusPullState(0.5);
  assert.equal(focused.blurPx, 0);
  assert.equal(focused.sharpnessPercent, 100);
  assert.equal(focused.inFocus, true);
});
