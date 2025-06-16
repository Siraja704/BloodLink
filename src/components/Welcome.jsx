import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="hero-section">
        <h1>Welcome to Blood Donation Platform</h1>
        <p>Join us in saving lives across Pakistan through blood donation</p>
        <div className="cta-buttons">
          <Link to="/Register" className="btn primary">
            Become a Donor
          </Link>
          <Link to="/user" className="btn secondary">
            Find Donors
          </Link>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h3>Easy Donation Process</h3>
          <p>
            Simple and quick registration process for donors in Karachi, Lahore,
            Islamabad, Sukkur, and more
          </p>
        </div>
        <div className="feature-card">
          <h3>Save Lives in Pakistan</h3>
          <p>Your donation can save up to three lives in your community</p>
        </div>
        <div className="feature-card">
          <h3>Track Your Impact</h3>
          <p>Monitor your donation history and impact across Pakistan</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
