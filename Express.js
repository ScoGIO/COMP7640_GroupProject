const express = require('express');
const app = express();
const port = 5051;
const cors = require('cors');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '');
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});