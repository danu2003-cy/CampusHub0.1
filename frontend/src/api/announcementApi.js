import apiClient from './axiosConfig';

const announcementApi = {
  getAll: () => apiClient.get('/announcements'),
  getById: (id) => apiClient.get(`/announcements/${id}`),
  create: (data) => apiClient.post('/announcements', data),
  update: (id, data) => apiClient.put(`/announcements/${id}`, data),
  remove: (id) => apiClient.delete(`/announcements/${id}`),
};

export default announcementApi;
