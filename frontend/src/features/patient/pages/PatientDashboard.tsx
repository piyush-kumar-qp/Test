import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import {
  publicDoctorsAndSlots,
  appointmentsMy,
  appointmentsCreate,
  type Slot,
  type Doctor,
} from '../../../services/api';
import styles from '../styles/PatientDashboard.module.css';

export default function PatientDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [speciality, setSpeciality] = useState('');
  const [date, setDate] = useState('');
  const [timeslots, setTimeslots] = useState<Slot[]>([]);
  const [myAppointments, setMyAppointments] = useState<Array<{ id: string; slot: Slot; doctor: Doctor; createdAt: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const [tab, setTab] = useState<'search' | 'my'>('search');

  const loadMyAppointments = useCallback(async () => {
    if (!token) return;
    try {
      const list = await appointmentsMy();
      setMyAppointments(list);
    } catch {
      setMyAppointments([]);
    }
  }, [token]);

  useEffect(() => {
    if (!token || user?.role !== 'patient') {
      navigate('/login');
      return;
    }
    loadMyAppointments();
  }, [token, user?.role, navigate, loadMyAppointments]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { timeslots: t } = await publicDoctorsAndSlots(speciality || undefined, date || undefined);
      setTimeslots(t);
    } catch (err) {
      console.error(err);
      setTimeslots([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(slotId: string) {
    if (!token) return;
    setBookingSlotId(slotId);
    try {
      await appointmentsCreate(slotId);
      await loadMyAppointments();
      setTimeslots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBookingSlotId(null);
    }
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Patient Dashboard</h1>
        <span>{user.email}</span>
        <button type="button" onClick={() => logout()} className={styles.logout}>
          Logout
        </button>
      </header>

      <nav className={styles.tabs}>
        <button type="button" className={tab === 'search' ? styles.active : ''} onClick={() => setTab('search')}>
          Search & Book
        </button>
        <button type="button" className={tab === 'my' ? styles.active : ''} onClick={() => setTab('my')}>
          My Appointments
        </button>
      </nav>

      {tab === 'search' && (
        <>
          <form onSubmit={handleSearch} className={styles.filters}>
            <input
              type="text"
              placeholder="Speciality (e.g. Cardiology)"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </button>
          </form>

          <section className={styles.section}>
            <h2>Available slots</h2>
            {timeslots.length === 0 && !loading && (
              <p>Use filters and click Search, or leave empty to see all.</p>
            )}
            <ul className={styles.slotList}>
              {timeslots.map((slot) => (
                <li key={slot.id} className={styles.slotItem}>
                  <span>
                    {slot.doctor?.user?.name ?? 'Doctor'} · {slot.doctor?.speciality} · {slot.date} {slot.startTime}–{slot.endTime}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBook(slot.id)}
                    disabled={bookingSlotId === slot.id}
                  >
                    {bookingSlotId === slot.id ? 'Booking…' : 'Book'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {tab === 'my' && (
        <section className={styles.section}>
          <h2>My Appointments</h2>
          {myAppointments.length === 0 ? (
            <p>No appointments yet.</p>
          ) : (
            <ul className={styles.appList}>
              {myAppointments.map((a) => (
                <li key={a.id}>
                  {a.doctor?.user?.name} · {a.doctor?.speciality} · {a.slot?.date} {a.slot?.startTime}–{a.slot?.endTime}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <p className={styles.back}>
        <Link to="/">Home</Link>
      </p>
    </div>
  );
}
