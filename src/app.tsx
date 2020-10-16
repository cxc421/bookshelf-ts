/** @jsx jsx */
import {jsx} from '@emotion/core';

import * as auth from 'auth-provider';
import {AuthenticatedApp} from './authenticated-app';
import {UnauthenticatedApp} from './unauthenticated-app';
import {useState} from 'react';

function App() {
  const [user, setUser] = useState<auth.User | null>(null);

  const login = (form: auth.User) => auth.login(form).then(u => setUser(u));
  const register = (form: auth.User) =>
    auth.register(form).then(u => setUser(u));
  const logout = () => auth.logout().then(() => setUser(null));

  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  );
}

export {App};
