/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { CartContext } from '../context/cartContext';
import '../estilos/Home.css';
import { useIsMounted } from '../hooks/useIsMounted';
import api from '../http/api';
import Prato from '../interface/Prato';
import CardPrato from './CardPrato';

function HomeCliente() {
  const isMounted = useIsMounted();
  const [pratos, setPratos] = React.useState<Prato[] | []>([]);

  useEffect(() => {
    const fetchPratos = async () => {
      const response = await api.get<Prato[]>('/pratos');
      setPratos(response.data);
    };
    if (isMounted()) {
      fetchPratos();
    }
  }, [isMounted]);

  const cartContext = React.useContext(CartContext);

  if (!cartContext) {
    throw new Error('CartContext não está disponível');
  }

  const {
    pratos: pratosNoCarrinho,
    adicionarPrato,
    removerPrato,
  } = cartContext;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Pratos Disponíveis
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {pratos.length ? (
          pratos.map((prato, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 lg:w-1/4 bg-white shadow-md rounded-lg overflow-hidden"
            >
              <CardPrato {...prato} />
            </div>
          ))
        ) : (
          <p>Nenhum prato disponível no momento.</p>
        )}
      </div>
    </div>
  );
}

export default HomeCliente;
