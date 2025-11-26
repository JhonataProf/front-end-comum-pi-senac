import React from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;

  // ✅ novo: permite passar botões customizados
  actions?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
  actions,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center ${className}`}
    >
      {icon && <div className="mb-3 text-2xl text-slate-400">{icon}</div>}

      <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
        {title}
      </h3>

      {description && (
        <p className="mt-1 max-w-md text-xs text-slate-500 sm:text-sm">
          {description}
        </p>
      )}

      {/* ✅ se existir `actions`, usamos ele; senão caímos no botão padrão */}
      {actions ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {actions}
        </div>
      ) : (
        actionLabel &&
        onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
