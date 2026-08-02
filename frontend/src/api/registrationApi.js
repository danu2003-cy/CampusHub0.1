import apiClient from './axiosConfig';

// TODO (Member 5): use these functions inside the Registrations page.
const registrationApi = {

  // Get all registrations
  getAll: () =>
      apiClient.get('/registrations'),



  // Get one registration
  getById: (id) =>
      apiClient.get(`/registrations/${id}`),



  // Student registers for event
  create: (data) =>
      apiClient.post('/registrations', data),



  // Confirm or cancel registration
  update: (id, data) =>
      apiClient.put(`/registrations/${id}`, data),



  // Delete registration
  remove: (id) =>
      apiClient.delete(`/registrations/${id}`),



  // Cancel registration (shortcut)
  cancel: (id) =>
      apiClient.put(
          `/registrations/${id}`,
          {
            status: "CANCELLED"
          }
      )
};

export default registrationApi;
