import { Link, useLocation } from "react-router-dom";
import './Navbar.css';  // Add CSS file below

function Navbar() {
  const location = useLocation(); // For active link highlighting
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>🚀 CareMaa</h2>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "nav-link active" : "nav-link"}>
          🏠 Home
        </Link>
        
        <Link to="/tracker" className={location.pathname === "/tracker" ? "nav-link active" : "nav-link"}>
          📅 Period Tracker
        </Link>
        
        <Link to="/pregnancy" className={location.pathname === "/pregnancy" ? "nav-link active" : "nav-link"}>
          🤰 Pregnancy
        </Link>
        
        <Link to="/vaccination" className={location.pathname === "/vaccination" ? "nav-link active" : "nav-link"}>
          💉 Vaccination
        </Link>
        
        <Link to="/nutrition" className={location.pathname === "/nutrition" ? "nav-link active" : "nav-link"}>
          🥗 Nutrition
        </Link>
        
        <Link to="/risk" className={location.pathname === "/risk" ? "nav-link active" : "nav-link"}>
          🤖 AI Risk
        </Link>
        
        <Link to="/community" className={location.pathname === "/community" ? "nav-link active" : "nav-link"}>
          👥 Community
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
