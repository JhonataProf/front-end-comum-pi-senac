// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import useAuth from './hooks/useAuth';

// const ProtectedRoute: React.FC = () => {
//   const isAuthenticated = useAuth();
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
// ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // se o usuário não for admin ou gerente, redireciona pra área do cliente
  if (user?.role !== 'admin' && user?.role !== 'Gerente') {
    return <Navigate to="/cardapio" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
