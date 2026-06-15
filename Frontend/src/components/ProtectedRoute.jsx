import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, authenticated } = useAuth();

  if (loading) {
    return <Loader fullPage />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
