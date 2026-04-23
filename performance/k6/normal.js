import workload, { setup } from './workload.js';

export const options = {
  scenarios: {
    normal: {
      executor: 'constant-vus',
      vus: 5,
      duration: '2m',
      gracefulStop: '30s',
      exec: 'default',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],

    // Browse
    'http_req_duration{name:GET /api/products}': ['p(95)<800'],
    'http_req_duration{name:GET /api/products/:id}': ['p(95)<800'],

    // Similar (can hit Pinecone + fallback computation)
    'http_req_duration{name:GET /api/products/:id/similar}': ['p(95)<1500'],

    // Auth
    'http_req_duration{name:POST /api/auth/register}': ['p(95)<1200'],
    'http_req_duration{name:POST /api/auth/login}': ['p(95)<1000'],

    // Checkout includes ~1200ms simulated delay in handler
    'http_req_duration{name:POST /api/checkout/create-order}': ['p(95)<2500'],
  },
};

export { setup };
export default workload;

