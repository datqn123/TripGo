import adminAxiosClient from "./adminAxiosClient";

const adminAirlineApi = {
  // 1. Get List
  getAll: () => {
    return adminAxiosClient.get('/airlines');
  },

  // 2. Get Detail
  getById: (id) => {
    return adminAxiosClient.get(`/airlines/${id}`);
  },

  // 3. Create
  create: (data) => {
    return adminAxiosClient.post('/airlines', data);
  },

  // 4. Update
  update: (id, data) => {
    return adminAxiosClient.put(`/airlines/${id}`, data);
  },

  // 5. Delete
  delete: (id) => {
    return adminAxiosClient.delete(`/airlines/${id}`);
  }
};

export default adminAirlineApi;
