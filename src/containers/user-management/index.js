import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const UserLazy = lazyWithRetry(() => import('./index.jsx'));

const UserManagement = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <UserLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default UserManagement;
