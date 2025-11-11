import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIsMounted } from '../hooks/useIsMounted';
import api from '../http/api';
// import api from '../http/api';

interface Prato {
  id: number;
  nome: string;
  cozinha: string;
  descricaoDetalhada: string;
  imagem: string;
  valor: number;
}

const DetalhesPrato: React.FC = () => {
  const isMounted = useIsMounted();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prato, setPrato] = useState<Prato | null>(null);

  async function fetchPratoDetails(id: string): Promise<Prato> {
    const response = await api.get<Prato>(`/pratos/${id}`);
    return response.data;
  }

  useEffect(() => {
    const fetchPrato = async () => {
      try {
        const response = await fetchPratoDetails(id!);
        setPrato(response);
      } catch (error) {
        console.error('Erro ao buscar os detalhes do prato:', error);
      }
    };

    if (id && isMounted()) {
      fetchPrato();
    }
  }, [id, isMounted]);

  const handleAddToCart = () => {
    console.log(`Prato ${prato?.nome} adicionado ao carrinho!`);
    alert(`Prato "${prato?.nome}" foi adicionado ao carrinho!`);
  };

  if (!prato) {
    return <p className="text-center mt-10">Carregando detalhes do prato...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Imagem e informações principais */}
        <div className="flex flex-col md:flex-row">
          <img
            src={prato.imagem}
            alt={`Imagem de ${prato.nome}`}
            className="w-full md:w-1/2 h-64 object-cover"
          />
          <div className="p-6 flex-1">
            <h1 className="text-2xl font-bold mb-4">{prato.nome}</h1>
            <p className="text-sm text-gray-500 mb-2">
              <strong>Cozinha:</strong> {prato.cozinha}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Valor:</strong> R$ {prato?.valor?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Descrição detalhada */}
        <div className="p-6">
          <p className="text-lg font-semibold mb-2">
            Descrição da sua experiência gastronômica:
          </p>
          <p className="text-gray-700">{prato.descricaoDetalhada}</p>
        </div>

        {/* Botões */}
        <div className="p-6 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Voltar
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesPrato;
