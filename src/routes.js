import React from 'react'
import Home from './containers/Home';
import News from './containers/News';

export default [
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
  }
];
