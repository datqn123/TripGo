import adminAxiosClient from "./adminAxiosClient";

const adminApi = {
  getTotalInfo: () => adminAxiosClient.get("total-info"),
  getHotelById: (id) => adminAxiosClient.get(`hotels/${id}`),
  createHotel: (data) => adminAxiosClient.post("hotels", data, {
    headers: { "Content-Type": undefined },
  }),
  updateHotel: (id, data) => adminAxiosClient.put(`hotels/${id}`, data, {
    headers: { "Content-Type": undefined },
  }),
  deleteHotel: (id) => adminAxiosClient.delete(`hotels/${id}`),
  getHotels: (params) => adminAxiosClient.get(`hotels/navigate`, { params }),
};

export default adminApi;
