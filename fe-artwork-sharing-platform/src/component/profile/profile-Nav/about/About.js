import React, { useState } from "react";
import "./About.css";
import urlApi from "../../../../configAPI/UrlApi";
import axios from "axios";

export default function About({ userInfor, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickName, setNickName] = useState(userInfor.nickName || "");
  const [email, setEmail] = useState(userInfor.email || "");
  const [phoneNumber, setPhone] = useState(userInfor.phoneNumber || "");
  const [address, setAddress] = useState(userInfor.address || "");

  const handleFullNameChange = (value) => {
    setNickName(value);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePhoneNumberChange = (value) => {
    setPhone(value);
  };

  const handleAddressChange = (value) => {
    setAddress(value);
  };

  const token = localStorage.getItem("token");
  const handleSaveClick = () => {
    const userData = {
      nickName: nickName,
      email: email,
      phoneNo: phoneNumber,
      address: address,
    };
    axios
      .put(`${urlApi}/api/User/update-information`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setIsEditing(false);
        } else {
          throw new Error("Failed to update user data");
        }
        alert("Update account successful!");
        onUpdate(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.request);
        alert(error.request.response)
      });
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div>
      <div className="about-container">
        <div className="about-info">
          <h4>Thông tin cá nhân</h4>
  
          <div>
            <ul>
              <div className="about-left">
                <li>
                  <label htmlFor="fullName">Nick Name:</label>
                  <div>
                  <input
                    type="text"
                    value={nickName}
                    placeholder="Nick name"
                    onChange={(e) => handleFullNameChange(e.target.value)}
                  />
                  </div>
                </li>
                <li>
                  <label htmlFor="userName">Email:</label>
                  <div>
                  <input
                    type="text"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                  </div>
                </li>
                <li>
                  
                  <label htmlFor="address">Phone:</label>
                  <div>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                  />
                  </div>
                </li>
              </div>
              <div className="about-right">
                <li>
                  <label htmlFor="address">Address:</label>
                  <div>
                  <input
                    type="text"
                    value={address}
                    placeholder="Address"
                    onChange={(e) => handleAddressChange(e.target.value)}
                  />
                  </div>
                </li>
                <li>
                  <label htmlFor="createdAt">Created At:</label>
                  <div className="info-input">
                    {new Date(userInfor.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </li>
              </div>
            </ul>
            <div style={{ textAlign: "right" }}>
              <button onClick={handleSaveClick} className="edit-button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
}
