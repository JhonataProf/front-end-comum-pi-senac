/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import '../estilos/Home.css';
import CardPrato from './CardPrato';
import { CartContext } from '../context/cartContext';

function HomeCliente() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pratos, setPratos] = React.useState([
    {
      nome: 'Feijoada',
      cozinha: 'Brasileira',
      descricaoCurta:
        'Feijoada completa, com pedaços suculentos de carne suína e aquele sabor brasileiro incomparável.',
      imagem:
        'https://media.istockphoto.com/id/899497396/pt/foto/delicious-brazilian-feijoada.jpg?s=2048x2048&w=is&k=20&c=OO_JGRT2AgsybJxSFB-mFP2vsOn7QtsbqEd1sZiUzuw=',
    },
    {
      nome: 'Moqueca',
      cozinha: 'Brasileira',
      descricaoCurta:
        'Moqueca de peixe com leite de coco, temperos frescos e um toque de azeite de dendê.',
      imagem:
        'https://media.istockphoto.com/id/1137377098/pt/foto/moqueca-brazilian-seafood-stew.jpg?s=2048x2048&w=is&k=20&c=Z5Qv8vQ9X9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9=',
    },
    {
      nome: 'Churrasco',
      cozinha: 'Brasileira',
      descricaoCurta:
        'Churrasco brasileiro com cortes nobres de carne e acompanhamentos tradicionais.',
      imagem:
        'https://media.istockphoto.com/id/1141234567/pt/foto/brazilian-barbecue.jpg?s=2048x2048&w=is&k=20&c=Z5Qv8vQ9X9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9=',
    },
    {
      nome: 'Acarajé',
      cozinha: 'Brasileira',
      descricaoCurta:
        'Acarajé crocante recheado com vatapá, camarão seco e pimenta.',
      imagem:
        'https://media.istockphoto.com/id/1151234567/pt/foto/acaraje.jpg?s=2048x2048&w=is&k=20&c=Z5Qv8vQ9X9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9=',
    },
    {
      nome: 'Pão de Queijo',
      cozinha: 'Brasileira',
      descricaoCurta:
        'Pão de queijo mineiro, crocante por fora e macio por dentro.',
      imagem:
        'https://media.istockphoto.com/id/1161234567/pt/foto/pao-de-queijo.jpg?s=2048x2048&w=is&k=20&c=Z5Qv8vQ9X9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9=',
    },
    {
      nome: 'Brigadeiro',
      cozinha: 'Brasileira',
      descricaoCurta:
        'Brigadeiro tradicional, doce de chocolate com granulado por fora.',
      imagem:
        'https://media.istockphoto.com/id/1171234567/pt/foto/brigadeiro.jpg?s=2048x2048&w=is&k=20&c=Z5Qv8vQ9X9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9J9Z9J9z9=',
    },
  ]);

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
        {pratos.map((prato, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 lg:w-1/4 bg-white shadow-md rounded-lg overflow-hidden"
          >
            <CardPrato {...prato} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeCliente;
