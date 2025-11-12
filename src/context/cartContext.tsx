import React, { createContext, useState, ReactNode } from 'react';
import Prato from '../interface/Prato';

interface CartContextType {
  pratos: Prato[] | null;
  adicionarPrato: (prato: Prato) => void;
  removerPrato: (pratoId: number) => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [pratos, setPratos] = useState<Prato[] | null>(null);
  const adicionarPrato = (prato: Prato) => {
    setPratos((prevPratos) => (prevPratos ? [...prevPratos, prato] : [prato]));
  };
  const removerPrato = (pratoId: number) => {
    setPratos((prevPratos) =>
      prevPratos ? prevPratos.filter((p) => p.id !== pratoId) : null,
    );
  };
  return (
    <CartContext.Provider value={{ pratos, adicionarPrato, removerPrato }}>
      {children}
    </CartContext.Provider>
  );
};
