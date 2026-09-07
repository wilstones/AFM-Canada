import './SessionWarningModal.css';

function SessionWarningModal({ onStayLoggedIn, onLogoutNow }) {
  return (
    <div className="session-warning-overlay">
      <div className="session-warning-box">
        <h3>Still there?</h3>
        <p>You've been inactive for a while. For security, you'll be logged out in about a minute.</p>
        <div className="session-warning-actions">
          <button className="btn-primary" onClick={onStayLoggedIn}>Stay Logged In</button>
          <button className="btn-secondary" onClick={onLogoutNow}>Log Out Now</button>
        </div>
      </div>
    </div>
  );
}

export default SessionWarningModal;