import React, { useState, useEffect } from "react";
import Banner from "../../components/Banner/Banner";
import AdvanceSearch from "../../components/AdvanceSearch/AdvanceSearch";
import Features from "../../components/Features/Features";

import "./home.css";

import VoucherList from "../../components/Cards/VoucherList";
import Home_Start from "./Home_Start";
import Tour from "../../pages/Tour/Tour.jsx";
import Hotel from "../../pages/Hotel/Hotel.jsx";

const Home = () => {
  const [activeTab, setActiveTab] = useState("hotel");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Banner />
      <AdvanceSearch onTabChange={handleTabChange} />

      {activeTab === "tour" ? <Tour /> :
        activeTab === "hotel" ? <Hotel /> :
          <>
            <Home_Start />
            <VoucherList />
            <Features />
          </>
      }
    </>
  );
};

export default Home;
