import {
  createUser,
  fetchUserById,
  updateUser,
  UserRole,
  UserVM,
} from 'bff/userBff';
import { useAsyncResource } from 'hooks/useAsyncResource';
import React, { JSX, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from 'shared/feedback/Snackbar';
import FormField from 'shared/ui/FormField';
import PrimaryButton from 'shared/ui/PrimaryButton';
import SecondaryButton from 'shared/ui/SecondaryButton';

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

interface UserFormParams extends Record<string, string | undefined> {
  id?: string;
}

interface UserFormProps {
  isEditing?: boolean;
}

function UserForm({ isEditing = false }: UserFormProps): JSX.Element {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams<UserFormParams>();

  const {
    data: user,
    setData: setUser,
    loading,
  } = useAsyncResource<UserVM | null>(
    async () => {
      if (!id) return null;
      return await fetchUserById(id);
    },
    {
      initialData: null,
    },
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validações bem simples (se quiser podemos plugar useForm depois)
    if (
      !user?.nome.trim() ||
      !user?.email.trim() ||
      (!isEditing && !user?.password?.trim())
    ) {
      setSnackbar({
        message: 'Preencha todos os campos obrigatórios.',
        type: 'warning',
        duration: 5000,
      });
      return;
    }

    try {
      setSubmitting(true);

      const { nome: name, email, password } = user || {};
      const method = isEditing
        ? updateUser(id!, {
            nome: name,
            email,
            senha: password || undefined,
          })
        : createUser({
            nome: name,
            email,
            senha: password!,
            role: UserRole.CLIENTE,
          });

      await method;

      setSnackbar({
        message: isEditing
          ? 'Usuário atualizado com sucesso'
          : 'Usuário criado com sucesso',
        type: 'success',
        duration: 6000,
      });

      navigate('/admin/usuarios');
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setSnackbar({
        message: axiosError.response?.data?.message || 'Erro na requisição',
        type: 'error',
        duration: 10000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:p-6"
      >
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
          {isEditing ? 'Editar usuário' : 'Criar usuário'}
        </h2>

        {loading && isEditing && (
          <p className="text-xs text-slate-500">
            Carregando dados do usuário...
          </p>
        )}

        <FormField
          label="Nome"
          type="text"
          placeholder="Digite o nome do usuário"
          value={user?.nome || ''}
          onChange={(e) => setUser({ ...user!, nome: e.target.value })}
        />

        <FormField
          label="E-mail"
          type="email"
          placeholder="Digite o e-mail do usuário"
          value={user?.email || ''}
          onChange={(e) => setUser({ ...user!, email: e.target.value })}
        />

        {!isEditing && (
          <FormField
            label="Senha"
            type="password"
            placeholder="Crie uma senha para o usuário"
            value={user?.password || ''}
            onChange={(e) => setUser({ ...user!, password: e.target.value })}
          />
        )}

        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton
            type="button"
            onClick={() => navigate('/admin/usuarios')}
            fullWidth
            className="sm:w-auto"
            disabled={submitting}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            fullWidth
            className="sm:w-auto"
            disabled={submitting || (loading && isEditing)}
          >
            {submitting
              ? isEditing
                ? 'Salvando...'
                : 'Criando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Criar usuário'}
          </PrimaryButton>
        </div>
      </form>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() => setSnackbar({ message: '', type: 'info', duration: 0 })}
      />
    </div>
  );
}

export default UserForm;
