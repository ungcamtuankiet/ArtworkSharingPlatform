import React, { useState } from "react";
import "./ButtonStatus.css";
import axios from "axios";
import urlApi from "../../../../../../configAPI/UrlApi";

export default function ButtonStatus({ id, isActive, isDeleted, setUpdateOrder }) {
  
  const token = localStorage.getItem("token");
  const handleCancel = async () => {
    try {
      const response = await axios.patch(
        `${urlApi}/api/RequestOrder/cancel-request?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setUpdateOrder(response);
    } catch (error) {
      console.log(error.request);
    }
  };

  const handleAccept = async () => {
    try {
      const response = await axios.patch(
        `${urlApi}/api/RequestOrder/update-request?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setUpdateOrder(response)
      alert("Accept request successful!");
    } catch (error) {
      console.log(error.request);
      alert(error.response.data);
    }
  };
  return (
    <div className="buttonStatus">
      <button
        className="cancel"
        onClick={() => handleCancel()}
        disabled={!isActive || isDeleted}
        style={{
          backgroundColor: !isActive ? "#FFCAD4" : isDeleted ? "red" : "inherit",
          color: !isActive || isDeleted ? "white" : "inherit",
        }}
      >
        Cancel
      </button>
      <button
        className="custom-btn btn-3"
        onClick={() => handleAccept()}
        disabled={!isActive || isDeleted}
        style={{
          backgroundColor: !isActive ? "rgba(2, 126, 251, 1);" : isDeleted ? "#FFCAD4" : "inherit",
          color: !isDeleted || isActive ? "white" : "inherit",
        }}
      >
        <span>Accept</span>
      </button>
    </div>
  );
}
