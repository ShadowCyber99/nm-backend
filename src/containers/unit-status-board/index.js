import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const UnitStatusLazy = lazyWithRetry(() => import('./index.jsx'));

const UnitStatusManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <UnitStatusLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default UnitStatusManagement;
