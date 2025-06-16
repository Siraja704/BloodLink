import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>BloodDonate</h3>
          <p>Making blood donation accessible and efficient</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="/about">About Us</a>
          <a href="/donate">Donate</a>
          <a href="/contact">Contact</a>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: Siraj1704@icloud.com</p>
          <p>Phone: +92 315 5031961</p>
          <p>Address: IBA Sukkur, Sindh, Pakistan</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 BloodDonate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
