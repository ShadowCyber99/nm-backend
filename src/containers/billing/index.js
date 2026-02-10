import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const BillingLazy = lazyWithRetry(() => import('./index.jsx'));

const Billing = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <BillingLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default Billing;
