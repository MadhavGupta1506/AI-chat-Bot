import React, { useState, useEffect } from 'react';
import { investmentAPI } from '../services/api';
import './Dashboard.css';

const InvestorDashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await investmentAPI.getMyInvestments();
      setInvestments(response.data.investments);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalReturn = investments.reduce((sum, inv) => sum + inv.returnAmount, 0);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Investor Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Invested</h3>
          <p className="stat-number">₹{totalInvested}</p>
        </div>
        <div className="stat-card">
          <h3>Total Returns</h3>
          <p className="stat-number">₹{totalReturn}</p>
        </div>
        <div className="stat-card">
          <h3>Active Investments</h3>
          <p className="stat-number">
            {investments.filter(i => i.status === 'active').length}
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Investments</h2>
        {investments.length === 0 ? (
          <p>No investments yet. Start investing!</p>
        ) : (
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>ROI</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Maturity Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment._id}>
                    <td>{investment.investmentType}</td>
                    <td>₹{investment.investmentAmount}</td>
                    <td>{investment.expectedROI}%</td>
                    <td>{investment.duration} months</td>
                    <td>
                      <span className={`status-badge status-${investment.status}`}>
                        {investment.status}
                      </span>
                    </td>
                    <td>{new Date(investment.maturityDate).toLocaleDateString()}</td>
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

export default InvestorDashboard;
