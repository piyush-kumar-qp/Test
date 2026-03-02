const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token = getToken(), ...init } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? res.statusText);
  }
  return res.json().catch(() => ({} as T));
}

// Auth
export type LoginRes = { access_token: string; user: { id: string; email: string; name: string; role: string } };
export function authLogin(email: string, password: string) {
  return api<LoginRes>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}
export function authRegister(name: string, email: string, password: string) {
  return api<{ id: string }>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

// Public
export type Doctor = { id: string; speciality: string; qualification: string; user?: { name: string; email: string } };
export type Slot = { id: string; date: string; startTime: string; endTime: string; doctorId: string; doctor?: Doctor };
export function publicDoctorsAndSlots(speciality?: string, date?: string) {
  const q = new URLSearchParams();
  if (speciality) q.set('speciality', speciality);
  if (date) q.set('date', date);
  return api<{ doctors: Doctor[]; timeslots: Slot[] }>(`/api/public/doctors-and-slots?${q}`);
}

// Appointments (patient + admin)
export function appointmentsCreate(slotId: string) {
  return api<{ id: string }>('/appointments', { method: 'POST', body: JSON.stringify({ slotId }) });
}
export function appointmentsMy() {
  return api<Array<{ id: string; slot: Slot; doctor: Doctor; createdAt: string }>>('/appointments/my');
}
export function appointmentsList() {
  return api<Array<{ id: string; slot: Slot; doctor: Doctor; patient?: { name: string; email: string }; createdAt: string }>>('/appointments');
}

// Doctors (admin create, list; doctor me)
export function doctorsCreate(dto: { name: string; email: string; password: string; speciality: string; qualification: string }) {
  return api<Doctor>('/doctors', { method: 'POST', body: JSON.stringify(dto) });
}
export function doctorsList() {
  return api<Doctor[]>('/doctors');
}
export function doctorsMe() {
  return api<Doctor>('/doctors/me');
}

// Slots (doctor create; optional filters for listing)
export function slotsCreate(dto: { date: string; startTime: string; endTime: string }) {
  return api<Slot>('/slots', { method: 'POST', body: JSON.stringify(dto) });
}
export function slotsList(doctorId?: string, speciality?: string, date?: string) {
  const q = new URLSearchParams();
  if (doctorId) q.set('doctorId', doctorId);
  if (speciality) q.set('speciality', speciality);
  if (date) q.set('date', date);
  return api<Slot[]>(`/slots?${q}`);
}

// Analytics (admin)
export type Analytics = {
  mostBookedSpeciality: Array<{ speciality: string; count: string }>;
  mostBookedDoctor: Array<{ doctorId: string; doctorName: string; speciality: string; count: string }>;
  mostBookedTimeslot: Array<{ date: string; startTime: string; endTime: string; count: string }>;
};
export function analyticsDashboard() {
  return api<Analytics>('/analytics');
}
