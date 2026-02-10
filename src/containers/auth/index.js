import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading';
// Lazy Components
const LoginLazy = lazyWithRetry(() => import('./login'));

const Login = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <LoginLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default Login;
