// src/hooks/useAuthInfo.ts
import useAuth from './useAuth';
import type { Role } from 'domain/usuario';

export function useAuthInfo() {
  const { usuario, verificarLogin } = useAuth();

  const isAuthenticated = Boolean(usuario);
  const role = usuario?.role as Role | undefined;
  const email = usuario?.email ?? null;

  const isGerente = role?.toUpperCase() === 'GERENTE';
  const isFuncionario = role?.toUpperCase() === 'FUNCIONARIO';
  const isCliente = role?.toUpperCase() === 'CLIENTE';

  // regras de acesso
  const canAccessAdmin = isGerente || isFuncionario;
  const canAccessClientArea = isCliente || isGerente || isFuncionario;

  return {
    usuario,
    email,
    role,
    isAuthenticated,
    isGerente,
    isFuncionario,
    isCliente,
    canAccessAdmin,
    canAccessClientArea,
    verificarLogin,
  };
}

export type UseAuthInfoReturn = ReturnType<typeof useAuthInfo>;

export default useAuthInfo;
