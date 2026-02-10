import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const LogsLazy = lazyWithRetry(() => import('./index.jsx'));

const LogsManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <LogsLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default LogsManagement;
