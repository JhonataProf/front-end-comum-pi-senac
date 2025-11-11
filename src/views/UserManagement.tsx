import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabelaJS from '../components/TabelaJS';
import { useIsMounted } from '../hooks/useIsMounted';
import api from '../http/api';

interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const isMounted = useIsMounted();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('/api/users'); // Substitua pela URL correta da sua API
        const response = await api.get<User[]>('/users/');
        if (!response.status.toString().startsWith('2')) {
          throw new Error('Erro ao buscar os usuários');
        }
        const data: User[] = response.data;
        setUsers(data);
      } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isMounted()) {
      fetchData();
    }
  }, [isMounted]);

  const handleEdit = (user: User) => {
    navigate(`/admin/usuarios/editar/${user.id}`);
  };

  const handleDelete = async (user: User) => {
    try {
      const response = await api.delete(`/users/${user.id}`);
      console.log('Usuário deletado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
    }
    console.log(`Deletar usuário com ID: ${user.id}`);
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
  };

  const handleView = (user: User) => {
    navigate(`/admin/usuarios/editar/${user.id}`);
  };

  const columns: (keyof User | 'Ações')[] = ['nome', 'email', 'role', 'Ações'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
        <button
          type="button"
          onClick={() => navigate('/users/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Usuário
        </button>
      </div>
      {loading ? (
        <p className="text-center">Carregando usuários...</p>
      ) : (
        <TabelaJS
          columns={columns}
          data={users}
          actions={{
            edit: handleEdit,
            delete: handleDelete,
            view: handleView,
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
