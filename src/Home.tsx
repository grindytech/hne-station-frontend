import { SidebarVariant } from "components/Sidebar";
import React from "react";
import { Route, Routes } from "react-router";
import Station from "Station";

interface VariantConfig {
  navigation: SidebarVariant;
  navigationButton: boolean;
}

const Home = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Station />} />
      </Routes>
    </>
  );
};

export default Home;
