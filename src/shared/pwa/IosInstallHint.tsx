// src/shared/pwa/IosInstallHint.tsx
import React, { useEffect, useState } from 'react';

const IOS_HINT_STORAGE_KEY = 'pwa-ios-hint-dismissed';

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Não precisamos mais do window.opera aqui; iOS detection via UA/vendor já resolve
  const ua = navigator.userAgent || navigator.vendor || '';

  return /iphone|ipad|ipod/i.test(ua);
}

interface NavigatorWithStandalone extends Navigator {
  // Safari iOS expõe essa flag quando está rodando em standalone
  standalone?: boolean;
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  const displayModeStandalone =
    window.matchMedia?.('(display-mode: standalone)').matches ?? false;

  const nav = window.navigator as NavigatorWithStandalone;
  const safariStandalone = nav.standalone === true;

  return displayModeStandalone || safariStandalone;
}

const IosInstallHint: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(IOS_HINT_STORAGE_KEY) === '1';

      if (isIos() && !isStandalone() && !dismissed) {
        setVisible(true);
      }
    } catch {
      // se der erro no localStorage, só não mostra
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    try {
      localStorage.setItem(IOS_HINT_STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-slate-900/95 px-4 py-3 text-white shadow-lg sm:left-auto sm:right-4 sm:w-80">
      <div className="flex items-start gap-3">
        <div className="mt-1 text-xl" aria-hidden>
          📲
        </div>
        <div className="flex-1 text-sm">
          <p className="font-semibold">Instalar este app</p>
          <p className="mt-1 text-xs text-slate-200">
            No iPhone, toque no botão{' '}
            <span className="font-semibold">Compartilhar</span> (ícone{' '}
            <span aria-hidden>⬆️</span>) e depois em{' '}
            <span className="font-semibold">“Adicionar à Tela de Início”</span>{' '}
            para instalar o aplicativo.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="ml-2 text-xs text-slate-300 hover:text-white"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default IosInstallHint;
