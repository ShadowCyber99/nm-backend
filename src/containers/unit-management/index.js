import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const UnitLazy = lazyWithRetry(() => import('./index.jsx'));

const UnitManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <UnitLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default UnitManagement;
