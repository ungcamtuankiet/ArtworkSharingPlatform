import React, { useEffect } from "react";
import {
  BsFillBoxFill,
  BsFillGrid1X2Fill,
  BsEmojiSmile,
  BsFillGrid3X3GapFill,
  BsMenuButtonWideFill,
  BsPeopleFill,
  BsFillGearFill,
} from "react-icons/bs";
import "./Sidebar.css";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    //window.location.reload();
  };

  useEffect(() => {
    const allSideMenu = document.querySelectorAll(".side-menu.top li a");
    if (allSideMenu.length > 0) {
      allSideMenu.forEach((item) => {
        const li = item.parentElement;

        item.addEventListener("click", function () {
          allSideMenu.forEach((i) => {
            i.parentElement.classList.remove("active");
          });
          li.classList.add("active");
        });
      });
    }
  }, []);

  return (
    <section id="sidebar" className="sidebar">
      <a className="brand">
        <BsEmojiSmile className="bx bxs-smile" />
        <span className="text">AdminHub</span>
      </a>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "90%",
        }}
      >
        <ul className="side-menu top">
          <li class="active">
            <Link to={"/home-admin/dashboard"}>
              <BsFillGrid1X2Fill className="bx bxs-dashboard" />
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to={"/home-admin/product"}>
              <BsFillBoxFill className="bx bxs-smile" />
              <span className="text">Product</span>
            </Link>
          </li>
          <li>
            <Link to={"/home-admin/revenue"}>
              <BsFillGrid3X3GapFill className="bx bxs-revenue" />
              <span className="text">Revenue</span>
            </Link>
          </li>
          <li>
            <a href="#">
              <BsMenuButtonWideFill className="bx bxs-report" />
              <span className="text">Reports</span>
            </a>
          </li>
          <li>
            <Link to={"/home-admin/creator"}>
              <BsPeopleFill className="bx bxs-cogs" />
              <span className="text">Creator</span>
            </Link>
          </li>
        </ul>
        <ul className="side-menu">
          <li>
            <a href="#">
              <BsFillGearFill className="bx bxs-cog" />
              <span className="text">Settings</span>
            </a>
          </li>
          <li className="sidebar-list-item" onClick={handleLogout}>
            <a href="">
              <RiLogoutBoxRLine className="bx bxs-setting" /> Logout
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
