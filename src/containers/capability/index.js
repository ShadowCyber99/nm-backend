import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const CapabilityLazy = lazyWithRetry(() => import('./index.jsx'));

const Capability = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <CapabilityLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default Capability;
