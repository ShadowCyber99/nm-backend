import React, { Suspense, lazy } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
// Lazy Components
const MaintainenceLazy = lazy(() => import('./index.jsx'));

const Maintainence = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <MaintainenceLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default Maintainence;
