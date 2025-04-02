const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/commerce', createProxyMiddleware({
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
}));

app.listen(3000, () => console.log('Proxy server running on port 3000'));