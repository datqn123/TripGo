import homeApi from "../api/homeApi";

/**
 * Fetch hotels from API and return the JSON shape:
 * {
 *   code: number,
 *   message: string,
 *   result: [{
 *     id: number,
 *     name: string,
 *     address: string,
 *     starRating: number,
 *     locationName: string,
 *     thumbnail: string,
 *     minPrice: number,
 *     hotelType: string,
 *     isFavorite: boolean
 *   }]
 * }
 *
 * On error, the function returns a fallback response with empty result array.
 */
export async function fetchHotels(params) {
  try {
    const res = await homeApi.getHotels(params);
    const api = res?.data || {};
    const apiResult = Array.isArray(api.result) ? api.result : [];

    // Map the API result to ensure all fields are present
    const mapped = apiResult.map((hotel) => ({
      id: hotel.id ?? 0,
      name: hotel.name || "",
      address: hotel.address || "",
      starRating: hotel.starRating ?? 0,
      locationName: hotel.locationName || "",
      thumbnail: hotel.thumbnail || "",
      minPrice: hotel.minPrice ?? 0,
      hotelType: hotel.hotelType || "",
      isFavorite: hotel.isFavorite ?? false,
    }));

    return {
      code: typeof api.code !== "undefined" ? api.code : 0,
      message: api.message || "Success",
      result: mapped,
    };
  } catch (err) {
    console.error("fetchHotels error:", err);
    // Return fallback response on error
    return {
      code: -1,
      message: err?.message || "Failed to fetch hotels",
      result: [],
    };
  }
}

export default { fetchHotels };
