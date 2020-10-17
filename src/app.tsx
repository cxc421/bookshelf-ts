/** @jsx jsx */
import {jsx} from '@emotion/core';

import * as auth from 'auth-provider';
import {AuthenticatedApp} from './authenticated-app';
import {UnauthenticatedApp} from './unauthenticated-app';
import {useEffect, useState} from 'react';
import {client} from 'utils/api-client';

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
  const [init, setInit] = useState(false);
  const [user, setUser] = useState<auth.User | null>(null);

  useEffect(() => {
    getUser().then(user => {
      if (user) {
        setUser(user);
      }
      setInit(true);
    });
  }, []);

  const login = (form: auth.User) => auth.login(form).then(u => setUser(u));
  const register = (form: auth.User) =>
    auth.register(form).then(u => setUser(u));
  const logout = () => auth.logout().then(() => setUser(null));

  if (!init) {
    return null;
  }

  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  );
}

export {App};
