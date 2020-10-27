/** @jsx jsx */
import {jsx} from '@emotion/core';

import {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import * as auth from 'auth-provider';
import {AuthenticatedApp} from 'authenticated-app';
import {UnauthenticatedApp} from 'unauthenticated-app';
import {client} from 'utils/api-client';
import {useAsync} from 'utils/hooks';
import {FullPageSpinner} from 'components/lib';
import * as colors from 'styles/colors';
import {queryCache} from 'react-query';

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
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error && error.message}</pre>
      </div>
    );
  }

  if (isSuccess) {
    return user ? (
      <Router>
        <AuthenticatedApp user={user} logout={logout} />
      </Router>
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    );
  }

  throw new Error(`Unhandle state`);
}

export {App};
