import { useState, useEffect } from 'react';
import { blogAPI } from '../utils/api';
import './ReactionBar.css';

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'pray', emoji: '🙏', label: 'Amen' },
  { type: 'amen', emoji: '🙌', label: 'Hallelujah' }
];

function ReactionBar({ blogId, initialReactions, compact = false }) {
  const [reactions, setReactions] = useState(
    initialReactions || { like: 0, love: 0, pray: 0, amen: 0 }
  );
  const [userReacted, setUserReacted] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`afm_reactions_${blogId}`) || '{}');
    setUserReacted(stored);
  }, [blogId]);

  const handleReact = async (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (userReacted[type]) return;

    setReactions((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    const updated = { ...userReacted, [type]: true };
    setUserReacted(updated);
    localStorage.setItem(`afm_reactions_${blogId}`, JSON.stringify(updated));

    try {
      await blogAPI.react(blogId, type);
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  return (
    <div className={`reaction-bar ${compact ? 'compact' : ''}`}>
      {REACTIONS.map(({ type, emoji, label }) => (
        <button
          key={type}
          className={`reaction-btn ${userReacted[type] ? 'reacted' : ''}`}
          onClick={(e) => handleReact(e, type)}
          title={label}
        >
          <span className="reaction-emoji">{emoji}</span>
          <span className="reaction-count">{reactions[type] || 0}</span>
        </button>
      ))}
    </div>
  );
}

export default ReactionBar;