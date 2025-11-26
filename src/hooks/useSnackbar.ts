import { useCallback, useState } from 'react';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarState {
  message: string;
  type: SnackbarType;
  duration: number;
}

const defaultState: SnackbarState = {
  message: '',
  type: 'info',
  duration: 0,
};

export function useSnackbar(defaultDuration = 3000) {
  const [snackbar, setSnackbar] = useState<SnackbarState>(defaultState);

  const showSnackbar = useCallback(
    (message: string, type: SnackbarType = 'info', duration?: number) => {
      setSnackbar({
        message,
        type,
        duration: duration ?? defaultDuration,
      });
    },
    [defaultDuration],
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) =>
      showSnackbar(message, 'success', duration),
    [showSnackbar],
  );

  const showError = useCallback(
    (message: string, duration?: number) =>
      showSnackbar(message, 'error', duration),
    [showSnackbar],
  );

  const showWarning = useCallback(
    (message: string, duration?: number) =>
      showSnackbar(message, 'warning', duration),
    [showSnackbar],
  );

  const showInfo = useCallback(
    (message: string, duration?: number) =>
      showSnackbar(message, 'info', duration),
    [showSnackbar],
  );

  const clearSnackbar = useCallback(() => {
    setSnackbar(defaultState);
  }, []);

  return {
    snackbar,
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearSnackbar,
  };
}

export default useSnackbar;
