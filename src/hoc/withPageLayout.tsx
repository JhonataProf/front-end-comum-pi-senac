// src/hoc/withPageLayout.tsx
import React from 'react';
import PageLayout from '../shared/layout/PageLayout';

export interface WithPageLayoutOptions {
  title: string;
  subtitle?: string;
}

/**
 * HOC que embrulha uma página dentro do PageLayout,
 * padronizando título, subtítulo e estrutura.
 */
export function withPageLayout<P extends object>(
  options: WithPageLayoutOptions,
) {
  return function withPageLayoutWrapper(
    WrappedComponent: React.ComponentType<P>,
  ) {
    const ComponentWithPageLayout: React.FC<P> = (props) => {
      return (
        <PageLayout title={options.title} subtitle={options.subtitle}>
          <WrappedComponent {...props} />
        </PageLayout>
      );
    };

    ComponentWithPageLayout.displayName = `WithPageLayout(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return ComponentWithPageLayout;
  };
}

export default withPageLayout;
