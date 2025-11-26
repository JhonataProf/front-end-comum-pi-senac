// src/app/routes.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';


import PublicLayout from 'shared/layout/PublicLayout';
import RestrictedLayout from 'features/admin/layout/RestrictedLayout';

import HomeCliente from 'features/menu/pages/HomeCliente';
import DetalhesPrato from 'features/menu/pages/DetalhesPrato';
import ShoppingCart from 'features/cart/pages/ShoppingCart';

import AdminLoginPage from 'features/auth/pages/AdminLoginPage';
import UserForm from 'features/admin/components/UserForm';
import ClientLoginPage from 'features/auth/pages/ClienteLoginPage';
import ProtectedRoute from 'shared/routing/ProtectedRoute';
import Home from 'features/admin/pages/AdminHomePage';
import FormularioPrato from 'features/admin/pages/PratoFormPage';
import UserManagementPage from 'features/admin/pages/UserManagementPage';
import OrderManagementPage from 'features/admin/pages/OrderManagementPage';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: '/login',
    element: <ClientLoginPage />,
  },
  {
    path: '/login-admin',
    element: <AdminLoginPage />,
  },
  // rotas públicas com PublicLayout
  {
    path: '',
    element: (
      <PublicLayout />
    ),
    children: [
      {
        path: '',
        element: <HomeCliente />,
      },
      {
        path: '/detalhes/:id',
        element: <DetalhesPrato />,
      },
      {
        path: '/carrinho',
        element: <ShoppingCart />,
      },
    ],
  },
  // rotas admin protegidas
  {
    path: '/admin',
    element: <ProtectedRoute />, // já usa useAuthInfo e verifica canAccessAdmin
    children: [
      {
        path: '',
        element: <RestrictedLayout />,
        children: [
          {
            path: '',
            element: <Navigate to="home" replace />,
          },
          {
            path: 'home',
            element: <Home />,
          },
          {
            path: 'novo-prato',
            element: <FormularioPrato />,
          },
          {
            path: 'detalhes-prato/:id',
            element: <FormularioPrato />,
          },
          {
            path: 'usuarios',
            element: <UserManagementPage />,
          },
          {
            path: 'usuarios/novo',
            element: <UserForm />,
          },
          {
            path: 'usuarios/editar/:id',
            element: <UserForm isEditing />,
          },
          {
            path: 'pedidos',
            element: <OrderManagementPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default routes;
