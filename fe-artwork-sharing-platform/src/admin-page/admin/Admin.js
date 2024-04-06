import React, { useState, useEffect } from "react";
import {
  BsFillArchiveFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import "./Admin.css";
import urlApi from "../../configAPI/UrlApi";
import axios from "axios";

function Admin() {
  const [creatorUsers, setCreatorUsers] = useState();
  const [productCount, setProductCount] = useState();

  const [isAdd, setIsAdd] = useState([]);
  const [isDelete, setIsDelete] = useState([]);

  useEffect(() => {
    async function fetchRegisteredUsers() {
      try {
        const response = await axios.get(`${urlApi}/api/User/users`);
        const users = response.data;

        const creatorCount = users.filter((user) =>
          user.roles.includes("CREATOR")
        ).length;

        const productsResponse = await axios.get(
          `${urlApi}/api/Artwork/get-all`
        );
        const products = productsResponse.data;

        setProductCount(products.length);
        setCreatorUsers(creatorCount);
      } catch (error) {
        console.error("Error fetching registered users:", error);
      }
    }

    fetchRegisteredUsers();
  }, []);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const categories = async () => {
      try {
        const dataCategory = await axios.get(
          `${urlApi}/api/Category/get-all-category`
        );
        setCategories(dataCategory.data);
      } catch (error) {
        console.error(error);
      }
    };
    categories();
  }, [isAdd, isDelete]);

  const [add, setAdd] = useState("");
  const [deleteData, setDeleteData] = useState("");
  const token = localStorage.getItem("token");

  const handleAdd = (e) => {
    setAdd(e.target.value);
  };
  const handleDeleteData = (e) => {
    setDeleteData(e.target.value);
  };

  const addCategory = async () => {
    try {
      const response = await axios.post(
        `${urlApi}/api/Category/create`,
        { name: add },
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setAdd("");
      alert("Add new category successful");
      setIsAdd(response);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async () => {
    try {
      const response = await axios.delete(
        `${urlApi}/api/Category/delete?id=${deleteData}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setDeleteData("");
      alert("Delete category successful");
      setIsDelete(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <main className="main-container">
      <div className="main-title">
        <h4>DASHBOARD</h4>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <BsFillArchiveFill className="card_icon" />
          </div>
          <div className="text-ad">
            <h3>PRODUCTS</h3>
            <p>{productCount}</p> {/* Hiển thị số lượng sản phẩm */}
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <BsPeopleFill className="card_icon" />
          </div>
          <div className="text-ad">
            <h3>CEARTOR</h3>
            <p>{creatorUsers}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <BsFillBellFill className="card_icon" />
          </div>
          <div className="text-ad">
            <h3>REPORTS</h3>
           
          </div>
        </div>
      </div>
      <div class="table-data">
        <div class="order">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div class="head">
              <h3>Recent Categories</h3>
              <i class="bx bx-search"></i>
              <i class="bx bx-filter"></i>
            </div>

            <section style={{ display: "flex" }}>
              <input
                placeholder="Enter name category"
                onChange={(e) => handleAdd(e)}
              />
              <button
                onClick={addCategory}
                style={{ height: "45.8px", padding: "0 10px" }}
              >
                Add
              </button>
            </section>
            <section style={{ display: "flex" }}>
              <input
                placeholder="Enter id category"
                onChange={(e) => handleDeleteData(e)}
              />
              <button
                onClick={deleteCategory}
                style={{ height: "45.8px", padding: "0 10px" }}
              >
                Delete
              </button>
            </section>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name of category</th>
                  <th>Date create</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Admin;
