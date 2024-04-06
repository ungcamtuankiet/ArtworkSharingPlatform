import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import MailIcon from "@mui/icons-material/Mail";
import PaidIcon from "@mui/icons-material/Paid";
import { Link } from "react-router-dom";
import "./Detail.css";
import urlApi from "../../configAPI/UrlApi";
import axios from "axios";
import EditArt from "./editArt/EditArt";
import DeleteArt from "./deleteArt/DeleteArt";
import Favourite from "./favourite/Favourite";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FileDownloadOffRoundedIcon from "@mui/icons-material/FileDownloadOffRounded";

export default function Detail({ setUserById, statusPay }) {
  // const [comment, setComment] = useState("");
  // const [isCommentModalOpen, setIsCommentModalOpen] = useState(false); // State để điều khiển việc hiển thị modal comment
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updateState, setUpdateState] = useState([]);
  const token = localStorage.getItem("token");

  const urlNoAva =
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/logo%2F499638df-cf1c-4ee7-9abf-fb51e875e6dc?alt=media&token=367643f5-8904-4be8-97a0-a794e6b76bd0";

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  const toggleFullscreen = () => {
    const imageElement = document.querySelector(".product-tumb img"); // Lấy phần tử ảnh
    if (imageElement) {
      imageElement.style.objectFit = 'contain';
      // Kiểm tra xem trình duyệt có hỗ trợ API fullscreen không
      if (imageElement.requestFullscreen) {
        // Nếu fullscreen đang được bật, tắt fullscreen
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          // Nếu fullscreen đang tắt, bật fullscreen cho phần tử ảnh
          imageElement.requestFullscreen();
        }
      } else {
        alert("Your browser does not support fullscreen mode.");
      }
    } else {
      alert("Image element not found.");
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handlePayment = (navigate, location) => {
    console.log("Redirect path:", location.pathname);
    if (isLoggedIn) {
      navigate("/payment");
    } else {
      localStorage.setItem("redirectPath", location.pathname);
      navigate("/login");
    }
  };

  const handleRequest = (navigate, location) => {
    console.log("Redirect path:", location.pathname);
    if (isLoggedIn) {
      navigate("/request");
    } else {
      localStorage.setItem("redirectPath", location.pathname);
      navigate("/login");
    }
  };

  const [itemData, setItemData] = useState([]);
  const { ID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${urlApi}/api/Artwork/${String(ID)}`);
        setItemData(response.data);
        setUserById(response.data);
        console.log("Data from API: ", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [ID, updateState]); // Thêm ID vào dependency array để useEffect chạy lại khi ID thay đổi

  const handleAuthorClick = () => {
    if (isLoggedIn) {
      window.location.href = "/profile";
    } else {
      localStorage.setItem("redirectPath", window.location.pathname);
      window.location.href = "/login";
    }
  };
  //call api để xét tên người dùng
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          `${urlApi}/api/Auth/me`,
          {
            token: token,
          },
          {
            headers: {
              accept: "text/plain",
              "Content-Type": "application/json",
            },
          }
        );
        setUserData(response.data);
        console.log("User data from API: ", response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const formatFileName = (name) => {
    return name.toLowerCase().replace(/ /g, "_");
  };

  const downloadImage = async () => {
    try {
      const response = await axios.get(
        `${urlApi}/api/Artwork/download?firebaseUrl=${itemData.url_Image}`,
        { responseType: "blob" }
      );
      const blob = response.data;
      // Xác định hậu tố cho tên tệp
      const filename = `${formatFileName(itemData.name)}.jpg`; // thay đổi 'yourfilename.jpg' thành hậu tố mong muốn
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
    <div className="container-card">
      <div className="product-card">
        <div className="product-tumb">
          <img src={itemData.url_Image} alt="Product" />
        </div>
      </div>
      <div className="product-icons">
        <Favourite itemData={itemData} />
        <div className="product-comment">
          {/* Clicking on the icon opens the comment modal */}
          <button>
            <CommentIcon />
            <span>Comment</span>
          </button>
          {/* Modal displayed when isCommentModalOpen state is true */}
          {/* <Modal
            open={isCommentModalOpen}
            actions={[
              <Button onClick={handleCommentSubmit} modal="close" waves="light">
                Submit
              </Button>,
            ]}
            options={{ onCloseEnd: () => setIsCommentModalOpen(false) }} // Khi đóng modal, cập nhật state để đóng modal
          >
            <Textarea
              placeholder="Add your comment here..."
              value={comment}
              onChange={handleCommentChange}
            />
          </Modal> */}
        </div>
        <div className="product-download">
          {itemData.isPayment === false ? (
            isLoggedIn ? (
              <Link to={`/payment`}>
                <button onClick={() => handlePayment(navigate, location)}>
                  <PaidIcon />
                  <span>Payment ${itemData.price}</span>
                </button>
              </Link>
            ) : (
              <Link to="/login">
                <button onClick={() => handlePayment(navigate, location)}>
                  <PaidIcon />
                  <span>Thanh toán</span>
                </button>
              </Link>
            )
          ) : (userData.userInfo &&
              userData.userInfo.nickName === itemData.owner) ||
            itemData.price === 0 ? (
            <button onClick={downloadImage}>
              <DownloadRoundedIcon />
              <span>Download</span>
            </button>
          ) : (
            <button style={{ backgroundColor: "gray" }}>
              <FileDownloadOffRoundedIcon />
              <span>Can't Download</span>
            </button>
          )}
        </div>
        {/* request */}
        <div className="product-request">
          <button
            onClick={() => handleRequest(navigate, location)}
            href={isLoggedIn ? "/request" : "/login"}
          >
            <MailIcon />
            <span>Request</span>
          </button>
        </div>
        {/* request */}
        <div className="product-fullscreen">
          <button onClick={toggleFullscreen}>
            <FullscreenIcon />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>
      <div className="product-info">
        <div
          style={{
            width: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "130px",
          }}
        >
          <div style={{ width: "70px" }}>
            <div style={{ height: "30px" }}></div>
            <a
              onClick={handleAuthorClick}
              href={isLoggedIn ? "/profile" : "/login"}
              className="author"
            >
              <img src={urlNoAva} alt="Author Avatar" />
            </a>
          </div>
          <div className="artist">
            <p>
              <span style={{ fontWeight: "bold", fontSize: "30px" }}>
                {itemData.name}
              </span>
            </p>
            <p>
              Artist:{" "}
              <span style={{ fontWeight: "bold" }}>{itemData.nick_Name}</span>
            </p>
            {/* Thông tin về tác giả */}
          </div>
          <div className="public">
            <p>
              <strong>Published:</strong>{" "}
              {new Date(itemData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {itemData.isPayment === false || itemData.price === 0 ? (
              userData.userInfo?.nickName === itemData.nick_Name && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <DeleteArt ID={ID} />
                  <EditArt
                    itemData={itemData}
                    setUpdateState={setUpdateState}
                  />
                </div>
              )
            ) : (
              <div>
                <p style={{ margin: "0" }}>
                  Owner:{" "}
                  <span style={{ fontWeight: "bold" }}>{itemData.owner}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="cateDes">
          <section className="category">
            <p>
              Category: <span>{itemData.category_Name}</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
