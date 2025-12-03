// src/app/App.tsx (ajuste o caminho conforme sua estrutura)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes, { RouteConfig } from './routes';
import { AuthProvider } from 'context/authContext';
import { CartProvider } from 'context/cartContext';
import IosInstallHint from 'shared/pwa/IosInstallHint';

const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <IosInstallHint />
      <CartProvider>
        <Router>
          <Routes>{renderRoutes(routes)}</Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
