// src/serviceWorkerRegistration.ts
export function register() {
  if ('serviceWorker' in navigator) {
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
