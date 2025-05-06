const SESSION_KEY = "skillhub_user_session";
const SESSION_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Save user session to localStorage.
 * @param {Object} userData - Object containing user session info.
 */
export const saveSession = (userData) => {
  if (userData && typeof userData === "object") {
    const sessionData = {
      ...userData,
      timestamp: Date.now(), // Add timestamp for session expiration check
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } else {
    console.warn("Invalid session data. Must be an object.");
  }
};

/**
 * Get current session data from localStorage.
 * @returns {Object|null} - Parsed session object or null if not found.
 */
export const getSession = () => {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (err) {
    console.error("Failed to parse session data:", err);
    return null;
  }
};

/**
 * Clear the current user session from localStorage.
 */
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Check whether a user session exists and is not expired.
 * @returns {boolean} - Whether the user is logged in.
 */
export const isLoggedIn = () => {
  const session = getSession();
  if (session) {
    // Check if the session is expired
    const sessionAge = Date.now() - session.timestamp;
    if (sessionAge > SESSION_EXPIRY_TIME) {
      clearSession(); // Clear expired session
      return false; // Session expired
    }
    return session.email ? true : false;
  }
  return false;
};
