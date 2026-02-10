import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const POCLazy = lazyWithRetry(() => import('./index.jsx'));

const Poc = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <POCLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default Poc;
