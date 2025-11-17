import React, { useState, useEffect } from 'react';
import { cropAPI, farmerAPI } from '../services/api';
import './Dashboard.css';

const FarmerDashboard = () => {
  const [crops, setCrops] = useState([]);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cropsRes, profileRes] = await Promise.all([
        cropAPI.getMyCrops(),
        farmerAPI.getMyProfile().catch(() => ({ data: { farmer: null } }))
      ]);
      setCrops(cropsRes.data.crops);
      setFarmerProfile(profileRes.data.farmer);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Farmer Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Crops</h3>
          <p className="stat-number">{crops.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-number">₹{farmerProfile?.totalSales || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Rating</h3>
          <p className="stat-number">⭐ {farmerProfile?.rating || 0}/5</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Crops</h2>
        {crops.length === 0 ? (
          <p>No crops listed yet. Start listing your crops!</p>
        ) : (
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Crop Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop) => (
                  <tr key={crop._id}>
                    <td>{crop.cropName}</td>
                    <td>{crop.category}</td>
                    <td>{crop.quantity.value} {crop.quantity.unit}</td>
                    <td>₹{crop.pricePerUnit}</td>
                    <td>
                      <span className={`status-badge status-${crop.status}`}>
                        {crop.status}
                      </span>
                    </td>
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

export default FarmerDashboard;
