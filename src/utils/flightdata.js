import axiosClient from "../api/axiosClient";


export async function fetchFlights() {
    try {
        const res = await axiosClient.get("public/home/flights");
        const api = res?.data || {};
        const apiResult = Array.isArray(api.result) ? api.result : [];

        return {
            code: typeof api.code !== "undefined" ? api.code : 0,
            message: api.message || "Success",
            result: apiResult,
        };
    } catch (err) {
        console.error("fetchFlights error:", err);
        return {
            code: -1,
            message: err?.message || "Failed to fetch flights",
            result: [],
        };
    }
}

export default { fetchFlights };
