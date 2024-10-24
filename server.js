// server.js - Gateway API Server Endpoint
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Load the port from the .env file, defaulting to 3000 if not defined
const PORT = process.env.PORT || 1000;

// Allow requests from frontend
// Configure CORS
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all HTTP methods
  allowedHeaders: 'Content-Type,Authorization' // Allow the specified headers
}));


// Define your microservices' endpoints using environment variables
const serviceRoutes = {
  userService: process.env.USER_SERVICE_URL,
  productService: process.env.PRODUCT_SERVICE_URL,
  orderService: process.env.ORDER_SERVICE_URL,
};

// Welcome message at /api
app.get('/api', (req, res) => {
  res.send({
    message: 'Welcome to the API Gateway!',
    availableEndpoints: [
      '/api/users',
      '/api/products',
      '/api/orders'
    ]
  });
});

// logging test

console.log('Service Routes:', serviceRoutes);

// Proxy routes
app.use('/api/users', createProxyMiddleware({ target: serviceRoutes.userService, changeOrigin: true,  onError: (err, req, res) => {
  console.error('Error proxying user service request:', err);
  res.status(500).send('Something went wrong!');
} }));
app.use('/api/products', createProxyMiddleware({ target: serviceRoutes.productService, changeOrigin: true }));
app.use('/api/orders', createProxyMiddleware({ target: serviceRoutes.orderService, changeOrigin: true }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong!');
  });

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});

// log/test env variable
console.log('USER_SERVICE_URL:', process.env.USER_SERVICE_URL);