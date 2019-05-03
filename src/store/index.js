import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';
import serverAxios from '../server/request';
import clientAxios from '../client/request';

export const getServerStore = () => createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk.withExtraArgument(serverAxios), logger))
);

export const getClientStore = () => {
  let initState = window.context.state;
  return createStore(
    reducers,
    initState,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(clientAxios), logger))
  );
}