import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const TripsLazy = lazyWithRetry(() => import('./index.jsx'));

const TripManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <TripsLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default TripManagement;
