import axios from 'axios';

/**
 * Shared Axios configuration instance with default base URL.
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
