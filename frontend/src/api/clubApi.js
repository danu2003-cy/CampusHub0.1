import apiClient from './axiosConfig';

const clubApi = {
  getAll: () => apiClient.get('/clubs'),

  getById: (id) => apiClient.get(`/clubs/${id}`),

  create: (data) => apiClient.post('/clubs', data),

  update: (id, data) => apiClient.put(`/clubs/${id}`, data),

  remove: (id) => apiClient.delete(`/clubs/${id}`),

  join: (clubId, userId) =>
      apiClient.post(`/clubs/${clubId}/members/${userId}`),

  leave: (clubId, userId) =>
      apiClient.delete(`/clubs/${clubId}/members/${userId}`),

  getMembers: (clubId) =>
      apiClient.get(`/clubs/${clubId}/members`),
};

export default clubApi;