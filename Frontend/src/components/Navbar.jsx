import { Link, useLocation } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      {/* BRAND */}
      <div className="nav-brand">
        <h2>💙 CareMaa</h2>
      </div>

      {/* LINKS */}
      <div className="nav-links">
        <Link to="/" className={isActive("/")}>
          🏠 Home
        </Link>

        <Link to="/tracker" className={isActive("/tracker")}>
          📅 Period Tracker
        </Link>

        <Link to="/pregnancy" className={isActive("/pregnancy")}>
          🤰 Pregnancy
        </Link>

        <Link to="/vaccination" className={isActive("/vaccination")}>
          💉 Vaccination
        </Link>

        <Link to="/nutrition" className={isActive("/nutrition")}>
          🥗 Nutrition
        </Link>

        <Link to="/risk" className={isActive("/risk")}>
          🤖 AI Risk
        </Link>

        {/* ⭐ NEW COMMUNITY LINK */}
        <Link to="/community" className={isActive("/community")}>
          🌸 Community
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;