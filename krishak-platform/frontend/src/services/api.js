import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Farmer API
export const farmerAPI = {
  createProfile: (data) => api.post('/farmers/profile', data),
  getMyProfile: () => api.get('/farmers/profile/me'),
  updateProfile: (data) => api.put('/farmers/profile', data),
  getAllFarmers: (params) => api.get('/farmers', { params }),
  getFarmer: (farmerId) => api.get(`/farmers/${farmerId}`),
};

// Crop API
export const cropAPI = {
  createCrop: (data) => api.post('/crops', data),
  getAllCrops: (params) => api.get('/crops', { params }),
  getMyCrops: () => api.get('/crops/my-crops'),
  getCrop: (cropId) => api.get(`/crops/${cropId}`),
  updateCrop: (cropId, data) => api.put(`/crops/${cropId}`, data),
  deleteCrop: (cropId) => api.delete(`/crops/${cropId}`),
};

// Order API
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getFarmerOrders: (params) => api.get('/orders/farmer-orders', { params }),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  updateOrderStatus: (orderId, data) => api.put(`/orders/${orderId}/status`, data),
  updatePaymentStatus: (orderId, data) => api.put(`/orders/${orderId}/payment`, data),
};

// Investment API
export const investmentAPI = {
  createInvestment: (data) => api.post('/investments', data),
  getMyInvestments: (params) => api.get('/investments/my-investments', { params }),
  getFarmerInvestments: (params) => api.get('/investments/farmer-investments', { params }),
  getOpportunities: (params) => api.get('/investments/opportunities', { params }),
  getInvestment: (investmentId) => api.get(`/investments/${investmentId}`),
  updateInvestmentStatus: (investmentId, data) => api.put(`/investments/${investmentId}/status`, data),
  updateInvestmentPayment: (investmentId, data) => api.put(`/investments/${investmentId}/payment`, data),
};

export default api;
