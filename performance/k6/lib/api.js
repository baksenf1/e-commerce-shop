import http from 'k6/http';
import { check } from 'k6';
import { config } from './config.js';

export function url(path) {
  if (!path.startsWith('/')) return `${config.baseUrl}/${path}`;
  return `${config.baseUrl}${path}`;
}

export function getJson(path, tags = {}) {
  const res = http.get(url(path), {
    timeout: config.httpTimeout,
    tags,
    headers: { Accept: 'application/json' },
  });
  check(res, {
    'status is 2xx/3xx': r => r.status >= 200 && r.status < 400,
  });
  return res;
}

export function postJson(path, body, tags = {}) {
  const payload = JSON.stringify(body ?? {});
  const res = http.post(url(path), payload, {
    timeout: config.httpTimeout,
    tags,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
  return res;
}

