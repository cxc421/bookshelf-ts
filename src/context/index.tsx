import React, {FC} from 'react';
import {ReactQueryConfigProvider, ReactQueryConfig} from 'react-query';
import {BrowserRouter as Router} from 'react-router-dom';

import {AuthProvider} from './auth-context';
import {CustomError} from 'test/types';

const queryConfig: ReactQueryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false, // window 進入 focus 時不要重新 qurey
    retry(failureCount, error) {
      if ((error as CustomError).status === 404) {
        console.log(`404 ERROR, STOP retry`);
        return false;
      }
      if (failureCount >= 2) {
        return false;
      }
      return true;
    },
  },
};

const AppProviders: FC = ({children}) => (
  <ReactQueryConfigProvider config={queryConfig}>
    <Router>
      <AuthProvider>{children}</AuthProvider>
    </Router>
  </ReactQueryConfigProvider>
);

export {AppProviders};
