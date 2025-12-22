import axiosClient from "./axiosClient";

const bookingApi = {
    /**
     * Create payment link for booking
     * POST /api/payment/create-payment-link
     */
    createPaymentLink: (data) => axiosClient.post('/payment/create-payment-link', data),

    /**
     * Check payment status
     * GET /api/payment/check-status/{orderCode}
     */
    checkPaymentStatus: (orderCode) => axiosClient.get(`/payment/check-status/${orderCode}`),

    /**
     * Get my tour bookings
     * GET /api/public/booking/my-tours
     */
    getMyTourBookings: () => axiosClient.get('/public/booking/my-tours'),
};

export default bookingApi;
