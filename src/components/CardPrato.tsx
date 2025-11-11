import React, { FC } from 'react';
import { Link } from 'react-router';

interface CardPratoProps {
  id?: number;
  nome: string;
  cozinha: string;
  descricao_resumida: string;
  imagem: string;
  prazoValidade?: Date; // Opcional, caso queira adicionar no futuro
  valor?: number; // Opcional, caso queira adicionar no futuro
}

const CardPrato: FC<CardPratoProps> = (props) => {
  return (
    <div className="relative bg-white shadow-md rounded-lg overflow-hidden">
      {/* Imagem do prato */}
      <img
        src={props.imagem}
        alt={props.nome}
        className="w-full h-48 object-cover"
      />

      {/* Conteúdo do card */}
      <div className="p-4">
        <h2 className="text-lg font-bold">{props.nome}</h2>
        <p className="text-sm text-gray-500">{props.cozinha}</p>
        <p className="text-sm mt-2 text-gray-700">{props.descricao_resumida}</p>
      </div>

      {/* Botão de menu e dropdown */}
      <div className="absolute top-2 right-2 group">
        <button className="menu-button bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 focus:outline-none">
          &#x22EE;
        </button>
        <div className="dropdown-menu absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
          <Link
            to="/carrinho"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Ir para carrinho
          </Link>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Adicionar ao carrinho +
          </a>
          <Link
            to={`/detalhes/${props?.id}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardPrato;
