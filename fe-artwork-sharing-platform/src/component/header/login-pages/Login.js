import React, { useState } from "react";
import "./Login.css";
import urlApi from "../../../configAPI/UrlApi";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const urlLogo =
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/logo%2Ffeed6075-55fd-4fb3-98d4-946d30029eda?alt=media&token=a3dd9363-73f3-4aec-ae32-264c761a0c0f";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      alert("Please enter complete information");
      setIsLoading(false);
      return;
    }
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${urlApi}/api/Auth/login`, {
        username,
        password,
      });
      console.log(response.data);
      console.log(response.data.userInfo.roles);
      const previousPath = localStorage.getItem("redirectPath");
      if (response.data.userInfo.roles.includes("ADMIN")) {
        navigate("/home-admin/dashboard");
      } else if (response.data.userInfo.roles.includes("CREATOR")) {
        navigate(previousPath || "/");
        localStorage.removeItem("redirectPath");
      }
      const { newToken } = response.data;
      localStorage.setItem("token", newToken);
      // Hiển thị thông báo thành công khi đăng nhập thành công
      Swal.fire({
        icon: "success",
        title: "Login successful!",
        showConfirmButton: false,
        timer: 1300, // Tắt sau 2 giây
      });
    } catch (error) {
      console.error(
        "An error occurred while sending the API request:",
        error.response.data
      );
      // Hiển thị thông báo lỗi khi đăng nhập thất bại
      Swal.fire({
        icon: "error",
        title: "Login failed!",
        text: error.response.data,
      });
    } finally {
      setIsLoading(false); // Đặt isLoading thành false sau khi xử lý hoàn tất
    }
  };

  return (
    <div className="loginPage">
      <div className="login">
        <div className="logoLogin">
          <Link to={`/`}>
            <img src={urlLogo} alt="Logo" />
          </Link>
        </div>
        <div className="title">Welcome to Artwork!</div>
        <h6>please login to your account</h6>
        <form onSubmit={handleSubmit}>
          <div className="group">
            <span style={{fontSize: "15px"}}>Username*</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="group">
            <span style={{fontSize: "15px"}}>Password*</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
          <div className="recoveryPage">
            <Link to="/recovery-password">Forget Password?</Link>
          </div>
          <div className="signIn">
            <button type="submit">
              <span>{isLoading ? "Login..." : "Login"}</span>
            </button>
          </div>
          <div className="signUp-lg">
            <h6>Bạn chưa có tài khoản?</h6>
            <Link to={`/regis`}>
              <button>Sign UP</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
