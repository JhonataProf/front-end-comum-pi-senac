import React, { ReactNode, useEffect } from 'react';
import { redirect } from 'react-router';
import PageLayout from 'shared/layout/PageLayout';
import useAuth from '../hooks/useAuth';

const ContentPage = (): ReactNode => (
  <div>
    <h2>Você saiu com sucesso.</h2>
    <p>Redirecionando para a página inicial...</p>
  </div>
);

export default function LogoutPage(): React.JSX.Element {
  // Limpa o token de autenticação e redireciona para a página inicial
  const { logout } = useAuth();
  useEffect(() => {
    const timer = setTimeout(() => {
      logout();
      redirect('/admin');
    }, 2000); // redireciona após 2 segundos

    return () => clearTimeout(timer);
  }, []);
  return (
    <PageLayout title="Logout" subtitle="Saindo do sistema">
      <ContentPage />
    </PageLayout>
  );
}
