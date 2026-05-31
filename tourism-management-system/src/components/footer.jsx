import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>TourEase</h2>
          <p>
            © 2025 TourEase. All Rights Reserved.
          </p>
        </div>

        <div className="footer-section">
          <Link to="/about" className="footer-link">Our Story</Link>
          <Link to="/destinations" className="footer-link">Destinations</Link>
        </div>

        <div className="footer-section">
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>

        <div className="footer-section">
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer