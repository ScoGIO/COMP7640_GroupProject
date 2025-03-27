const express = require('express');
const app = express();
const port = 3000;

// Load the JSON data
const venders = require('./venders.json');

// Define an API endpoint
app.get('/api/venders', (req, res) => {
  res.json(venders);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});