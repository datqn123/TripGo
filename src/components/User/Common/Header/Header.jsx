import React, { useEffect, useState, useRef } from "react";
import { Container, Nav, Offcanvas } from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../../assets/images/icons/Logo.png";
import notificationApi from '../../../../api/notificationApi';
import WebSocketService from '../../../../services/WebSocketService';

// Helper function to get last name
const getLastName = (fullName) => {
  if (!fullName) return "bạn";
  const nameParts = fullName.trim().split(" ");
  return nameParts[nameParts.length - 1];
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [sticky, setSticky] = useState(false);
  
  // Custom states for dropdowns to replace Bootstrap's behavior
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  
  const isPaymentPage = ['/paymenthotel', '/paymenttour', '/paymentplane', '/hotel-detail', '/tour-detail', '/setting'].includes(location.pathname);

  const toggleMenu = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY >= 80);
    };
    window.addEventListener("scroll", handleScroll);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

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

  // WebSocket Notifications Logic
  const [notifications, setNotifications] = useState([]);
  const [tempNotifications, setTempNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideNotif = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideNotif);
    return () => document.removeEventListener("mousedown", handleClickOutsideNotif);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.isRead).length + tempNotifications.length;

  const fetchNotifications = async () => {
    try {
        if(isLogged) {
            const res = await notificationApi.getNotifications();
            setNotifications(res.data || res || []);
        }
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isLogged]);

  useEffect(() => {
    const unsubscribe = WebSocketService.subscribe((notification) => {
       const notifWithTime = {
           ...notification,
           receivedAt: notification.createdAt || new Date().toISOString()
       };
       setTempNotifications(prev => [notifWithTime, ...prev]);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenNotifications = async () => {
      setShowNotifications(!showNotifications);
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

  const displayNotifications = [...tempNotifications, ...notifications];

  // Dynamic Styles
  const isScrolledOrPayment = sticky || isPaymentPage;
  // If scrolled or payment page, use dark text. Otherwise (transparent header on hero), use white text.
  const textColorClass = isScrolledOrPayment ? 'text-gray-700' : 'text-white';
  const notificationIconColor = isScrolledOrPayment ? 'text-gray-600' : 'text-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 w-full ${isScrolledOrPayment ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between relative">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <NavLink to="/" className="flex items-center gap-2 no-underline">
              <img src={Logo} alt="Trip Go Logo" className={`h-8 w-auto transition-all ${isScrolledOrPayment ? '' : 'brightness-0 invert'}`} />
              <span className={`text-xl font-bold font-['Lexend'] tracking-tight ${isScrolledOrPayment ? 'text-[#0292c6]' : 'text-white'}`}>Trip Go</span>
            </NavLink>
          </div>

          {/* Desktop Navigation - Centered Absolute */}
          <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-10">
            {[
              { to: "/", label: "Trang chủ" },
              { to: "/hotel", label: "Khách sạn" },
              { to: "/plane", label: "Chuyến bay" },
              { to: "/tour", label: "Tour" }
            ].map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={({isActive}) => 
                  `text-[15px] font-medium transition-colors no-underline ${
                    isActive 
                      ? (isScrolledOrPayment ? 'text-[#0292c6] font-bold' : 'text-white font-bold') 
                      : (isScrolledOrPayment ? 'text-gray-600 hover:text-[#0292c6]' : 'text-white/90 hover:text-white')
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Section: Auth & Mobile Toggle */}
          <div className="flex items-center gap-4">
            
            {!isLogged ? (
              <div className="hidden sm:flex items-center gap-3">
                <NavLink 
                  to="/login" 
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all no-underline ${
                    isScrolledOrPayment 
                      ? 'bg-[#0292c6] text-white hover:bg-[#027aa5]' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}
                >
                  Đăng nhập
                </NavLink>
                <NavLink 
                  to="/register" 
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all no-underline ${
                    isScrolledOrPayment 
                      ? 'border border-[#0292c6] text-[#0292c6] hover:bg-blue-50' 
                      : 'bg-white text-[#0292c6] hover:bg-gray-100'
                  }`}
                >
                  Đăng ký
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                   <button 
                     className="relative p-1 focus:outline-none"
                     onClick={handleOpenNotifications}
                   >
                     <i className={`bi bi-bell text-xl ${notificationIconColor} hover:opacity-80 transition-opacity`}></i>
                     {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                            {unreadCount}
                        </span>
                     )}
                   </button>
                   
                   {/* Notification Dropdown */}
                   {showNotifications && (
                      <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                           <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-gray-800 font-semibold text-sm">
                             Thông báo
                           </div>
                           <div className="max-h-[400px] overflow-y-auto">
                               {displayNotifications.length === 0 ? (
                                   <div className="p-6 text-center text-gray-400 text-sm">Không có thông báo mới</div>
                               ) : (
                                   displayNotifications.map((notif, index) => (
                                       <div 
                                            key={index} 
                                            className={`p-3 border-b border-gray-50 last:border-0 transition-colors ${notif.isRead ? 'bg-white' : 'bg-blue-50/50'} hover:bg-gray-50 cursor-pointer`}
                                            onClick={() => handleClickNotification(notif)}
                                        >
                                           <div className="text-sm font-semibold text-gray-800 mb-1">{notif.title || 'Thông báo hệ thống'}</div>
                                           <div className="text-xs text-gray-600 leading-relaxed mb-1 line-clamp-2">{notif.message}</div>
                                           <div className="text-[10px] text-gray-400 text-right">
                                               {new Date(notif.receivedAt || notif.createdAt || Date.now()).toLocaleTimeString('vi-VN')}
                                           </div>
                                       </div>
                                   ))
                               )}
                           </div>
                      </div>
                   )}
                </div>
                
                {/* User Profile */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 focus:outline-none group"
                  >
                    <div className="hidden md:flex flex-col items-end mr-1">
                      <span className={`text-sm font-semibold max-w-[120px] truncate ${isScrolledOrPayment ? 'text-gray-700' : 'text-white'}`}>
                        Xin chào, {getLastName(user?.fullName || user?.username)}
                      </span>
                    </div>
                    <img
                      src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.fullName || "U") + "&background=random&size=32"}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white/50 shadow-sm group-hover:border-white transition-colors"
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-4 w-[300px] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Gradient Header */}
                      <div className="bg-gradient-to-r from-[#9A6A45] to-[#B98A63] p-5 text-white">
                         <div className="text-lg font-bold mb-1 truncate">{user?.email || user?.username || "Thành viên mới"}</div>
                         <div className="flex items-center gap-2 text-white/90 text-sm cursor-pointer hover:text-white transition-colors">
                            <span className="p-1.5 bg-white/20 rounded-full flex items-center justify-center">
                              <i className="bi bi-compass text-sm"></i>
                            </span>
                            <span>Thẻ thành viên Explorer</span>
                            <i className="bi bi-chevron-right ml-auto text-xs"></i>
                         </div>
                      </div>
                      
                      {/* Points Section */}
                      <div className="bg-[#eff6ff] px-4 py-3 flex items-center gap-3 text-[#075985] text-sm font-medium">
                         <i className="bi bi-star-fill text-[#0284c7]"></i>
                         <span>{user?.points || 0} Điểm tích lũy</span>
                      </div>

                      {/* Links */}
                      <div className="py-2">
                         {[
                           { icon: "bi-person", label: "Chỉnh sửa hồ sơ", tab: "account" },
                           { icon: "bi-heart", label: "Yêu thích", tab: "favorite" },
                           { icon: "bi-credit-card", label: "Thẻ của tôi", tab: "cards" },
                           { icon: "bi-receipt", label: "Giao dịch của tôi", tab: "history" },
                         ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                  navigate('/setting', { state: { activeTab: item.tab } });
                                  setShowUserDropdown(false);
                                }}
                                className="w-full text-left px-5 py-3 flex items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-[#0292c6] transition-colors group"
                            >
                               <i className={`bi ${item.icon} text-gray-400 group-hover:text-[#0292c6] transition-colors text-lg w-6 text-center`}></i>
                               <span className="text-sm font-medium">{item.label}</span>
                            </button>
                         ))}
                         
                         <div className="h-px bg-gray-100 my-1 mx-4"></div>
                         
                         <button
                            onClick={() => {
                              localStorage.removeItem('user');
                              localStorage.removeItem('accessToken');
                              localStorage.removeItem('refreshToken');
                              localStorage.removeItem('token');
                              setUser(null);
                              setIsLogged(false);
                              navigate('/');
                              setShowUserDropdown(false);
                            }}
                            className="w-full text-left px-5 py-3 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors group"
                        >
                           <i className="bi bi-box-arrow-right text-red-400 group-hover:text-red-600 text-lg w-6 text-center"></i>
                           <span className="text-sm font-medium">Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Toggle Button */}
            <div className="lg:hidden">
               <button onClick={toggleMenu} className={`text-2xl ${isScrolledOrPayment ? 'text-gray-800' : 'text-white'}`}>
                 <i className={open ? "bi bi-x-lg" : "bi bi-list"}></i>
               </button>
            </div>
          </div>
        </div>
      </Container>


      {/* Mobile Offcanvas Menu - Using React Bootstrap for convenience but styled primarily via className if possible */}
      <Offcanvas show={open} onHide={toggleMenu} responsive="lg" placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="font-bold text-xl text-[#0292c6]">Trip Go</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="flex flex-col gap-4 p-4 lg:hidden">
              <NavLink to="/" onClick={toggleMenu} className={({isActive}) => `text-lg font-medium ${isActive ? 'text-[#0292c6]' : 'text-gray-700'}`}>Trang chủ</NavLink>
              <NavLink to="/hotel" onClick={toggleMenu} className={({isActive}) => `text-lg font-medium ${isActive ? 'text-[#0292c6]' : 'text-gray-700'}`}>Khách sạn</NavLink>
              <NavLink to="/plane" onClick={toggleMenu} className={({isActive}) => `text-lg font-medium ${isActive ? 'text-[#0292c6]' : 'text-gray-700'}`}>Chuyến bay</NavLink>
              <NavLink to="/tour" onClick={toggleMenu} className={({isActive}) => `text-lg font-medium ${isActive ? 'text-[#0292c6]' : 'text-gray-700'}`}>Tour</NavLink>
              
              {!isLogged && (
                 <div className="mt-4 flex flex-col gap-3">
                   <NavLink to="/login" onClick={toggleMenu} className="text-center w-full py-2 bg-[#0292c6] text-white rounded-lg font-semibold">Đăng nhập</NavLink>
                   <NavLink to="/register" onClick={toggleMenu} className="text-center w-full py-2 border border-[#0292c6] text-[#0292c6] rounded-lg font-semibold">Đăng ký</NavLink>
                 </div>
              )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Header;
