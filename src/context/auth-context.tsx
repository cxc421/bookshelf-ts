import React, {createContext, FC, useContext, useEffect, useMemo} from 'react';
import {queryCache} from 'react-query';
import * as auth from 'auth-provider';
import {useAsync} from 'utils/hooks';
import {client} from 'utils/api-client';

import {FullPageSpinner, FullPageErrorFallback} from 'components/lib';
import {useCallback} from 'react';

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
    const data = await client('bootstrap', {token});
    // StaleTime not work?
    queryCache.setQueryData('list-items', data.listItems, {staleTime: 5000});
    user = data.user as auth.User;
  }
  return user;
}

const userProfile = getUser();
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
    console.log(`Mounted`);
    run(userProfile);
  }, [run]);

  const login = useCallback(
    (form: auth.User) => auth.login(form).then(user => setData(user)),
    [setData],
  );
  const register = useCallback(
    (form: auth.User) => auth.register(form).then(u => setData(u)),
    [setData],
  );
  const logout = useCallback(
    () =>
      auth.logout().then(() => {
        // clear query cache when logout
        queryCache.clear();
        setData(null);
      }),
    [setData],
  );
  // Only for practice, actually no usecase for useMemo / useCallback
  const value = useMemo(() => ({user, login, register, logout}), [
    login,
    logout,
    register,
    user,
  ]);

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <FullPageErrorFallback error={error!} resetErrorBoundary={() => {}} />
    );
  }

  if (isSuccess) {
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
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

function useAuthClient() {
  const {user} = useUserExistAuth();
  const {token} = user;
  return useCallback(
    (endpoint: string, config?: Parameters<typeof client>[1]) =>
      client(endpoint, {...config, token}),
    [token],
  );
}

export {AuthProvider, useAuth, useUserExistAuth, useAuthClient};
