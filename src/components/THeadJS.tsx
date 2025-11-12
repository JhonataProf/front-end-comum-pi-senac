import React from 'react';

interface THeadJSProps {
  columns: string[];
}

const THeadJS: React.FC<THeadJSProps> = ({ columns }) => {
  return (
    <thead>
      <tr className="bg-gray-200">
        {columns.map((column, index) => (
          <th key={index} className="border border-gray-300 p-2">
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default THeadJS;
