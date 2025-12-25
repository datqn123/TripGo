import axiosClient from "./axiosClient";
import { RECOMMENDER_API_URL } from "./config";

const recommenderApi = {
    getSimilarHotels: (hotelId) => {
        const url = `${RECOMMENDER_API_URL}/${hotelId}`;
        return axiosClient.get(url);
    },
    
    getSmartRecommendations: (userId) => {
        const url = `${RECOMMENDER_API_URL}/smart/${userId}/`;
        return axiosClient.get(url);
    }
};

export default recommenderApi;
