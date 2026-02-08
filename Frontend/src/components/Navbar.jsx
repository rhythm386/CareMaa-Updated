import { Link, useLocation } from "react-router-dom";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import './Navbar.css';

function Navbar({ isDark = false, onToggleDark }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'DASHBOARD' },
    { path: '/tracker', label: 'PERIOD TRACKER' },
    { path: '/pregnancy', label: 'PREGNANCY' },
    { path: '/vaccination', label: 'VACCINATION' },
    { path: '/nutrition', label: 'NUTRITION' },
    { path: '/risk', label: 'AI RISK' },
    { path: '/community', label: 'COMMUNITY' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-logo-text">Care Maa</span>
      </div>

      <div className="nav-links">
        {navItems.map(({ path, label }) =>
          path === '/' ? (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? 'active' : ''}`}
            >
              {label}
            </Link>
          ) : (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? 'active' : ''}`}
            >
              {label}
            </Link>
          )
        )}
      </div>

      <div className="nav-actions">
        <button
          type="button"
          onClick={onToggleDark}
          className="nav-toggle-dark"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <LightModeIcon sx={{ fontSize: 20 }} />
          ) : (
            <DarkModeIcon sx={{ fontSize: 20 }} />
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
