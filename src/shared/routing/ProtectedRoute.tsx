// src/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthInfo from 'features/auth/hooks/useAuthInfo';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, canAccessAdmin } = useAuthInfo();

  // Não logado → manda pro login de admin
  if (!isAuthenticated) {
    return <Navigate to="/login-admin" replace />;
  }

  // Logado, mas não tem permissão de admin (CLIENTE) → manda para a home pública
  if (!canAccessAdmin) {
    return <Navigate to="/" replace />;
  }

  // GERENTE ou FUNCIONARIO autenticado → pode acessar rotas /admin/*
  return <Outlet />;
};

export default ProtectedRoute;
