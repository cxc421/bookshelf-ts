/** @jsx jsx */
import {jsx} from '@emotion/core';

import {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {queryCache} from 'react-query';
import * as auth from 'auth-provider';
import {client} from 'utils/api-client';
import {useAsync} from 'utils/hooks';
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib';
import {AuthContext} from 'context/auth-context';
import {AuthenticatedApp} from 'authenticated-app';
import {UnauthenticatedApp} from 'unauthenticated-app';

async function getUser() {
  let user: null | auth.User = null;

  const token = await auth.getToken();
  if (token) {
    const data = await client('me', {token});
    user = data.user as auth.User;
  }
  return user;
}

function App() {
  const {
    data: user,
    error,
    isIdle,
    isLoading,
    isError,
    isSuccess,
    setData,
    run,
  } = useAsync<auth.User | null>();

  useEffect(() => {
    run(getUser());
  }, [run]);

  const login = (form: auth.User) =>
    auth.login(form).then(user => setData(user));
  const register = (form: auth.User) =>
    auth.register(form).then(u => setData(u));
  const logout = () =>
    auth.logout().then(() => {
      // clear query cache when logout
      queryCache.clear();
      setData(null);
    });

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <FullPageErrorFallback error={error!} resetErrorBoundary={() => {}} />
    );
  }

  if (isSuccess) {
    const props = {user, login, register, logout};
    return (
      <AuthContext.Provider value={props}>
        {user ? (
          <Router>
            <AuthenticatedApp />
          </Router>
        ) : (
          <UnauthenticatedApp />
        )}
      </AuthContext.Provider>
    );
  }
  throw new Error(`Unhandle state`);
}

export {App};
