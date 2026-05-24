import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
      
        <div className="footer-logo-section">
          <h2>TourEase</h2>
          <p className="footer-description">
            Elevating Nigerian Hospitality with unparalleled luxury and local expertise.
          </p>
          <p className="footer-copyright">
            © 2025 TourEase. All Rights Reserved.
          </p>
        </div>

       
        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <Link to="/about">Our Story</Link>
            <Link to="/destinations">Destinations</Link>
            <Link to="/hotels">Hotels</Link>
          </div>
        </div>

        
        <div className="footer-section">
          <h3>Legal</h3>
          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>

        
        <div className="footer-section">
          <h3>Support</h3>
          <div className="footer-links">
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;