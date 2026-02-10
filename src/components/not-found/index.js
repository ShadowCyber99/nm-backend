import React, { Suspense, lazy } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
// Lazy Components
const NotFoundLazy = lazy(() => import('./index.jsx'));

const NotFound = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <NotFoundLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default NotFound;
