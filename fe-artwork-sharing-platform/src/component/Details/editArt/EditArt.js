import React, { useState, useEffect } from "react";
import "./EditArt.css";
import urlApi from "../../../configAPI/UrlApi";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import BackupIcon from "@mui/icons-material/Backup";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { imgDb } from "../../../configFirebase/config";

export default function EditArt({ itemData, setUpdateState }) {
  const [name, setName] = useState(itemData.name || "");
  const [categoryName, setCategoryName] = useState(
    itemData.category_Name || ""
  );
  const [description, setDescription] = useState(itemData.description || "");
  const [price, setPrice] = useState(itemData.price || 0);
  const [image, setImage] = useState(itemData.url_Image || "");
  const [imageFile, setImageFile] = useState(null);
  const [imgUrl, setImgUrl] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingCharacters, setRemainingCharacters] = useState(60);

  useEffect(() => {
    // Cập nhật số ký tự còn lại khi component được render và name đã được thiết lập
    setRemainingCharacters(60 - name.length);
  }, [name]);

  const handleName = (value) => {
    if (value.length <= 60) {
      const updatedName = value.slice(0, 60);
      setName(updatedName);
      setRemainingCharacters(60 - updatedName.length);
    }
  };

  const handleCategoryName = (event) => {
    const selectedOption = event.target.value;
    setCategoryName(selectedOption);
  };

  const handleDescription = (value) => {
    setDescription(value);
  };

  const handlePrice = (value) => {
    setPrice(value);
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    } else {
      setImage(itemData.url_Image || "");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    listAll(ref(imgDb, "")).then(async (imgs) => {
      const urls = await Promise.all(
        imgs.items.map(async (val) => {
          const url = await getDownloadURL(val);
          return url;
        })
      );
      setImgUrl(urls);
    });
  }, []);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handleEdit = async () => {
    let url = itemData.url_Image || "";
    setIsLoading(true);
    if (imageFile) {
      const imgRef = ref(imgDb, `/${v4()}`);
      const snapshot = await uploadBytes(imgRef, imageFile);
      url = await getDownloadURL(snapshot.ref);
    }
    const editData = {
      name: name,
      category_Name: categoryName,
      description: description,
      price: parseFloat(price),
      url_Image: url,
    };
    try {
      // Make a DELETE request to the API endpoint
      const response = await axios.put(
        `${urlApi}/api/Artwork/update-artwork?id=${itemData.id}`,
        editData,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response as needed
      console.log("Update artwork successful:", response.data);
      alert("Update Artwork successful!");
      navigate("/profile/mylog/:id");
      setIsPopupOpen(false);
      setUpdateState(response);
    } catch (error) {
      // Handle errors
      console.error("Error updating:", error.response.data.title);
      alert("Something wrong when you update");
      setIsLoading(false);
    }
  };

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const categoriesData = async () => {
      try {
        const response = await axios.get(
          `${urlApi}/api/Category/get-all-category`
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    categoriesData();
  }, []);
  return (
    <div>
      <a href="#popupEdit" onClick={() => setIsPopupOpen(true)}>
        <EditIcon className="iconEdit" />
      </a>
      {isPopupOpen && (
        <div id="popupEdit" className="overlay">
          <div className="popup">
            <div className="iconclose">
              <span style={{ marginLeft: "10px" }}>Edit your artwork</span>
              <a
                className="close"
                href="#"
                style={{ color: "black", textDecoration: "none" }}
              >
                &times;
              </a>
            </div>

            <div className="popupCreate">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  border: "none",
                }}
              >
                <section
                  style={{
                    width: "300px",
                  }}
                  onDrop={(e) => handleDrop(e)}
                  onDragOver={(e) => handleDragOver(e)}
                >
                  <div
                    className="popupImage"
                    onClick={(e) =>
                      document.querySelector(".input-img").click()
                    }
                  >
                    <input
                      type="file"
                      onChange={(e) => handleImageFile(e)}
                      accept="image/*"
                      hidden
                      className="input-img"
                    />
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        style={{
                          width: "310px",
                          height: "250px",
                          objectFit: "cover",
                          objectPosition: "50% 50%",
                        }}
                      />
                    ) : (
                      <div
                        className="imgNew"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <BackupIcon
                          sx={{ fontSize: 40 }}
                          style={{ color: "#1475cf" }}
                        />
                        <span>Drop or click here to upload your image</span>
                      </div>
                    )}
                  </div>
                </section>

                <section
                  style={{
                    width: "350px",
                    height: "250px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <div className="popupInput">
                    <input
                      type="text"
                      placeholder="Enter name of artwork *"
                      value={name}
                      onChange={(e) => handleName(e.target.value)}
                      maxLength={60}
                    />
                    <span style={{ fontWeight: "600", color: "#838592" }}>
                      {remainingCharacters}
                    </span>
                  </div>

                  <FormControl
                    sx={{ m: 1, minWidth: 120 }}
                    style={{ margin: "0 0 5px 0", width: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-helper-label">
                      Category *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={categoryName}
                      onChange={handleCategoryName}
                      label="Category *"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 250, // Đặt giới hạn chiều cao tại đây
                          },
                        },
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem value={`${category.name}`}>{category.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="popupInput">
                    <input
                      type="number"
                      placeholder="Enter price of artwork ($) *"
                      value={price}
                      onChange={(e) => handlePrice(e.target.value)}
                      min="0"
                    />
                    <span style={{ fontWeight: "600", color: "#838592" }}>
                      $
                    </span>
                  </div>
                </section>
              </div>

              <div
                className="popupInput"
                style={{ border: "none", flexDirection: "column", marginTop: "15px", }}
              >
                <section
                  style={{
                    width: "95%",
                    border: "0.5px solid #c9cacf",
                    borderRadius: "5px",
                    paddingLeft: "20px",
                  }}
                >
                  <textarea
                    type="text"
                    placeholder="Enter description of artwork *"
                    value={description}
                    onChange={(e) => handleDescription(e.target.value)}
                    style={{
                      border: "none",
                      height: "150px",
                      marginTop: "10px",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </section>
              </div>

              <div className="popupButtonCreate">
                <button onClick={() => handleEdit()}>
                  <span>{isLoading ? "Update..." : "Update"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
