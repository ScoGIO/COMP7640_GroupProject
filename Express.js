const express = require('express');
const app = express();
const port = 3000;

// Load the JSON data
const venders = require('./venders.json');
const customers = require('./customers.json');
const orders = require('./orders.json');
const products = require('./products.json');
const transactions = require('./transactions.json');
const users = require('./users.json');

// Define an API endpoint
app.get('/api/venders', (req, res) => {
  res.json(venders);
});

app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});