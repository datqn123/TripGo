import axiosClient from "./axiosClient";

const PREFIX = "public";

const tourApi = {
  /**
   * Get list of tours with pagination
   * GET /api/public/tours
   * @param {object} params - { page, size, ... }
   */
  getTours: (params) => axiosClient.get(`${PREFIX}/tours`, { params }),

  /**
   * Search tours with filters
   * GET /api/public/tours/search
   * @param {object} params - { title, destinationId, duration, priceRange, status, page, size }
   */
  searchTours: (params) => axiosClient.get(`${PREFIX}/tours/search`, { params }),
  
  searchSuggest: (search) => axiosClient.get(`${PREFIX}/tours/search-suggest`, { params: { search } }),

  getTour: (id) => axiosClient.get(`${PREFIX}/tours/${id}`),

  createTour: (data) => axiosClient.post(`/admin/tours`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),

  updateTour: (id, data) => axiosClient.put(`/admin/tours/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" } 
  }),

  deleteTour: (id) => axiosClient.delete(`/admin/tours/${id}`),
};

export default tourApi;
