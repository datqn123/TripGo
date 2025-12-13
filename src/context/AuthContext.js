import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

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

    const checkAuthStatus = () => {
        try {
            const storedUser = localStorage.getItem("user");
            const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token");

            if (storedUser && accessToken) {
                setUser(JSON.parse(storedUser));
                setIsLogged(true);
            } else {
                setUser(null);
                setIsLogged(false);
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
