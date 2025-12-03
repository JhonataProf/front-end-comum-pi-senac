// src/serviceWorkerRegistration.ts
export function register() {
  if (
    process.env.REACT_APP_NODE_ENV === 'production' &&
    'serviceWorker' in navigator
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[PWA] SW registrado:', registration);
        })
        .catch((error) => {
          console.error('[PWA] Erro ao registrar SW:', error);
        });
    });
  }
}
