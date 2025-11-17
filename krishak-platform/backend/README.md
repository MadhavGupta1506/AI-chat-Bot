# Krishak Platform - Backend

This is the backend API for the Krishak e-commerce and investment platform for farmers.

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

## Features

- User authentication and authorization
- Farmer profile management
- Crop listing and marketplace
- Order management
- Investment system
- Role-based access control (Farmer, Buyer, Investor, Admin)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/krishak
JWT_SECRET=your_secret_key
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Farmers
- `POST /api/farmers/profile` - Create farmer profile (Farmer only)
- `GET /api/farmers/profile/me` - Get my farmer profile (Farmer only)
- `PUT /api/farmers/profile` - Update farmer profile (Farmer only)
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/:farmerId` - Get specific farmer

### Crops
- `POST /api/crops` - Create crop listing (Farmer only)
- `GET /api/crops` - Get all crops with filters
- `GET /api/crops/my-crops` - Get my crops (Farmer only)
- `GET /api/crops/:cropId` - Get specific crop
- `PUT /api/crops/:cropId` - Update crop (Farmer only)
- `DELETE /api/crops/:cropId` - Delete crop (Farmer only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get my orders (Buyer)
- `GET /api/orders/farmer-orders` - Get farmer orders (Farmer)
- `GET /api/orders/:orderId` - Get specific order
- `PUT /api/orders/:orderId/status` - Update order status (Farmer)
- `PUT /api/orders/:orderId/payment` - Update payment status

### Investments
- `POST /api/investments` - Create investment (Investor only)
- `GET /api/investments/my-investments` - Get my investments (Investor)
- `GET /api/investments/farmer-investments` - Get farmer investments (Farmer)
- `GET /api/investments/opportunities` - Get investment opportunities
- `GET /api/investments/:investmentId` - Get specific investment
- `PUT /api/investments/:investmentId/status` - Update investment status (Farmer)
- `PUT /api/investments/:investmentId/payment` - Update payment status

## User Roles

- **Farmer**: Can create farmer profile, list crops, manage orders
- **Buyer**: Can purchase crops, view marketplace
- **Investor**: Can invest in farms and crops
- **Admin**: Full access to all features

## Database Models

- User
- Farmer
- Crop
- Order
- Investment

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## License

MIT
