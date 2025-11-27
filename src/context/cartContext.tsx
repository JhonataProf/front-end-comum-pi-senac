// src/context/cartContext.tsx
import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

export interface PratoCarrinho {
  id: number;
  quantidade: number;
  nome: string;
  valor: number;
}

interface CartContextType {
  pratos: PratoCarrinho[];
  adicionarPrato: (prato: PratoCarrinho) => void;
  removerPrato: (pratoId: number) => void;
  clearCart: () => void;
  totalCompra: number;
}

const CART_STORAGE_KEY = 'cart-items';

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [pratos, setPratos] = useState<PratoCarrinho[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as PratoCarrinho[]) : [];
    } catch {
      return [];
    }
  });

  // persiste no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(pratos));
    } catch {
      // ignora em modo privado, etc.
    }
  }, [pratos]);

  const adicionarPrato = useCallback((prato: PratoCarrinho) => {
    setPratos((prev) => {
      const lista = prev ?? [];
      const idx = lista.findIndex((p) => p.id === prato.id);

      // não existe ainda → adiciona
      if (idx === -1) {
        return [...lista, prato];
      }

      // aqui tratamos `prato.quantidade` como quantidade “final” (absoluta)
      const quantidadeFinal = prato.quantidade;

      // se quantidade <= 0, removemos o item
      if (quantidadeFinal <= 0) {
        return lista.filter((p) => p.id !== prato.id);
      }

      // atualiza quantidade
      return lista.map((p) =>
        p.id === prato.id ? { ...p, quantidade: quantidadeFinal } : p,
      );
    });
  }, []);

  const removerPrato = (pratoId: number) => {
    setPratos((prev) => prev.filter((p) => p.id !== pratoId));
  };

  const clearCart = () => {
    setPratos([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const totalCompra =
    pratos.reduce((sum, dish) => sum + dish.valor * dish.quantidade, 0) || 0;

  return (
    <CartContext.Provider
      value={{ pratos, adicionarPrato, removerPrato, clearCart, totalCompra }}
    >
      {children}
    </CartContext.Provider>
  );
};
