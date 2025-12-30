import axiosClient from "./axiosClient";

const PREFIX = "public";

const tourApi = {
  
  getTours: (params) => axiosClient.get(`${PREFIX}/tours`, { params }),

  searchTours: (params) => axiosClient.get(`${PREFIX}/tours/search`, { params }),
  
  searchSuggest: (search) => axiosClient.get(`${PREFIX}/tours/search-suggest`, { params: { search } }),

  getTour: (id) => axiosClient.get(`${PREFIX}/tours/${id}`),

  getVouchersTour: () => axiosClient.get(`${PREFIX}/vouchers/tour-page`),

  createTour: (data) => axiosClient.post(`/admin/tours`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),

  updateTour: (id, data) => axiosClient.put(`/admin/tours/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" } 
  }),

  deleteTour: (id) => axiosClient.delete(`/admin/tours/${id}`),
};

export default tourApi;
