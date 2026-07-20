# SIMS — SSD Inventory Management System

A full-stack web app for tracking SSD hardware inventory: register drives, view/edit/delete records, and visualize inventory statistics on a dashboard with charts and tables.

---

## Tech Stack

| Layer        | Technology                                                              |
| ------------ | ----------------------------------------------------------------------- |
| Frontend     | Next.js 16 (Pages Router), React 19, TypeScript 5, Mantine UI 9, Mantine Charts 9, Axios 1.18, Tabler Icons 3 |
| Backend      | Node.js 20, Express 4, Mongoose 9                                       |
| Database     | MongoDB 7                                                               |
| Styling      | Tailwind CSS 4 + Mantine components                                     |
| Package mgr  | pnpm 10                                                                 |
| Tooling      | ESLint 9 (flat config), Prettier 3, Docker Compose, nodemon             |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Browser                                            │
│  localhost:3000  (Next.js dev server)               │
│                                                     │
│  Pages:                                             │
│  /                → Dashboard (charts + tables)     │
│  /inventory       → Inventory list (CRUD)           │
│  /inventory/add   → Register new SSD form           │
└──────────┬──────────────────────────────────────────┘
           │  Axios HTTP requests
           │  API_BASE_URL = NEXT_PUBLIC_API_URL
           │  or default: http://localhost:5000/api/inventory
           ▼
┌─────────────────────────────────────────────────────┐
│  Backend (Express)                                  │
│  localhost:5000  (or host:5001 via Docker)          │
│                                                     │
│  Routes:                                            │
│  GET    /api/inventory      → list all SSDs         │
│  POST   /api/inventory      → create SSD            │
│  PUT    /api/inventory/:id   → update SSD            │
│  DELETE /api/inventory/:id   → delete SSD            │
│  GET    /api/health          → health check          │
└──────────┬──────────────────────────────────────────┘
           │  Mongoose ODM
           │  MONGODB_URI connection string
           ▼
