import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import useAuth from '../hooks/useAuth';

// Pages
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import MyLinks from '../pages/MyLinks/MyLinks';
import QRCodes from '../pages/QRCodes/QRCodes';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Settings/Settings';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import Users from '../pages/Admin/Users';
import AdminRequests from '../pages/Admin/AdminRequests';
import URLs from '../pages/Admin/URLs';
import Reports from '../pages/Admin/Reports';
import PublicStats from '../pages/PublicStats/PublicStats';

export const AppRoutes = () => {
  const { authenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={authenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={authenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/stats/:shortCode" element={<PublicStats />} />

      {/* User Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/my-links" element={<ProtectedRoute><MyLinks /></ProtectedRoute>} />
      <Route path="/qr-codes" element={<ProtectedRoute><QRCodes /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/analytics/:urlId" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute adminOnly><AdminRequests /></ProtectedRoute>} />
      <Route path="/admin/urls" element={<ProtectedRoute adminOnly><URLs /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={authenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;
