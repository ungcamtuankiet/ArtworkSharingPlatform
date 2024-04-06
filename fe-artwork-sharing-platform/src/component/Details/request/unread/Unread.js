import React, { useState, useEffect } from "react";
import "./Unread.css";
import urlApi from "../../../configAPI/UrlApi";
import axios from "axios";

export default function Unread() {
  const [hasData, setHasData] = useState(false);
  const [order, setOrder] = useState([]);
  const token = localStorage.getItem("token");

  const urlNoAva =
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/logo%2F499638df-cf1c-4ee7-9abf-fb51e875e6dc?alt=media&token=367643f5-8904-4be8-97a0-a794e6b76bd0";

  useEffect(() => {
    if (token) {
      axios
        .get(`${urlApi}/api/RequestOrder/get-mine-order`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setHasData(true);
            setOrder(response.data);
          } else {
            // Nếu response.data không phải là mảng, xử lý tương ứng
            console.error("Dữ liệu trả về không phải là mảng");
          }
        })
        .catch((error) => {
          // Xử lý lỗi nếu có
          console.error("Lỗi khi gọi API:", error);
        });
    }
  }, []);
  return (
    <React.Fragment>
      {hasData && order.length > 0 ? (
        <>
          {order.map((note) => (
            <li key={note} id="li2" className="liOrder">
              <div id="div1">
                <section style={{display: "flex"}}>
                  <img src={urlNoAva} alt="" />
                  <div style={{ margin: "12px 0 0 12px" }}>
                    From: <strong>{note.fullName_Sender}</strong>
                  </div>
                </section>
                <section>
                  <p>{note.text}</p>
                </section>
              </div>
            </li>
          ))}
        </>
      ) : (
        <li id="li1">
          <span>Your Unread Notes</span>
        </li>
      )}
    </React.Fragment>
  );
}
