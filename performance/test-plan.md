## Performance test plan (Assignment 3 — Part 1)

### System under test

- **Backend API**: Express server (default `http://localhost:8000`)
- **Database**: MongoDB (required for products + orders)
- **Key flows tested**: authentication, product browsing + recommendations, checkout (order creation)

### High-risk modules (3)

1. **Checkout / Order creation**
   - DB reads (products), DB write (order), validation, and a simulated delay in handler.
   - Endpoint: `POST /api/checkout/create-order`
2. **Products + recommendations**
   - Heavy DB access and recommendation logic (Pinecone query + fallback computations).
   - Endpoints: `GET /api/products`, `GET /api/products/:id`, `GET /api/products/:id/similar`
3. **Authentication**
   - Password hashing + DB reads/writes (register) and login.
   - Endpoints: `POST /api/auth/register`, `POST /api/auth/login`

### Tools

- **Load generation**: k6 (scripts in `performance/k6/`)
- **Resource monitoring** (pick what you have available):
  - Windows Task Manager / Resource Monitor (CPU/RAM/Disk/Network)
  - Optional: Docker Desktop stats (if running in containers)
  - Optional (advanced): Prometheus + Grafana

### Common execution parameters

- Base URL: `BASE_URL` env var (default `http://localhost:8000`)
- Timeouts: per-request `timeout` is set in scripts
- Data: scripts fetch products via `GET /api/products` in `setup()` and reuse IDs for reproducibility

### Scenarios

The scripts implement the following 4 scenarios:

#### 1) Normal load (`normal.js`)

- **Goal**: simulate typical usage, validate baseline performance.
- **Load**: 5 VUs for 2 min (steady).
- **Mix** (approx):
  - 60% browse products (list + details)
  - 25% recommendations (`/similar`)
  - 10% auth (register/login)
  - 5% checkout (create order)

**Expected thresholds**
- HTTP error rate < 1%
- p95 (browse) < 800ms
- p95 (similar) < 1500ms
- p95 (checkout) < 2500ms (includes ~1200ms simulated delay)

#### 2) Peak load (`peak.js`)

- **Goal**: confirm system meets performance requirements at peak traffic.
- **Load**: ramp 5 → 25 VUs over 3 min, hold 5 min.

**Expected thresholds**
- HTTP error rate < 2%
- p95 (browse) < 1200ms
- p95 (similar) < 2200ms
- p95 (checkout) < 3500ms

#### 3) Spike load (`spike.js`)

- **Goal**: observe behavior during sudden demand spike.
- **Load**: 5 VUs 30s → 50 VUs 60s → 5 VUs 60s.

**Expected thresholds**
- HTTP error rate < 5%
- System recovers (p95 returns near baseline within 1–2 minutes after spike)

#### 4) Endurance / Soak (`endurance.js`)

- **Goal**: detect memory leaks, performance degradation, DB connection exhaustion.
- **Load**: 10 VUs for 15 minutes.

**Expected thresholds**
- Error rate stable and < 2%
- No upward trend in p95 latency over time

### Metrics to capture (for your report)

- **Latency**: average / median / p95 for each endpoint group
- **Throughput**: requests/sec over time
- **Errors**: HTTP error rate and top error codes
- **Resources**: CPU%, RAM, Disk I/O, Network I/O during each run

### Artifacts to save

- k6 console output for each run
- `--summary-export` JSON for each run
- Screenshots of CPU/RAM graphs during tests
- Backend logs (optional, but useful for bottleneck analysis)

### Bottleneck analysis checklist

- Slow endpoints: identify by p95 and high variance
- DB pressure: increased latency on `create-order` or `products` reads
- External dependency: recommendation queries (Pinecone) vs fallback behavior
- Resource saturation: CPU pegged, RAM growth, or high disk latency

