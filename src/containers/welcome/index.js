import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components

const WelcomeLazy = lazyWithRetry(() => import('./index.jsx'));

const WelcomeScreen = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <WelcomeLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default WelcomeScreen;
