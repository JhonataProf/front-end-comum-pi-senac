import React from 'react';
import { AuthProvider } from '../context/authContext';

const withAuthProvider = <Props extends object>(WrappedComponent: React.ComponentType<Props>) => {
  const ComponentWithAuthProvider = (props: React.ComponentProps<typeof WrappedComponent>) => {
    return (
      <AuthProvider>
        <WrappedComponent {...props} />
      </AuthProvider>
    );
  };

  ComponentWithAuthProvider.displayName = `WithAuthProvider(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuthProvider;
};

export default withAuthProvider;