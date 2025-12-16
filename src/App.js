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
import Setting from "./pages/Setting/Setting";
import Promotion from "./pages/Promotion/Promotion";

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/filter/:slug" element={<Filter />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/classification" element={<Classification />} />
        <Route path="/hotel-detail" element={<Hotel_Detail />} />
        <Route path="/tour-detail" element={<Tour_Detail />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/promotion" element={<Promotion />} />
      </Routes>

      {!isHideLayout && <Footer />}
    </>
  );
}

export default App;
