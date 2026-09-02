import { useState, useRef, useEffect } from 'react';
import './ShareMenu.css';

function ShareMenu({ url, title }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  };

  const handleShare = (e, platform) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setOpen(false);
  };

  const toggleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <div className="share-menu" ref={menuRef}>
      <button className="share-menu-trigger" onClick={toggleOpen} aria-label="Share options">
        •••
      </button>
      {open && (
        <div className="share-menu-dropdown">
          <button onClick={(e) => handleShare(e, 'whatsapp')} className="share-menu-item">
            <span>💬</span> WhatsApp
          </button>
          <button onClick={(e) => handleShare(e, 'facebook')} className="share-menu-item">
            <span>f</span> Facebook
          </button>
          <button onClick={(e) => handleShare(e, 'twitter')} className="share-menu-item">
            <span>𝕏</span> Twitter
          </button>
          <button onClick={handleCopy} className="share-menu-item">
            <span>🔗</span> Copy Link
          </button>
        </div>
      )}
    </div>
  );
}

export default ShareMenu;