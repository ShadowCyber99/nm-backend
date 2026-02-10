import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const AdminLazy = lazyWithRetry(() => import('./index.jsx'));

const AdminPanel = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <AdminLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default AdminPanel;
