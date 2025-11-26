// src/components/HomeCliente.tsx
import React, { useEffect } from 'react';
import CardPrato from '../components/CardPrato';
import PageLayout from 'shared/layout/PageLayout';
import Snackbar from 'shared/feedback/Snackbar';
import EmptyState from 'shared/ui/EmptyState';

import useSnackbar from 'hooks/useSnackbar';
import useTable from 'hooks/useTable';

import { useAsyncResource } from 'hooks/useAsyncResource';
import { fetchPratosCliente, PratoClienteVM } from 'bff/pratoBff';

const HomeCliente: React.FC = () => {
  // Snackbar para erros da tela
  const { snackbar, showError, clearSnackbar } = useSnackbar(4000);

  // Busca de pratos na API
  const {
    data: pratosData,
    loading,
    error,
  } = useAsyncResource<PratoClienteVM[]>(fetchPratosCliente, {
    initialData: [],
  });

  // Filtro/busca no cardápio
  const {
    filteredData: pratos,
    searchTerm,
    handleSearch,
  } = useTable<PratoClienteVM>(pratosData || [], (prato, term) => {
    const search = term.toLowerCase();
    return (
      prato.nome.toLowerCase().includes(search) ||
      prato.cozinha.toLowerCase().includes(search) ||
      prato.descricaoCurta.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    if (error) {
      showError('Erro ao carregar os pratos. Tente novamente mais tarde.');
    }
  }, [error, showError]);

  const hasPratos = (pratos || []).length > 0;

  return (
    <PageLayout
      title="Cardápio"
      subtitle="Escolha seu prato favorito e adicione ao carrinho."
    >
      {/* Campo de busca (opcional mas ajuda muito na UX) */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Buscar por nome, cozinha ou descrição..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-xl rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100"
        />
      </div>

      {/* Conteúdo principal */}
      {loading ? (
        // Skeleton
        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-64 w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="h-64 w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="h-64 w-full animate-pulse rounded-xl bg-slate-200" />
        </section>
      ) : !hasPratos ? (
        // Estado vazio
        <section className="mt-6">
          <EmptyState
            title="Nenhum prato disponível no momento"
            description={
              (pratosData || []).length > 0
                ? 'Sua busca não encontrou resultados. Tente outro termo.'
                : 'O cardápio ainda está sendo montado. Volte em alguns instantes.'
            }
          />
        </section>
      ) : (
        // Grid de pratos
        <section className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pratos.map((prato) => (
              <CardPrato
                key={prato.id}
                id={prato.id}
                nome={prato.nome}
                cozinha={prato.cozinha}
                descricao_resumida={prato.descricaoCurta}
                imagem={prato.imagemUrl}
                valor={prato.valor}
              />
            ))}
          </div>
        </section>
      )}

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={clearSnackbar}
      />
    </PageLayout>
  );
};

export default HomeCliente;
