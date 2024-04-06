import React, { useEffect, useState } from "react";
import "./SuccessPage.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import urlApi from "../../../configAPI/UrlApi";
import { useParams } from "react-router-dom";

export default function SuccessPage() {
  const [bill, setBill] = useState([]);
  const order_Id = localStorage.getItem("order_Id");
  const token = localStorage.getItem("token");
  const { ID } = useParams();
  console.log("Id:", order_Id);
  console.log("data:", bill);
  console.log("id: ", ID);
  useEffect(() => {
    const billData = async () => {
      try {
        const fetchData = await axios.get(
          `${urlApi}/api/Order/get-bill?id=${order_Id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        setBill(fetchData.data);
      } catch (error) {
        console.error(error);
      }
    };
    billData();
  }, [order_Id]);

  const handleClick = () =>{
    localStorage.removeItem("order_Id");
    window.location.href = (`/detail/${bill.artwork_Id}`)
  }

  return (
    <main className="pageSuccess">
      <div className="contain">
        {/* logo */}
        <div className="logo">
          <section className="logoSuccess">
            <img src="assets/image/logoSuccess.avif" alt="" />
          </section>
        </div>
        {/* content */}
        <div className="content">
          {/* loi cam on */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <section className="title">Thank you !</section>
            <section
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CheckCircleIcon
                style={{ color: "#36e190", marginRight: "5px" }}
                fontSize="large"
              />{" "}
              <span style={{ fontSize: "20px" }}>Payment done successful.</span>
            </section>
          </div>
          {/* info don hang */}
          <div className="infoBill">
            <section style={{ borderBottom: "0.5px solid #B5C0D0" }}>
              <img src={bill.url_Image} alt="" />
            </section>
            <section
              style={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                margin: "10px 0 0 20px",
              }}
            >
              <span>Name Image: {bill.name_Artwork}</span>
              <span>Date buy: {new Date(bill.date_Payment).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
              <span>Name of buyer: {bill.nickName_Buyer}</span>
              <span>Name of seller: {bill.nickName_Seller}</span>
              <span>Category: {bill.category_Artwork}</span>
              <span>Price: {bill.price}</span>
            </section>
            <section style={{ textAlign: "right" }}>
              <button className="buttonAccept" onClick={handleClick}>Accept</button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
