import {Link } from "react-router-dom"

function Navbar(){
  return (
    <nav className="navbar">
      <div className="logo">TravelGo</div>

      <div className="links">
        <Link to = "/" className="nav-links" >Home</Link>
        <Link to = "/destinations" className="nav-links" >Destinations</Link>
        <Link to = "/hotels" className="nav-links" >Hotels</Link>
        <Link to = "/tours" className="nav-links" >Tour guides</Link>
        
      </div>
      
      <div className="nav-buttons">
      <button>Sign up</button>
      <button>Log in</button>
      </div>
    </nav>
  );
}

export default Navbar;