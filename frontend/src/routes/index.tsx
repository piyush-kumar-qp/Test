import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../features/home/pages/Home';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import PatientDashboard from '../features/patient/pages/PatientDashboard';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import DoctorDashboard from '../features/doctor/pages/DoctorDashboard';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
