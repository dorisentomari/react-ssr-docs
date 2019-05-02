const express = require('express');

let app = express();
const PORT = 8758;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  next();
});

app.get('/api/getSchoolList', (req, res) => {
  let schoolList = [
    { id: 1, name: '动物大学' },
    { id: 2, name: '植物大学' },
    { id: 3, name: '建筑大学' },
    { id: 4, name: '服装大学' }
  ];
  console.log('request api/getSchoolList');
  return res.json({ schoolList });
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`the server is running at http://localhost:${PORT}`);
  }
});
