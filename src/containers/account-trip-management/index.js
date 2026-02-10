import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const AccountTripLazy = lazyWithRetry(() => import('./index.jsx'));

const AccountTripManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <AccountTripLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default AccountTripManagement;
