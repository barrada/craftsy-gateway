
# API Gateway Project

## Overview
A simple API gateway built with Node.js to route requests to various microservices.

## Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with the following variables:

PORT=1000
USER_SERVICE_URL=http://localhost:4000
PRODUCT_SERVICE_URL=http://localhost:5000
ORDER_SERVICE_URL=http://localhost:6000

4. Start the server with `node index.js`.

## Features
- Proxy requests to user, product, and order services.
- Welcome message at `/api`.

## Future Improvements
- Implement authentication middleware
- Add logging for API requests# craftsy-gateway
