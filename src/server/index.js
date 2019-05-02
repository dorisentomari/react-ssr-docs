import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import routes from '../routes';
import Header from './../components/Header/index';

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('*', (req, res) => {

  let context = {};

  let domContent = renderToString(
    <StaticRouter context={context} location={req.path}>
      <>
        <Header />
        <div className="container" style={{ marginTop: 70 }}>
          {routes}
        </div>
      </>
    </StaticRouter>
  );
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <link href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
  <title>react-ssr</title>
</head>
<body>
<div id="root">${domContent}</div>
<script src="/client.js"></script>
</body>
</html>
`;
  res.send(html);
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running at http://localhost:${PORT}`);
  }
});