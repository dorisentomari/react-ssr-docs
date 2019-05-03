import React from 'react'
import { hydrate } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { getClientStore } from '../store';
import { Provider } from 'react-redux';

import routes from '../routes';
import Header from './../components/Header/index';

const store = getClientStore();

hydrate(<Provider store={store}>
  <BrowserRouter>
    {renderRoutes(routes)}
  </BrowserRouter>
</Provider>, window.root);