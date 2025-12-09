import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "./login.css";
import Banner from "../../assets/images/login_register/Frame 55.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email) e.email = "Số điện thoại không được bỏ trống";
    if (!password) e.password = "Mật khẩu không được bỏ trống";
    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await authApi.login({ email, password });
      const user = res.data.result;
      if (res && user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            roles: user.roles,
          })
        );
        localStorage.setItem("accessToken", user.accesToken);
        localStorage.setItem("refreshToken", user.refreshToken);
      }
      alert("Đăng nhập thành công!");
      // Clear fields on success
      setEmail("");
      setPassword("");
      setErrors({});
      // Redirect to home page
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Sai số điện thoại hoặc mật khẩu!";
      alert(message);
    }
  };

  return (
    <div className="auth-container">
      <img src={Banner} alt="banner" />
      <h2>Đăng nhập</h2>
      <p className="subtext">Đăng nhập bằng số điện thoại để tiếp tục</p>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Nhập số điện thoại..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" className="primaryBtn">
          Đăng nhập
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
