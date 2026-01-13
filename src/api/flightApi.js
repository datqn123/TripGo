import axiosClient from "./axiosClient";

const PREFIX = "public/flights";

/**
 * API helper for public flight endpoints.
 * All methods accept optional params object which will be sent as query params.
 */
const flightApi = {
  /**
   * Get flight details by ID including seat classes
   * GET /api/public/flights/{id}
   * @param {number} id - Flight ID
   * @returns {Promise} Flight details with seat classes
   */
  getFlightById: (id) => axiosClient.get(`${PREFIX}/${id}`),

  getFlightCards: (params) => axiosClient.get(`${PREFIX}/cards`, { params }),

  searchFlights: (params) => axiosClient.get(`${PREFIX}/search`, { params }),
};

export default flightApi;
