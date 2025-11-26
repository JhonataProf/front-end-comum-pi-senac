// src/features/auth/pages/ClientLoginPage.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

import Login from '../components/Login';
import useAuthInfo from '../hooks/useAuthInfo';

const ClientLoginPage: React.FC = () => {
  const { isAuthenticated, isCliente, canAccessAdmin } = useAuthInfo();

  if (isAuthenticated) {
    if (isCliente) {
      return <Navigate to="/" replace />; // ou '/meus-pedidos'
    }
    if (canAccessAdmin) {
      return <Navigate to="/admin/home" replace />;
    }
  }

  return <Login mode="client" />;
};

export default ClientLoginPage;
