import React, { useState, useEffect } from "react";
import "./CreateArt.css";
import urlApi from "../../../../../configAPI/UrlApi";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { imgDb } from "../../../../../configFirebase/config";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import BackupIcon from "@mui/icons-material/Backup";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CreateArt({ onCreate }) {
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imgUrl, setImgUrl] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imgName, setImgName] = useState("No selected image.");
  const [remainingCharacters, setRemainingCharacters] = useState(60);

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
    }
    file && setImgName(file.name);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setImageFile(file);
      setImgName(file.name);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
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
  const handleSave = async () => {
    if (!name || !categoryName || !description || !price) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setIsLoading(true);
    const imgRef = ref(imgDb, `/${v4()}`);
    const snapshot = await uploadBytes(imgRef, imageFile);
    const url = await getDownloadURL(snapshot.ref);

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Category_Name", categoryName);
    formData.append("Description", description);
    formData.append("Price", price);
    formData.append("Url_Image", url); // Không cần thêm file và fileName

    try {
      // Gửi yêu cầu POST đến API
      const response = await axios.post(
        `${urlApi}/api/Artwork/create`,
        formData,
        {
          headers: {
            "Content-Type": `application/json`,
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //Reset input after create successful
      setName("");
      setCategoryName("");
      setDescription("");
      setPrice("");
      setImageFile("");
      setIsLoading(false);
      console.log("url", response.data);
      alert("Tạo thành công");
      navigate("/profile/shop");
      setIsPopupOpen(false);
      onCreate(response);
    } catch (error) {
      // Xử lý lỗi
      console.log("URL", url);
      alert("Hãy kiểm tra lại thông tin nhập vào!");
      console.error("Đã có lỗi xảy ra khi gửi yêu cầu API:", error);
      console.log(formData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isUserLoggedIn = token !== null;
    setIsLogin(isUserLoggedIn);

    // Redirect to login if not logged in
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  }, [token, navigate]);

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
    <div className="createart">
      {isLogin && (
        <a href="#popupCreate" onClick={() => setIsPopupOpen(true)}>
          <div className="createArt">
            <div className="cartcreate">
              <div>
                <AddIcon />
              </div>
              <span>Create a new artwork</span>
              <p>
                Offer custom creations directly to deviants who love your style.
              </p>
            </div>
          </div>
        </a>
      )}

      {/* popup */}
      {isPopupOpen && (
        <div id="popupCreate" className="overlay">
          <div className="popup">
            <div className="iconclose">
              <span style={{ marginLeft: "10px" }}>Create a new artwork</span>
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
                    {imageFile ? (
                      <img
                        src={imageUrl}
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
                      style={{ borderRadius: "10px" }}
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
                      placeholder="Enter price of artwork ($)"
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
                style={{ border: "none", flexDirection: "column" }}
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
                <section
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <AttachFileIcon style={{ color: "#1475cf" }} />
                  <span>{imgName}</span>
                  <DeleteIcon
                    onClick={() => {
                      setImgName("No selected image.");
                      setImageUrl(null);
                      setImageFile(null);
                    }}
                    style={{ color: "#1475cf" }}
                  />
                </section>
              </div>

              <div className="popupButtonCreate">
                <button onClick={() => handleSave()} disabled={isLoading}>
                  <span>{isLoading ? "Creating..." : "Create"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
