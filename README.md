# SIMS — SSD Inventory Management System

A full-stack web app for tracking SSD hardware inventory: registering drives, viewing/editing/deleting records, and visualizing inventory statistics on a dashboard.

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js (Pages Router) 16, React 19, TypeScript, Mantine UI 9, Mantine Charts, Axios |
| Backend    | Node.js, Express 4, Mongoose 9 |
| Database   | MongoDB 7 |
| Tooling    | ESLint, Prettier, Docker Compose |

## Project Structure

```
sims/
├── docker-compose.yml       # Orchestrates mongodb + backend + frontend containers
├── backend/                 # Express API server
│   ├── server.js            # App entry point, middleware, route mounting, DB connection
│   ├── models/SSD.js        # Mongoose schema for an SSD record
│   ├── routes/inventory.js  # CRUD routes for /api/inventory
│   └── .env / .env.example  # PORT, MONGODB_URI
└── frontend/                 # Next.js app
    ├── pages/
    │   ├── index.tsx              # Dashboard page (charts, summary cards, tables)
    │   ├── inventory/index.tsx    # Inventory list page (search, filter, edit, delete)
    │   ├── inventory/add.tsx      # "Register New SSD" form page
    │   └── _app.tsx               # MantineProvider + global Layout wrapper
    ├── components/
    │   ├── Layout.tsx              # App shell: header, sidebar navigation
    │   └── dashboard/              # Dashboard-only chart/table components + shared helpers (types.ts)
    ├── lib/
    │   ├── api.ts                  # Exports API_BASE_URL (reads NEXT_PUBLIC_API_URL)
    │   └── ssdOptions.ts           # Shared <Select> dropdown option lists (model, capacity, etc.)
    └── types/tabler-icons.d.ts     # TypeScript declaration shim for @tabler/icons-react
```

## Data Model

`backend/models/SSD.js` — Mongoose schema, collection `ssds`:

| Field          | Type   | Notes                                      |
|----------------|--------|---------------------------------------------|
| `deviceId`     | String | required, unique                            |
| `model`        | String | required                                    |
| `serialNumber` | String | required, unique                            |
| `capacity`     | String | required                                    |
| `interface`    | String | required                                    |
| `status`       | String | required, enum: `Active`, `Available`, `Failed` |
| `location`     | String | required                                    |
| `createdAt` / `updatedAt` | Date | auto (schema option `timestamps: true`) |

## Backend API

Base path: `/api/inventory` (mounted in `backend/server.js`). All routes defined in `backend/routes/inventory.js`.

| Method | Path                  | Description                          | Success Response |
|--------|------------------------|---------------------------------------|-------------------|
| `GET`  | `/api/inventory`       | List all SSDs                         | `200` — array of SSD docs |
| `POST` | `/api/inventory`       | Create a new SSD (`req.body` = SSD fields) | `201` — `{ message, data }` |
| `PUT`  | `/api/inventory/:id`   | Update an SSD by MongoDB `_id`        | `200` — `{ message, data }` |
| `DELETE` | `/api/inventory/:id` | Delete an SSD by MongoDB `_id`        | `200` — `{ message }` |

Other server routes:
- `GET /` — health/welcome message
- `GET /api/health` — `{ status: 'OK', timestamp }`

All routes use `async/await` with `try/catch`; validation errors return `400`, not-found returns `404`, unexpected errors return `500`. A global Express error-handling middleware also catches uncaught errors.

## Frontend Pages & What They Call

| Page | Route | Calls | Method |
|------|-------|-------|--------|
| `pages/index.tsx` | `/` | `GET API_BASE_URL` | `axios.get` — fetches all SSDs, then derives dashboard stats (status counts, capacity/location/model breakdowns, recent additions, failed drives) client-side via `useMemo` |
| `pages/inventory/index.tsx` | `/inventory` | `GET API_BASE_URL` (list), `PUT API_BASE_URL/:id` (save edit), `DELETE API_BASE_URL/:id` (delete) | `axios.get` / `axios.put` / `axios.delete` |
| `pages/inventory/add.tsx` | `/inventory/add` | `POST API_BASE_URL` | `axios.post` — registers a new SSD, redirects to `/inventory` on success |