┌─────────────────────────────────────────────────────┐
│  MongoDB 7                                          │
│  Database: sims                                     │
│  Collection: ssds                                   │
│  localhost:27017 (dev) / mongodb:27017 (Docker)     │
└─────────────────────────────────────────────────────┘
```

### Data Flow Per Page

**Dashboard (`pages/index.tsx`)**
1. `useEffect` fires on mount → `axios.get(API_BASE_URL)` → fetches entire SSD array
2. All chart/table data is derived client-side via `useMemo` from the raw array
3. Status/Capacity filter modals narrow the array before computation
4. Render each chart component with the filtered data

**Inventory List (`pages/inventory/index.tsx`)**
1. Mount → `axios.get(API_BASE_URL)` → full SSD array
2. Client-side text search across `deviceId`, `model`, `serialNumber`, `capacity`, `location`
3. Status and Capacity popover filters further narrow results
4. Edit button → opens Mantine Modal → `axios.put(${API_BASE_URL}/${_id}, editForm)` → refetch
5. Delete button → confirm dialog → `axios.delete(${API_BASE_URL}/${_id})` → refetch

**Add SSD (`pages/inventory/add.tsx`)**
1. Form fields from `lib/ssdOptions.ts` (Model, Capacity, Interface, Status, Location dropdowns)
2. Submit → `axios.post(API_BASE_URL, formData)` → redirect to `/inventory`

### Key Files and Their Roles

```
sims/
├── docker-compose.yml              # 3 services: mongodb, backend, frontend
├── seed-50-drives.sh               # POSTs 50 randomized SSDs to the API
│
├── backend/
│   ├── server.js                   # Express app: middleware, routes, DB connect → listen
│   ├── models/SSD.js               # Mongoose schema (collection: "ssds")
│   ├── routes/inventory.js         # CRUD handlers for /api/inventory
│   ├── Dockerfile                  # Production build: pnpm start (no nodemon)
│   ├── .env                        # PORT=5000, MONGODB_URI=...
│   └── .env.example                # Template with Docker-oriented defaults
│
├── frontend/
│   ├── pages/
│   │   ├── _app.tsx                # MantineProvider + Layout wrapper (global)
│   │   ├── index.tsx               # Dashboard: fetches all SSDs, derives chart data
│   │   ├── inventory/
│   │   │   ├── index.tsx           # List: search, filter, edit modal, delete
│   │   │   └── add.tsx             # Form: POST new SSD
│   ├── components/
│   │   ├── Layout.tsx              # App shell: header, sidebar nav
│   │   └── dashboard/
│   │       ├── types.ts            # SSD interface, statusMeta, countBy(), pivotCount(), chartColors
│   │       ├── SummaryCards.tsx     # Total / Active / Available / Failed stat cards
│   │       ├── StatusOverviewChart.tsx   # Donut: Active/Available/Failed
│   │       ├── CapacityChart.tsx         # Bar: capacity distribution
│   │       ├── InterfaceChart.tsx        # Bar: interface type counts
│   │       ├── AdditionsTrendChart.tsx   # Line: SSDs added over time (by createdAt)
│   │       ├── LocationChart.tsx         # Stacked bar: location × model
│   │       ├── ModelPopularityChart.tsx  # Stacked bar: model × location
│   │       ├── RecentAdditionsTable.tsx  # Latest 6 SSDs (scrollable)
│   │       ├── NeedsAttentionTable.tsx   # All Failed SSDs (scrollable)
│   │       └── ChartCard.tsx             # Reusable card wrapper for charts
│   ├── lib/
│   │   ├── api.ts                  # API_BASE_URL constant
│   │   └── ssdOptions.ts           # Dropdown options: models, capacities, interfaces, etc.
│   ├── types/
│   │   └── tabler-icons.d.ts       # TS shim for @tabler/icons-react imports
│   ├── Dockerfile                  # Production build: next build → next start
│   ├── .env.local                  # NEXT_PUBLIC_API_URL=...
│   └── .env.example                # Template
```

---

## Data Model

**Collection:** `ssds` (MongoDB) — defined in `backend/models/SSD.js`

| Field          | Type   | Required | Unique | Notes                                    |
|----------------|--------|----------|--------|------------------------------------------|
| `deviceId`     | String | ✓        | ✓      | Human-readable device identifier          |
| `model`        | String | ✓        |        | e.g. "Samsung 990 Pro"                   |
| `serialNumber` | String | ✓        | ✓      | Manufacturer serial number                |
| `capacity`     | String | ✓        |        | e.g. "1 TB", "500 GB"                    |
| `interface`    | String | ✓        |        | e.g. "NVMe PCIe 4.0", "SATA III"        |
| `status`       | String | ✓        |        | Enum: `Active`, `Available`, `Failed`    |
| `location`     | String | ✓        |        | e.g. "Rack A, Bay 1"                     |
| `createdAt`    | Date   | auto     |        | From Mongoose `timestamps: true`          |
| `updatedAt`    | Date   | auto     |        | From Mongoose `timestamps: true`          |

---

## Backend API Reference

Base URL: `/api/inventory` (mounted in `backend/server.js` line 25).  
All route handlers: `backend/routes/inventory.js`

### `GET /api/inventory`
Returns all SSD documents as a JSON array.  
**Response:** `200` — `[ { _id, deviceId, model, ... }, ... ]`

### `POST /api/inventory`
Create a new SSD. Body must include all required fields.  
**Request body:** `{ deviceId, model, serialNumber, capacity, interface, status, location }`  
**Response:** `201` — `{ message: "SSD registered successfully", data: { ... } }`  
**Errors:** `400` — validation error (missing field, duplicate, invalid enum)

### `PUT /api/inventory/:id`
Update an existing SSD by its MongoDB `_id`. Uses `findByIdAndUpdate` with `runValidators: true`, so enum and required checks fire on updates too.  
**Response:** `200` — `{ message: "SSD updated successfully", data: { ... } }`  
**Errors:** `400` — validation error, `404` — not found

### `DELETE /api/inventory/:id`
Delete an SSD by its MongoDB `_id`.  
**Response:** `200` — `{ message: "SSD deleted successfully" }`  
**Errors:** `404` — not found

### Other Routes (`backend/server.js`)
| Method | Path           | Response                                         |
|--------|---------------|--------------------------------------------------|
| GET    | `/`           | `{ message: "Welcome to the API" }`              |
| GET    | `/api/health` | `{ status: "OK", timestamp: "<ISO string>" }`    |

All handlers use `async/await` with `try/catch`. A global Express error middleware catches uncaught errors and returns `500`.

---

## Frontend: How `API_BASE_URL` Resolves

`frontend/lib/api.ts`:
```ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/inventory';
```

- **Local dev:** Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api/inventory` in `frontend/.env.local`
- **Docker Compose:** The `docker-compose.yml` passes `NEXT_PUBLIC_API_URL=http://localhost:5001/api/inventory` as a build arg — the browser reaches the backend on the host-mapped port `5001`
- **Fallback:** If the env var is unset, it defaults to `http://localhost:5000/api/inventory`

