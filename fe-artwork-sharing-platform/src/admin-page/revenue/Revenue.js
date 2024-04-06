import React, { useEffect, useState } from "react";
import "./Revenue.css";
import axios from "axios";
import urlApi from "../../configAPI/UrlApi";

export default function Revenue() {
  const [dataRevenues, setDataRevenues] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const revenues = async () => {
      try {
        const dataRevenue = await axios.get(
          `${urlApi}/api/Admin/get-user-revenue`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(dataRevenue.data);
        setDataRevenues(dataRevenue.data);
      } catch (error) {
        console.error(error.response);
      }
    };
    revenues();
  }, []);

  const toggleFullscreen = (event) => {
    const imageElement = event.target; // Lấy phần tử ảnh được click
    if (imageElement) {
      imageElement.style.objectFit = "contain";
      // Kiểm tra xem trình duyệt có hỗ trợ API fullscreen không
      if (imageElement.requestFullscreen) {
        // Nếu fullscreen đang được bật, tắt fullscreen
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          // Nếu fullscreen đang tắt, bật fullscreen cho phần tử ảnh
          imageElement.requestFullscreen();
        }
      } else {
        alert("Your browser does not support fullscreen mode.");
      }
    } else {
      alert("Image element not found.");
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h4>Revenue</h4>
      </div>

      <div class="table-data-product">
        <div class="order">
          <div class="head">
            <h3>User Revenue</h3>
            <i class="bx bx-search"></i>
            <i class="bx bx-filter"></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name Seller</th>
                <th>Name buyer</th>
                <th>Image</th>
                <th>Purchase date</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {dataRevenues.map((item, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.nickName_Seller}</td>
                  <td>{item.nickNme_Buyer}</td>
                  <td onClick={toggleFullscreen}>
                    <img src={item.url_Image} alt="image" />
                  </td>
                  <td>
                    {new Date(item.purchase_Date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
