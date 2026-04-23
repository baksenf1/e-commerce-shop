## Performance testing (k6)

This folder contains reproducible performance tests for the Fusion Electronics MERN app.

### High-risk modules covered

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Catalog + recommendations**: `GET /api/products`, `GET /api/products/:id`, `GET /api/products/:id/similar`
- **Checkout**: `POST /api/checkout/create-order` (DB write + validation + simulated delay)

### Prerequisites

- Backend running locally (default in this repo is port **8000** via `backend/index.js`)
- Seeded DB with products (backend seeds on start unless `SKIP_SEED_ON_START=true`)
- k6 installed:
  - Windows: install from k6 releases or use Docker

### Quick start (PowerShell)

Set the base URL (optional):

```powershell
$env:BASE_URL="http://localhost:8000"
```

Run scenarios:

```powershell
k6 run .\performance\k6\normal.js
k6 run .\performance\k6\peak.js
k6 run .\performance\k6\spike.js
k6 run .\performance\k6\endurance.js
```

Save a JSON summary (recommended for the report):

```powershell
k6 run --summary-export .\performance\results\normal-summary.json .\performance\k6\normal.js
```

### Docker alternative (no local install)

```powershell
docker run --rm -i grafana/k6 run - < .\performance\k6\normal.js
```

### Where to write results

- Store raw outputs in `performance/results/` (create it locally).
- Use `performance/test-plan.md` + your exported summaries + screenshots for the assignment report.

