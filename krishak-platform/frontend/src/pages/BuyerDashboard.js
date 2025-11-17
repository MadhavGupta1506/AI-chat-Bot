import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './Dashboard.css';

const BuyerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Buyer Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">
            {orders.filter(o => o.orderStatus === 'delivered').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">
            {orders.filter(o => o.orderStatus !== 'delivered').length}
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet. Start shopping!</p>
        ) : (
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderId}</td>
                    <td>{order.items.length} items</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`status-badge status-${order.orderStatus}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
