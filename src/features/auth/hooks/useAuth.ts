// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from 'context/authContext';

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth deve ser usado dentro de um AuthProvider. ' +
        'Verifique se o componente está envolvido por <AuthProvider> nas rotas.',
    );
  }

  return ctx;
}

// Tipo utilitário caso você queira tipar props de componentes que recebem o retorno do hook
export type UseAuthReturn = ReturnType<typeof useAuth>;

export default useAuth;
