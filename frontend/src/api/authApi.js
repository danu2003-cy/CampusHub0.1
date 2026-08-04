import apiClient from './axiosConfig';

const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
};

export default authApi;
