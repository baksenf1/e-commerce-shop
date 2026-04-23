import workload, { setup } from './workload.js';

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '30s', target: 5 },
        { duration: '60s', target: 50 },
        { duration: '60s', target: 5 },
      ],
      gracefulRampDown: '30s',
      exec: 'default',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    'http_req_duration{name:GET /api/products}': ['p(95)<2000'],
    'http_req_duration{name:GET /api/products/:id}': ['p(95)<2000'],
    'http_req_duration{name:GET /api/products/:id/similar}': ['p(95)<3500'],
    'http_req_duration{name:POST /api/checkout/create-order}': ['p(95)<6000'],
  },
};

export { setup };
export default workload;

