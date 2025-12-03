// src/hooks/useCart.ts
import { useContext, useMemo } from 'react';
import { CartContext } from '../context/cartContext';

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }

  const { pratos, adicionarPrato, removerPrato, clearCart, totalCompra } = ctx;

  const itens = pratos || [];

  const totalItens = useMemo(
    () => itens.reduce((acc, p) => acc + p.quantidade, 0),
    [pratos],
  );

  return {
    pratos: itens,
    adicionarPrato,
    removerPrato,
    clearCart,
    totalCompra,
    totalItens,
    isEmpty: pratos.length === 0,
  };
}

export default useCart;
