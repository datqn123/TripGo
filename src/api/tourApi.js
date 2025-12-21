import axiosClient from "./axiosClient";

const PREFIX = "public";

const tourApi = {
  /**
   * Get list of tours with pagination
   * GET /api/public/tours
   * @param {object} params - { page, size, ... }
   */
  getTours: (params) => axiosClient.get(`${PREFIX}/tours`, { params }),

  getTour: (id) => axiosClient.get(`/admin/tours/${id}`),

  createTour: (data) => axiosClient.post(`/admin/tours`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),

  updateTour: (id, data) => axiosClient.put(`/admin/tours/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" } 
  }),
};

export default tourApi;
