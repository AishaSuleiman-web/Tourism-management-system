function Navbar(){
  return (
    <nav className="navbar">
      <div className="logo">TravelGo</div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Destinations</li>
        <li>Hotels</li>
        <li>Tour guides</li>
      </ul>
      
      <div className="nav-buttons">
      <button>Sign up</button>
      <button>Log in</button>
      </div>
    </nav>
  );
}

export default Navbar;