Every page imports `API_BASE_URL` from `lib/api.ts` and uses it directly in Axios calls — there is no shared Axios instance or interceptor.

---

## Shared Helpers

### `frontend/components/dashboard/types.ts`

This is the **canonical source** for the `SSD` interface and dashboard utilities. Import from here rather than redefining types in page files.

| Export           | Type / Signature                                         | Purpose                                                    |
|------------------|----------------------------------------------------------|------------------------------------------------------------|
| `SSD`            | `interface`                                              | Shape of an SSD document (mirrors Mongoose schema + `_id`) |
| `statusMeta`     | `Record<string, { color, badge }>`                       | Status → Mantine color/badge mapping                       |
| `chartColors`    | `string[]`                                               | 24-color palette cycled for chart series                   |
| `countBy()`      | `(items: SSD[], key: keyof SSD) => {name, count}[]`      | Group & count by any SSD field, sorted desc                |
| `pivotCount()`   | `(items: SSD[], groupKey, seriesKey) => {data, series}`  | Two-level grouping for stacked bar charts                  |
| `DistributionItem` | `interface { name, count }`                            | Return type of `countBy()`                                 |
| `PivotResult`    | `interface { data, series }`                             | Return type of `pivotCount()`                              |

### `frontend/lib/ssdOptions.ts`

Constant arrays used by both the Add SSD form (`pages/inventory/add.tsx`) and the inventory list filters (`pages/inventory/index.tsx`):

- `MODEL_OPTIONS` — 12 SSD models (Samsung, WD, Crucial, Seagate, Kingston, SK Hynix, Intel)
- `CAPACITY_OPTIONS` — 250 GB to 8 TB
- `INTERFACE_OPTIONS` — SATA III, NVMe PCIe 3.0/4.0/5.0
- `STATUS_OPTIONS` — Active, Available, Failed
- `LOCATION_OPTIONS` — 11 rack/room/center locations

---

## Environment Variables

### `backend/.env`

| Variable       | Description                               | Default                      |
|----------------|------------------------------------------|------------------------------|
| `PORT`         | Port the Express server listens on        | `5000`                       |
| `MONGODB_URI`  | MongoDB connection string                 | (required, no default)       |

- **Local dev:** `MONGODB_URI=mongodb://localhost:27017/sims`
- **Docker:** `MONGODB_URI=mongodb://mongodb:27017/sims` (hostname = Docker service name)

### `frontend/.env.local`

| Variable               | Description                                      | Default                                     |
|------------------------|--------------------------------------------------|---------------------------------------------|
| `NEXT_PUBLIC_API_URL`  | Full URL to the backend inventory API endpoint   | `http://localhost:5000/api/inventory`       |

> **Important:** `NEXT_PUBLIC_` prefix is required — Next.js only exposes env vars with this prefix to the browser. Without it, the variable is server-side only and Axios calls from the browser will fall back to the default.

---

## Running the Project

### Prerequisites

- Node.js 20+ (with `corepack enabled` for pnpm)
- Docker (for MongoDB container) or a local MongoDB 7 installation

### Option 1: Mixed — MongoDB in Docker, Backend & Frontend locally (recommended for development)

This gives you fast code-reload (nodemon + Next.js dev server) while keeping MongoDB in a container — no local MongoDB installation needed.

