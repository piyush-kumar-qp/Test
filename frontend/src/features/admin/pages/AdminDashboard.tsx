import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import {
  doctorsCreate,
  doctorsList,
  appointmentsList,
  analyticsDashboard,
  type Doctor,
  type Analytics,
} from '../../../services/api';
import styles from '../styles/AdminDashboard.module.css';

type AppointmentItem = {
  id: string;
  slot: { date: string; startTime: string; endTime: string };
  doctor: { speciality: string; user?: { name: string } };
  patient?: { name: string; email: string };
  createdAt: string;
};

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'doctors' | 'create' | 'appointments' | 'analytics'>('doctors');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', speciality: '', qualification: '' });
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadDoctors();
    loadAppointments();
    loadAnalytics();
  }, [token, user?.role, navigate]);

  async function loadDoctors() {
    try {
      const list = await doctorsList();
      setDoctors(list);
    } catch {
      setDoctors([]);
    }
  }

  async function loadAppointments() {
    try {
      const list = await appointmentsList();
      setAppointments(list);
    } catch {
      setAppointments([]);
    }
  }

  async function loadAnalytics() {
    try {
      const data = await analyticsDashboard();
      setAnalytics(data);
    } catch {
      setAnalytics(null);
    }
  }

  async function handleCreateDoctor(e: React.FormEvent) {
    e.preventDefault();
    setCreateError('');
    setLoading(true);
    try {
      await doctorsCreate(createForm);
      setCreateForm({ name: '', email: '', password: '', speciality: '', qualification: '' });
      await loadDoctors();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create doctor');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <span>{user.email}</span>
        <button type="button" onClick={() => logout()} className={styles.logout}>
          Logout
        </button>
      </header>

      <nav className={styles.tabs}>
        <button type="button" className={tab === 'doctors' ? styles.active : ''} onClick={() => setTab('doctors')}>
          Doctors
        </button>
        <button type="button" className={tab === 'create' ? styles.active : ''} onClick={() => setTab('create')}>
          Create Doctor
        </button>
        <button type="button" className={tab === 'appointments' ? styles.active : ''} onClick={() => setTab('appointments')}>
          Appointments
        </button>
        <button type="button" className={tab === 'analytics' ? styles.active : ''} onClick={() => setTab('analytics')}>
          Analytics
        </button>
      </nav>

      {tab === 'doctors' && (
        <section className={styles.section}>
          <h2>Doctors list</h2>
          {doctors.length === 0 ? (
            <p>No doctors yet. Create one in the Create Doctor tab.</p>
          ) : (
            <ul className={styles.list}>
              {doctors.map((d) => (
                <li key={d.id}>
                  {d.user?.name} · {d.speciality} · {d.qualification} · {d.user?.email}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'create' && (
        <section className={styles.section}>
          <h2>Create doctor (invite)</h2>
          <form onSubmit={handleCreateDoctor} className={styles.form}>
            <input
              type="text"
              placeholder="Full name"
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              required
              minLength={2}
            />
            <input
              type="email"
              placeholder="Email"
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6)"
              value={createForm.password}
              onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
            />
            <input
              type="text"
              placeholder="Speciality"
              value={createForm.speciality}
              onChange={(e) => setCreateForm((f) => ({ ...f, speciality: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Qualification"
              value={createForm.qualification}
              onChange={(e) => setCreateForm((f) => ({ ...f, qualification: e.target.value }))}
              required
            />
            {createError && <p className={styles.error}>{createError}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create Doctor'}
            </button>
          </form>
        </section>
      )}

      {tab === 'appointments' && (
        <section className={styles.section}>
          <h2>All appointments</h2>
          {appointments.length === 0 ? (
            <p>No appointments.</p>
          ) : (
            <ul className={styles.list}>
              {appointments.map((a) => (
                <li key={a.id}>
                  {a.patient?.name ?? 'Patient'} · {a.doctor?.user?.name} · {a.doctor?.speciality} · {a.slot?.date} {a.slot?.startTime}–{a.slot?.endTime}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'analytics' && (
        <section className={styles.section}>
          <h2>Analytics</h2>
          {!analytics ? (
            <p>Loading…</p>
          ) : (
            <div className={styles.analytics}>
              <div>
                <h3>Most booked speciality</h3>
                <ul className={styles.list}>
                  {analytics.mostBookedSpeciality.map((s, i) => (
                    <li key={i}>{s.speciality}: {s.count}</li>
                  ))}
                  {analytics.mostBookedSpeciality.length === 0 && <li>No data</li>}
                </ul>
              </div>
              <div>
                <h3>Most booked doctor</h3>
                <ul className={styles.list}>
                  {analytics.mostBookedDoctor.map((d, i) => (
                    <li key={i}>{d.doctorName} ({d.speciality}): {d.count}</li>
                  ))}
                  {analytics.mostBookedDoctor.length === 0 && <li>No data</li>}
                </ul>
              </div>
              <div>
                <h3>Most booked time slot</h3>
                <ul className={styles.list}>
                  {analytics.mostBookedTimeslot.map((t, i) => (
                    <li key={i}>{t.date} {t.startTime}–{t.endTime}: {t.count}</li>
                  ))}
                  {analytics.mostBookedTimeslot.length === 0 && <li>No data</li>}
                </ul>
              </div>
            </div>
          )}
        </section>
      )}

      <p className={styles.back}>
        <Link to="/">Home</Link>
      </p>
    </div>
  );
}
