import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authApi from '../../../api/authApi';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Call API to invalidate token (optional, based on backend)
      await authApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Clear local storage and context
    logout();
    localStorage.removeItem('userRole'); // Ensure legacy key is removed
    localStorage.removeItem('userName'); // Ensure legacy key is removed
    
    toast.info('Đã đăng xuất');
    navigate('/admin/login');
  };

  const menuSections = [
    {
      items: [
        { path: '/admin', icon: 'bi-grid-3x3-gap', label: 'Tổng quan', isOverview: true }
      ]
    },
    {
      label: 'QUẢN LÝ',
      items: [
        { path: '/admin/hotels', icon: 'bi-building', label: 'Quản lý khách sạn' },
        { path: '/admin/tours', icon: 'bi-signpost-2', label: 'Quản lý tour' },
        { path: '/admin/flights', icon: 'bi-airplane', label: 'Quản lý chuyến bay' }
      ]
    },
    {
      label: 'KHÁCH HÀNG & ĐẶT CHỖ',
      items: [
        { path: '/admin/bookings', icon: 'bi-calendar-check', label: 'Đặt chỗ' },

        { path: '/admin/customers', icon: 'bi-people', label: 'Khách hàng' },
        { path: '/admin/chat', icon: 'bi-chat-dots', label: 'Hỗ trợ khách hàng' },
      ]
    },
    {
      label: 'TÀI CHÍNH',
      items: [
        { path: '/admin/promotions', icon: 'bi-tag', label: 'Khuyến mãi & Voucher' }
      ]
    }
  ];

  return (
    <div className="admin-sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <img src="/Logo.png" alt="TripGo" className="logo-img" />
        </div>
        <div className="logo-text">
          <div className="logo-title">TripGo</div>
          <div className="logo-subtitle">Nền tảng quản lý</div>
        </div>
      </div>

      {/* Menu Items with Sections */}
      <nav className="sidebar-nav">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="menu-section">
            {section.label && (
              <div className="section-label">{section.label}</div>
            )}
            {section.items.map((item, itemIndex) => (
              <NavLink
                key={itemIndex}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => 
                  `nav-item ${isActive ? 'active' : ''} ${item.isOverview ? 'overview-item' : ''}`
                }
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i>
        <span>Đăng xuất</span>
      </button>
    </div>
  );
};

export default Sidebar;
