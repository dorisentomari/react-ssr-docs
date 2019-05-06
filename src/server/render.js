import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Route, matchPath } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { getServerStore } from '../store';

import Header from './../components/Header/index';
import routes from '../routes';


export default (req, res) => {

  let context = {
    csses: []
  };

  let store = getServerStore(req);

  let matchedRoutes = matchRoutes(routes, req.path);

  let promises = [];

  matchedRoutes.forEach(item => {
    let loadData = item.route.loadData;

    if (loadData) {
      const promise = new Promise((resolve) => {
        loadData(store).then(resolve).catch(resolve);
      });
      promises.push(promise);
    }
  });

  Promise.all(promises).then(() => {
    let domContent = renderToString(
      <Provider store={store}>
        <StaticRouter context={context} location={req.path}>
          {
            renderRoutes(routes)
          }
        </StaticRouter>
      </Provider>
    );
    let cssStr = context.csses.length ? context.csses.join('\n') : '';
    const helmet = Helmet.renderStatic();
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <link href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
  ${helmet.title.toString()}
  ${helmet.meta.toString()}
  <style>${cssStr}</style>
</head>
<body>
<div id="root">${domContent}</div>
<script>
  window.context = {
    state: ${JSON.stringify(store.getState())}
  }
</script>
<script src="/client.js"></script>
</body>
</html>
`;
    if (context.action === 'REPLACE') {
      res.redirect(301, context.url);
    } else if (context.NotFound) {
      res.statusCode = 404;
    }
    res.send(html);
  });
};
