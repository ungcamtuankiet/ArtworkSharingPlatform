import React, { useState, useEffect } from "react";
import "./Shop.css";
import urlApi from "../../../../configAPI/UrlApi";
import CreateArt from "./createart/CreateArt";
import axios from "axios";
import { Link } from "react-router-dom";

export const Shop = () => {
  const [itemData, setItemData] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const artData = async () => {
      try {
        const response = await axios.get(
          `${urlApi}/api/Artwork/get-by-userId`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );
        setItemData(response.data);
        console.log("Data from API: ", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    artData();
  }, [isCreate]);

  const handleCreateArt = () => {
    setIsCreate((prev) => !prev);
  };
  return (
    <div className="shopUser">
      {/* hàm tạo ảnh và thêm thông tin */}
      <div className="content">
        <div className="commissions">
          <span>Artwork</span>
        </div>

        <div className="container-fluid" style={{ height: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "15px",
              justifyContent: "center", // Để căn giữa
              width: "100%",
              height: "100%",
              margin: "0 auto", // Để thẻ div nằm giữa trang
            }}
          >
            <CreateArt onCreate={handleCreateArt} />
            {itemData.map((item) => (
              <div key={item.id}>
                <Link
                  to={item && item.id ? `/detail/${item.id}` : "/fallback-path"}
                  style={{ color: "black" }}
                >
                  <div
                    className="cardShop"
                    style={{
                      height: "365px",
                      width: "auto",
                      boxShadow:
                        "3px 4px 2px 2px rgba(0, 0, 0, 0.1), 3px 6px 3px 6px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <div className="cardImg">
                      <img
                        src={item.url_Image}
                        alt=""
                        style={{ height: "95%", width: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="cardInfor">
                      <div className="cardName">
                        <div>
                          <span style={{ fontWeight: "bold" }}>
                            {item.name}
                          </span>
                        </div>
                        <div>
                          By{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {item.nick_Name}
                          </span>
                        </div>
                      </div>
                      <div className="cardPrice">
                        <div>
                          <strong>${item.price}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
