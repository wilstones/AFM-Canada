import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>AFM in Canada</h3>
          <p>Apostolic Faith Mission - A missionary church serving God and community since 1908.</p>
          <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
            "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over..." - Luke 6:38
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/about">About Us</Link>
          <Link to="/blog">Sermons</Link>
          <Link to="/events">Events</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <a href="#">AFM History</a>
          <a href="#">Our Leadership</a>
          <a href="#">Ministries</a>
          <a href="#">Weekly Calendar</a>
        </div>

        <div className="footer-section">
          <h3>Connect</h3>
          <p>Follow us on social media for updates, inspirational content, and community events.</p>
          <div className="social-links">
            <a href="https://www.facebook.com/afmincanada" target="_blank" rel="noopener noreferrer">f</a>
            <a href="https://instagram.com/afmincanada" target="_blank" rel="noopener noreferrer">📷</a>
            <a href="https://youtube.com/@afmincanada" target="_blank" rel="noopener noreferrer">▶</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AFM in Canada - Hamilton Assembly. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
