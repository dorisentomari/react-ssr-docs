import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Home from '../containers/Home';

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  let domContent = renderToString(<Home />);
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>react-ssr</title>
</head>
<body>
<div id="root">${domContent}</div>
<script src="/client.js"></script>
</body>
</html>
`;
  res.send(domContent);
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running at http://localhost:${PORT}`);
  }
});