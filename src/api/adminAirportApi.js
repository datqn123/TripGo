import adminAxiosClient from "./adminAxiosClient";

const adminAirportApi = {
  // 1. Get List
  getAll: () => {
    return adminAxiosClient.get('/airports');
  },

  // 2. Get Detail
  getById: (id) => {
    return adminAxiosClient.get(`/airports/${id}`);
  },

  // 3. Create
  create: (data) => {
    return adminAxiosClient.post('/airports', data);
  },

  // 4. Update
  update: (id, data) => {
    return adminAxiosClient.put(`/airports/${id}`, data);
  },

  // 5. Delete
  delete: (id) => {
    return adminAxiosClient.delete(`/airports/${id}`);
  }
};

export default adminAirportApi;
