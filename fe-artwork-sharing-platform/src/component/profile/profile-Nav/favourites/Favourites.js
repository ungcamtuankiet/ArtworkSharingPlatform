import React, { useEffect, useState } from "react";
import "./Favourites.css";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { Link } from "react-router-dom";
import urlApi from "../../../../configAPI/UrlApi";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const favouritesData = async () => {
      try {
        const response = await axios.get(
          `${urlApi}/api/Favourite/get-favourite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavourites(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    favouritesData();
  }, []);
  const [hoveredItem, setHoveredItem] = useState(null);
  console.log(favourites);
  return (
    <div className="favourite">
      {/* hàm tạo ảnh và thêm thông tin */}
      <div className="content">
        <div className="commissions">
          <h3>Your Favourites</h3>
        </div>

        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "25px",
          }}
        >
          <Masonry
            columnsCount={3}
            gutter="10px"
            style={{ width: "100%", gap: "0" }}
          >
            {favourites.map((item, index) => (
              <Link
                to={
                  item && item.artwork_Id
                    ? `/detail/${item.artwork_Id}`
                    : "/fallback-path"
                }
                style={{
                  color: "black",
                  display: "block",
                  margin: "0 4px",
                  position: "relative",
                }}
                onMouseEnter={() => item && setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <img
                  src={item.url_Image}
                  key={index}
                  alt=""
                  style={{ width: "100%", display: "block" }}
                />

                {hoveredItem === item && (
                  <div
                    className="image-info"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      padding: "8px",
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      color: "white",
                      height: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <section
                      style={{
                        margin: "10px",
                      }}
                    >
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          {item && item.name}
                        </span>
                      </p>
                      <p>
                        By:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {item && item.nick_Name}
                        </span>
                      </p>
                    </section>
                    <section
                      style={{
                        margin: "10px",
                      }}
                    >
                      <p>
                      {item && item.price !== 0 ? (
                        <span style={{ fontWeight: "bold" }}>
                          ${item && item.price}
                        </span>
                      ) : (
                        <span style={{ fontWeight: "bold" }}>Free</span>
                      )}
                    </p>
                    </section>
                  </div>
                )}
              </Link>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
}
