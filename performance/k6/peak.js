import workload, { setup } from './workload.js';

export const options = {
  scenarios: {
    peak: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '3m', target: 25 },
        { duration: '5m', target: 25 },
        { duration: '1m', target: 5 },
      ],
      gracefulRampDown: '30s',
      exec: 'default',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    'http_req_duration{name:GET /api/products}': ['p(95)<1200'],
    'http_req_duration{name:GET /api/products/:id}': ['p(95)<1200'],
    'http_req_duration{name:GET /api/products/:id/similar}': ['p(95)<2200'],
    'http_req_duration{name:POST /api/auth/register}': ['p(95)<1800'],
    'http_req_duration{name:POST /api/auth/login}': ['p(95)<1500'],
    'http_req_duration{name:POST /api/checkout/create-order}': ['p(95)<3500'],
  },
};

export { setup };
export default workload;

