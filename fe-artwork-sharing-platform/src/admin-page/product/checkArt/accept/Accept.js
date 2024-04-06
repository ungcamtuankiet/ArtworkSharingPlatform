import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DoneIcon from "@mui/icons-material/Done";
import axios from "axios";
import urlApi from "../../../../configAPI/UrlApi";

export default function Accept({ item, isActive, isDeleted }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (!isActive && !isDeleted) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const token = localStorage.getItem("token");

  const handleAccept = async () => {
    try {
      const response = await axios.patch(
        `${urlApi}/api/Admin/accept-artwork?id=${item.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
      console.log(response);
      setOpen(false);
    } catch (error) {
      console.error(error.request);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        disabled={isActive || isDeleted}
        style={{
          backgroundColor: isActive
            ? "lightgreen"
            : isDeleted
            ? "grey"
            : "inherit",
          color: isDeleted || isActive ? "white" : "inherit",
        }}
      >
        <DoneIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Box accept artwork</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to accept this image?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAccept}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
