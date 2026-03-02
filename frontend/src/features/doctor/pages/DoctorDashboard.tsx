import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { slotsCreate, slotsList, doctorsMe } from '../../../services/api';
import type { Slot } from '../../../services/api';
import styles from '../styles/DoctorDashboard.module.css';

export default function DoctorDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [mySlots, setMySlots] = useState<Slot[]>([]);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || user?.role !== 'doctor') {
      navigate('/login');
      return;
    }
    doctorsMe().then((d) => {
      setDoctorId(d.id);
    }).catch(() => {});
  }, [token, user?.role, navigate]);

  useEffect(() => {
    if (!doctorId || !token) return;
    slotsList(doctorId).then(setMySlots).catch(() => setMySlots([]));
  }, [doctorId, token]);

  async function loadSlots() {
    if (!doctorId) return;
    try {
      const list = await slotsList(doctorId);
      setMySlots(list);
    } catch {
      setMySlots([]);
    }
  }

  async function handleOpenSlot(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await slotsCreate(form);
      setForm({ date: '', startTime: '', endTime: '' });
      if (doctorId) await loadSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create slot');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Doctor Dashboard</h1>
        <span>{user.email}</span>
        <button type="button" onClick={() => logout()} className={styles.logout}>
          Logout
        </button>
      </header>

      <section className={styles.section}>
        <h2>Open a slot</h2>
        <form onSubmit={handleOpenSlot} className={styles.form}>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            required
          />
          <input
            type="time"
            placeholder="Start"
            value={form.startTime}
            onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
            required
          />
          <input
            type="time"
            placeholder="End"
            value={form.endTime}
            onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Open slot'}
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <h2>My slots</h2>
        {mySlots.length === 0 ? (
          <p>No slots yet. Open slots above.</p>
        ) : (
          <ul className={styles.list}>
            {mySlots.map((s) => (
              <li key={s.id}>
                {s.date} {s.startTime}–{s.endTime}
                {s.doctor && ` · ${s.doctor.speciality}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className={styles.back}>
        <Link to="/">Home</Link>
      </p>
    </div>
  );
}
