import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../views/Login';
import Home from '../views/Home';
import UserManagement from '../views/UserManagement';
import UserForm from '../views/UserForm';
import ProtectedRoute from '../ProtectedRoute';
import RestrictedLayout from '../layout/RestrictedLayout';
import ShoppingCart from '../components/ShoppingCart';
import HomeCliente from '../components/HomeCliente';
import DetalhesPrato from '../components/DetalhesPrato';
import FormularioPrato from '../components/FormularioPrato';
import { AuthProvider } from '../context/authContext';
import { CartProvider } from '../context/cartContext';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: 'cardapio',
    element: (
      <CartProvider>
        <HomeCliente />
      </CartProvider>
    ),
  },
  {
    path: '/detalhes/:id',
    element: (
      <CartProvider>
        <DetalhesPrato />
      </CartProvider>
    ),
  },
  {
    path: '/carrinho',
    element: (
      <CartProvider>
        <ShoppingCart />
      </CartProvider>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'admin',
        element: (
          <AuthProvider>
            <RestrictedLayout />
          </AuthProvider>
        ),
        children: [
          {
            path: '',
            element: <Navigate to="home" replace />,
          },
          {
            path: 'novo-prato',
            element: <FormularioPrato />,
          },
          {
            path: 'detalhes-prato/:id',
            element: <FormularioPrato isEditing />,
          },
          {
            path: 'home',
            element: <Home />,
          },
          {
            path: 'usuarios',
            element: <UserManagement />,
          },
          {
            path: 'usuarios/novo',
            element: <UserForm />,
          },
          {
            path: 'usuarios/editar/:id',
            element: <UserForm isEditing />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/cardapio" replace />,
  },
];

export default routes;
