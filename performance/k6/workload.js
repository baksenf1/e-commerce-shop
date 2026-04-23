import { sleep } from 'k6';
import { check, fail } from 'k6';
import { getJson, postJson } from './lib/api.js';
import { pickWeighted } from './lib/weighted.js';
import { pickProductId, randomEmail, randomPassword, randInt } from './lib/utils.js';
import { config } from './lib/config.js';

function safeJson(res) {
  try {
    return res.json();
  } catch (_) {
    return null;
  }
}

export function setup() {
  const res = getJson('/api/products', { name: 'GET /api/products' });
  const products = safeJson(res);

  if (!Array.isArray(products) || products.length === 0) {
    fail('No products returned from /api/products. Ensure backend is running and DB is seeded.');
  }

  // keep a bounded cache to reduce memory, but keep enough diversity
  const trimmed = products.slice(0, Math.min(products.length, config.maxProductsToCache));
  return { products: trimmed };
}

export function browseFlow(data) {
  const productId = pickProductId(data.products);
  if (!productId) return;

  const listRes = getJson('/api/products', { name: 'GET /api/products', flow: 'browse' });
  check(listRes, { 'products list ok': r => r.status === 200 });

  const detailRes = getJson(`/api/products/${productId}`, { name: 'GET /api/products/:id', flow: 'browse' });
  check(detailRes, { 'product detail ok': r => r.status === 200 });
}

export function similarFlow(data) {
  const productId = pickProductId(data.products);
  if (!productId) return;

  const res = getJson(`/api/products/${productId}/similar`, { name: 'GET /api/products/:id/similar', flow: 'similar' });
  check(res, { 'similar ok': r => r.status === 200 });
}

export function authFlow() {
  const email = randomEmail('k6.user');
  const password = randomPassword();

  const registerRes = postJson(
    '/api/auth/register',
    { name: 'k6 user', email, password },
    { name: 'POST /api/auth/register', flow: 'auth' }
  );
  check(registerRes, { 'register ok': r => r.status === 200 });

  const loginRes = postJson('/api/auth/login', { email, password }, { name: 'POST /api/auth/login', flow: 'auth' });
  check(loginRes, { 'login ok': r => r.status === 200 });
}

export function checkoutFlow(data) {
  const productId = pickProductId(data.products);
  if (!productId) return;

  const payload = {
    items: [{ productId, quantity: randInt(1, 2) }],
    name: 'K6 Buyer',
    email: randomEmail('k6.buyer'),
    shippingAddress: '123 Test Street, Test City',
    cardNumber: '4242 4242 4242 4242',
    cardName: 'K6 BUYER',
    expiry: '12/34',
    cvc: '123',
  };

  const res = postJson('/api/checkout/create-order', payload, { name: 'POST /api/checkout/create-order', flow: 'checkout' });
  check(res, { 'checkout created': r => r.status === 201 });
}

export default function (data) {
  const flow = pickWeighted([
    { weight: 60, value: 'browse' },
    { weight: 25, value: 'similar' },
    { weight: 10, value: 'auth' },
    { weight: 5, value: 'checkout' },
  ]);

  if (flow === 'browse') browseFlow(data);
  else if (flow === 'similar') similarFlow(data);
  else if (flow === 'auth') authFlow();
  else if (flow === 'checkout') checkoutFlow(data);

  sleep(Math.random() * 1.2);
}

