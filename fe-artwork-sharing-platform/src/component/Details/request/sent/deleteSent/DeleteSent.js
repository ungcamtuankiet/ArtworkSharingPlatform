import React from "react";
import "./DeleteSent.css";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import urlApi from "../../../../../configAPI/UrlApi";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DeleteSent({ note, setUpdateDe }) {
  const [open, setOpen] = React.useState(false);
  const token = localStorage.getItem("token");
  const handleDeSentReq = async () => {
    try {
      const response = await axios.delete(
        `${urlApi}/api/RequestOrder/delete-request?id=${note.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setUpdateDe(response);
    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="deSentReq">
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          <DeleteIcon />
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Box cancel artwork</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to delete this request?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeSentReq}>Submit</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}
