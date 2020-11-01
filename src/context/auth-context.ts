import {createContext, useContext} from 'react';
import * as auth from 'auth-provider';

type AuthContextType = {
  user: auth.User | null;
  login: (form: auth.User) => Promise<void>;
  register: (form: auth.User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(`useAuth must be used within a AuthContext provider`);
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

export {AuthContext, useAuth, useUserExistAuth};
