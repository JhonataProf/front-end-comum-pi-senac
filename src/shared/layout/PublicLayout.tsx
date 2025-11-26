import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import UserMenu from '../ui/UserMenu';
import CartIconButton from '../ui/CartIconButton';
import useCart from 'hooks/useCart';

const PublicLayout: React.FC = () => {
  const { totalItens } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        {/* Logo / Home link */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/"
            className="text-base font-semibold text-slate-900 sm:text-lg"
          >
            Meu Restaurante
          </NavLink>
        </div>

        {/* Ações à direita */}
        <div className="flex items-center gap-3">
          <CartIconButton to="/carrinho" count={totalItens} />
          <UserMenu />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
