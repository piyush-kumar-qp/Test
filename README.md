# Doctor–Patient Management

Monorepo: **backend** (NestJS API) and **frontend** (React + Vite).

## Structure

```
.
├── backend/     # NestJS API (auth, doctors, slots, appointments, analytics)
├── frontend/    # React + TypeScript + Vite
├── docs/
├── docker-compose.yml
└── package.json # workspace root
```

## Setup

```bash
npm install
```

- **Backend env**: Copy your `.env` into `backend/` (or create `backend/.env` with `PORT`, `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, SMTP vars).
- **Frontend env**: Optional `frontend/.env` with `VITE_API_URL=http://localhost:3001`.

## Run

| Command | Description |
|--------|-------------|
| `npm run dev` | Start backend (NestJS) |
| `npm run dev:frontend` | Start frontend (Vite) |
| `make dev` | Same as `npm run dev` |
| `make dev:frontend` | Same as `npm run dev:frontend` |

Run both in separate terminals. Backend: http://localhost:3001. Frontend: http://localhost:5173.

## Docker

```bash
make build
make up
```

API and Postgres run in Docker; frontend stays local unless you add it to compose.
