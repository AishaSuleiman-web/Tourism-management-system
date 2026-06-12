import Footer from "../components/footer";
import {Link } from "react-router-dom";

function NotFound(){
  return(
    <div className="error-page">
      <h1>404</h1>
      <p>Page Not Found</p>
      <p className="text">The page you are looking for doesn't exist or has been moved</p>
      <Link to= "/" className="button-container">
      <button className="home-button">Return Home</button>
      </Link>
      

      
    </div>

  
  )
}

export default NotFound;