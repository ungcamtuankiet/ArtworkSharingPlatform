import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import SearchBar from "./search/searchbar/SearchBar";
import Avatar from "./avtaruser/Avatar";
import Order from "./order/Order";
import EmailIcon from "@mui/icons-material/Email";

export default function Header({
  isLoginPage,
  isRegisterPage,
  isRecoveryPage,
  isEmailOTP,
  isHomeAdmin,
}) {
  const urlLogo =
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/logo%2Ffeed6075-55fd-4fb3-98d4-946d30029eda?alt=media&token=a3dd9363-73f3-4aec-ae32-264c761a0c0f";

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(false);
    }
  }, []);
  if (
    isLoginPage ||
    isRegisterPage ||
    isRecoveryPage ||
    isEmailOTP ||
    isHomeAdmin
  ) {
    // Ẩn header nếu là trang Login hoặc Register
    return null;
  }

  return (
    <>
      <div className="nav">
        <div className="navbar">
          <div className="search">
            <SearchBar />
          </div>
          <div className="sort"></div>
          <div className="logo">
            <Link to={`/`}>
              <img src={urlLogo} alt="Logo" />
            </Link>
          </div>
          <div className="regisLogin">
            {isLoggedIn && (
              <>
                <Link to={`/login`}>
                  <button>Login</button>
                </Link>
                <Link to={`/regis`}>
                  <button>Register</button>
                </Link>
              </>
            )}
            {!isLoggedIn && (
              <>
                <div className="emailIcon">
                  <Link to={"/request"}>
                    <EmailIcon />
                  </Link>
                </div>
                <Order />
              </>
            )}
            <Avatar />
          </div>
        </div>
      </div>
    </>
  );
}
