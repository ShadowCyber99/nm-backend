import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const TransportLazy = lazyWithRetry(() => import('./index.jsx'));

const TransportManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <TransportLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default TransportManagement;
