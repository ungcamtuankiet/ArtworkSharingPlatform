import React, { useEffect, useState } from "react";
import "./Product.css";
import axios from "axios";
import urlApi from "../../configAPI/UrlApi";
import CheckArt from "./checkArt/CheckArt";

export default function Product() {
  const [dataProduct, setDataProduct] = useState([]);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const productData = async () => {
      try {
        const response = await axios.get(
          `${urlApi}/api/Admin/get-artwork-for-admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setDataProduct(response.data);
      } catch (error) {
        console.error(error.request);
      }
    };
    productData();
  }, []);

  const getStatus = (isActive, isDeleted) => {
    if (isDeleted) {
      return "Bị từ chối";
    } else {
      return isActive ? "Được chấp nhận" : "Đang xử lý";
    }
  };

  const toggleFullscreen = (event) => {
    const imageElement = event.target; // Lấy phần tử ảnh được click
    if (imageElement) {
      imageElement.style.objectFit = 'contain';
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
        <h4>PRODUCTS</h4>
      </div>

      <div class="table-data-product">
        <div class="order">
          <div class="head">
            <h3>Recent Orders</h3>
            <i class="bx bx-search"></i>
            <i class="bx bx-filter"></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>Creator Name</th>
                <th>Image</th>
                <th>Date Order</th>
                <th>Price</th>
                <th>Description</th>
                <th>Status</th>
                <th>Accept | Cancel</th>
              </tr>
            </thead>
            <tbody>
              {dataProduct.map((item) => (
                <tr>
                  <td>{item.nick_Name}</td>
                  <td onClick={toggleFullscreen}>
                    <img src={item.url_Image} alt="image" />
                  </td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>${item.price}</td>
                  <td><textarea value={item.description}/></td>
                  <td>{getStatus(item.isActive, item.isDeleted)}</td>
                  <td><CheckArt item={item}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
