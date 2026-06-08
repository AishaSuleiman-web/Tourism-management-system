import { Link } from "react-router-dom";
import "../Auth.css";

function Login() {
  return (
    <div className="auth-container">

      <div className="auth-box">

        
        <img
          src="/assets/logo.png"
          alt="NaijaVoyage Logo"
          className="auth-logo"
        />


        <h1>NaijaVoyage</h1>
        <p>Your gateway to Nigerian adventures</p>

        <h2>Login</h2>  
                         
        <div className="input-group">
          <input type="email" placeholder="Email" />
        </div>

        <div className="input-group">
          <input type="password" placeholder="Password" />
        </div>

        <button className="auth-button">Login</button>

        <p className="switch-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

      </div>
    </div>
  );
}


export default Login;