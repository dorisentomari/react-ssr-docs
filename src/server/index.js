import express from 'express';
import render from './render';

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('*', (req, res) => {
  render(req, res);
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running at http://localhost:${PORT}`);
  }
});