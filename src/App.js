import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import WebSocketService from "./services/WebSocketService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./pages/User/Home/Home";
import Header from "./components/User/Common/Header/Header";
import Footer from "./components/User/Common/Footer/Footer";
import Login from "./pages/User/Login/Login";
import Register from "./pages/User/Register/Register";
import Filter from "./pages/User/Filter/Filter";

import Payment from "./pages/User/Payment/Payment";
import Classification from "./pages/User/Payment/Classification";
import Hotel_Detail from "./pages/User/Hotel/Hotel_Detail";
import Tour_Detail from "./pages/User/Tour/Detail_Tour";
import Tour from "./pages/User/Tour/Tour";
import Hotel from "./pages/User/Hotel/Hotel";
import Setting from "./pages/User/Setting/Setting";
import Promotion from "./pages/User/Promotion/Promotion";
import Outstandingoffer from "./components/User/Filter/Outstandingoffer";
import Outstandingtour from "./components/User/Filter/Outstandingtour";

// Admin imports
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminLogin from "./pages/Admin/Login/AdminLogin";
import HotelManagement from "./pages/Admin/Hotels/HotelManagement";
import AddHotel from "./pages/Admin/Hotels/AddHotel";
import EditHotel from "./pages/Admin/Hotels/EditHotel";
import TourManagement from "./pages/Admin/Tours/TourManagement";
import AddTour from "./pages/Admin/Tours/AddTour";
import EditTour from "./pages/Admin/Tours/EditTour";
import FlightManagement from "./pages/Admin/Flights/FlightManagement";
import BookingManagement from "./pages/Admin/Bookings/BookingManagement";
import CustomerManagement from "./pages/Admin/Customers/CustomerManagement";
import PromotionManagement from "./pages/Admin/Promotions/PromotionManagement";

function App() {
  const location = useLocation();

  // Những route không cần hiện header & footer
  const hideLayoutRoutes = ["/login", "/register", "/admin/login"];
  const isHideLayout = hideLayoutRoutes.includes(location.pathname) || location.pathname.startsWith('/admin');

  useEffect(() => {
    WebSocketService.connect();
    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {!isHideLayout && <Header />}

      <Routes>  
        {/* Admin Login - Public */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="hotels" element={<HotelManagement />} />
          <Route path="hotels/add" element={<AddHotel />} />
          <Route path="hotels/edit/:id" element={<EditHotel />} />
          <Route path="tours" element={<TourManagement />} />
          <Route path="tours/add" element={<AddTour />} />
          <Route path="tours/edit/:id" element={<EditTour />} />
          <Route path="flights" element={<FlightManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="promotions" element={<PromotionManagement />} />
          {/* TODO: Add more admin routes here */}
        </Route>

        {/* Home */}
        <Route path="/" element={<Home />} />
        {/*More : Khi nhấn xem thêm ở trang home*/}
        <Route path="/plane" element={<Outstandingoffer/>} />
        <Route path="/tour" element={<Tour/>} />
        <Route path="/hotel" element={<Hotel />} />
        {/*Chọn loại tour trong trang /tour*/}
        <Route path="/outstanding-tour" element={<Outstandingtour/>} />
        {/* Authenticate */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Filter : trang tour và trang plane sau khi nhấn áp dụng bộ lọc sẽ mất trang ưu đãi */}
        <Route path="/filter-hotel" element={<Filter type="hotel" />} />
        <Route path="/filter-tour" element={<Filter type="tour" />} />
        <Route path="/filter-plane" element={<Filter type="plane" />} />
        {/* Payment : Trang thanh toán */}
        <Route path="/payment-hotel" element={<Payment type="hotel" />} />
        <Route path="/payment-tour" element={<Payment type="tour" />} />
        <Route path="/payment-plane" element={<Payment type="plane" />} />
        {/* Classification : này là phân bậc các loại vé trong paymentplane */}
        <Route path="/classification" element={<Classification />} />
        {/* Details */}
        <Route path="/hotel-detail/:id" element={<Hotel_Detail />} />
        <Route path="/tour-detail" element={<Tour_Detail />} />
        {/* Setting */}
        <Route path="/setting" element={<Setting />} />
        {/* Promotion */}
        <Route path="/promotion" element={<Promotion />} />
      </Routes>

      {!isHideLayout && <Footer />}
    </>
  );
}

export default App;
