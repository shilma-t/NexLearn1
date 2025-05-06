import axios from 'axios';

const API_BASE_URL = 'http://localhost:9006/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to handle authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const sessionData = localStorage.getItem('skillhub_user_session');
    if (sessionData) {
      try {
        const userData = JSON.parse(sessionData);
        config.headers['Authorization'] = `Bearer ${userData.accessToken}`;
      } catch (e) {
        console.error('Error parsing session data:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('skillhub_user_session');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 