export const config = {
  baseUrl: __ENV.BASE_URL || 'http://localhost:8000',
  httpTimeout: __ENV.HTTP_TIMEOUT || '10s',
  maxProductsToCache: Number(__ENV.MAX_PRODUCTS || 200),
};

