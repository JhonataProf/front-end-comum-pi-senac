import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCart from 'hooks/useCart';

import { PratoCarrinho } from 'context/cartContext';
import { useAsyncResource } from 'hooks/useAsyncResource';
import useSnackbar from 'hooks/useSnackbar';

import api from 'http/api';

import PageLayout from 'shared/layout/PageLayout';
import Snackbar from 'shared/feedback/Snackbar';
import PrimaryButton from 'shared/ui/PrimaryButton';
import SecondaryButton from 'shared/ui/SecondaryButton';

interface Prato {
  id: number;
  nome: string;
  cozinha: string;
  descricaoDetalhada: string;
  imagem: string;
  valor: number;
}

const DetalhesPrato: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { pratos: pratosNoCarrinho, adicionarPrato } = useCart();

  const { snackbar, showSuccess, showError, clearSnackbar } = useSnackbar(4000);

  // Carrega os detalhes do prato com useAsyncResource
  const {
    data: prato,
    loading,
    error,
  } = useAsyncResource<Prato | null>(
    async () => {
      if (!id) return null;
      const response = await api.get<Prato>(`/pratos/${id}`);
      return response.data;
    },
    {
      initialData: null,
      immediate: Boolean(id),
    },
  );

  const handleAddToCart = () => {
    if (!prato) return;

    try {
      const pratoExistente = pratosNoCarrinho?.find((p) => p.id === prato.id);

      let quantidade = 1;
      let pratoParaAdicionar: PratoCarrinho;

      if (pratoExistente) {
        pratoExistente.quantidade += 1;
        quantidade = pratoExistente.quantidade;
        pratoParaAdicionar = pratoExistente;
      } else {
        pratoParaAdicionar = {
          id: prato.id,
          nome: prato.nome,
          valor: prato.valor,
          quantidade: 1,
        } as PratoCarrinho;
      }

      adicionarPrato(pratoParaAdicionar);

      showSuccess(
        `Prato "${prato.nome}" foi adicionado ao carrinho! Quantidade: ${quantidade}`,
      );
    } catch (err) {
      console.error('Erro ao adicionar prato ao carrinho:', err);
      showError('Não foi possível adicionar o prato ao carrinho.');
    }
  };

  const temErroCarregamento = Boolean(error);

  return (
    <PageLayout
      title="Detalhes do prato"
      subtitle="Veja mais informações sobre sua escolha antes de adicioná-la ao carrinho."
    >
      {loading ? (
        // Skeleton de carregamento
        <section className="mt-4 flex justify-center">
          <div className="h-64 w-full max-w-3xl animate-pulse rounded-xl bg-slate-200" />
        </section>
      ) : temErroCarregamento ? (
        // Erro de carregamento
        <section className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível carregar os detalhes do prato. Tente novamente mais
          tarde.
        </section>
      ) : !prato ? (
        // Sem prato encontrado
        <section className="mt-6 text-center text-sm text-slate-600">
          Não encontramos detalhes para esse prato.
        </section>
      ) : (
        // Conteúdo normal
        <section className="mt-4 flex justify-center">
          <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            {/* Imagem + infos principais */}
            <div className="flex flex-col md:flex-row">
              <img
                src={prato.imagem}
                alt={`Imagem de ${prato.nome}`}
                className="h-56 w-full object-cover md:h-auto md:w-1/2"
                loading="lazy"
              />

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">
                  {prato.nome}
                </h1>

                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Cozinha:{' '}
                  <span className="font-semibold">{prato.cozinha}</span>
                </p>

                <p className="mt-3 text-sm font-semibold text-emerald-700 sm:text-base">
                  {prato.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </div>
            </div>

            {/* Descrição */}
            <div className="border-t border-slate-100 p-4 sm:p-6">
              <p className="text-sm font-semibold text-slate-900 sm:text-base">
                Descrição da experiência gastronômica
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {prato.descricaoDetalhada}
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <SecondaryButton
                type="button"
                onClick={() => navigate(-1)}
                className="sm:w-auto"
              >
                Voltar
              </SecondaryButton>

              <PrimaryButton
                type="button"
                onClick={handleAddToCart}
                fullWidth
                className="sm:w-auto"
              >
                Adicionar ao carrinho
              </PrimaryButton>
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

export default DetalhesPrato;
