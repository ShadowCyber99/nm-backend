import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const DriversLazy = lazyWithRetry(() => import('./index.jsx'));

const DriverManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DriversLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default DriverManagement;
