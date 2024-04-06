import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProfileNav.css";

export default function ProfileNav() {
  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="profile-nav">
      <div className="nav-bar">
        <ul>
          <li className={activeLink === "/profile/favourites" ? "active" : ""}>
            <Link
              to="/profile/favourites"
              onClick={() => handleLinkClick("/profile/favourites")}
            >
              Favorites
            </Link>
          </li>
          <li className={activeLink === "/profile/shop" ? "active" : ""}>
            <Link
              to="/profile/shop"
              onClick={() => handleLinkClick("/profile/shop")}
            >
              Shop
            </Link>
          </li>
          <li className={activeLink === "/profile/about" ? "active" : ""}>
            <Link
              to="/profile/about"
              onClick={() => handleLinkClick("/profile/about")}
            >
              About
            </Link>
          </li>
          <li className={activeLink === "/profile/mylog/:id" ? "active" : ""}>
            <Link
              to="/profile/mylog/:id"
              onClick={() => handleLinkClick("/profile/mylog/:id")}
            >
              MyLog
            </Link>
          </li>
          <li className={activeLink === "/profile/saleHistory" ? "active" : ""}>
            <Link
              to="/profile/saleHistory"
              onClick={() => handleLinkClick("/profile/saleHistory")}
            >
              Sale History
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
