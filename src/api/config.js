// API Configuration
// Change this URL to switch between local development and production

// Production
// export const API_BASE_URL = "https://tripgo-api.onrender.com/api";

// Local development (uncomment to use)
export const API_BASE_URL = "http://localhost:8080/api";

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Public API endpoints (no auth required)
export const PUBLIC_API = {
    // Locations
    VN_LOCATIONS: `${API_BASE_URL}/public/locations/vn-location`,
    COUNTRY_LOCATIONS: `${API_BASE_URL}/public/locations/country`,
    DROPDOWN_LOCATIONS: `${API_BASE_URL}/public/locations/dropdown`,
    
    // Hotels
    HOTELS_BY_LOCATION: (locationId) => `${API_BASE_URL}/public/hotels/by-location/${locationId}`,
    HOTELS_SEARCH: (locationId) => `${API_BASE_URL}/public/hotels/search?id=${locationId}`,
    
    // Favorites
    TOGGLE_FAVORITE: (hotelId) => `${API_BASE_URL}/public/favorites/hotels/${hotelId}`,
    
    // Vouchers
    HOTEL_VOUCHERS: `${API_BASE_URL}/public/vouchers/hotel-page`,
    
    // View History
    TRACK_VIEW: (hotelId) => `${API_BASE_URL}/public/view-history/track?hotelId=${hotelId}`,
    UPDATE_DURATION: (viewHistoryId, seconds) => `${API_BASE_URL}/public/view-history/${viewHistoryId}/duration?seconds=${seconds}`,
};

export default API_BASE_URL;
