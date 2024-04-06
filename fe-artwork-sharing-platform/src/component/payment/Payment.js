import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Payment.css";
import urlApi from "../../configAPI/UrlApi";
import axios from "axios";
import Swal from "sweetalert2";

const Payment = ({ userById }) => {
  const [imageSize, setImageSize] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [dataPay, setDataPay] = useState(null);
  const [selfLink, setSelfLink] = useState("");
  const [approveLink, setApproveLink] = useState("");
  const [status, setStatus] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const token = localStorage.getItem("token");

  //Create payment
  const handlePaypalClick = async () => {
    try {
      const response = await axios.post(
        `${urlApi}/api/Payment/create-payment?artwork_Id=${userById.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataPay(response.data);
      setShowPaymentInfo(true);
      const selfLink = response.data.order.links.find(
        (link) => link.rel === "self"
      );
      setSelfLink(selfLink);
      const approveLink = response.data.order.links.find(
        (link) => link.rel === "approve"
      );
      setApproveLink(approveLink);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response.data + "!!!")
    }
  };

  //open popup (link 2)
  const handleProceedToPayment = async () => {
    if (approveLink) {
      const popupWidth = 600;
      const popupHeight = 400;
      const left = window.screenX + (window.innerWidth - popupWidth) / 2;
      const top = window.screenY + (window.innerHeight - popupHeight) / 2;
      const popupOptions = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable,scrollbars=yes,status=1`;
      window.open(approveLink.href, "_blank", popupOptions);
    } else {
      console.error("No approve link found in the response.");
    }
  };

  const navigate = useNavigate();

  //self link (link 1)
  useEffect(() => {
    let intervalId;
    const dataCapture = async () => {
      try {
        const response = await axios.get(selfLink.href, {
          headers: {
            Authorization: `Bearer ${dataPay.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data.status);
        setStatus(response.data.status);
      } catch (error) {
        console.log(error);
      }
    };
    const startInterval = () => {
      intervalId = setInterval(() => {
        if (selfLink) {
          dataCapture();
        }
      }, 7000);
      if (selfLink) {
        dataCapture();
      }
    };
    startInterval();
    return () => clearInterval(intervalId);
  });

  //capture-payment(save data + capture)
  useEffect(() => {
    if (status === "APPROVED") {
      const dataCapture = async () => {
        try {
          const response = await axios.post(
            `${urlApi}/api/Payment/capture-payment?orderId=${dataPay.order.id}&artwork_Id=${userById.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response);
          if (response) {
            setIsPaid(true);
            Swal.fire({
              icon: "success",
              title: "Payment successful!",
              showConfirmButton: false,
              timer: 4000,
              confirmButtonText: "OK",
              didClose: () => {
                navigate(`/success-page`);
              },
            });
            console.log("data: ", response.data);
            localStorage.setItem("order_Id", response.data.order_Id)
          } else {
            Swal.fire({
              icon: "error",
              title: "Payment failed!",
              text: "There was an error processing your payment.",
              confirmButtonText: "OK",
              showConfirmButton: false,
              timer: 4000,
            });
          }
        } catch (error) {
          console.log(error);
          console.log(error.response.data);
          Swal.fire({
            icon: "error",
            title: "Payment failed!",
            text: "Please check your payment!",
            confirmButtonText: "OK",
            showConfirmButton: false,
            timer: 4000,
          });
        }
      };
      dataCapture();
    }
  }, [status]);

  useEffect(() => {
    console.log("Payment component mounted");
    const loadImage = async () => {
      const img = new Image();
      img.onload = function () {
        setImageSize({ width: this.width, height: this.height });
        setImageLoaded(true);
      };
      img.src = decodeURIComponent(userById.url_Image);
    };
    loadImage();
  }, [userById.url_Image]);

  return (
    <div className="PaymentPage">
      <div className="container-payment">
        <div className="center">
          <h3>Choose Payment Method</h3>
          <div className="pay">
            <button onClick={handlePaypalClick}>
              <img
                src="https://i.ibb.co/KVF3mr1/paypal.png"
                alt="Paypal Logo"
                className="paypal-logo"
              />
              <p className="name">Paypal</p>
            </button>
          </div>
          {showPaymentInfo /* Hiển thị thông tin khi showPaymentInfo là true */ && (
            <div className="card-details">
              <h4>You’ll be redirected to PayPal to complete this payment.</h4>
              <div>
                <button onClick={handleProceedToPayment}>
                  Buy
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="right">
          <div className="price-info">
            <p>Summary</p>
          </div>
          {imageLoaded && (
            <div className="details-img">
              <img src={userById.url_Image} alt="Product" />
              <p>
                Image Size: {imageSize.width}x{imageSize.height}
              </p>
            </div>
          )}
          <div className="total">
            <p>Name of artwork: {userById.name}</p>
            <p>Total: <strong>${userById.price}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
