import { useState } from 'react';
import './DonateModal.css';

// Update this if your real PayPal business account differs from your Interac email
const PAYPAL_BUSINESS_EMAIL = 'administrator@afmincanada.org';
const INTERAC_EMAIL = 'administrator@afmincanada.org';

function DonateModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(INTERAC_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayPalDonate = () => {
    const url = `https://www.paypal.com/donate?business=${encodeURIComponent(PAYPAL_BUSINESS_EMAIL)}&currency_code=CAD`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="donate-modal-overlay" onClick={onClose}>
      <div className="donate-modal" onClick={(e) => e.stopPropagation()}>
        <button className="donate-modal-close" onClick={onClose} aria-label="Close">×</button>

        <h2>Support Our Mission</h2>
        <p className="donate-modal-subtitle">
          "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over..." — Luke 6:38
        </p>

        <div className="donate-options">
          <div className="donate-option">
            <div className="donate-option-icon">💳</div>
            <h3>Donate with PayPal</h3>
            <p>Pay securely with your PayPal account, debit, or credit card.</p>
            <button className="btn-primary" onClick={handlePayPalDonate}>
              Continue to PayPal
            </button>
          </div>

          <div className="donate-option">
            <div className="donate-option-icon">🏦</div>
            <h3>Interac e-Transfer</h3>
            <p>Send an e-Transfer directly from your Canadian bank account to:</p>
            <div className="donate-email-box">
              <span>{INTERAC_EMAIL}</span>
              <button className="btn-copy" onClick={handleCopyEmail}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="donate-note">
              If your bank prompts for a security question, please contact the church office first to confirm the answer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonateModal;