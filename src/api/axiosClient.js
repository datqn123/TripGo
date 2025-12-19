import axios from "axios";
import API_BASE_URL from "./config";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag để tránh gọi refresh token nhiều lần cùng lúc
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Gắn token vào mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Xử lý 401 và tự động refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Bỏ qua nếu là request login hoặc refresh token
      if (originalRequest.url?.includes("auth/login") || 
          originalRequest.url?.includes("auth/refresh-token")) {
        return Promise.reject(error);
      }

      // Nếu đang refresh, đưa request vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // Không có refresh token -> logout
        isRefreshing = false;
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token (dùng axios trực tiếp để tránh loop)
        console.log('[Refresh Token] Attempting to refresh with token:', refreshToken?.substring(0, 20) + '...');
        
        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        console.log('[Refresh Token] API Response:', res.data);

        // Lấy token từ nhiều cấu trúc response khác nhau
        const newAccessToken = 
          res.data?.result?.accessToken || 
          res.data?.result?.token ||
          res.data?.accessToken || 
          res.data?.token ||
          res.data?.data?.accessToken;

        const newRefreshToken = 
          res.data?.result?.refreshToken ||
          res.data?.refreshToken ||
          res.data?.data?.refreshToken;

        console.log('[Refresh Token] New Access Token:', newAccessToken ? 'Found' : 'Not Found');
        console.log('[Refresh Token] New Refresh Token:', newRefreshToken ? 'Found' : 'Not Found');

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          // Cũng cập nhật token cũ để tương thích
          localStorage.setItem("token", newAccessToken);

          // Cập nhật token mới cho refresh token nếu có
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          console.log('[Refresh Token] Tokens saved to localStorage successfully');

          // Xử lý các request đang chờ
          processQueue(null, newAccessToken);

          // Retry request gốc với token mới
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } else {
          console.error('[Refresh Token] No access token found in response');
          throw new Error("No access token in response");
        }
      } catch (refreshError) {
        // Refresh token hết hạn hoặc lỗi -> logout
        console.error('[Refresh Token] Refresh failed:', refreshError);
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
