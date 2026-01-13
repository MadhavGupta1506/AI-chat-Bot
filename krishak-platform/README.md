# Krishak Platform

An innovative e-commerce platform designed to empower farmers by directly connecting them with consumers, retailers, and investors.

## Overview

Krishak addresses critical challenges in Indian agriculture such as:
- Exploitation by intermediaries
- Lack of transparent pricing
- Limited market access for small and marginal farmers

The platform creates a digital marketplace where farmers can showcase their crops, receive viable prices, and attract investment for sustainable growth.

## Features

### For Farmers
- 🌾 Direct crop listing and management
- 💰 Fair pricing without intermediaries
- 📊 Real-time sales tracking
- 💼 Investment opportunities
- 🏦 Secure payment system

### For Buyers
- 🛒 Fresh produce directly from farmers
- 🔍 Advanced search and filtering
- 📦 Order tracking
- ✅ Quality assurance
- 🚚 Logistics support

### For Investors
- 💎 Investment in agriculture
- 📈 Expected ROI tracking
- 🌱 Support farmer growth
- 📊 Portfolio management

## Technology Stack

### Backend
- Node.js & Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router
- Axios
- Context API

## Project Structure

```
krishak-platform/
├── backend/           # Node.js/Express backend
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth middleware
│   └── server.js     # Main server file
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # Context providers
│   │   ├── services/   # API services
│   │   └── App.js      # Main app component
│   └── public/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd krishak-platform
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your backend API URL
npm start
```

The backend will run on `http://localhost:5000` and frontend on `http://localhost:3000`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Farmer Endpoints
- `POST /api/farmers/profile` - Create farmer profile
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/:id` - Get farmer by ID

### Crop Endpoints
- `POST /api/crops` - Create crop listing
- `GET /api/crops` - Get all crops (with filters)
- `GET /api/crops/:id` - Get crop by ID
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get buyer orders
- `GET /api/orders/farmer-orders` - Get farmer orders
- `PUT /api/orders/:id/status` - Update order status

### Investment Endpoints
- `POST /api/investments` - Create investment
- `GET /api/investments/opportunities` - Get opportunities
- `GET /api/investments/my-investments` - Get investor investments
- `GET /api/investments/farmer-investments` - Get farmer investments

## User Roles

1. **Farmer** - Lists crops, manages orders, receives investments
2. **Buyer** - Purchases crops, tracks orders
3. **Investor** - Invests in farms and crops
4. **Admin** - Full system access

## Database Models

- **User** - Authentication and profile
- **Farmer** - Farmer-specific details
- **Crop** - Crop listings
- **Order** - Purchase orders
- **Investment** - Investment records

## Key Functionalities

### Direct Market Access
Farmers can list their crops directly without intermediaries, ensuring fair prices.

### AI-Powered Pricing
Smart pricing engine recommends optimal rates based on market trends and demand.

### Investment Model
Investors can support farmers with upfront capital and earn returns on future yields.

### Logistics Support
Integrated delivery and storage management for timely distribution.

### Traceability
Blockchain-ready architecture for transparent transactions.

## Future Enhancements

- 📱 Mobile app (Flutter/React Native)
- 🌦️ Weather forecasts integration
- 🛡️ Crop insurance
- 🤖 AI-based crop advisory
- 🌐 Multi-language support
- 📍 GPS-based farmer location
- 💳 Multiple payment gateways

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Contact

For more information, please contact the development team.

---

**Krishak** - Empowering Farmers, Connecting Communities 🌾
