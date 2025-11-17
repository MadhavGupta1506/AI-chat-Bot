# Krishak Platform - Frontend

This is the frontend application for the Krishak e-commerce and investment platform for farmers.

## Technologies Used

- React.js
- React Router
- Axios for API calls
- Context API for state management

## Features

- User authentication (Login/Register)
- Role-based dashboards (Farmer, Buyer, Investor)
- Crop marketplace
- Investment opportunities
- Order management
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite

## User Roles

### Farmer
- Create and manage crop listings
- View orders from buyers
- Receive investments
- Track sales and ratings

### Buyer
- Browse crop marketplace
- Place orders
- Track order status
- View purchase history

### Investor
- View investment opportunities
- Invest in farms and crops
- Track investment returns
- Monitor active investments

## Pages

- **Home** - Landing page with features and stats
- **Login** - User login
- **Register** - User registration with role selection
- **Marketplace** - Browse available crops
- **Crop Detail** - Detailed crop information
- **Investment Opportunities** - Available investment options
- **Farmer Dashboard** - Farmer's control panel
- **Buyer Dashboard** - Buyer's order management
- **Investor Dashboard** - Investor's portfolio

## Backend Integration

This frontend connects to the Krishak backend API. Make sure the backend is running before starting the frontend application.

## License

MIT
