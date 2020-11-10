/** @jsx jsx */
import {jsx} from '@emotion/core';

import {lazy, Suspense} from 'react';
import {useAuth} from 'context/auth-context';
import {FullPageSpinner} from 'components/lib';

const AuthenticatedApp = lazy(() => import('authenticated-app'));
const UnauthenticatedApp = lazy(() => import('unauthenticated-app'));

function App() {
  const {user} = useAuth();
  return (
    <Suspense fallback={<FullPageSpinner />}>
      {!user ? <UnauthenticatedApp /> : <AuthenticatedApp />}
    </Suspense>
  );
}

export {App};
