import React from "react";

const ContactPage = () => {
  return (
    <div className="page-container">
      <div className="contact-section">
        <h1>Contact Us</h1>
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <h3>Email</h3>
              <p>Siraj1704@icloud.com</p>
            </div>
            <div className="info-card">
              <h3>Phone</h3>
              <p>+92 315 5031961</p>
            </div>
            <div className="info-card">
              <h3>Address</h3>
              <p>IBA Sukkur</p>
              <p>Sindh, Pakistan</p>
            </div>
          </div>

          <div className="contact-form">
            <h2>Send us a Message</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Your email" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" placeholder="Message subject" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Your message"
                ></textarea>
              </div>
              <button type="submit" className="btn primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
