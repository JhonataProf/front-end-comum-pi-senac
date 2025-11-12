import React from 'react';

interface TBodyJSProps<T> {
  data: T[]; // Dados genéricos
  columns: (keyof T | 'Ações')[];
  actions?: {
    [key: string]: (item: T) => void;
  };
}

const TBodyJS = <T,>({ data, columns, actions }: TBodyJSProps<T>) => {
  // ✅ Garante que 'data' seja um array antes de usar .map()
  if (!Array.isArray(data)) {
    console.error('⚠️ TBodyJS recebeu "data" inválido:', data);
    return (
      <tbody>
        <tr>
          <td
            colSpan={columns.length}
            className="text-center p-4 text-gray-500"
          >
            Nenhum dado disponível
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex} className="hover:bg-gray-100">
          {columns.map((column, colIndex) => (
            <td key={colIndex} className="border border-gray-300 p-2">
              {column === 'Ações' && actions ? (
                <div className="flex gap-2">
                  {Object.keys(actions).map((actionKey) => (
                    <button
                      key={actionKey}
                      onClick={() => actions[actionKey](row)}
                      className={`px-2 py-1 rounded ${
                        actionKey === 'edit'
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : actionKey === 'delete'
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                    >
                      {actionKey.charAt(0).toUpperCase() + actionKey.slice(1)}
                    </button>
                  ))}
                </div>
              ) : (
                row[column as keyof T]?.toString() || ''
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TBodyJS;
// import React from 'react';

// interface TBodyJSProps<T> {
//   data: T[]; // Dados genéricos
//   columns: (keyof T | 'Ações')[]; // Colunas baseadas nas chaves do objeto genérico T
//   actions?: {
//     [key: string]: (item: T) => void; // Ações que recebem o objeto completo
//   };
// }

// const TBodyJS = <T,>({ data, columns, actions }: TBodyJSProps<T>) => {
//   return (
//     <tbody>
//       {data.map((row, rowIndex) => (
//         <tr key={rowIndex} className="hover:bg-gray-100">
//           {columns.map((column, colIndex) => (
//             <td key={colIndex} className="border border-gray-300 p-2">
//               {column === 'Ações' && actions ? (
//                 <div className="flex gap-2">
//                   {Object.keys(actions).map((actionKey) => (
//                     <button
//                       key={actionKey}
//                       onClick={() => actions[actionKey](row)}
//                       className={`px-2 py-1 rounded ${
//                         actionKey === 'edit'
//                           ? 'bg-blue-500 text-white hover:bg-blue-600'
//                           : actionKey === 'delete'
//                             ? 'bg-red-500 text-white hover:bg-red-600'
//                             : 'bg-gray-500 text-white hover:bg-gray-600'
//                       }`}
//                     >
//                       {actionKey.charAt(0).toUpperCase() + actionKey.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               ) : (
//                 row[column as keyof T]?.toString() || ''
//               )}
//             </td>
//           ))}
//         </tr>
//       ))}
//     </tbody>
//   );
// };

// export default TBodyJS;
