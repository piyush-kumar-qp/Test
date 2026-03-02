# Doctor–Patient Management – Frontend

React + TypeScript + Vite app for the doctor–patient management system (lives in `frontend/`).

## Setup

From repo root (installs all workspaces):

```bash
npm install
```

Or from this folder:

```bash
cd frontend
cp .env.example .env   # optional: edit VITE_API_URL if backend is not on localhost:3001
npm install
```

## Run

```bash
npm run dev
```

Open http://localhost:5173. Ensure the backend is running (e.g. `npm run dev` or `make dev` from repo root) at the URL set in `VITE_API_URL` (default `http://localhost:3001`).

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Features

- **Patient**: Register, login, search doctors/slots (by speciality, date), book appointment, view my appointments.
- **Doctor**: Login, open slots (date + time range), view my slots.
- **Admin**: Login, create doctor (invite), view doctors list, view all appointments, analytics (most booked speciality, doctor, time slot).

## Environment

| Variable        | Description                    | Default              |
|----------------|--------------------------------|----------------------|
| `VITE_API_URL` | Backend API base URL (no slash)| `http://localhost:3001` |
