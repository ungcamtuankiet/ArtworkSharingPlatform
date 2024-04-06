import React, { useEffect, useState } from "react";
import "./SaleHistory.css";
import axios from "axios";
import urlApi from "../../../../configAPI/UrlApi";

export default function SaleHistory() {
  const [salesData, setSalesData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const saleData = async () => {
      try {
        const response = await axios.get(`${urlApi}/api/Order/get-mine-order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSalesData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error.response);
      }
    };
    saleData();
  }, []);

  return (
    <div className="table-sale">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Owner</th>
            <th>Purchase Date</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>
                <img src={sale.url_Image} alt="" />
              </td>
              <td>{sale.nickNme_Buyer}</td>
              <td>
                {new Date(sale.purchase_Date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td>${sale.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
