import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import urlApi from "../../../../configAPI/UrlApi";

export default function Cancel({ item, isActive, isDeleted }) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = useState("");

  const handleClickOpen = () => {
    if (!isActive && !isDeleted) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const hanldReason = (e) => {
    setReason(e.target.value);
  };

  const token = localStorage.getItem("token");

  const handleCancel = async () => {
    try {
      const data = {
        reason: reason,
      };
      const response = await axios.patch(
        `${urlApi}/api/Admin/refuse-artwork?id=${item.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );
      window.location.reload();
      console.log(response);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        disabled={isActive || isDeleted}
        style={{
          backgroundColor: isActive ? "gray" : isDeleted ? "red" : "inherit",
          color: isActive || isDeleted ? "white" : "inherit",
        }}
      >
        <CloseIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Box cancel artwork</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please write down why you refused!
          </DialogContentText>
          <textarea
            placeholder="Refused"
            style={{ border: "0.5px solid black", marginTop: "15px" }}
            onChange={(e) => hanldReason(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCancel}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
