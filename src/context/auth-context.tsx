import React, {createContext, FC, useContext, useEffect} from 'react';
import {queryCache} from 'react-query';
import * as auth from 'auth-provider';
import {useAsync} from 'utils/hooks';
import {client} from 'utils/api-client';

import {FullPageSpinner, FullPageErrorFallback} from 'components/lib';

type AuthContextType = {
  user: auth.User | null;
  login: (form: auth.User) => Promise<void>;
  register: (form: auth.User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
AuthContext.displayName = 'AuthContext';

async function getUser() {
  let user: null | auth.User = null;

  const token = await auth.getToken();
  if (token) {
    const data = await client('me', {token});
    user = data.user as auth.User;
  }
  return user;
}

const AuthProvider: FC = ({children}) => {
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
      <AuthContext.Provider value={props}>{children}</AuthContext.Provider>
    );
  }
  throw new Error(`Unhandle state`);
};

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error(`useAuth must be used within an AtuhProvider`);
  return context;
}

function useUserExistAuth() {
  const context = useAuth();
  const {user} = context;
  if (!user)
    throw new Error(
      `useUserExistAuth must be used when user is set to context`,
    );
  return {...context, user};
}

export {AuthProvider, useAuth, useUserExistAuth};
