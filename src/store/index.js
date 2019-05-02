import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

export const getServerStore = () => createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, logger))
);

export const getClientStore = () => {
  let initState = window.context.state;
  return createStore(
    reducers,
    initState,
    composeWithDevTools(applyMiddleware(thunk, logger))
  );
}