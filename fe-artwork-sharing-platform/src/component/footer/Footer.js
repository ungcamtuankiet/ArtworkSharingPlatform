import React from 'react'
import './Footer.css'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
function Footer({ isLoginPage, isRegisterPage,isRecoveryPage, isEmailOTP, isPayment, isTransaction }) { // Thêm isRegisterPage vào props
  if (isLoginPage || isRegisterPage || isRecoveryPage || isEmailOTP || isPayment || isTransaction) { // Ẩn footer nếu là trang Login hoặc Register
    return null;
  }

  const urlLogo = "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/logo%2Ffeed6075-55fd-4fb3-98d4-946d30029eda?alt=media&token=a3dd9363-73f3-4aec-ae32-264c761a0c0f";

  return (
    <div className='footer-content'>
      <img src={urlLogo} alt='logo' className='footer-logo' />
      <div className='row'>
        <div className="footer-col">
          <h4>Info</h4>
          <ul>
            <li>Courses</li>
            <li>Schedule</li>
            <li>Pricing</li>
            <li>Teachers</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>About</h4>
          <ul>
            <li>Blog</li>
            <li>About us</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact us</h4>
          <ul>
            <li><p>Address: Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Thành phố Hồ Chí Minh 700000</p></li>
            <li><p>Phone No: +84 123 456789</p></li>
            <li><p>Email: baokk254952@fpt.edu.vn</p></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Follow Us</h4>
          <ul className="social-icons">
            <li><a href="#"><FaFacebookF /></a></li>
            <li><a href="#"><FaInstagram /></a></li>
            <li><a href="#"><FaTwitter /></a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;