import axiosClient from "./axiosClient";

const PREFIX = "public/hotels";

/**
 * API helper for public hotel endpoints.
 * All methods accept optional params object which will be sent as query params.
 */
const hotelApi = {
  /**
   * Get hotel details by ID
   * GET /api/public/hotels/{id}
   * @param {number} id - Hotel ID
   * @returns {Promise} Hotel details
   */
  getHotelById: (id) => axiosClient.get(`${PREFIX}/${id}`),

  /**
   * Get top 10 hotels by location
   * GET /api/public/hotels/top-10-locations
   * @param {object} params - Optional query parameters
   * @returns {Promise} Top 10 hotels list
   */
  getTop10Locations: (params) => axiosClient.get(`${PREFIX}/top-10-locations`, { params }),

  /**
   * Search hotels with filters
   * GET /api/public/hotels/search
   * @param {object} params - Search parameters (e.g., { location, name, starRating, minPrice, maxPrice, page, size })
   * @returns {Promise} Search results
   */
  searchHotels: (params) => axiosClient.get(`${PREFIX}/search`, { params }),
};

export default hotelApi;
