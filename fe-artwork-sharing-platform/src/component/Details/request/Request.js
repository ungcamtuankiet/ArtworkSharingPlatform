import React, { useEffect, useState } from "react";
import "./Request.css";
import urlApi from "../../../configAPI/UrlApi";
import axios from "axios";
import Sent from "./sent/Sent";
import PaymentRequest from "./paymentRequest/PaymentRequest";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

export default function Request({ userById }) {
  const [username, setUsername] = useState([]);
  const [currentTab, setCurrentTab] = useState("unread");
  const [nickName, setNickName] = useState(userById.nick_Name || "");
  const [mail, setMail] = useState("newRequest");
  const [email, setEmail] = useState(username.email || "");
  const [phoneNo, setPhoneNo] = useState(username.phoneNumber || "");
  const [text, setText] = useState("");
  const [updateData, setUpdateData] = useState([]);
  const token = localStorage.getItem("token");

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
  };

  const handleNewRequest = (tab) => {
    setMail(tab);
  };

  const handleNickname = (value) => {
    setNickName(value);
  };

  const handleEmail = (value) => {
    setEmail(value);
  };

  const handlePhoneNo = (value) => {
    setPhoneNo(value);
  };

  const handleText = (value) => {
    setText(value);
  };

  const handleSend = async () => {
    const dataSend = {
      email: email,
      phoneNumber: phoneNo,
      text: text,
    };
    try {
      if (!text) {
        alert("Hãy nhập nội dung cần gửi trước khi gửi!!!");
        return;
      }
      const response = await axios.post(
        `${urlApi}/api/RequestOrder/send-request?nick_Name=${nickName}`,
        dataSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Send successful!");
        setText("");
        setUpdateData(response);
      } else {
        console.error(
          "Failed to send. Server responded with status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error", error);
      alert(error.response.data);
    }
  };

  useEffect(() => {
    const data = {
      Token: token,
    };
    if (token) {
      axios
        .post(`${urlApi}/api/Auth/me`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const userInfo = response.data.userInfo;
          setUsername(userInfo);
          setEmail(userInfo.email || "");
          setPhoneNo(userInfo.phoneNumber || "");
        })
        .catch((error) => {
          // Xử lý lỗi nếu có
          console.error("Lỗi khi gọi API:", error);
        });
    }
  }, []);

  const [requestId, setRequestId] = useState(null);
  const [dataReqId, setDataReqId] = useState([]);
  const [iShow, setIsShow] = useState(false);

  useEffect(() => {
    const requestById = async () => {
      try {
        if (requestId !== null) {
          const response = await axios.get(
            `${urlApi}/api/RequestOrder/get-mine-request-by-id?id=${requestId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("data", response.data);
          setDataReqId(response.data);
          setIsShow(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (requestId !== null) {
      requestById();
    }
  }, [requestId]);

  const handleLiClick = (id) => {
    setRequestId(id);
  };

  const getStatus = (isActive, isDeleted) => {
    if (isDeleted) {
      return "Bị từ chối";
    } else {
      return !isActive ? "Được chấp nhận" : "Đang xử lý";
    }
  };

  const downloadImage = async () => {
    try {
      const response = await axios.get(
        `${urlApi}/api/Artwork/download?firebaseUrl=${dataReqId.url_Image}`,
        { responseType: "blob" }
      );
      const blob = response.data;
      // Xác định hậu tố cho tên tệp
      const filename = "image.jpg"; // thay đổi 'yourfilename.jpg' thành hậu tố mong muốn
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
    <div className="request">
      <section className="request-content">
        <section className="content-title">
          <span>Request</span>
          <div style={{ width: "170px" }}>
            <button
              onClick={() => handleNewRequest("newRequest")}
              className={currentTab === "newRequest" ? "notMail" : ""}
            >
              New request
            </button>
          </div>
        </section>
        <section className="content-box">
          {/* <div className="box-sideBar">
            <button
              onClick={() => handleTabClick("sent")}
              className={currentTab === "sent" ? "active" : ""}
            >
              Sent
            </button>
          </div> */}
          <div className="box-request">
            <ul>
              <Sent
                username={username}
                updateData={updateData}
                onLiClick={handleLiClick}
              />
            </ul>
            <div>
              {mail === "newRequest" ? (
                <div className="boxRequest-mail">
                  <section
                    style={{ width: "90%", height: "90%", marginTop: "15px" }}
                  >
                    <section>
                      <span
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Sent to:
                      </span>
                      <input
                        type="text"
                        value={nickName}
                        onChange={(e) => handleNickname(e.target.value)}
                      />

                      <span
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Email:
                      </span>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => handleEmail(e.target.value)}
                      />

                      <span
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Phone number:
                      </span>
                      <input
                        type="text"
                        value={phoneNo}
                        onChange={(e) => handlePhoneNo(e.target.value)}
                      />

                      <textarea
                        placeholder="Please enter your request here"
                        value={text}
                        onChange={(e) => handleText(e.target.value)}
                      />
                    </section>
                    <section
                      style={{ textAlign: "right", marginBottom: "20px" }}
                    >
                      <button
                        onClick={() => handleNewRequest("notMail")}
                        className={currentTab === "newRequest" ? "notMail" : ""}
                        style={{
                          border: "none",
                          fontWeight: "bold",
                          color: "#b1b1b9",
                          width: "120px",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          height: "51px",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "black";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#b1b1b9";
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => handleSend(e)}
                        style={{
                          marginLeft: "10px",
                          border: "none",
                          backgroundColor: "#05eb8f",
                          width: "120px",
                          height: "51px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        SEND
                      </button>
                    </section>
                  </section>
                </div>
              ) : (
                <div className="boxRequest-notMail">
                  {iShow ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          width: "90%",
                          marginTop: "15px",
                          flexDirection: "column",
                          borderBottom: "0.2px solid grey",
                        }}
                      >
                        <section
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            marginTop: "15px",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <div style={{ marginLeft: "12px" }}>
                              <section style={{ textAlign: "left" }}>
                                From: <strong>{username.nickName}</strong>
                              </section>
                              <section style={{ textAlign: "left" }}>
                                To:{" "}
                                <strong>{dataReqId.nickName_Receivier}</strong>
                              </section>
                            </div>
                          </div>
                          <div>
                            <p
                              style={{
                                margin: "0",
                                marginBottom: "5px",
                                color: "#a8a1a1",
                              }}
                            >
                              {dataReqId.isSendResult === true ? (
                                <strong>
                                  The results have been sent successfully
                                </strong>
                              ) : (
                                <strong>
                                  {getStatus(
                                    dataReqId.isActive,
                                    dataReqId.isDeleted
                                  )}
                                </strong>
                              )}
                            </p>
                            <p
                              style={{
                                margin: "0",
                                textAlign: "right",
                              }}
                            >
                              {!dataReqId.isActive && (
                                <strong>{dataReqId.statusRequest}</strong>
                              )}
                            </p>
                          </div>
                        </section>
                        <section
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            marginTop: "15px",
                          }}
                        >
                          <span
                            style={{ marginLeft: "12px", fontWeight: "bold" }}
                          >
                            Request you wrote:
                          </span>
                          <textarea
                            style={{
                              textAlign: "left",
                              margin: "10px 0 15px 0",
                              padding: "10px 0 0 15px",
                              border: "0.4px solid gray",
                              borderRadius: "10px",
                              resize: "vertical",
                              minHeight: "80px",
                              outline: "none",
                            }}
                            value={dataReqId.text}
                          ></textarea>
                        </section>
                      </div>
                      <div
                        style={{
                          width: "90%",
                          margin: "15px 0",
                        }}
                      >
                        <section>
                          <img
                            src={dataReqId.url_Image}
                            alt=""
                            style={{ height: "220px", width: "auto" }}
                          />
                        </section>
                        <section>
                          <p style={{ fontWeight: "600" }}>
                            Text result: {dataReqId.text_Result}
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p style={{ fontWeight: "600", margin: "0" }}>Price: ${dataReqId.price}</p>
                            {dataReqId.isPayment === true ? (
                              <div
                                style={{
                                  textAlign: "right",
                                  cursor: "pointer",
                                }}
                              >
                                <DownloadRoundedIcon onClick={downloadImage} />
                              </div>
                            ) : (
                              <PaymentRequest dataReqId={dataReqId} />
                            )}
                          </div>
                        </section>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "25px",
                          fontWeight: "600",
                          color: "gray",
                        }}
                      >
                        You Don't have any notification
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
