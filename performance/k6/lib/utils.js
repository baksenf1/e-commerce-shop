import { randomItem } from './weighted.js';

export function nowIso() {
  return new Date().toISOString();
}

export function randInt(min, max) {
  // inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomEmail(prefix = 'k6') {
  const stamp = Date.now();
  const n = randInt(1000, 999999);
  return `${prefix}.${stamp}.${n}@example.com`;
}

export function randomPassword() {
  // must satisfy min length 6 for /auth/register
  return `P@ssw0rd-${randInt(100000, 999999)}`;
}

export function pickProductId(products) {
  if (!products || products.length === 0) return null;
  const p = randomItem(products);
  return p?.id || p?._id || null;
}

