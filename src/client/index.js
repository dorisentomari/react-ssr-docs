import React from 'react'
import { hydrate } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { getClientStore } from '../store';
import { Provider } from 'react-redux';

import routes from '../routes';
import Header from './../components/Header/index';

const store = getClientStore();

hydrate(<Provider store={store}>
  <BrowserRouter>
    <>
      <Header />
      <div className="container" style={{ marginTop: 70 }}>
        {routes.map(route => <Route {...route} />)}
      </div>
    </>
  </BrowserRouter>
</Provider>, window.root);