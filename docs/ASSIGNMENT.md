# Doctor–Patient Management – Assignment Summary

## 1. Client side (Patient)

- Patient **registers** and **logs in**.
- Patient **searches/filters** doctors (e.g. by speciality, time slot, date).
- Patient **books an appointment** with a chosen doctor.
- **Notification email** is sent to the doctor that the appointment is confirmed.

## 2. Admin side

- Admin **creates doctor credentials** (or invites doctors).
- Doctor **logs in** and **opens slots** (e.g. date, time range).
- **Analytics**: e.g. most booked speciality, most booked doctor, most booked time slot.
- **API**: expose endpoints for **doctors list** and **timeslots** (for the frontend to consume).

## 3. Frontend (this repo)

- Frontend lives at **`frontend/`** (Vite + React + TypeScript).
- From repo root: `npm run dev:frontend` or `cd frontend && npm run dev`.
- **API base URL**: set `VITE_API_URL` in `frontend/.env` (default `http://localhost:3001`).

## 4. Backend (existing)

- **Doctors API**: e.g. `GET /doctors` (list with filters).
- **Slots API**: e.g. `GET /doctors/:id/slots` (for a chosen doctor).
- **Appointments API**: `POST /appointments` (book), `GET /appointments/my` (my appointments).
- **Analytics API** (optional): e.g. `GET /analytics/popular` (for admin dashboard).

---

*Use `backend/.env` for `PORT`, `JWT_SECRET`, `DB_*`, and SMTP vars. Run backend with `make dev` or `npm run dev`, frontend with `npm run dev:frontend` or `cd frontend && npm run dev`.*