```bash
# Step 1: Start only MongoDB
docker compose up -d mongodb

# Step 2: Backend (terminal 1)
cd backend
cp .env.example .env
pnpm install
pnpm dev          # nodemon auto-reloads on code changes

# Step 3: Frontend (terminal 2)
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev          # Next.js dev server with hot reload
```

The MongoDB container exposes port `27017` to your host, so the backend's `localhost:27017` connection works. Stop MongoDB with `docker compose down` when done.

### Option 2: Full Docker Compose

```bash
docker compose up -d --build
```

Starts all 3 containers:
| Container        | Host Port | Internal Port | Notes                                      |
|------------------|-----------|---------------|--------------------------------------------|
| `sims-mongodb`   | `27017`   | `27017`       | Data persisted in `mongodb-data` volume    |
| `sims-backend`   | `5001`    | `5000`        | Production mode (`node`, no hot reload)     |
| `sims-frontend`  | `3000`    | `3000`        | Production mode (`next start`)             |

**Important Docker details:**
- The Dockerfiles are **production builds** — no bind-mount volumes, no nodemon, no Next.js dev server. Code changes require `docker compose up -d --build` to rebuild images.
- Port mapping: Backend runs on `5000` inside the container but is exposed on host `5001`. The frontend build arg `NEXT_PUBLIC_API_URL=http://localhost:5001/api/inventory` accounts for this — the browser hits host `5001`, not internal `5000`.
- Backend reaches MongoDB at `mongodb:27017` (Docker Compose internal DNS), not `localhost`.

### Option 3: Fully Local (no Docker)

Requires MongoDB 7 installed and running on your machine.

```bash
# Start MongoDB first (example with Homebrew)
brew services start mongodb-community

# Backend
cd backend
cp .env.example .env   # ensure MONGODB_URI=mongodb://localhost:27017/sims
pnpm install
pnpm dev

# Frontend (separate terminal)
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev
```

---

## Seed Test Data

```bash
bash seed-50-drives.sh
```

POSTs 50 randomized SSD records to the API. Requires the backend to be running and `curl` available. The script randomizes model, capacity, interface, status, and location from the same option sets used by the frontend.

---

## Linting & Formatting

Both `frontend/` and `backend/` have ESLint 9 (flat config, `eslint.config.mjs`) and Prettier 3 configured:

```bash
npm run lint          # ESLint
npm run format        # Prettier — writes changes
npm run format:check  # Prettier — check only, no changes
```

---

## Key Implementation Notes

### Module System
Backend is CommonJS (`require`/`module.exports`), frontend is ESM + TypeScript. Shared constants (model lists, status enums) are duplicated between `frontend/lib/ssdOptions.ts` and `backend/models/SSD.js` — there is no shared package.

### Mongoose Behaviors
- `timestamps: true` on the schema auto-adds `createdAt`/`updatedAt`. The dashboard's AdditionsTrendChart groups by `createdAt`.
- `PUT` uses `findByIdAndUpdate` with `runValidators: true` — enum and required validations fire on updates, not just creates.
- The backend connects to MongoDB **before** calling `app.listen()`. If the DB is unreachable, the server exits instead of starting and returning 500s.

### `--webpack` Flag
Frontend `dev` script uses `next dev --webpack`. Next.js 16 defaults to Turbopack; this flag explicitly opts back into webpack. Do not remove it without verifying Mantine CSS and all charts render correctly under Turbopack.

### Port Mapping
- Local dev: backend → `localhost:5000`, frontend → `localhost:3000`
- Docker: backend → `localhost:5001` (host), frontend → `localhost:3000` (host)
- Frontend env var must match the port the **browser** can reach, not the internal container port

