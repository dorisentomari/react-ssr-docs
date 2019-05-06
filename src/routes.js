import React from 'react';
import { Route } from 'react-router-dom';
import App from './App';
import Home from './containers/Home';
import News from './containers/News';
import NotFound from './containers/NotFound/index';

export default [
  {
    path: '/',
    component: App,
    key: 'app',
    routes: [
      {
        path: '/',
        component: Home,
        loadData: Home.loadData,
        exact: true,
        key: '/'
      },
      {
        path: '/news',
        component: News,
        exact: true,
        key: '/news'
      },
      {
        component: NotFound
      }
    ]
  }
];