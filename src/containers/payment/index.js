import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const PaymentTab = lazyWithRetry(() => import('./index.jsx'));

const Payments = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <PaymentTab />
      </Suspense>
    </ErrorBoundary>
  );
};
export default Payments;
