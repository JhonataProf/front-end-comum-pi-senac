import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabelaJS from '../components/TabelaJS';
import api from '../http/api';

interface Pedido {
  prato: string;
  valor: number;
  quantidade: number;
  total: number;
  status: string;
  id?: number;
}

const PedidoManagement: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Pedido[]>('/pedidos');
        if (!response.status.toString().startsWith('2')) {
          throw new Error('Erro ao buscar os pedidos');
        }
        const data: Pedido[] = response.data;
        setPedidos(data);
      } catch (error) {
        console.error('Erro ao buscar os pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (pedidos: Pedido) => {
    navigate(`/pedidos/edit/${pedidos.id}`);
  };

  const handleDelete = (pedidos: Pedido) => {
    console.log(`Deletar pedidos com ID: ${pedidos.id}`);
  };

  const handleView = (pedidos: Pedido) => {
    navigate(`/pedidos/details/${pedidos.id}`);
  };

  const columns: (keyof Pedido | 'Ações')[] = [
    'prato',
    'valor',
    'quantidade',
    'total',
    'status',
    'Ações',
  ];
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestão de Pedidos</h2>
        <button
          type="button"
          onClick={() => navigate('/admin/novo-pedido')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Pedido
        </button>
      </div>

      {loading ? (
        <p className="text-center">Carregando pedidos...</p>
      ) : (
        <TabelaJS
          columns={columns}
          data={pedidos}
          actions={{
            edit: handleEdit,
            delete: handleDelete,
            view: handleView,
          }}
        />
      )}
    </div>
  );
};

export default PedidoManagement;
