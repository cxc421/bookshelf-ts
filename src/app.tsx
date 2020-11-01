/** @jsx jsx */
import {jsx} from '@emotion/core';

import {BrowserRouter as Router} from 'react-router-dom';
import {useAuth} from 'context/auth-context';
import {AuthenticatedApp} from 'authenticated-app';
import {UnauthenticatedApp} from 'unauthenticated-app';

function App() {
  const {user} = useAuth();
  if (!user) {
    return <UnauthenticatedApp />;
  }
  return (
    <Router>
      <AuthenticatedApp />
    </Router>
  );
}

export {App};
