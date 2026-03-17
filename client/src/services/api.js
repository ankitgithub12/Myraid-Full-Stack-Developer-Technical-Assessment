import axios from 'axios';

const api = axios.create({
  // For local dev: set VITE_API_URL=http://localhost:5000/api in client/.env
  // For production: set VITE_API_URL=https://myraid-server.onrender.com/api in Render dashboard
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Required for httpOnly cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear any stale local state
      localStorage.removeItem('userInfo');
      // Use replace() to avoid polluting browser history with broken back-button loops
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);
// ─────────────────────────────────────────────────────────────────────────────

export default api;

