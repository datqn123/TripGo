import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminAuthApi from '../../../api/adminAuthApi';
import { useAuth } from '../../../context/AuthContext';
import './AdminHeader.css';
import WebSocketService from '../../../services/WebSocketService';

import notificationApi from '../../../api/notificationApi';
// ... other imports

const AdminHeader = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]); // DB notifications
  const [tempNotifications, setTempNotifications] = useState([]); // Temporary WS notifications
  const [showNotifications, setShowNotifications] = useState(false);

  // Combined unread count
  const unreadCount = notifications.filter(n => !n.isRead).length + tempNotifications.length;

  const fetchNotifications = async () => {
      try {
          const res = await notificationApi.getNotifications();
          setNotifications(res.data || res || []);
      } catch (error) {
          console.error("Failed to fetch notifications:", error);
      }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Subscribe to WebSocket notifications
    const unsubscribe = WebSocketService.subscribe((notification) => {
      const notifWithTime = {
           ...notification,
           receivedAt: notification.createdAt || new Date().toISOString()
       };
      // Append to TEMP list
      setTempNotifications(prev => [notifWithTime, ...prev]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenNotifications = async () => {
      setShowNotifications(!showNotifications);

      // Only sync if opening and have temp notifications
      if (!showNotifications && tempNotifications.length > 0) {
          try {
              for (const notif of tempNotifications) {
                  await notificationApi.saveNotification({
                      title: notif.title,
                      message: notif.message,
                      link: notif.link,
                      isRead: false
                  });
              }
              setTempNotifications([]);
              await fetchNotifications();
          } catch (error) {
              console.error("Error syncing notifications:", error);
          }
      }
  };

  const handleClickNotification = async (notif) => {
      try {
          if(notif.id) {
              await notificationApi.markAsRead(notif.id);
              // Update UI to reflect read status locally
              setNotifications(prev => prev.map(n => n.id === notif.id ? {...n, isRead: true} : n));
          }

          if (notif.link) {
              navigate(notif.link);
              setShowNotifications(false);
          }
      } catch (error) {
          console.error("Error marking read:", error);
      }
  };

  // Combine for display
  const displayNotifications = [...tempNotifications, ...notifications];

  // ... (logout logic)
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
          <button 
            className="notification-btn"
            onClick={handleOpenNotifications}
          >
            <i className="fa-regular fa-bell"></i>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">Thông báo</div>
              <div className="notification-list">
                {displayNotifications.length === 0 ? (
                  <div className="no-notification">Không có thông báo mới</div>
                ) : (
                  displayNotifications.map((notif, index) => (
                    <div 
                        key={index} 
                        className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                        onClick={() => handleClickNotification(notif)}
                        style={{ cursor: notif.link ? 'pointer' : 'default', background: notif.isRead ? '#fff' : '#f0f9ff' }}
                    >
                      <div className="notification-title">{notif.title || 'Thông báo hệ thống'}</div>
                      <div className="notification-message">{notif.message}</div>
                      <div className="notification-time">
                        {new Date(notif.receivedAt || notif.createdAt || Date.now()).toLocaleTimeString('vi-VN')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
