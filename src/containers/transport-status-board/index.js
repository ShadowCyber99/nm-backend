import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const TransportStatusLazy = lazyWithRetry(() => import('./index.jsx'));

const TransportStatusManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <TransportStatusLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default TransportStatusManagement;
