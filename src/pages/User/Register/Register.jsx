import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authApi from "../../../api/authApi";
import "./register.css";
import Banner from "../../../assets/images/login_register/Frame 55.png";

const Register = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};
    if (!phoneNumber) newErrors.phone = "Số điện thoại không hợp lệ";
    if (!email) newErrors.email = "Email không được bỏ trống";
    else if (!emailRegex.test(email)) newErrors.email = "Email không hợp lệ";
    if (!fullName) newErrors.fullName = "Họ và tên không được bỏ trống";
    if (!password) newErrors.password = "Mật khẩu không được bỏ trống";
    else if (password.length < 8)
      newErrors.password = "Mật khẩu phải ít nhất 8 ký tự";
    if (!confirmPassword) newErrors.confirmPassword = "Bạn phải nhập lại mật khẩu";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const payload = { phoneNumber, fullName, password, confirmPassword, email };
      await authApi.register(payload);
      // Hiển thị toast thành công và redirect về trang đăng nhập
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message || "Đăng ký thất bại";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={Banner} alt="banner" />

      <h2>Đăng ký tài khoản</h2>
      <p className="subtext">Chúng tôi có một ưu đãi mà bạn không thể bỏ qua!</p>

      <form onSubmit={handleRegister}>
        <div className="input-group phone-group">
          <input
            type="text"
            placeholder="Số điện thoại của bạn"
            onChange={(e) => setPhoneNumber(e.target.value)}
            value={phoneNumber} />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Họ và tên của bạn"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={errors.fullName ? "error" : ""}
          />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email của bạn"
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
          <small className="hint">Tối thiểu 8 kí tự, kết hợp chữ cái, chữ số và kí hiệu đặc biệt</small>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Xác nhận mật khẩu..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? "error" : ""}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.general && (
          <p className="error-text" style={{ textAlign: 'center', marginBottom: '16px' }}>
            {errors.general}
          </p>
        )}

        <button type="submit" className="primaryBtn" disabled={isLoading}>
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="loading-spinner"></span>
              Đang xử lý...
            </span>
          ) : (
            "Đăng ký"
          )}
        </button>

        <div className="login-register-text">
          <span>Bạn đã có tài khoản? </span>
          <NavLink to="/login" className="register-link">
            Đăng nhập
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Register;
