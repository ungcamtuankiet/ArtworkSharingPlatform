import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../sidebar/Sidebar";
import Admin from "../admin/Admin";
import HeaderAdmin from "../headeradmin/HeaderAdmin";
import "./HomeAdmin.css";
import { Routes, Route } from "react-router-dom";
import Product from "../product/Product";
import Creator from "../creator/Creator";
import Revenue from "../revenue/Revenue";

export default function HomeAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const isAdmin = true;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const checkAccess = () => {
    if (!isAdmin) {
      navigate("/"); // Nếu người dùng không phải là admin, chuyển hướng về trang chính
    }
  };
  // Gọi hàm kiểm tra quyền truy cập khi component được render
  useEffect(() => {
    checkAccess();
  }, []);

  return (
    <div className="grid-container">
      <HeaderAdmin toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <Routes>
        <Route path="dashboard" element={<Admin />} />
        <Route path="product" element={<Product />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="creator" element={<Creator />} />
      </Routes>
    </div>
  );
}
