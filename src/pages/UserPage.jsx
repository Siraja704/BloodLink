import React from "react";

const UserPage = () => {
  return (
    <div className="page-container">
      <div className="user-section">
        <h1>Find Blood Donors</h1>
        <div className="search-section">
          <div className="search-filters">
            <div className="form-group">
              <label htmlFor="bloodType">Blood Type Required</label>
              <select id="bloodType">
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                placeholder="Enter your location"
              />
            </div>
            <button className="btn primary">Search Donors</button>
          </div>
        </div>
        <div className="donors-list">
          <h2>Available Donors</h2>
          <div className="donor-cards">
            {/* Pakistani donor cards */}
            <div className="donor-card">
              <h3>Ahmed Khan</h3>
              <p>Blood Type: A+</p>
              <p>Location: Karachi</p>
              <p>Last Donation: 2 months ago</p>
              <button className="btn secondary">Contact</button>
            </div>
            <div className="donor-card">
              <h3>Fatima Ali</h3>
              <p>Blood Type: O-</p>
              <p>Location: Lahore</p>
              <p>Last Donation: 1 month ago</p>
              <button className="btn secondary">Contact</button>
            </div>
            <div className="donor-card">
              <h3>Usman Siddiqui</h3>
              <p>Blood Type: B+</p>
              <p>Location: Islamabad</p>
              <p>Last Donation: 3 months ago</p>
              <button className="btn secondary">Contact</button>
            </div>
            <div className="donor-card">
              <h3>Ayesha Noor</h3>
              <p>Blood Type: AB+</p>
              <p>Location: Sukkur</p>
              <p>Last Donation: 2 weeks ago</p>
              <button className="btn secondary">Contact</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
