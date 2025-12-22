import axiosClient from "./axiosClient";

const notificationApi = {
    // Lưu thông báo vào DB
    saveNotification: (data) => {
        return axiosClient.post('/notifications', data);
    },

    // Đánh dấu đã đọc
    markAsRead: (id) => {
        return axiosClient.put(`/notifications/${id}/read`);
    },

    // Lấy danh sách thông báo từ DB (thường là của user hiện tại)
    getNotifications: () => {
        return axiosClient.get('/notifications');
    }
};

export default notificationApi;
