import React from 'react';
import ReactDOM from 'react-dom';
import {ReactQueryConfigProvider, ReactQueryConfig} from 'react-query';

import {loadDevTools} from './dev-tools/load';
import './bootstrap';
import {App} from './app';
import {AuthProvider} from 'context/auth-context';
import {CustomError} from './test/types';

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

loadDevTools(() => {
  ReactDOM.render(
    <ReactQueryConfigProvider config={queryConfig}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ReactQueryConfigProvider>,
    document.getElementById('root'),
  );
});
