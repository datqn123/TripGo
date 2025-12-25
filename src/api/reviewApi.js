import axiosClient from "./axiosClient";

const reviewApi = {
    // Get reviews for a hotel
    getHotelReviews: (hotelId) => {
        return axiosClient.get(`/public/reviews/hotel/${hotelId}`);
    },

    // Submit a new review
    submitReview: (data) => {
        // data: { hotelId, rating, comment, ... }
        return axiosClient.post('/public/reviews', data);
    },

    // Check if user has reviewed or is eligible (returns review object or null/status)
    checkMyReview: (hotelId) => {
        return axiosClient.get(`/public/reviews/my-review/${hotelId}`);
    }
};

export default reviewApi;
