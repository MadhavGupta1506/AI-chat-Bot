import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cropAPI } from '../services/api';
import './CropDetail.css';

const CropDetail = () => {
  const { cropId } = useParams();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrop();
  }, [cropId]);

  const fetchCrop = async () => {
    try {
      const response = await cropAPI.getCrop(cropId);
      setCrop(response.data.crop);
    } catch (error) {
      console.error('Error fetching crop:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!crop) return <div className="error">Crop not found</div>;

  return (
    <div className="crop-detail">
      <div className="crop-detail-container">
        <div className="crop-detail-image">
          {crop.images && crop.images.length > 0 ? (
            <img src={crop.images[0].url} alt={crop.cropName} />
          ) : (
            <div className="placeholder">🌾</div>
          )}
        </div>
        
        <div className="crop-detail-info">
          <h1>{crop.cropName}</h1>
          <p className="category">{crop.category}</p>
          
          <div className="detail-section">
            <h3>Price</h3>
            <p className="price">₹{crop.pricePerUnit}/{crop.quantity.unit}</p>
          </div>
          
          <div className="detail-section">
            <h3>Available Quantity</h3>
            <p>{crop.quantity.value} {crop.quantity.unit}</p>
          </div>
          
          {crop.quality && (
            <div className="detail-section">
              <h3>Quality Grade</h3>
              <p>{crop.quality.grade}</p>
            </div>
          )}
          
          {crop.description && (
            <div className="detail-section">
              <h3>Description</h3>
              <p>{crop.description}</p>
            </div>
          )}
          
          {crop.organicCertified && (
            <div className="organic-certified">
              🌿 Certified Organic
            </div>
          )}
          
          {crop.farmerId && crop.farmerId.userId && (
            <div className="detail-section">
              <h3>Farmer Details</h3>
              <p>Name: {crop.farmerId.userId.name}</p>
              <p>Phone: {crop.farmerId.userId.phone}</p>
            </div>
          )}
          
          <button className="btn btn-primary btn-large">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropDetail;
