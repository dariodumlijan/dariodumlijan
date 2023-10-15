import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useEnvironmentInfo } from './utils';

function App() {
  const environment = useEnvironmentInfo();

  useEffect(() => {
    if (!environment.isInvalidHost) return;

    const toStaging = window.location.hostname.includes('staging');
    window.location.href = toStaging
      ? 'https://staging.dariodumlijan.com'
      : 'https://dariodumlijan.com';
  }, [environment.isInvalidHost]);

  if (environment.isInvalidHost) return null;

  return <RouterProvider router={router} />;
}

export default App;
