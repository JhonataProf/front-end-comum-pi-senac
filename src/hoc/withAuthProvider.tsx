import React from 'react';
import { AuthProvider } from '../context/authContext';

const withAuthProvider = (WrappedComponent: React.ComponentType<any>) => {
  return (props: React.ComponentProps<typeof WrappedComponent>) => {
    return (
      <AuthProvider>
        <WrappedComponent {...props} />
      </AuthProvider>
    );
  };
};

export default withAuthProvider;