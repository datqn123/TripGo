import axiosClient from "./axiosClient";

const adminAuthApi = {
  register: (data) => axiosClient.post("auth/register", data),

  login: (data) => axiosClient.post("auth/login", data),

  logout: () => axiosClient.post("auth/logout"),

  refreshToken: (refreshToken) =>
    axiosClient.post("auth/refresh-token", { refreshToken }),
};

export default adminAuthApi;
