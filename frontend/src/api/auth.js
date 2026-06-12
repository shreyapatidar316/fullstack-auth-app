import axios from 'axios';

// Use Vite proxy — requests to /api will be forwarded to http://localhost:5000
const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── API Functions ──────────────────────────────

/**
 * Register a new user
 * @param {{ name: string, email: string, password: string }} data
 */
export const signupUser = (data) => API.post('/auth/signup', data);

/**
 * Log in an existing user
 * @param {{ email: string, password: string }} data
 */
export const loginUser = (data) => API.post('/auth/login', data);

/**
 * Get the authenticated user's profile (requires token)
 */
export const getProfile = () => API.get('/auth/profile');

export default API;
