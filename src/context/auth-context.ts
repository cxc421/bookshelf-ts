import {createContext} from 'react';
import * as auth from 'auth-provider';

type AuthContextType = {
  user: auth.User | null;
  login: (form: auth.User) => Promise<void>;
  register: (form: auth.User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export {AuthContext};
