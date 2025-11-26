// src/features/auth/pages/AdminLoginPage.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

import Login from '../components/Login';
import useAuthInfo from '../hooks/useAuthInfo';

const AdminLoginPage: React.FC = () => {
  const { isAuthenticated, canAccessAdmin, isCliente } = useAuthInfo();

  if (isAuthenticated) {
    if (canAccessAdmin) {
      return <Navigate to="/admin/home" replace />;
    }
    if (isCliente) {
      return <Navigate to="/" replace />;
    }
  }

  return <Login mode="admin" />;
};

export default AdminLoginPage;
