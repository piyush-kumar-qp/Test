import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { user, token } = useAuth();

  if (token && user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor" replace />;
    return <Navigate to="/patient" replace />;
  }

  return (
    <div className={styles.page}>
      <h1>Doctor–Patient Management</h1>
      <p>Book appointments with doctors. Sign in or register as a patient.</p>
      <nav className={styles.nav}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register as Patient</Link>
      </nav>
    </div>
  );
}
