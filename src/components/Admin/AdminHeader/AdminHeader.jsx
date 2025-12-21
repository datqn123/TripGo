import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminAuthApi from '../../../api/adminAuthApi';
import { useAuth } from '../../../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await adminAuthApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }

    logout();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    toast.info('Đã đăng xuất');
    navigate('/admin/login');
  };

  const adminName = localStorage.getItem('userName') || 'Admin';

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-title">Quản lý</h1>
      </div>

      <div className="header-right">
        <div className="header-time">
          <span className="time-text">
            {currentTime.toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
          <span className="date-text">
            {currentTime.toLocaleDateString('vi-VN', { 
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </span>
        </div>

        <div className="header-notifications">
          <button className="notification-btn">
            <i class="fa-regular fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
        </div>

        <div className="header-user">
          <div 
            className="user-info"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-details">
              <span className="user-name">{adminName}</span>
              <span className="user-role">Quản trị viên cấp cao</span>
            </div>
            <div className="user-avatar">
              <i className="fa-solid fa-user"></i>
            </div>
          </div>

          {showUserMenu && (
            <div className="user-menu">
              <button 
                className="user-menu-item"
                onClick={() => navigate('/admin/settings')}
              >
                Cài đặt
              </button>
              <button 
                className="user-menu-item"
                onClick={() => navigate('/setting')}
              >
                Hồ sơ
              </button>
              <div className="user-menu-divider"></div>
              <button 
                className="user-menu-item logout"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
