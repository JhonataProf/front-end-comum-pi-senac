// src/context/authContext.tsx
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

import Usuario, { Role } from 'domain/usuario'; // ajuste o caminho se estiver diferente
import { parseJwtPayload } from 'utils/auth';

export interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (
    usuario: Usuario,
    tokens?: { token?: string; refreshToken?: string },
  ) => void;
  logout: () => void;
  verificarLogin: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const AUTH_TOKEN_KEY = 'token';
const AUTH_REFRESH_TOKEN_KEY = 'refreshToken';

interface AuthProviderProps {
  children: ReactNode;
}

function clearAuthStorage() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Carrega o usuário a partir do token salvo, se existir
  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return;

      const parsed = parseJwtPayload(token);
      const payload = parsed?.payload;
      if (!payload) {
        clearAuthStorage();
        setUsuario(null);
        return;
      }

      const role = (payload.role as Role | string | undefined) ?? 'CLIENTE';

      const user: Usuario = {
        id: String(payload.sub ?? ''),
        email: payload.email,
        role: role as Role,
      };

      setUsuario(user);
      // if (isExpired) {
      //   // 🔎 Opcional: só log de debug, sem deslogar
      //   if (process.env.NODE_ENV === 'development') {
      //     console.warn('[AuthProvider] Token carregado está expirado. O refresh será tratado via interceptor quando a API retornar 401.');
      //   }
      // }
    } catch (error) {
      console.error('Erro ao inicializar AuthContext:', error);
      clearAuthStorage();
      setUsuario(null);
    }
  }, []);

  const login = useCallback(
    (
      user: Usuario,
      tokens?: { token?: string; refreshToken?: string },
    ) => {
      // Se o BFF ainda não salvou os tokens, podemos salvar aqui
      if (tokens?.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, tokens.token);
      }
      if (tokens?.refreshToken) {
        localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, tokens.refreshToken);
      }

      setUsuario(user);
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuthStorage();
    setUsuario(null);
  }, []);

  const verificarLogin = useCallback(() => {
    return Boolean(usuario);
  }, [usuario]);

  const isAuthenticated = Boolean(usuario);

  const value = useMemo<AuthContextType>(
    () => ({
      usuario,
      isAuthenticated,
      login,
      logout,
      verificarLogin,
    }),
    [usuario, isAuthenticated, login, logout, verificarLogin],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
