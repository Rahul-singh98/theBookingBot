import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import Home from "./Home";

const UserApp = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MainLayout>
  );
};

export default UserApp;
