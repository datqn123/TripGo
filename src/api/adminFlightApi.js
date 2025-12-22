import adminAxiosClient from "./adminAxiosClient";

const adminFlightApi = {
  getAll: (params) => {
    return adminAxiosClient.get('/flights', { params });
  },
  getById: (id) => {
    return adminAxiosClient.get(`/flights/${id}`);
  },
  create: (data, imageFile) => {
    const formData = new FormData();
    // Append JSON string
    formData.append('flight', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    // Append Image file
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return adminAxiosClient.post('/flights', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  update: (id, data, imageFile) => {
    const formData = new FormData();
    // Append JSON string
    formData.append('flight', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    // Append Image file if exists
    if (imageFile) {
        formData.append('image', imageFile);
    }

    return adminAxiosClient.put(`/flights/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  delete: (id) => {
    return adminAxiosClient.delete(`/flights/${id}`);
  }
};

export default adminFlightApi;
