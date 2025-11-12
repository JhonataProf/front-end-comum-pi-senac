import React from 'react';
import THeadJS from './THeadJS';
import TBodyJS from './TBodyJS';

interface TabelaJSProps<T> {
  columns: (keyof T | 'Ações')[]; // Colunas baseadas nas chaves do objeto genérico T
  data: T[]; // Dados genéricos
  actions?: {
    [key: string]: (item: T) => void; // Ações que recebem o objeto completo
  };
}

const TabelaJS = <T,>({ columns, data, actions }: TabelaJSProps<T>) => {
  // Mapeia as colunas para strings para garantir compatibilidade com THeadJS
  const columnStrings = columns.map((col) => col.toString());

  return (
    <table className="w-full border-collapse border border-gray-300">
      <THeadJS columns={columnStrings} />
      <TBodyJS data={data} columns={columns} actions={actions} />
    </table>
  );
};

export default TabelaJS;
