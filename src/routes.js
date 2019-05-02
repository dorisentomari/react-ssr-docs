import React from 'react';
import { Route } from 'react-router-dom';
import Home from './containers/Home';
import News from './containers/News';

export default (
  <>
    <Route path='/' exact component={Home} />
    <Route path='/news' component={News} />
  </>
);