### Collection Name
Mongoose automatically lowercases and pluralizes the model name: `mongoose.model('SSD', ...)` → collection `ssds`.

 Problem: IT teams track SSDs in spreadsheets. Spreadsheets don't show you patterns — which models are failing, where capacity is concentrated,
  or whether a site is overloaded with one interface type. You don't know what needs attention until something breaks.

  Solution: SIMS — a single-pane view of every SSD across your fleet. Register a drive in 30 seconds, and the dashboard does the rest: charts
  update live, failures surface immediately, and filters let you slice by status, capacity, or location.

  ---
  Live Demo Script (the "good flow")

  Run through this sequence — it takes ~3 minutes and hits every feature:

  Act 1: The Dashboard (30s)

  Open the app to /. You land on a dashboard with:
  - 4 summary cards at the top — total drives, active, available, failed
  - 6 charts below — status donut, capacity bars, interface donut, additions trend line, location stacked bars, model popularity stacked bars
  - 2 tables at the bottom — recent additions, failed drives needing attention

  Say: "This is the zero-config view. Every chart is live — no setup, no dashboard builder. The moment a drive is registered, these all update."

  Click the status/capacity filter pills to show how the entire dashboard re-filters instantly.

  Act 2: Register a Drive (60s)

  Click "Register SSD" (top-right button) → goes to /inventory/add.

  Fill in a drive live:

  ┌───────────────┬─────────────────┐
  │     Field     │      Value      │
  ├───────────────┼─────────────────┤
  │ Device ID     │ SSD-DEMO-01     │
  ├───────────────┼─────────────────┤
  │ Model         │ Samsung 990 Pro │
  ├───────────────┼─────────────────┤
  │ Serial Number │ S7M3N0WBC40987X │
  ├───────────────┼─────────────────┤
  │ Capacity      │ 2TB             │
  ├───────────────┼─────────────────┤
  │ Interface     │ NVMe            │
  ├───────────────┼─────────────────┤
  │ Status        │ Active          │
  ├───────────────┼─────────────────┤
  │ Location      │ DC1-Rack4       │
  └───────────────┴─────────────────┘

  Click Save SSD → redirects to /inventory.

  Say: "One form, 7 fields, 30 seconds. Searchable dropdowns for model and location mean no typos. And —"

  Act 3: It Appears Everywhere (45s)

  Navigate back to / (click Dashboard in the sidebar).

  Say: "— it's already in every chart. Summary count went up. Capacity distribution shifted. Location chart now shows DC1-Rack4. The additions 
  trend has today's datapoint. No refresh, no ETL, no waiting."

  Point at the Recent Additions table — the new drive is top of the list.

  Act 4: Inventory Management (45s)

  Go to /inventory (View Records in sidebar).

  Say: "The table view gives you full control."

  - Type 990 in the search bar → table filters to matching rows.
  Say: "Search hits device ID, model, serial, or location — no column picker needed."
  - Click the filter icon on the Capacity column header → check 2TB → table filters.
  Say: "Inline column filters. Same filters exist on the dashboard too."
  - Click the pencil icon on a row → edit modal opens → change status to Failed → Save.
  Say: "Inline edit — no page navigation."

  Act 5: The "Needs Attention" Loop (30s)

  Navigate back to the dashboard.

  Say: "And this is why the dashboard matters. That drive we just marked as Failed? It's now in the Needs Attention table. The status donut red 
  slice grew. You don't go looking for problems — the dashboard surfaces them."

  Point at the Needs Attention table at the bottom — the failed drive is listed with its serial, model, and location so someone knows exactly
  which physical drive to pull.

  Act 6: Delete (15s)

  Back to /inventory, click the trash icon on the demo drive → confirm → row disappears.

  Say: "Delete is one click with a confirmation guard. And yes — the dashboard updates again."

  ---
  The 3 Talking Points to Hammer

  1. Live, not static. Every create/update/delete flows back to the dashboard instantly. No refresh button exists because none is needed.
  2. Filters are global. Filter by status or capacity on the dashboard, and every chart + table respects it. Same filters exist on the table
  view. The mental model is consistent.
  3. Problems find you. The "Needs Attention" table and the red Failed badge mean you don't audit a spreadsheet — the dashboard tells you what to
  care about.

  ---
  If You're Screen-Recording

  Pre-seed the database with ~15-20 drives across different models, capacities, locations, and statuses (including 2-3 Failed ones) so the charts
  look populated and the "Needs Attention" table has rows from the first frame. Then run the demo flow above. The contrast between "already
  populated" and "watch this new one appear everywhere" is the punchline.
