import axiosClient from "./axiosClient";

const voucherApi = {
  // 1. Get detailed voucher by ID
  getById: (id) => {
    return axiosClient.get(`/public/vouchers/${id}`);
  },

  // 2. Get vouchers for Hotel page
  getHotelVouchers: () => {
    return axiosClient.get('/public/vouchers/hotel-page');
  },

  // 3. Get vouchers for Flight page
  getFlightVouchers: () => {
    return axiosClient.get('/public/vouchers/flight-page');
  },

  // 4. Get vouchers for Tour page
  getTourVouchers: () => {
    return axiosClient.get('/public/vouchers/tour-page');
  }
};

export default voucherApi;
