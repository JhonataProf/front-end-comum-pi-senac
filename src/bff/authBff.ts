// src/bff/authBff.ts
import api from 'http/api';
import Usuario, { Role } from 'domain/usuario';
import { parseJwtPayload } from 'utils/auth';

export interface LoginResult {
  token: string;
  refreshToken: string;
  usuario: Usuario;
}

interface LoginApiResponse {
  token: string;
  refreshToken: string;
  message?: string;
}

// função base para login na API
async function loginBase(email: string, senha: string): Promise<LoginResult> {
  const response = await api.post<LoginApiResponse>('/login', {
    email,
    senha,
  });

  const { token, refreshToken } = response.data;

  // persiste tokens
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);

  // decodifica payload do JWT
  const parsed = parseJwtPayload(token);
  const payload = parsed?.payload;

  const role = (payload?.role as Role) ?? 'CLIENTE';
  const usuario: Usuario = {
    id: String(payload?.sub ?? ''),
    email: payload?.email,
    role,
  };

  return { token, refreshToken, usuario };
}

/**
 * Login para área ADMIN (GERENTE / FUNCIONARIO)
 */
export async function loginAdmin(
  email: string,
  senha: string,
): Promise<LoginResult> {
  const result = await loginBase(email, senha);

  if (result.usuario.role === 'CLIENTE') {
    // cliente tentando logar no admin → bloqueia
    throw new Error('Acesso restrito. Use o login de cliente.');
  }

  return result;
}

/**
 * Login para CLIENTE.
 * Aqui aceitamos apenas role CLIENTE.
 */
export async function loginCliente(
  email: string,
  senha: string,
): Promise<LoginResult> {
  const result = await loginBase(email, senha);

  if (result.usuario.role !== 'CLIENTE') {
    // colaborador tentando entrar com login de cliente
    throw new Error('Apenas clientes podem usar este acesso.');
  }

  return result;
}
