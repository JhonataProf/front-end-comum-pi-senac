// src/views/UserManagementInner.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Snackbar from 'shared/feedback/Snackbar';
import TabelaJS from 'shared/table/TabelaJS';
import EmptyState from 'shared/ui/EmptyState';
import PrimaryButton from 'shared/ui/PrimaryButton';

import { useAsyncResource } from 'hooks/useAsyncResource';
import useSnackbar from 'hooks/useSnackbar';
import useTable from 'hooks/useTable';

import api from 'http/api';

interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
}

const UserManagementInner: React.FC = () => {
  const navigate = useNavigate();

  // Snackbar hook
  const { snackbar, showError, showSuccess, clearSnackbar } = useSnackbar(5000);

  // Carrega usuários da API
  const {
    data: users,
    setData: setUsers,
    loading,
    error,
    refetch,
  } = useAsyncResource<User[]>(
    async () => {
      const response = await api.get<User[]>('/users/');
      return response.data;
    },
    { initialData: [] },
  );

  // Busca / filtro na tabela
  const { filteredData, searchTerm, handleSearch } = useTable<User>(
    users || [],
    (user, term) => {
      const search = term.toLowerCase();
      return (
        user.nome.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
      );
    },
  );

  // Exibe erro de carregamento, se houver
  useEffect(() => {
    if (error) {
      showError('Erro ao buscar os usuários. Tente novamente.');
    }
  }, [error, showError]);

  const handleEdit = (user: User) => {
    navigate(`/admin/usuarios/editar/${user.id}`);
  };

  const handleDelete = async (user: User) => {
    try {
      const response = await api.delete(`/users/${user.id}`);
      console.log('Usuário deletado com sucesso:', response.data);

      setUsers((prev) => (prev || []).filter((u) => u.id !== user.id));
      showSuccess('Usuário removido com sucesso.');
    } catch (err) {
      console.error('Erro ao deletar o usuário:', err);
      showError('Erro ao deletar o usuário. Tente novamente.');
    }
  };

  const handleView = (user: User) => {
    navigate(`/admin/usuarios/editar/${user.id}`);
  };

  const columns: (keyof User | 'Ações')[] = ['nome', 'email', 'role', 'Ações'];

  return (
    <>
      {/* Header da página */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">
            Lista de usuários
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Gerencie usuários cadastrados no sistema.
          </p>
        </div>

        <PrimaryButton type="button" onClick={refetch} className="sm:w-auto">
          Recarregar
        </PrimaryButton>

        <PrimaryButton
          type="button"
          onClick={() => navigate('/admin/usuarios/novo')}
          className="sm:w-auto"
        >
          Novo usuário
        </PrimaryButton>
      </div>

      {/* Barra de busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou perfil..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100"
        />
      </div>

      {/* Conteúdo: loading, vazio ou tabela */}
      {loading ? (
        <div className="mt-6 space-y-2">
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
        </div>
      ) : (filteredData || []).length === 0 ? (
        <EmptyState
          title="Nenhum usuário encontrado"
          description={
            users && users.length > 0
              ? 'A sua busca não encontrou resultados. Tente outro termo.'
              : 'Ainda não há usuários cadastrados. Comece criando um novo usuário.'
          }
          actionLabel={
            users && users.length > 0 ? 'Limpar busca' : 'Criar usuário'
          }
          onAction={() => {
            if (users && users.length > 0) {
              handleSearch('');
            } else {
              navigate('/admin/usuarios/novo');
            }
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <TabelaJS
            columns={columns}
            data={filteredData}
            actions={{
              edit: handleEdit,
              delete: handleDelete,
              view: handleView,
            }}
          />
        </div>
      )}

      {/* Snackbar global da página */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={clearSnackbar}
      />
    </>
  );
};

export default UserManagementInner;
