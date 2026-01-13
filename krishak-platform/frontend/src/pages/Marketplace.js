import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cropAPI } from '../services/api';
import './Marketplace.css';

const Marketplace = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchCrops();
  }, [filters]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await cropAPI.getAllCrops({
        ...filters,
        status: 'available',
      });
      setCrops(response.data.crops);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Spices', 'Oilseeds', 'Cash Crops'];

  return (
    <div className="marketplace">
      <h1>Crop Marketplace</h1>
      
      <div className="marketplace-filters">
        <input
          type="text"
          placeholder="Search crops..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />
        
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading crops...</div>
      ) : (
        <div className="crops-grid">
          {crops.length === 0 ? (
            <p className="no-crops">No crops available</p>
          ) : (
            crops.map((crop) => (
              <div key={crop._id} className="crop-card">
                <div className="crop-image">
                  {crop.images && crop.images.length > 0 ? (
                    <img src={crop.images[0].url} alt={crop.cropName} />
                  ) : (
                    <div className="crop-placeholder">🌾</div>
                  )}
                </div>
                <div className="crop-details">
                  <h3>{crop.cropName}</h3>
                  <p className="crop-category">{crop.category}</p>
                  <p className="crop-quantity">
                    {crop.quantity.value} {crop.quantity.unit}
                  </p>
                  <p className="crop-price">
                    ₹{crop.pricePerUnit}/{crop.quantity.unit}
                  </p>
                  {crop.organicCertified && (
                    <span className="organic-badge">🌿 Organic</span>
                  )}
                  <Link to={`/crops/${crop._id}`} className="btn btn-primary btn-small">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
