import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/error-boundary';
// Imports Components
import Loading from '../../components/loading/loading';
import { lazyWithRetry } from '../../components/lazyLoading/index.js';
// Lazy Components
const SettingLazy = lazyWithRetry(() => import('./index.jsx'));

const SettingScreen = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <SettingLazy />
      </Suspense>
    </ErrorBoundary>
  );
};
export default SettingScreen;
