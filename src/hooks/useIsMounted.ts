import { useCallback, useEffect, useRef } from "react";

export function useIsMounted() {
    const isMountedRef = useRef(true);
  
    // A função é memorizada para evitar recriação desnecessária
    const isMounted = useCallback(() => isMountedRef.current, []);
  
    // UseEffect para gerenciar o ciclo de vida de montagem/desmontagem
    useEffect(() => {
      // A função de limpeza é executada quando o componente é desmontado
      return () => {
        isMountedRef.current = false;
      };
    }, []); // O array vazio garante que o efeito rode apenas uma vez (na montagem)
  
    return isMounted;
  }
  