import React from 'react';
import ReactDOM from 'react-dom';

import {loadDevTools} from './dev-tools/load';
import './bootstrap';
import {App} from './app';
import {AppProviders} from 'context';
import {Profiler} from 'components/Profiler';

loadDevTools(() => {
  ReactDOM.render(
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>,
    document.getElementById('root'),
  );
});
