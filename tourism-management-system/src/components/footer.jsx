import { Link } from "react-router-dom";

function Footer (){
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">
          <h2>TravelGo</h2>

          <p>
            © 2024 TravelGo Luxury Travel.
            All Rights Reserved.
          </p>
        </div>

        <div className="footer-section">
          <Link to= "/about" className="footer-link">Our Story</Link>
          <Link to= "/destination"  className="footer-link">Destinations</Link>

        </div>

        <div className="footer-section">
          <Link to= "/NotFound" className="footer-link">Terms of Service</Link>
          <Link to= "/NotFound"  className="footer-link">Privacy Policy</Link>
        </div>

        <div className="footer-section">
          <Link to= "/contact"  className="footer-link">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;