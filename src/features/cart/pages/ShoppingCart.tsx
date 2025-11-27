// src/components/ShoppingCart.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Snackbar from 'shared/feedback/Snackbar';
import PhoneField from 'shared/form/PhoneField'; // ajuste o caminho se estiver diferente
import PageLayout from 'shared/layout/PageLayout';
import EmptyState from 'shared/ui/EmptyState';
import PrimaryButton from 'shared/ui/PrimaryButton';
import SecondaryButton from 'shared/ui/SecondaryButton';

import useCart from 'hooks/useCart';
import useSnackbar from 'hooks/useSnackbar';

const ShoppingCart: React.FC = () => {
  const navigate = useNavigate();

  const { pratos, adicionarPrato, removerPrato, totalCompra, clearCart } =
    useCart();

  const [address, setAddress] = useState<string>('');
  const [paymentInfo, setPaymentInfo] = useState<string>('');
  const [phone, setPhone] = useState<string>(''); // armazenando só dígitos

  const { snackbar, showError, showSuccess, clearSnackbar } = useSnackbar(4000);

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity > 0) {
      const pratoExists = pratos?.find((prato) => prato.id === id);
      if (!pratoExists) return;

      const updated = { ...pratoExists, quantidade: quantity };
      adicionarPrato(updated);
      return;
    }

    removerPrato(id);
  };

  const handleConfirmOrder = () => {
    if (!pratos || pratos.length === 0) {
      showError(
        'Seu carrinho está vazio. Adicione algum prato antes de confirmar.',
      );
      return;
    }

    if (!phone || phone.length < 10) {
      showError('Informe um telefone válido para contato.');
      return;
    }

    if (!address.trim()) {
      showError('Informe o endereço de entrega.');
      return;
    }

    if (!paymentInfo.trim()) {
      showError('Informe os dados de pagamento.');
      return;
    }

    // aqui no futuro: chamada para API de criação de pedido
    console.log('Confirmando pedido com dados:', {
      phone,
      address,
      paymentInfo,
      itens: pratos,
      total: totalCompra,
    });

    showSuccess('Pedido confirmado com sucesso!');

    // futuramente: navegar para tela de resumo / acompanhamento
    // navigate('/pedido/confirmado');
  };

  const hasItems = pratos && pratos.length > 0;

  return (
    <PageLayout
      title="Carrinho de compras"
      subtitle="Revise seus itens e informe seus dados de entrega e pagamento."
    >
      {!hasItems ? (
        <section className="mt-4">
          <EmptyState
            title="Seu carrinho está vazio"
            description="Você ainda não adicionou nenhum prato. Volte ao cardápio para escolher suas opções favoritas."
            actions={
              <SecondaryButton
                type="button"
                onClick={() => navigate('/')}
                className="mt-2"
              >
                Voltar ao cardápio
              </SecondaryButton>
            }
          />
        </section>
      ) : (
        <section className="mt-4 flex flex-col gap-6 lg:flex-row">
          {/* Dados do cliente e pagamento */}
          <div className="flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Dados do cliente
              </h2>
              <SecondaryButton
                type="button"
                onClick={() => navigate(-1)}
                className="hidden sm:inline-flex"
              >
                Voltar
              </SecondaryButton>
            </div>

            {/* Telefone */}
            <div className="mb-4">
              <PhoneField
                label="Telefone celular"
                value={phone}
                onChange={setPhone}
                placeholder="(00) 90000-0000"
                required
              />
            </div>

            {/* Endereço */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Endereço de entrega
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100"
                rows={3}
                placeholder="Rua, número, complemento, bairro, cidade..."
              />
            </div>

            {/* Pagamento */}
            <h2 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl">
              Pagamento
            </h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Informações de pagamento
              </label>
              <input
                type="text"
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100"
                placeholder="Ex.: pagamento em dinheiro, PIX, cartão na entrega..."
              />
            </div>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-900">
              <span>Total</span>
              <span>
                {totalCompra.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <SecondaryButton
                type="button"
                onClick={clearCart}
                disabled={!pratos.length}
              >
                Esvaziar carrinho
              </SecondaryButton>

              <PrimaryButton
                type="button"
                onClick={handleConfirmOrder}
                fullWidth
              >
                Confirmar pedido (
                {totalCompra.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                )
              </PrimaryButton>
            </div>

            {/* Botão voltar (mobile) */}
            <SecondaryButton
              type="button"
              onClick={() => navigate(-1)}
              className="mt-3 w-full sm:hidden"
            >
              Voltar
            </SecondaryButton>
          </div>

          {/* Lista de itens do carrinho */}
          <div className="flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">
              Itens do carrinho
            </h2>

            <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {pratos?.map((prato) => (
                <div
                  key={prato.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0"
                >
                  <div className="pr-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {prato.nome}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {prato.valor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(prato.id, prato.quantidade - 1)
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={prato.quantidade}
                      onChange={(e) =>
                        handleQuantityChange(
                          prato.id,
                          Number(e.target.value) || 0,
                        )
                      }
                      className="w-14 rounded border border-slate-300 px-2 py-1 text-center text-sm"
                      min={0}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(prato.id, prato.quantidade + 1)
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={clearSnackbar}
      />
    </PageLayout>
  );
};

export default ShoppingCart;
