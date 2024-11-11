// server.js - Gateway API Server Endpoint
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();

// Load the port from the .env file, defaulting to 3000 if not defined
const PORT = process.env.PORT || 1000;

// Log environment variables to ensure they are loaded
console.log('Environment Variables:', {
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL,
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL,
  COMMUNICATION_SERVICE_URL: process.env.COMMUNICATION_SERVICE_URL
});

// Allow requests from frontend
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Define your microservices' endpoints using environment variables
const serviceRoutes = {
  userService: process.env.USER_SERVICE_URL,
  productService: process.env.PRODUCT_SERVICE_URL,
  orderService: process.env.ORDER_SERVICE_URL,
  communicationService: process.env.COMMUNICATION_SERVICE_URL
};

// Welcome message at /api
app.get('/api', (req, res) => {
  res.send({
    message: 'Welcome to the API Gateway!',
    availableEndpoints: [
      '/api/users',
      '/api/products',
      '/api/orders',
      'api/communication'
    ]
  });
});

// Logging test
console.log('Service Routes:', serviceRoutes);

// Proxy routes
app.use('/api/users', createProxyMiddleware({ target: serviceRoutes.userService, changeOrigin: true, onError: (err, req, res) => {
  console.error('Error proxying user service request:', err);
  res.status(500).send('Something went wrong!');
} }));
app.use('/api/products', createProxyMiddleware({ target: serviceRoutes.productService, changeOrigin: true }));
app.use('/api/orders', createProxyMiddleware({ target: serviceRoutes.orderService, changeOrigin: true }));
app.use('/api/communication', createProxyMiddleware({ target: serviceRoutes.communicationService, changeOrigin: true }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});

// Log/test env variable
console.log('USER_SERVICE_URL:', process.env.USER_SERVICE_URL);