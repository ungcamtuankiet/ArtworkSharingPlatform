import React, { useState, useEffect } from "react";
import "./TransactionHistory.css";
import axios from "axios";
import urlApi from "../../../configAPI/UrlApi";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [downImg, setDownImg] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const historyData = async () => {
      try {
        const response = await axios.get(
          `${urlApi}/api/Order/get-payment-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Data transaction: ", response.data);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };
    historyData();
  }, []);

  const formatFileName = (name) => {
    return name.toLowerCase().replace(/ /g, "_");
  };

  const downloadImage = async (url_Image, name_Artwork) => {
    try {
      const response = await axios.get(
        `${urlApi}/api/Artwork/download?firebaseUrl=${url_Image}`,
        { responseType: "blob" }
      );
      const blob = response.data;
      // Xác định hậu tố cho tên tệp
      const filename = `${formatFileName(name_Artwork)}.jpg`; // thay đổi 'yourfilename.jpg' thành hậu tố mong muốn
      // Tạo URL cho Blob với hậu tố tệp
      const imageUrl = URL.createObjectURL(
        new Blob([blob], { type: "image/jpeg" })
      );
      // Tạo một thẻ a ẩn và kích hoạt sự kiện click của nó để tải xuống
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = filename;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      <div className="table-body">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name of seller</th>
              <th>Name of artwork</th>
              <th>Image</th>
              <th>Price</th>
              <th>Purchase Date</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{transaction.nickName_Seller}</td>
                <td>{transaction.name_Artwork}</td>
                <td>
                  <img
                    src={transaction.url_Image}
                    style={{ width: "auto", height: "70px" }}
                    alt=""
                  />
                </td>
                <td>${transaction.price}</td>
                <td>
                  {new Date(transaction.purchase_Date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </td>
                <td>
                  <DownloadRoundedIcon
                  className="iconDown"
                    onClick={() =>
                      downloadImage(
                        transaction.url_Image,
                        transaction.name_Artwork
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
