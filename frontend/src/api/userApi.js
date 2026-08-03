import apiClient from './axiosConfig';

const userApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  remove: (id) => apiClient.delete(`/users/${id}`),
};

export default userApi;
