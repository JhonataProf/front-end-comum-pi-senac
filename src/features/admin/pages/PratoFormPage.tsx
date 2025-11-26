// src/components/FormularioPrato.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageLayout from 'shared/layout/PageLayout';
import Snackbar from 'shared/feedback/Snackbar';
import CurrencyField from 'shared/form/CurrencyField'; // ajuste o caminho se for diferente
import PrimaryButton from 'shared/ui/PrimaryButton';
import SecondaryButton from 'shared/ui/SecondaryButton';

import { useAsyncResource } from 'hooks/useAsyncResource';
import useForm from 'hooks/useForm';
import useSnackbar from 'hooks/useSnackbar';

import api from 'http/api';
import {Prato} from 'domain/prato';

interface PratoFormParams extends Record<string, string | undefined> {
  id?: string;
}

type PratoFormValues = {
  nome: string;
  cozinha: string;
  descricao_resumida: string;
  descricao_detalhada: string;
  imagem: string;
  valor: number | null; // ⬅️ antes era string
};

const defaultPratoValues: PratoFormValues = {
  nome: '',
  cozinha: '',
  descricao_resumida: '',
  descricao_detalhada: '',
  imagem: '',
  valor: null, // ⬅️ antes era ''
};

const FormularioPrato: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<PratoFormParams>();
  const isEditing = Boolean(id);

  const { snackbar, showSuccess, showError, clearSnackbar } = useSnackbar(5000);

  const { values, errors, handleChange, validate, updateValues } =
    useForm<PratoFormValues>(defaultPratoValues);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega prato para edição (quando tem id)
  const {
    data: pratoCarregado,
    loading: loadingPrato,
    error: errorPrato,
  } = useAsyncResource<Prato | null>(
    async () => {
      if (!id) return null;
      const response = await api.get<Prato>(`/pratos/${id}`);
      return response.data;
    },
    {
      initialData: null,
      immediate: isEditing,
    },
  );

  // Quando tiver prato carregado, sincroniza com o formulário
  useEffect(() => {
    if (pratoCarregado) {
      updateValues({
        nome: pratoCarregado.nome,
        cozinha: pratoCarregado.cozinha,
        descricao_resumida: pratoCarregado.descricao_resumida,
        descricao_detalhada: pratoCarregado.descricao_detalhada,
        imagem: pratoCarregado.imagem,
        valor: pratoCarregado.valor, // ⬅️ agora é number direto
      });
    }
  }, [pratoCarregado, updateValues]);

  // Erro ao carregar prato (edição)
  useEffect(() => {
    if (errorPrato && isEditing) {
      showError('Erro ao carregar os dados do prato para edição.');
    }
  }, [errorPrato, isEditing, showError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validate({
      nome: (value) => (!value ? 'O nome é obrigatório.' : null),
      cozinha: (value) => (!value ? 'A cozinha é obrigatória.' : null),
      descricao_resumida: (value) =>
        !value ? 'A descrição resumida é obrigatória.' : null,
      descricao_detalhada: (value) =>
        !value ? 'A descrição detalhada é obrigatória.' : null,
      valor: (value) => {
        const num =
          typeof value === 'number' ? value : Number(value as unknown);

        if (!num || Number.isNaN(num) || num <= 0) {
          return 'O valor deve ser um número válido.';
        }

        return null;
      },
      imagem: () => null,
    });

    if (!isValid) return;

    try {
      setIsSubmitting(true);

      const valorNormalizado =
        typeof values.valor === 'number' ? values.valor : 0;
      // ou só usar direto se validação já garante

      const payload = {
        nome: values.nome,
        cozinha: values.cozinha,
        descricao_resumida: values.descricao_resumida,
        descricao_detalhada: values.descricao_detalhada,
        imagem: values.imagem,
        valor: valorNormalizado,
      };

      if (isEditing && id) {
        await api.put<Prato>(`/pratos/${id}`, payload);
        showSuccess('Prato atualizado com sucesso!');
      } else {
        await api.post<Prato>('/pratos', payload);
        showSuccess('Prato cadastrado com sucesso!');
        updateValues(defaultPratoValues);
      }

      // Depois de salvar, volta para a lista (home admin)
      navigate('/admin/home');
    } catch (error) {
      console.error('Erro ao salvar o prato:', error);
      showError('Erro ao salvar o prato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isEditing && loadingPrato;

  return (
    <PageLayout
      title={isEditing ? 'Editar prato' : 'Cadastrar novo prato'}
      subtitle={
        isEditing
          ? 'Atualize as informações do prato já cadastrado.'
          : 'Preencha os campos abaixo para cadastrar um novo prato no cardápio.'
      }
    >
      {isLoading ? (
        <section className="mt-4 flex justify-center">
          <div className="h-64 w-full max-w-xl animate-pulse rounded-xl bg-slate-200" />
        </section>
      ) : (
        <section className="mt-4 flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            {/* Imagem */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Imagem do prato
              </label>
              <input
                type="text"
                name="imagem"
                value={values.imagem}
                onChange={handleChange('imagem')}
                placeholder="Cole a URL da imagem do prato"
                className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition ${
                  errors.imagem
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
                }`}
              />
              {errors.imagem && (
                <p className="mt-1 text-xs text-red-500">{errors.imagem}</p>
              )}
            </div>

            {/* Nome */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nome do prato
              </label>
              <input
                type="text"
                name="nome"
                value={values.nome}
                onChange={handleChange('nome')}
                placeholder="Digite o nome do prato"
                className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition ${
                  errors.nome
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
                }`}
              />
              {errors.nome && (
                <p className="mt-1 text-xs text-red-500">{errors.nome}</p>
              )}
            </div>

            {/* Cozinha */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Cozinha
              </label>
              <input
                type="text"
                name="cozinha"
                value={values.cozinha}
                onChange={handleChange('cozinha')}
                placeholder="Ex.: Brasileira, Italiana, Japonesa..."
                className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition ${
                  errors.cozinha
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
                }`}
              />
              {errors.cozinha && (
                <p className="mt-1 text-xs text-red-500">{errors.cozinha}</p>
              )}
            </div>

            {/* Descrição resumida */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Descrição resumida
              </label>
              <input
                type="text"
                name="descricao_resumida"
                value={values.descricao_resumida}
                onChange={handleChange('descricao_resumida')}
                placeholder="Resumo curto do prato"
                className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition ${
                  errors.descricao_resumida
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
                }`}
              />
              {errors.descricao_resumida && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.descricao_resumida}
                </p>
              )}
            </div>

            {/* Descrição detalhada */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Descrição detalhada
              </label>
              <textarea
                name="descricao_detalhada"
                value={values.descricao_detalhada}
                onChange={handleChange('descricao_detalhada')}
                placeholder="Descrição detalhada da experiência gastronômica"
                rows={4}
                className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition ${
                  errors.descricao_detalhada
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
                }`}
              />
              {errors.descricao_detalhada && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.descricao_detalhada}
                </p>
              )}
            </div>

            {/* Valor */}
            <div className="mb-4">
              <CurrencyField
                label="Valor do prato"
                value={values.valor}
                onChange={(valor) =>
                  updateValues({
                    ...values,
                    valor,
                  })
                }
                error={errors.valor}
                required
              />
            </div>

            {/* Ações */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <SecondaryButton
                type="button"
                onClick={() => navigate('/admin/home')}
                className="sm:w-auto"
              >
                Cancelar
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                disabled={isSubmitting}
                className="sm:w-auto"
              >
                {isSubmitting
                  ? isEditing
                    ? 'Salvando...'
                    : 'Cadastrando...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Cadastrar prato'}
              </PrimaryButton>
            </div>
          </form>
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

export default FormularioPrato;
