import React from "react";

const AboutPage = () => {
  return (
    <div className="page-container">
      <div className="about-section">
        <h1>About BloodDonate</h1>
        <div className="about-content">
          <div className="mission-section">
            <h2>Our Mission</h2>
            <p>
              BloodDonate is dedicated to connecting blood donors with those in
              need across Pakistan, making the process of blood donation and
              finding donors more accessible and efficient than ever before.
            </p>
          </div>

          <div className="impact-section">
            <h2>Our Impact</h2>
            <div className="impact-stats">
              <div className="stat-card">
                <h3>15,000+</h3>
                <p>Lives Saved in Pakistan</p>
              </div>
              <div className="stat-card">
                <h3>7,000+</h3>
                <p>Active Donors (Karachi, Lahore, Islamabad, Sukkur)</p>
              </div>
              <div className="stat-card">
                <h3>200+</h3>
                <p>Partner Hospitals Nationwide</p>
              </div>
            </div>
          </div>

          <div className="team-section">
            <h2>Our Team</h2>
            <p>
              We are a dedicated team of healthcare professionals,
              technologists, and volunteers from all over Pakistan, working
              together to make blood donation more accessible and efficient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
