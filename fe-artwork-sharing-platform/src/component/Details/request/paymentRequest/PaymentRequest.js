import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import urlApi from "../../../../configAPI/UrlApi";
import axios from "axios";
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PaymentRequest({ dataReqId }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [dataPay, setDataPay] = useState(null);
  const [selfLink, setSelfLink] = useState("");
  const [approveLink, setApproveLink] = useState("");
  const [status, setStatus] = useState([]);
  const token = localStorage.getItem("token");

  //Create payment
  const handlePaypalClick = async () => {
    try {
      const response = await axios.post(
        `${urlApi}/api/RequestOrder/create-payment-request?request_Id=${dataReqId.id}`,
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
      alert(error.response.data + "!!!");
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
            `${urlApi}/api/RequestOrder/capture-payment-request?orderId=${dataPay.order.id}&request_Id=${dataReqId.id}`,
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
            alert("Payment request successful!");
            setOpen(false);
            console.log("data: ", response.data);
            localStorage.setItem("order_Id", response.data.order_Id);
          } else {
            Swal.fire({
              icon: "error",
              title: "Payment failed!",
              text: "There was an error processing your payment.",
              confirmButtonText: "OK",
              showConfirmButton: false,
              timer: 4000,
            });
            alert("Payment failure!");
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
          alert("Payment failure!");
        }
      };
      dataCapture();
    }
  }, [status]);

  return (
    <div
      style={{
        textAlign: "right",
      }}
    >
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Payment
        </Button>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Payment request
              </Typography>
            </Toolbar>
          </AppBar>
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
                    <h4>
                      You’ll be redirected to PayPal to complete this payment.
                    </h4>
                    <div>
                      <button onClick={handleProceedToPayment}>Buy</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    </div>
  );
}
