import React, { useEffect, useState } from "react";
import "./TableStatus.css";
import axios from "axios";
import urlApi from "../../../../../configAPI/UrlApi";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function TableStatus() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [isAnyArtworkSelected, setIsAnyArtworkSelected] = useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${urlApi}/api/Artwork/get-by-userId`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );
        setArtworks(response.data);
        console.table(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to only run once on component mount

  useEffect(() => {
    setIsAnyArtworkSelected(selectedArtworks.length > 0);
  }, [selectedArtworks]);

  const getStatus = (isActive, isDeleted) => {
    if (isDeleted) {
      return "Bị từ chối";
    } else {
      return isActive ? "Được chấp nhận" : "Đang xử lý";
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectArtwork = (artworkId) => {
    const isSelected = selectedArtworks.includes(artworkId);
    if (isSelected) {
      setSelectedArtworks(selectedArtworks.filter((id) => id !== artworkId));
    } else {
      setSelectedArtworks([...selectedArtworks, artworkId]);
    }
  };
  const token = localStorage.getItem("token");

  const handleDeleteSelectedArtworks = async () => {
    try {
      const response = await axios.delete(
        `${urlApi}/api/Artwork/delete-by-id-select`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
          data: selectedArtworks, // Chuyển dữ liệu vào trong phần data
        }
      );
      console.log(response.data);
      window.location.reload();
      setOpen(false);
    } catch (error) {
      console.error(error.request);
    }
  };

  const checkStatus = (isPayment) => {
    if (isPayment === false) {
      return "Available";
    } else {
      return "Sold";
    }
  };

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Name Artwork</th>
            <th>Image</th>
            <th>Price</th>
            <th>Reason Refuse</th>
            <th>Status</th>
            <th>Sold</th>
            <th
              style={{
                width: "85px",
                height: "60px",
              }}
            >
              {isAnyArtworkSelected ? (
                <React.Fragment>
                  <DeleteIcon
                    onClick={handleClickOpen}
                    style={{ cursor: "pointer" }}
                  />
                  <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle>{"Delete Artwork"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">
                        Are you want to delete this artwork ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Disagree</Button>
                      <Button onClick={handleDeleteSelectedArtworks}>
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
              ) : (
                "Select"
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>
                <img
                  src={item.url_Image}
                  alt="Artwork"
                  style={{ width: "50px", height: "60px", objectFit: "cover" }}
                />
              </td>
              <td>
                {item && item.price !== 0 ? (
                  <span style={{ fontWeight: "bold" }}>
                    ${item && item.price}
                  </span>
                ) : (
                  <span style={{ fontWeight: "bold" }}>Free</span>
                )}
              </td>
              <td>{item.reasonRefuse}</td>
              <td>{getStatus(item.isActive, item.isDeleted)}</td>
              <td>
                {item.price !== 0 ? (
                
                checkStatus(item.isPayment)
                ) : (
                  <span>Free</span>
                )}
                </td>
              <td>
                {item.isPayment === false || item.price === 0 ? (
                  <IconButton onClick={() => handleSelectArtwork(item.id)}>
                    {selectedArtworks.includes(item.id) ? (
                      <CheckBoxIcon style={{ color: "#9195F6" }} />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}
                  </IconButton>
                ) : (
                  <section className="sold">
                    <CheckBoxIcon />
                  </section>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
