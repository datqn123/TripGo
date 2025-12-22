import adminAxiosClient from "./adminAxiosClient";

const adminBookingApi = {
  // 1. Get all bookings
  // API: GET /api/admin/bookings
  getAll: (params) => {
    return adminAxiosClient.get('/bookings', { params });
  },

  // 2. Get booking details by ID
  // API: GET /api/admin/bookings/{id}
  getById: (id) => {
    return adminAxiosClient.get(`/bookings/${id}`);
  },

  // 3. Update booking status
  // API: PUT /api/admin/bookings/{id}/status?status={status}
  // status: PENDING, CONFIRMED, CANCELLED, REJECTED, PAID
  updateStatus: (id, status) => {
      return adminAxiosClient.put(`/bookings/${id}/status`, null, {
          params: { status }
      });
  },

  // 4. Update booking info (Contact, Payment Method)
  // API: PUT /api/admin/bookings/{id}
  updateInfo: (id, data) => {
      return adminAxiosClient.put(`/bookings/${id}`, data);
  }
};

export default adminBookingApi;
