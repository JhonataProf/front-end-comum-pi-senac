import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsMountedRef } from './useIsMountedRef';

interface UseAsyncResourceOptions<T> {
  initialData?: T;
  immediate?: boolean;
}

export function useAsyncResource<T>(
  fetchFn: () => Promise<T>,
  { initialData, immediate = true }: UseAsyncResourceOptions<T> = {},
) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useIsMountedRef();

  // 🔐 guardamos a função mais recente em um ref
  const fetchFnRef = useRef(fetchFn);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFnRef.current();
      if (!isMountedRef.current) return;
      setData(result);
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [isMountedRef]);

  useEffect(() => {
    if (immediate) {
      run();
    }
  }, [immediate, run]);

  return {
    data,
    setData,
    loading,
    error,
    refetch: run,
  };
}
