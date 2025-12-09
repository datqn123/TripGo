import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://tripgo-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token vào mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
