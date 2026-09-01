import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DonateModal from './DonateModal';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('afm_token');
    localStorage.removeItem('afm_user');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <img src="/afm-logo.png" alt="AFM in Canada Logo" className="logo-image" />
            <span>AFM in Canada</span>
          </Link>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
            <li><Link to="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link></li>
            <li><Link to="/events" onClick={() => setMobileMenuOpen(false)}>Events</Link></li>
            <li><Link to="/join-us" onClick={() => setMobileMenuOpen(false)}>Join Us</Link></li>
            <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
            {user ? (
              <>
                <li><Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link></li>
                <li><button className="donate-btn" onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>Admin</Link></li>
                <li><button className="donate-btn" onClick={() => setShowDonateModal(true)}>Donate</button></li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <DonateModal isOpen={showDonateModal} onClose={() => setShowDonateModal(false)} />
    </>
  );
}

export default Navbar;