import { useState, useCallback, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spin } from '@arco-design/web-react';
import Router from '@/routes';

const App = () => {
  const [result, setResult] = useState(100);
  const clickHandler = useCallback(() => {
    setResult(c=>c+1);
  }, []);

  return (
    <>
    <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            console.log('重试');
          }}>
          <Suspense
            fallback={
              <div className="global-loading">
                <Spin size="large" />
              </div>
            }>
            <Router />
          </Suspense>
        </ErrorBoundary>
    </>
  );
};

export default App;
