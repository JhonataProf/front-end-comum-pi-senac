import React, { useEffect, useState } from 'react';
import useForm from '../hooks/useForm';
import { useParams } from 'react-router-dom';
import api from '../http/api';
import Snackbar from './Snackbar';

export interface PedidoFormProps {
  isEditing?: boolean;
}

interface Prato {
  id: number;
  nome: string;
  prato: string;
  valor: number;
}

interface PedidoFormParams extends Record<string, string | undefined> {
  id?: string;
}

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

const FormularioPedido: React.FC<PedidoFormProps> = ({ isEditing = false }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'success',
    duration: 0,
  });

  const [pratos, setPratos] = useState<Prato[]>([]);
  const { id } = useParams<PedidoFormParams>();

  const { values, errors, handleChange, updateValues } = useForm({
    pedidoId: '', // <--- adicionado
    pratoId: 0,
    nome: '',
    valor: 0,
    quantidade: 1,
    total: 0,
    status: '',
    telefone: '',
  });

  // Busca os pratos disponíveis
  useEffect(() => {
    const fetchPratos = async () => {
      try {
        const response = await api.get<Prato[]>('/pratos');
        setPratos(response.data);
      } catch (error) {
        setSnackbar({
          message: 'Erro ao carregar a lista de pratos.',
          type: 'error',
          duration: 4000,
        });
        console.error(error);
      }
    };
    fetchPratos();
  }, []);

  // Atualiza o total sempre que o valor ou quantidade mudam
  useEffect(() => {
    const novoTotal = Number(values.valor) * Number(values.quantidade);
    updateValues({ ...values, total: novoTotal });
  }, [values.valor, values.quantidade]);

  // Busca os dados do pedido caso seja edição
  useEffect(() => {
    if (isEditing && id) {
      const fetchPedido = async () => {
        try {
          const response = await api.get(`api/pedidos/${id}`);
          const pedido = response.data[0];
          updateValues({
            telefone: pedido.telefone,
            pedidoId: pedido.id,
            pratoId: pedido.pratoId,
            nome: pedido.nome,
            valor: pedido.valor,
            quantidade: pedido.quantidade,
            total: pedido.total,
            status: pedido.status,
          });
        } catch (error) {
          setSnackbar({
            message: 'Erro ao carregar os dados do pedido.',
            type: 'error',
            duration: 8000,
          });
          console.error(error);
        }
      };
      fetchPedido();
    }
  }, [id, isEditing]);

  // Atualiza valor ao selecionar um prato
  const handleSelectPrato = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pratoSelecionado = pratos.find(
      (p) => p.id === Number(e.target.value),
    );
    if (pratoSelecionado) {
      updateValues({
        ...values,
        pedidoId: values.pedidoId,
        pratoId: pratoSelecionado.id,
        nome: pratoSelecionado.nome, // ⬅️ preencher corretamente
        valor: pratoSelecionado.valor,
        quantidade: values.quantidade,
        total: Number(pratoSelecionado.valor) * Number(values.quantidade),
        status: values.status,
      });
    } else {
      updateValues({ ...values, valor: 0 });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(' laksjdçflaksjdçlf');
    e.preventDefault();

    // const isValid = validate({
    //   pedidoId: () => null,
    //   pratoId: (value) =>
    //     !value || Number(value) <= 0 ? 'O prato é obrigatório.' : null,
    //   nome: (value) => (!value ? 'O nome é obrigatório.' : null),
    //   valor: (value) =>
    //     !value || isNaN(Number(value))
    //       ? 'O valor deve ser um número válido.'
    //       : null,
    //   quantidade: (value) =>
    //     !value || Number(value) <= 0
    //       ? 'A quantidade deve ser um número positivo.'
    //       : null,
    //   status: (value) => (!value ? 'O status é obrigatório.' : null),
    //   total: () => null,
    //   telefone: (value) =>
    //     !value
    //       ? 'O número de telefone é obrigatório.'
    //       : !/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(value as string)
    //         ? 'Digite um número de telefone válido (ex: (11) 91234-5678).'
    //         : null,
    // });

    // console.log('Validação:', isValid, values);

    // if (!isValid) return;

    if (isEditing) {
      console.log('Pedido atualizado com sucesso:', values);
      setSnackbar({
        message: 'Pedido atualizado com sucesso!',
        type: 'success',
        duration: 4000,
      });
    } else {
      console.log('Pedido cadastrado com sucesso:', values);
      setSnackbar({
        message: 'Pedido cadastrado com sucesso!',
        type: 'success',
        duration: 4000,
      });
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      api
        .post('/pedidos', {
          usuarioId: user.id,
          clienteTelefone: values.telefone,
          itens: [
            {
              produtoId: values.pratoId,
              quantidade: values.quantidade,
              precoUnitario: values.valor,
              status: values.status,
            },
          ],
        })
        .catch((error) => {
          console.error('Erro ao cadastrar pedido:', error);
          setSnackbar({
            message: 'Erro ao cadastrar o pedido.',
            type: 'error',
            duration: 8000,
          });
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isEditing ? 'Editar Pedido' : 'Cadastrar Novo Pedido'}
        </h1>

        {/* Prato */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prato
          </label>
          <select
            value={values.pratoId || ''}
            onChange={handleSelectPrato}
            className={`w-full border rounded p-2 ${errors.prato ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Selecione o prato</option>
            {pratos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.prato} {p.nome}
              </option>
            ))}
          </select>
          {errors.prato && (
            <p className="text-red-500 text-sm">{errors.prato}</p>
          )}
        </div>

        {/* Valor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor Unitário (R$)
          </label>
          <input
            type="number"
            name="valor"
            value={values.valor}
            readOnly
            className="w-full border rounded p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Quantidade */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade
          </label>
          <input
            type="number"
            name="quantidade"
            value={values.quantidade}
            onChange={handleChange('quantidade')}
            className={`w-full border rounded p-2 ${errors.quantidade ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.quantidade && (
            <p className="text-red-500 text-sm">{errors.quantidade}</p>
          )}
        </div>

        {/* Total */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total (R$)
          </label>
          <input
            type="text"
            name="total"
            value={values.total.toFixed(2)}
            readOnly
            className="w-full border rounded p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
        {/* Telefone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone do Usuário
          </label>
          <input
            type="tel"
            name="telefone"
            value={values.telefone}
            onChange={handleChange('telefone')}
            placeholder="(11) 91234-5678"
            className={`w-full border rounded p-2 ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.telefone && (
            <p className="text-red-500 text-sm">{errors.telefone}</p>
          )}
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status do Pedido
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange('status')}
            className={`w-full border rounded p-2 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Selecione o status</option>
            <option value="Aguardando">Pago</option>
            <option value="Em preparo">Em preparo</option>
            <option value="Entregue">Enviado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {isEditing ? 'Salvar Alterações' : 'Cadastrar Pedido'}
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

export default FormularioPedido;
