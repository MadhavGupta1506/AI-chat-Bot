import React, { useState, useEffect } from 'react';
import { investmentAPI } from '../services/api';
import './InvestmentOpportunities.css';

const InvestmentOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await investmentAPI.getOpportunities();
      setOpportunities(response.data.opportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="investment-opportunities">
      <h1>Investment Opportunities</h1>
      <p className="subtitle">Invest in agriculture and support farmer growth</p>

      {opportunities.length === 0 ? (
        <p className="no-opportunities">No investment opportunities available at the moment.</p>
      ) : (
        <div className="opportunities-grid">
          {opportunities.map((opp) => (
            <div key={opp._id} className="opportunity-card">
              <h3>{opp.cropName}</h3>
              <p className="category">{opp.category}</p>
              
              <div className="investment-details">
                <div className="detail-row">
                  <span>Minimum Investment:</span>
                  <strong>₹{opp.investmentDetails?.minimumInvestment || 'N/A'}</strong>
                </div>
                <div className="detail-row">
                  <span>Expected ROI:</span>
                  <strong>{opp.investmentDetails?.expectedROI || 'N/A'}%</strong>
                </div>
                <div className="detail-row">
                  <span>Harvest Cycle:</span>
                  <strong>{opp.investmentDetails?.harvestCycle || 'N/A'} months</strong>
                </div>
              </div>

              {opp.farmerId && opp.farmerId.userId && (
                <div className="farmer-info">
                  <p>Farmer: {opp.farmerId.userId.name}</p>
                  <p>Rating: ⭐ {opp.farmerId.rating || 0}/5</p>
                </div>
              )}

              <button className="btn btn-primary">
                Invest Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestmentOpportunities;
