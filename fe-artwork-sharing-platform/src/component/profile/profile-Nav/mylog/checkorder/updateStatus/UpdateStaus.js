import React, { useState } from "react";
import urlApi from "../../../../../../configAPI/UrlApi";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { imgDb } from "../../../../../../configFirebase/config";
import { useNavigate } from "react-router-dom";
import BackupIcon from "@mui/icons-material/Backup";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UpdateStaus({ dataRequestById, setUpdateOrder }) {
  const [statusRequest, setStatusRequest] = useState(
    dataRequestById.statusRequest || ""
  );

  const completed = dataRequestById.statusRequest;
  // const isPayment = dataRequestById.isPayment;
  console.log(dataRequestById);
  const handleStatusRequest = (event) => {
    const selectedOption = event.target.value;
    setStatusRequest(selectedOption);
  };
  const token = localStorage.getItem("token");
  const handleUpdateStatus = async () => {
    if (statusRequest === dataRequestById.statusRequest) {
      alert("You cannot choose the same status!");
      return;
    }
    const data = {
      statusRequest: statusRequest,
    };
    try {
      const response = await axios.patch(
        `${urlApi}/api/RequestOrder/update-status-request?id=${dataRequestById.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setUpdateOrder(response);
      alert("Change status request successful!");
    } catch (error) {
      console.log(error.request);
      alert(error.response.data);
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgName, setImgName] = useState("No selected image.");

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

  const handleSave = async () => {
    if (!description || !price) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setIsLoading(true);
    const imgRef = ref(imgDb, `/${v4()}`);
    const snapshot = await uploadBytes(imgRef, imageFile);
    const url = await getDownloadURL(snapshot.ref);

    const formData = new FormData();
    formData.append("Text", description);
    formData.append("Price", price);
    formData.append("Url_Image", url); // Không cần thêm file và fileName

    try {
      // Gửi yêu cầu POST đến API
      const response = await axios.post(
        `${urlApi}/api/RequestOrder/send-result-artwork?id=${dataRequestById.id}`,
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
      setDescription("");
      setPrice("");
      setImageFile("");
      setIsLoading(false);
      console.log("url", response.data);
      alert("Send result request successful");
      setIsPopupOpen(false);
    } catch (error) {
      // Xử lý lỗi
      console.log("URL", url);
      alert("Hãy kiểm tra lại thông tin nhập vào!");
      console.error("Đã có lỗi xảy ra khi gửi yêu cầu API:", error.response);
      console.log(formData);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <FormControl
        sx={{ m: 1, minWidth: 120 }}
        style={{ margin: "0 0 5px 0", width: "100%" }}
      >
        <InputLabel id="demo-simple-select-helper-label">
          Status request
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={statusRequest}
          onChange={handleStatusRequest}
          label="Status request"
        >
          <MenuItem
            value={"Waiting"}
            disabled={
              dataRequestById.statusRequest === "Processing" ||
              dataRequestById.statusRequest === "Completed"
            }
          >
            Waiting
          </MenuItem>
          <MenuItem
            value={"Processing"}
            disabled={dataRequestById.statusRequest === "Completed"}
          >
            Processing
          </MenuItem>
          <MenuItem value={"Completed"}>Completed</MenuItem>
        </Select>
      </FormControl>
      <section>
        {completed === "Completed" ? (

          <a href="#popupCreate" onClick={() => setIsPopupOpen(true)}>
            <button className="custom-btn btn-3">Send result order</button>
          </a>
        ) : (
          <button
            className="custom-btn btn-3"
            onClick={(e) => handleUpdateStatus(e.target.value)}
          >
            Submit
          </button>
        )}

          {/* open popup */}
        {isPopupOpen && (
          <div id="popupCreate" className="overlay">
            <div className="popup">
              <div className="iconclose">
                <span style={{ marginLeft: "10px" }}>Send result request</span>
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
                        type="number"
                        placeholder="Enter price of artwork ($) *"
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
                    <span>{isLoading ? "Send..." : "Send"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
