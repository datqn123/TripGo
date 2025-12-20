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

  /**
   * Get flight cards for display
   * GET /api/public/flights/cards
   * @param {object} params - Optional query parameters (page, size)
   * @returns {Promise} Flight cards list
   */
  getFlightCards: (params) => axiosClient.get(`${PREFIX}/cards`, { params }),

  /**
   * Search flights with filters
   * GET /api/public/flights/search
   * @param {object} params - Search parameters (departureLocationId, arrivalLocationId, departureDate, minPrice, maxPrice, airlineIds, page, size)
   * @returns {Promise} Search results
   */
  searchFlights: (params) => axiosClient.get(`${PREFIX}/search`, { params }),
};

export default flightApi;
