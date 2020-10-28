import React from 'react';
import ReactDOM from 'react-dom';
import {ReactQueryConfigProvider} from 'react-query';

import {loadDevTools} from './dev-tools/load';
import './bootstrap';
import {App} from './app';
import {CustomError} from './test/types';

loadDevTools(() => {
  ReactDOM.render(
    <ReactQueryConfigProvider
      config={{
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
      }}
    >
      <App />
    </ReactQueryConfigProvider>,
    document.getElementById('root'),
  );
});
