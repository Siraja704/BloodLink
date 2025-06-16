import React from "react";

const DonorPage = () => {
  return (
    <div className="page-container">
      <div className="donor-section">
        <h1>Become a Blood Donor</h1>
        <div className="donor-form">
          <form>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="e.g. Ahmed Khan" />
            </div>
            <div className="form-group">
              <label htmlFor="bloodType">Blood Type</label>
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
              <label htmlFor="lastDonation">Last Donation Date</label>
              <input type="date" id="lastDonation" />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                placeholder="e.g. Karachi, Lahore, Sukkur"
              />
            </div>
            <button type="submit" className="btn primary">
              Register as Donor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorPage;
