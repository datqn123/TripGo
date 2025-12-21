import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);

    // TODO: Replace with real API call
    setTimeout(() => {
      // Temporary login - accept any credentials
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('userRole', 'ADMIN');
      localStorage.setItem('userName', email.split('@')[0]);
      
      toast.success('Đăng nhập thành công!');
      navigate('/admin');
      setLoading(false);
    }, 1000);

    // Real API call would look like:
    /*
    try {
      const response = await authApi.adminLogin({ email, password });
      if (response.code === 1000) {
        localStorage.setItem('token', response.result.token);
        localStorage.setItem('userRole', 'ADMIN');
        localStorage.setItem('userName', response.result.name);
        toast.success('Đăng nhập thành công!');
        navigate('/admin');
      } else {
        toast.error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      toast.error('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="admin-login-container">
      {/* Left Side - Banner */}
      <div className="banner_login">
        <div className="banner-overlay"></div>
        
        {/* Logo at top-left - outside banner-content */}
        <div className="logo-section">
          <i className="bi bi-compass"></i>
          <span>TripGo</span>
        </div>
        
        {/* Main content centered */}
        <div className="banner-content">
          <h1 className="banner-title">
            Đăng nhập vào<br />
            hệ thống <span className="highlight">quản trị</span>
          </h1>
          <p className="banner-subtitle">
            Quản lý Khách sạn, Tours, Bay và Khách hàng<br />
            Tất cả trong một bảng điều khiển thống nhất
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="admin-login-form-container">
        <div className="admin-login-form-wrapper">
          <div className="form-header">
            <h2>Cổng quản trị Admin</h2>
            <p className="form-subtitle">
              Đăng nhập để quản lý nền tảng du lịch của bạn
            </p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Tên người dùng hoặc Email</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="email"
                  className="form-input"
                  placeholder="Nhập tên người dùng của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="remember">Ghi nhớ tôi</label>
              </div>
              <a href="#" className="forgot-password">
                Quên mật khẩu
              </a>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>Không phải quản trị viên?</p>
            <a href="/" className="back-to-home">
              <i className="bi bi-arrow-left me-2"></i>
              Quay về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
