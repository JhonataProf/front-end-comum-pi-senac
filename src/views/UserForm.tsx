import React, { JSX, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '../components/Snackbar';
import { useIsMounted } from '../hooks/useIsMounted';
import api from '../http/api';

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

interface UserFormParams extends Record<string, string | undefined> {
  id?: string; // ID do usuário, opcional
}

interface UserFormProps {
  isEditing?: boolean; // Indica se o formulário está no modo de edição
}

function UserForm({ isEditing = false }: UserFormProps): JSX.Element {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });

  const navigate = useNavigate();
  const isMounted = useIsMounted();
  const { id } = useParams<UserFormParams>();

  useEffect(() => {
    if (isEditing && id) {
      // Busca os dados do usuário para edição
      const fetchUser = async () => {
        try {
          const response = await api.get<{ nome: string; email: string }>(
            `/users/${id}`,
          );
          const { nome, email: fetchedEmail } = response.data;
          setName(nome);
          setEmail(fetchedEmail);
        } catch {
          setSnackbar({
            message: 'Erro ao carregar os dados do usuário',
            type: 'error',
            duration: 10000,
          });
        }
      };

      if (isMounted()) {
        fetchUser();
      }
    }
  }, [id, isEditing, isMounted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = isEditing ? `/users/${id}` : '/users';
      const method = isEditing ? 'put' : 'post';
      const response = await api[method](url, {
        nome: name,
        email,
        senha: password,
      });

      if (response.status >= 200 && response.status < 300) {
        setSnackbar({
          message: isEditing
            ? 'Usuário atualizado com sucesso'
            : 'Usuário criado com sucesso',
          type: 'success',
          duration: 10000,
        });
        navigate('/admin/usuarios');
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setSnackbar({
        message: axiosError.response?.data?.message || 'Erro na requisição',
        type: 'error',
        duration: 10000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 mb-3 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 mb-3 border rounded"
        required
      />
      {!isEditing && (
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />
      )}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
      >
        {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
      </button>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() => setSnackbar({ message: '', type: 'info', duration: 0 })}
      />
    </form>
  );
}

export default UserForm;
