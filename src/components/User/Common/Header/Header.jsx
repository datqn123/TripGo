import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Navbar,
  Offcanvas,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../../assets/images/icons/Logo.png"
import "../Header/header.css";
import notificationApi from '../../../../api/notificationApi';
import WebSocketService from '../../../../services/WebSocketService';

// ... (other imports)

// Helper function để lấy tên cuối cùng
const getLastName = (fullName) => {
  if (!fullName) return "bạn";
  const nameParts = fullName.trim().split(" ");
  return nameParts[nameParts.length - 1];
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  
  const toggleMenu = () => {
    setOpen(!open);
  };

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky)
    }
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setIsLogged(!!(storedUser || accessToken));

    const onStorage = (e) => {
      if (e.key === "user" || e.key === "accessToken" || e.key === "token") {
        const su = localStorage.getItem("user");
        setUser(su ? JSON.parse(su) : null);
        setIsLogged(!!(localStorage.getItem("user") || localStorage.getItem("accessToken") || localStorage.getItem("token")));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // sticky Header 
  const isSticky = (e) => {
    const header = document.querySelector('.header-section');
    if (!header) return; // Guard clause to prevent null error
    const scrollTop = window.scrollY;
    scrollTop >= 120 ? header.classList.add('is-sticky') :
      header.classList.remove('is-sticky')
  }

  // WebSocket Notifications
  const [notifications, setNotifications] = useState([]); // Persistent DB notifications
  const [tempNotifications, setTempNotifications] = useState([]); // Temporary WS notifications
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Combined unread count
  const unreadCount = notifications.filter(n => !n.isRead).length + tempNotifications.length;

  // 1. Fetch initial notifications from DB
  const fetchNotifications = async () => {
    try {
        if(isLogged) {
            const res = await notificationApi.getNotifications();
            // Assuming API returns array directly or inside data property
            setNotifications(res.data || res || []);
        }
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isLogged]);

  // 2. WebSocket Subscription
  useEffect(() => {
    const unsubscribe = WebSocketService.subscribe((notification) => {
       // Add receipt time
       const notifWithTime = {
           ...notification,
           receivedAt: notification.createdAt || new Date().toISOString()
       };
       // Store in TEMP state
       setTempNotifications(prev => [notifWithTime, ...prev]);
    });
    return () => unsubscribe();
  }, []);

  // 3. Handle Opening Notification List
  const handleOpenNotifications = async () => {
      setShowNotifications(!showNotifications);

      // Only proceed if we are OPENING the list and have temp notifications
      if (!showNotifications && tempNotifications.length > 0) {
          try {
              // Save each temp notification to DB
              for (const notif of tempNotifications) {
                  await notificationApi.saveNotification({
                      title: notif.title,
                      message: notif.message,
                      link: notif.link,
                      isRead: false
                  });
              }
              // Clear temp list
              setTempNotifications([]);
              // Refresh full list from DB
              await fetchNotifications();
          } catch (error) {
              console.error("Error syncing notifications:", error);
          }
      }
  };

  // 4. Handle Click Item
  const handleClickNotification = async (notif) => {
       try {
           if(notif.id) {
               await notificationApi.markAsRead(notif.id);
               // Update local state to reflect read status
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

  // Combine lists for display (Temp first, then DB)
  const displayNotifications = [...tempNotifications, ...notifications];

  return (
    <header className={`header-section ${['/paymenthotel', '/paymenttour', '/paymentplane', '/hotel-detail', '/tour-detail', '/setting'].includes(location.pathname) ? 'payment-header' : ''}`}>
      <Container>

        <Navbar expand="lg" className="p-0">
          {/* Logo Section  */}
          <Navbar.Brand>
            <img
              src={Logo}
              alt="Trip Go Logo" />
            <NavLink to="/"> Trip Go</NavLink>
          </Navbar.Brand>
          {/* End Logo Section  */}

          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="start"
            show={open}
          >
            {/*mobile Logo Section  */}
            <Offcanvas.Header>
              <h1 className="logo">Weekendmonks</h1>
              <span className="navbar-toggler ms-auto" onClick={toggleMenu}>
                <i className="bi bi-x-lg"></i>
              </span>
            </Offcanvas.Header>
            {/*end mobile Logo Section  */}

            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1">
                <NavLink className="nav-link" to="/">
                  Trang chủ
                </NavLink>
                <NavLink className="nav-link" to="/explore">
                  Khám phá
                </NavLink>
                <NavLink className="nav-link" to="/promotion">
                  Khuyến mãi
                </NavLink>
                <NavLink className="nav-link" to="/my-bookings">
                  Đặt chỗ của tôi
                </NavLink>
              </Nav>

              <div className="d-flex align-items-center user-section">
                {!isLogged ? (
                  <>
                    <NavLink className="primaryBtn d-none d-sm-inline-block" to="/login">
                      Đăng nhập
                    </NavLink>
                    <NavLink className="primaryBtn1 d-none d-sm-inline-block" style={{ color: 'black' }} to="/register">
                      Đăng ký
                    </NavLink>
                  </>
                ) : (
                  <>
                    <div className="user-notification-container" style={{ position: 'relative', marginRight: '1rem' }}>
                        <i 
                            className="bi bi-bell" 
                            style={{ fontSize: '18px', color: 'white', cursor: 'pointer' }}
                            onClick={handleOpenNotifications}
                        ></i>
                        {unreadCount > 0 && (
                            <span className="user-notification-badge">
                                {unreadCount}
                            </span>
                        )}
                        
                        {showNotifications && (
                           <div className="user-notification-dropdown">
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

                    <NavDropdown
                      className="user-dropdown"
                      title={
                        <span className="d-flex align-items-center">
                          <span className="greeting-text me-2">Xin chào {getLastName(user?.fullName || user?.username)}</span>
                          <img
                            src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.fullName || "U") + "&background=random&size=32"}
                            alt="avatar"
                            className="user-avatar"
                          />
                        </span>
                      }
                      id="user-nav-dropdown"
                      align="end"
                    >

                      <div className="dropdown-header-section">
                        <div className="dropdown-user-name-large">{user?.email || user?.username || "Nguyễn ABC"}</div>
                        <div className="dropdown-membership-row">
                          <i className="bi bi-compass"></i>
                          <span>Bạn là thành viên hạng Explorer</span>
                          <i className="bi bi-chevron-right ms-auto"></i>
                        </div>
                      </div>

                      <div className="dropdown-points">
                        <i className="bi bi-star"></i>
                        <span style={{ paddingLeft: '7px' }}>{user?.points || 0} Điểm</span>
                      </div>

                      <NavDropdown.Divider />

                      <NavDropdown.Item onClick={() => navigate('/setting', { state: { activeTab: 'account' } })} className="dropdown-menu-item">
                        <i className="bi bi-person"></i>
                        <span>Chỉnh sửa hồ sơ</span>
                      </NavDropdown.Item>

                      <NavDropdown.Item onClick={() => navigate('/setting', { state: { activeTab: 'favorite' } })} className="dropdown-menu-item">
                        <i className="bi bi-heart"></i>
                        <span>Yêu thích</span>
                      </NavDropdown.Item>

                      <NavDropdown.Item onClick={() => navigate('/setting', { state: { activeTab: 'cards' } })} className="dropdown-menu-item">
                        <i className="bi bi-credit-card"></i>
                        <span>Thẻ của tôi</span>
                      </NavDropdown.Item>

                      <NavDropdown.Item onClick={() => navigate('/setting', { state: { activeTab: 'history' } })} className="dropdown-menu-item">
                        <i className="bi bi-receipt"></i>
                        <span>Giao dịch của tôi</span>
                      </NavDropdown.Item>

                      <NavDropdown.Divider />

                      <NavDropdown.Item onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('token');
                        setUser(null);
                        setIsLogged(false);
                        navigate('/');
                      }} className="dropdown-menu-item">
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Đăng xuất</span>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}
                <li className="d-inline-block d-lg-none ms-3 toggle_btn">
                  <i className={open ? "bi bi-x-lg" : "bi bi-list"} onClick={toggleMenu}></i>
                </li>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

        </Navbar>

      </Container>
    </header >
  );
};

export default Header;
