import { useEffect, useRef, useState, useCallback } from 'react';

const IDLE_LIMIT_MS = 20 * 60 * 1000; // log out after 20 minutes of inactivity
const WARNING_BEFORE_MS = 60 * 1000; // warn 60 seconds before that happens

function decodeTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function useSessionTimeout(user, onLogout) {
  const [showWarning, setShowWarning] = useState(false);
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const expiryTimerRef = useRef(null);

  const doLogout = useCallback((reason) => {
    setShowWarning(false);
    onLogout(reason);
  }, [onLogout]);

  const resetIdleTimer = useCallback(() => {
    if (!user) return;
    setShowWarning(false);
    clearTimeout(idleTimerRef.current);
    clearTimeout(warningTimerRef.current);

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, IDLE_LIMIT_MS - WARNING_BEFORE_MS);

    idleTimerRef.current = setTimeout(() => {
      doLogout('idle');
    }, IDLE_LIMIT_MS);
  }, [user, doLogout]);

  // Watch for user activity, reset the idle clock each time
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));
    resetIdleTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimerRef.current);
      clearTimeout(warningTimerRef.current);
    };
  }, [user, resetIdleTimer]);

  // Proactively log out the exact moment the JWT itself expires
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('afm_token');
    if (!token) return;

    const expiryMs = decodeTokenExpiry(token);
    if (!expiryMs) return;

    const msRemaining = expiryMs - Date.now();
    if (msRemaining <= 0) {
      doLogout('expired');
      return;
    }

    clearTimeout(expiryTimerRef.current);
    expiryTimerRef.current = setTimeout(() => doLogout('expired'), msRemaining);

    return () => clearTimeout(expiryTimerRef.current);
  }, [user, doLogout]);

  const stayLoggedIn = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  return { showWarning, stayLoggedIn, forceLogout: () => doLogout('manual') };
}