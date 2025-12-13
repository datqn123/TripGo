import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import authApi from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import "./login.css";
import Banner from "../../assets/images/login_register/Frame 55.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const e = {};

    // Validate email
    if (!email) {
      e.email = "Email không được bỏ trống";
    } else if (!validateEmail(email)) {
      e.email = "Email không đúng định dạng";
    }

    // Validate password
    if (!password) {
      e.password = "Mật khẩu không được bỏ trống";
    } else if (password.length < 8) {
      e.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const user = res.data.result;
      if (res && user) {
        // Sử dụng login function từ AuthContext
        login(user, user.accesToken, user.refreshToken);
      }

      setEmail("");
      setPassword("");
      setErrors({});
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Sai số điện thoại hoặc mật khẩu!";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={Banner} alt="banner" />
      <h2>Đăng nhập</h2>
      <p className="subtext">Đăng nhập bằng email để tiếp tục</p>
      <form onSubmit={handleLogin}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="input-wrapper">
          <input
            type="password"
            placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit" className="primaryBtn" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>
        <div className="login-register-text">
          <span>Bạn chưa có tài khoản? </span>
          <NavLink to="/register" className="register-link">
            Đăng ký
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Login;

