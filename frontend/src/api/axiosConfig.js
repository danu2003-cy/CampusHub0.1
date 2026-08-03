import axios from 'axios';

/**
 * Shared Axios instance for all API calls.
 * TODO (team): update baseURL for production deployment,
 * and add interceptors here once auth tokens/sessions are introduced.
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
