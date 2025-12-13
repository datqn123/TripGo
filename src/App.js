import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Header from "./components/Common/Header/Header";
import Footer from "./components/Common/Footer/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Filter from "./pages/Filter/Filter";

function App() {
  const location = useLocation();
  
  // Những route không cần hiện header & footer
  const hideLayoutRoutes = ["/login", "/register"];
  const isHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!isHideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/filter/:slug" element={<Filter />} />
      </Routes>

      {!isHideLayout && <Footer />}
    </>
  );
}

export default App;
