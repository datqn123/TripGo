import axiosClient from "./axiosClient";

const PREFIX = "public/hotels";

/**
 * API helper for public hotel endpoints.
 * All methods accept optional params object which will be sent as query params.
 */
const hotelApi = {
  getHotelById: (id) => axiosClient.get(`${PREFIX}/${id}`),
  getTop10Locations: (params) => axiosClient.get(`${PREFIX}/top-10-locations`, { params }),
  searchHotels: (params) => axiosClient.get(`${PREFIX}/search`, { params }),
  searchHotelsEs: (params) => axiosClient.get(`${PREFIX}/search-hotel`, { params }),
};

export default hotelApi;
