import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useForm from '../hooks/useForm';
import api from '../http/api';
import Prato from '../interface/Prato';
import Snackbar from './Snackbar';

export interface PratoFormProps {
  isEditing?: boolean; // Indica se o formulário está no modo de edição
}

interface PratoFormParams extends Record<string, string | undefined> {
  id?: string; // ID do usuário, opcional
}

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

const FormularioPrato: React.FC<PratoFormProps> = ({ isEditing = false }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });
  const defaultPratoValues = {
    nome: '',
    cozinha: '',
    descricao_resumida: '',
    descricao_detalhada: '',
    imagem: '',
    valor: 0,
  };
  const { values, errors, handleChange, validate, updateValues } =
    useForm(defaultPratoValues);

  const { id } = useParams<PratoFormParams>();

  useEffect(() => {
    if (isEditing && id) {
      // Busca os dados do usuário para edição
      const fetchUser = async () => {
        try {
          const response = await api.get(`/pratos/${id}`);
          const {
            nome,
            cozinha,
            descricao_detalhada,
            descricao_resumida,
            imagem,
            valor,
          } = response.data;
          updateValues({
            nome,
            cozinha,
            descricao_detalhada,
            descricao_resumida,
            imagem,
            valor,
          });
        } catch {
          setSnackbar({
            message: 'Erro ao carregar os dados do prato.',
            type: 'error',
            duration: 10000,
          });
        }
      };

      fetchUser();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validate({
      nome: (value) => (!value ? 'O nome é obrigatório.' : null),
      cozinha: (value) => (!value ? 'A cozinha é obrigatória.' : null),
      descricao_resumida: (value) =>
        !value ? 'A descrição resumida é obrigatória.' : null,
      descricao_detalhada: (value) =>
        !value ? 'A descrição detalhada é obrigatória.' : null,
      valor: (value) =>
        !value || isNaN(Number(value))
          ? 'O valor deve ser um número válido.'
          : null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      imagem: (value) => {
        return null;
      },
    });

    if (isValid) {
      try {
        await api.post<Prato[]>('/pratos', values);
        setSnackbar({
          message: 'Prato cadastrado com sucesso!',
          type: 'success',
          duration: 10000,
        });
        updateValues(defaultPratoValues);
      } catch (error) {
        console.error('Erro ao cadastrar o prato:', error);
        setSnackbar({
          message: 'Erro ao cadastrar o prato. Tente novamente.',
          type: 'error',
          duration: 10000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Cadastrar Novo Prato
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagem do Prato
          </label>
          <input
            type="text"
            name="imagem"
            value={values.imagem}
            onChange={handleChange('imagem')}
            placeholder="Cole a url da imagem do prato"
            className={`w-full border rounded p-2 ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.imagem && (
            <p className="text-red-500 text-sm">{errors.imagem}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Prato
          </label>
          <input
            type="text"
            name="nome"
            value={values.nome}
            onChange={handleChange('nome')}
            placeholder="Digite o nome do prato"
            className={`w-full border rounded p-2 ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cozinha
          </label>
          <input
            type="text"
            name="cozinha"
            value={values.cozinha}
            onChange={handleChange('cozinha')}
            placeholder="Digite o tipo de cozinha"
            className={`w-full border rounded p-2 ${
              errors.cozinha ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.cozinha && (
            <p className="text-red-500 text-sm">{errors.cozinha}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição Resumida
          </label>
          <input
            type="text"
            name="descricao_resumida"
            value={values.descricao_resumida}
            onChange={handleChange('descricao_resumida')}
            placeholder="Digite a descrição resumida do prato"
            className={`w-full border rounded p-2 ${
              errors.descricao_resumida ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.descricao_resumida && (
            <p className="text-red-500 text-sm">{errors.descricao_resumida}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição Detalhada
          </label>
          <textarea
            name="descricao_detalhada"
            value={values.descricao_detalhada}
            onChange={handleChange('descricao_detalhada')}
            placeholder="Digite a descrição detalhada do prato"
            className={`w-full border rounded p-2 ${
              errors.descricao_detalhada ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
          />
          {errors.descricao_detalhada && (
            <p className="text-red-500 text-sm">{errors.descricao_detalhada}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor do Prato
          </label>
          <input
            type="text"
            name="valor"
            value={values.valor}
            onChange={handleChange('valor')}
            placeholder="Digite o valor do prato"
            className={`w-full border rounded p-2 ${
              errors.valor ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.valor && (
            <p className="text-red-500 text-sm">{errors.valor}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Cadastrar Prato
        </button>
      </form>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onClose={() => setSnackbar({ message: '', type: 'info', duration: 0 })}
      />
    </div>
  );
};

export default FormularioPrato;
