# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Run with Docker (recommended)

```bash
docker compose up -d --build    # start all services (MongoDB, backend, frontend)
docker compose restart backend  # pick up backend code changes (nodemon auto-reloads)
docker compose restart frontend # pick up frontend code changes (Next dev auto-reloads)
docker compose down             # stop all services
```

### Run locally (without Docker)

```bash
# Backend (Express on :5000)
cd backend && cp .env.example .env && pnpm install && pnpm dev

# Frontend (Next.js on :3000)
cd frontend && cp .env.example .env.local && pnpm install && pnpm dev
```

### Lint & Format

```bash
# In backend/ or frontend/
npm run lint           # ESLint
npm run format         # Prettier (writes changes)
npm run format:check   # Prettier (check only)
```

### Seed Test Data

```bash
bash seed-50-drives.sh   # POSTs 50 randomized SSD records to the API
```

Requires the backend to be running and `curl` available.

## Architecture

### Module System Split

Backend is CommonJS (`require`/`module.exports`), frontend is ESM + TypeScript. You cannot share code between them without a build step — keep shared constants (model lists, status enums) duplicated or extract them into a separate package.

### `--webpack` Flag

Frontend `dev` script uses `next dev --webpack`. Next.js 16 defaults to Turbopack; this flag explicitly opts back into webpack. Do not remove it without verifying Mantine CSS and all charts render correctly under Turbopack.

### Docker Port Mapping

The docker-compose maps host port `5001` to container port `5000` for the backend. When the frontend runs in a browser (client-side), it reaches the backend at `http://localhost:5001/api/inventory`. When the backend container talks to MongoDB, it uses the internal Docker network hostname `mongodb:27017`.

The Dockerfiles (`backend/Dockerfile`, `frontend/Dockerfile`) are **production builds** — the backend runs `pnpm start` (Node, no nodemon) and the frontend runs `pnpm build` then `pnpm start` (production server). The docker-compose uses these directly with no bind-mount volumes, so code changes require `docker compose up -d --build`.

### Data Flow

- **Dashboard** (`pages/index.tsx`): Fetches all SSDs via a single `GET /api/inventory`, then derives all chart/table data client-side using `useMemo`. The helpers `countBy()` and `pivotCount()` in `components/dashboard/types.ts` transform the raw array into chart-ready data. Status/capacity filters reduce the array before these computations run.
- **Inventory list** (`pages/inventory/index.tsx`): Fetches all SSDs, then applies client-side search and filter (text search across multiple fields + status/capacity filter popovers). Editing opens a Mantine `Modal` inline; mutations call `PUT`/`DELETE` then refetch the list.
- **Add SSD** (`pages/inventory/add.tsx`): Form POSTs to the API, redirects to `/inventory` on success.

### Shared Types & Constants

- `frontend/components/dashboard/types.ts` — canonical `SSD` interface, `statusMeta` (status → color/badge mapping), `countBy()`, `pivotCount()`, and `chartColors`. Import `SSD` and `statusMeta` from here; do not redefine them in page files.
- `frontend/lib/ssdOptions.ts` — constant arrays (`MODEL_OPTIONS`, `CAPACITY_OPTIONS`, etc.) used by both the Add SSD form and the inventory list filters.
- `frontend/lib/api.ts` — `API_BASE_URL` resolves to `NEXT_PUBLIC_API_URL` or defaults to `http://localhost:5000/api/inventory`.

### Mongoose Behaviors

- `timestamps: true` on the schema auto-adds `createdAt`/`updatedAt`. The dashboard's `AdditionsTrendChart` groups by `createdAt`.
- PUT route uses `findByIdAndUpdate` with `runValidators: true` — enum and required validations fire on updates, not just creates.
- The backend now connects to MongoDB **before** calling `app.listen()`. If the DB is unreachable, the server exits instead of starting and returning 500s.

### TypeScript Icon Shims

`frontend/types/tabler-icons.d.ts` provides a minimal declaration shim for `@tabler/icons-react` so TypeScript doesn't error on icon imports. Add new icon exports here when using additional icons. Remove this file if the package ships its own types in a future version.
