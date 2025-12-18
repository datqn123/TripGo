import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = "https://tripgo-api.onrender.com/api";

// Helper function: Kiểm tra token có hết hạn chưa
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        // Thêm buffer 30 giây để refresh trước khi thực sự hết hạn
        return decoded.exp < (Date.now() / 1000) + 30;
    } catch {
        return true;
    }
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true);

    // Kiểm tra trạng thái đăng nhập khi app khởi động
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const storedUser = localStorage.getItem("user");
            const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshToken");

            // Nếu không có token hoặc user, đánh dấu chưa đăng nhập
            if (!storedUser || !accessToken) {
                setUser(null);
                setIsLogged(false);
                setLoading(false);
                return;
            }

            // Kiểm tra access token có hết hạn không
            if (isTokenExpired(accessToken)) {
                // Thử refresh token
                if (refreshToken && !isTokenExpired(refreshToken)) {
                    try {
                        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                            refreshToken,
                        });

                        const newAccessToken = res.data.result?.accessToken || res.data.accessToken;

                        if (newAccessToken) {
                            localStorage.setItem("accessToken", newAccessToken);

                            // Cập nhật refresh token mới nếu có
                            if (res.data.result?.refreshToken) {
                                localStorage.setItem("refreshToken", res.data.result.refreshToken);
                            }

                            setUser(JSON.parse(storedUser));
                            setIsLogged(true);
                        } else {
                            throw new Error("No token in response");
                        }
                    } catch (error) {
                        console.error("Failed to refresh token:", error);
                        // Refresh thất bại -> logout
                        localStorage.clear();
                        setUser(null);
                        setIsLogged(false);
                    }
                } else {
                    // Không có refresh token hoặc refresh token cũng hết hạn
                    localStorage.clear();
                    setUser(null);
                    setIsLogged(false);
                }
            } else {
                // Token còn hạn -> đăng nhập bình thường
                setUser(JSON.parse(storedUser));
                setIsLogged(true);
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            setUser(null);
            setIsLogged(false);
        } finally {
            setLoading(false);
        }
    };

    // Hàm login - lưu thông tin và cập nhật state
    const login = (userData, accessToken, refreshToken) => {
        const userInfo = {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            roles: userData.roles,
            avatar: userData.avatar || null,
        };

        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }

        setUser(userInfo);
        setIsLogged(true);
    };

    // Hàm logout - xóa thông tin và cập nhật state
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");

        setUser(null);
        setIsLogged(false);
    };

    // Hàm cập nhật thông tin user
    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const value = {
        user,
        isLogged,
        loading,
        login,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
