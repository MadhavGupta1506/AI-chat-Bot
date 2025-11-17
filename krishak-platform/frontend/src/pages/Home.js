import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Krishak</h1>
          <p className="hero-subtitle">
            Empowering Farmers, Connecting Communities
          </p>
          <p className="hero-description">
            A digital marketplace directly connecting farmers with consumers, retailers, and investors.
            Eliminating intermediaries, ensuring fair prices, and fostering sustainable agriculture.
          </p>
          
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/marketplace" className="btn btn-secondary">
                Explore Marketplace
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Krishak?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>Direct Market Access</h3>
            <p>
              Farmers can list their crops directly and receive fair prices without middlemen.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Investment Opportunities</h3>
            <p>
              Investors can support farmers and earn returns by investing in crops and farms.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Transactions</h3>
            <p>
              Safe and transparent payment system ensuring trust for all stakeholders.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>AI-Powered Pricing</h3>
            <p>
              Smart pricing engine recommends optimal rates based on market trends.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Logistics Support</h3>
            <p>
              Integrated delivery and storage management for timely distribution.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Accessibility</h3>
            <p>
              Mobile-first platform with regional language support for rural farmers.
            </p>
          </div>
        </div>
      </section>

      <section className="roles">
        <h2>Join Us As</h2>
        <div className="roles-grid">
          <div className="role-card">
            <h3>👨‍🌾 Farmer</h3>
            <p>List your crops, manage orders, and receive investments</p>
            {!isAuthenticated && (
              <Link to="/register?role=farmer" className="btn btn-outline">
                Register as Farmer
              </Link>
            )}
          </div>
          
          <div className="role-card">
            <h3>🛒 Buyer</h3>
            <p>Purchase fresh produce directly from farmers</p>
            {!isAuthenticated && (
              <Link to="/register?role=buyer" className="btn btn-outline">
                Register as Buyer
              </Link>
            )}
          </div>
          
          <div className="role-card">
            <h3>💼 Investor</h3>
            <p>Invest in agriculture and support farmer growth</p>
            {!isAuthenticated && (
              <Link to="/register?role=investor" className="btn btn-outline">
                Register as Investor
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="stats">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Farmers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5000+</div>
            <div className="stat-label">Crops Listed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">₹1Cr+</div>
            <div className="stat-label">Transactions</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Investments</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
