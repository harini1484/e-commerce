import React from "react";

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-top">
      <div>
        <h4>Customer Service</h4>
        <p>Help & Support</p>
        <p>Shipping & Returns</p>
      </div>
      <div>
        <h4>About</h4>
        <p>About us</p>
        <p>Careers</p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>support@example.com</p>
        <p>+91 98765 43210</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} Harini Electronics</p>
    </div>
  </footer>
);

export default Footer;
