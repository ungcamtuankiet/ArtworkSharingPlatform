import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Creator.css";
import urlApi from "../../configAPI/UrlApi";
import { FaLock, FaUnlock } from "react-icons/fa";

function Creator() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  console.log("he:", users);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${urlApi}/api/Admin/get-creator-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const token = localStorage.getItem("token");
  const handleStatusChange = async (userId, isActive) => {
    try {
      await axios.patch(
        `${urlApi}/api/Admin/update-status-user?user_Id=${userId}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          return { ...user, isActive: !isActive };
        }
        return user;
      });
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h4>CREATOR</h4>
      </div>
      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Registered Users</h3>
            <i className="bx bx-search"></i>
            <i className="bx bx-filter"></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nick Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Date Registered</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.nickName}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <button
                      onClick={() => handleStatusChange(user.id, user.isActive)}
                    >
                      {user.isActive ? <FaLock /> : <FaUnlock />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Creator;
