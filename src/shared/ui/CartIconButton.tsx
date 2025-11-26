// src/components/ui/CartIconButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

export interface CartIconButtonProps {
  /** Rota para onde o botão deve navegar (usa <Link />) */
  to?: string;
  /** Handler opcional caso você queira tratar o click na mão */
  onClick?: () => void;
  /** Quantidade de itens no carrinho (mostrada no badge) */
  count?: number;
  /** Classe extra para estilização adicional */
  className?: string;
}

const CartIconButton: React.FC<CartIconButtonProps> = ({
  to,
  onClick,
  count = 0,
  className = '',
}) => {
  const content = (
    <div
      className={`
        relative inline-flex h-10 w-10 items-center justify-center
        rounded-full border border-slate-200 bg-white text-slate-700
        shadow-sm transition hover:bg-slate-50
        ${className}
      `}
      onClick={onClick}
    >
      <FiShoppingCart size={18} />

      {count > 0 && (
        <span
          className="
            absolute -right-1 -top-1 min-h-[1.1rem] min-w-[1.1rem]
            rounded-full bg-emerald-500 px-1.5 text-center
            text-[0.65rem] font-semibold text-white
            flex items-center justify-center
          "
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );

  // Se tiver `to`, renderiza como Link; senão, só o conteúdo clicável
  if (to) {
    return (
      <Link to={to} aria-label="Ir para o carrinho">
        {content}
      </Link>
    );
  }

  return content;
};

export default CartIconButton;
