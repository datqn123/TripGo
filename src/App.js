import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./pages/Home/Home";
import Header from "./components/Common/Header/Header";
import Footer from "./components/Common/Footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Filter from "./pages/Filter/Filter";

import Payment from "./pages/Payment/Payment";
import Classification from "./pages/Payment/Classification";
import Hotel_Detail from "./pages/Hotel/Hotel_Detail";
import Tour_Detail from "./pages/Tour/Detail_Tour";
import Tour from "./pages/Tour/Tour";
import Hotel from "./pages/Hotel/Hotel";
import Setting from "./pages/Setting/Setting";
import Promotion from "./pages/Promotion/Promotion";
import Outstandingoffer from "./components/Filter/Outstandingoffer";
import Outstandingtour from "./components/Filter/Outstandingtour";
function App() {
  const location = useLocation();

  // Những route không cần hiện header & footer
  const hideLayoutRoutes = ["/login", "/register"];
  const isHideLayout = hideLayoutRoutes.includes(location.pathname);

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
