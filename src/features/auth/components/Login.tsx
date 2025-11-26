// src/features/auth/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Snackbar from 'shared/feedback/Snackbar';
import useForm from 'hooks/useForm';
import useSnackbar from 'hooks/useSnackbar';

import { loginAdmin, loginCliente } from 'bff/authBff';
import useAuth from '../hooks/useAuth';

type LoginMode = 'admin' | 'client';

interface LoginProps {
  mode: LoginMode;
}

const Login: React.FC<LoginProps> = ({ mode }) => {
  const { values, errors, handleChange, validate } = useForm({
    email: '',
    senha: '',
  });

  const { snackbar, showError, showSuccess, clearSnackbar } = useSnackbar(5000);

  const navigate = useNavigate();
  const { login } = useAuth(); // <- do AuthContext

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const isValid = validate({
      email: (value) => (!value ? 'O email é obrigatório.' : null),
      senha: (value) => (!value ? 'A senha é obrigatória.' : null),
    });

    if (!isValid) return;

    try {
      setIsSubmitting(true);

      const { email, senha } = values;

      const result =
        mode === 'admin'
          ? await loginAdmin(email, senha)
          : await loginCliente(email, senha);

      // Atualiza o AuthContext
      login(result.usuario, {
        token: result.token,
        refreshToken: result.refreshToken,
      });

      showSuccess(
        mode === 'admin'
          ? 'Login de administrador realizado com sucesso.'
          : 'Login de cliente realizado com sucesso.',
      );

      setTimeout(() => {
        if (mode === 'admin') {
          navigate('/admin/home');
        } else {
          navigate('/'); // ou "/meus-pedidos"
        }
      }, 800);
    } catch (error: unknown) {
      console.error(error);
      const msg =
        error instanceof Error
          ? error.message
          : 'Erro ao realizar login. Tente novamente.';
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="mb-4 text-center text-2xl font-bold">
          {mode === 'admin' ? 'Login Administrador' : 'Login do Cliente'}
        </h2>

        <div className="mb-4 w-full">
          <input
            type="text"
            placeholder="Email"
            value={values.email}
            onChange={handleChange('email')}
            className={`w-full rounded border p-2 ${
              errors.email
                ? 'border-red-500'
                : values.email
                  ? 'border-blue-500'
                  : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="mb-4 w-full">
          <input
            type="password"
            placeholder="Senha"
            value={values.senha}
            onChange={handleChange('senha')}
            className={`w-full rounded border p-2 ${
              errors.senha
                ? 'border-red-500'
                : values.senha
                  ? 'border-blue-500'
                  : 'border-gray-300'
            }`}
          />
          {errors.senha && (
            <p className="mt-1 text-xs text-red-500">{errors.senha}</p>
          )}
        </div>

        <button
          type="button"
          className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? mode === 'admin'
              ? 'Entrando como admin...'
              : 'Entrando...'
            : 'Entrar'}
        </button>
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={clearSnackbar}
      />
    </div>
  );
};

export default Login;
