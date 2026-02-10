import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const VehicleLazy = lazyWithRetry(() => import('./index.jsx'));

const VehicleManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <VehicleLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default VehicleManagement;
