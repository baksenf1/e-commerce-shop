import workload, { setup } from './workload.js';

export const options = {
  scenarios: {
    endurance: {
      executor: 'constant-vus',
      vus: 10,
      duration: '15m',
      gracefulStop: '30s',
      exec: 'default',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    'http_req_duration{name:GET /api/products}': ['p(95)<1500'],
    'http_req_duration{name:GET /api/products/:id}': ['p(95)<1500'],
    'http_req_duration{name:GET /api/products/:id/similar}': ['p(95)<2500'],
    'http_req_duration{name:POST /api/checkout/create-order}': ['p(95)<4500'],
  },
};

export { setup };
export default workload;

