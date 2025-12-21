import axiosClient from "./axiosClient";

const PREFIX = "public/home";

/**
 * API helper for public home endpoints.
 * All methods accept an optional `params` object which will be sent as query params.
 */
const homeApi = {
  // GET /api/public/home/vouchers
  getVouchers: (params) => axiosClient.get(`${PREFIX}/vouchers`, { params }),

  // GET /api/public/home/tours
  getTours: (params) => axiosClient.get(`${PREFIX}/tours`, { params }),

  // GET /api/public/home/top-10-locations
  getTop10Locations: () => axiosClient.get(`${PREFIX}/top-10-locations`),

  // GET /api/public/home/search/location/hotel - flexible search, pass { q, location, page, size, ... }
  searchLocationHotel: (params) => axiosClient.get(`${PREFIX}/search/location/hotel`, { params }),

  // GET /api/public/home/locations
  getLocations: (params) => axiosClient.get(`${PREFIX}/locations`, { params }),

  // GET /api/public/home/hotels - supports query params for filters/pagination
  getHotels: (params) => axiosClient.get(`${PREFIX}/hotels`, { params }),

  // GET /api/public/home/flights
  getFlights: (params) => axiosClient.get(`${PREFIX}/flights`, { params }),

  // GET /api/public/locations/dropdown
  getDropdownLocations: () => axiosClient.get(`public/locations/dropdown`),

  // GET /api/public/amenities
  getAmenities: () => axiosClient.get(`public/amenities`),
};

export default homeApi;