`API_BASE_URL` (from `frontend/lib/api.ts`) resolves to `process.env.NEXT_PUBLIC_API_URL` or defaults to `http://localhost:5000/api/inventory`.

### Dashboard (`pages/index.tsx`)

Fetches inventory once, then computes (via `components/dashboard/types.ts` helpers):
- `countBy()` — simple `{name, count}` grouping (used for capacity distribution)
- `pivotCount()` — groups by one field and stacks counts by a second field (used for Location-by-Model and Model-by-Location stacked bar charts)

Renders these components (all under `components/dashboard/`):
- `StatusOverviewChart` — donut chart of Active/Available/Failed
- `CapacityChart` — bar chart of capacity distribution
- `InterfaceChart` — chart of interface type distribution
- `AdditionsTrendChart` — SSDs added over time
- `LocationChart` — stacked bar chart, drives per location broken down by model
- `ModelPopularityChart` — stacked bar chart, drives per model broken down by location
- `RecentAdditionsTable` — latest 6 registered SSDs (scrollable)
- `NeedsAttentionTable` — all `Failed` status drives (scrollable)
- `SummaryCards` — total/active/available/failed counts

Includes filter modals (Status, Capacity) that filter the inventory before computing dashboard stats.

### Inventory List (`pages/inventory/index.tsx`)

- Search box + Capacity/Status filter popovers (client-side filtering)
- Table of all SSDs with an **Actions** column:
  - **Edit** (`IconPencil`) — opens a `Modal` pre-filled with the row's data; submitting calls `axios.put(${API_BASE_URL}/${id}, editForm)`
  - **Delete** (`IconTrash`) — confirms, then calls `axios.delete(${API_BASE_URL}/${id})`
- "Register New SSD" button links to `/inventory/add`

### Add SSD (`pages/inventory/add.tsx`)

Form with fields: Device ID, Serial Number (text inputs) and Model/Capacity/Interface/Status/Location (`Select` dropdowns sourced from `lib/ssdOptions.ts`). On submit, `axios.post(API_BASE_URL, form)`.

## Running the Project

### Local shell prerequisite

`pnpm` needs a working `node` binary in the same shell/environment. If you are running this in WSL and see `exec: node: not found`, install Node.js in WSL first or use a Node manager such as `nvm`/`fnm`/`volta`, then run `corepack enable` once before `pnpm install`.

### Option 1: Docker Compose (recommended)

```bash
docker compose up -d --build
```

Starts 3 containers:
- `sims-mongodb` — MongoDB on `localhost:27017`
- `sims-backend` — Express API on `localhost:5000`
- `sims-frontend` — Next.js app on `localhost:3000`

Backend and frontend source directories are bind-mounted, so code edits are reflected without rebuilding. Only rebuild (`docker compose up -d --build`) when you change `package.json` dependencies; a plain `docker compose restart <service>` is enough for route/logic changes since nodemon/Next dev server auto-reload.

### Option 2: Run locally without Docker

Requires a local or remote MongoDB instance.

```bash
# once per shell/environment, after Node.js is installed
corepack enable

# backend
cd backend
cp .env.example .env   # set MONGODB_URI, PORT
pnpm install
pnpm dev

# frontend (separate terminal)
cd frontend
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
pnpm install
pnpm dev
```

## Environment Variables

**`backend/.env`**
| Variable | Description |
|----------|-------------|
| `PORT` | Port the Express server listens on (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |

**`frontend/.env.local`** (or Docker Compose env)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Full URL to the backend inventory API, e.g. `http://localhost:5000/api/inventory` |

## Linting & Formatting

Both `frontend/` and `backend/` have ESLint (flat config, `eslint.config.mjs`) and Prettier configured:

```bash
npm run lint          # ESLint
npm run format        # Prettier — writes changes
npm run format:check  # Prettier — check only, no changes
```
