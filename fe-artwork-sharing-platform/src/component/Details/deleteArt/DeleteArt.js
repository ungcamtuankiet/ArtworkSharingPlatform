import React from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteArt.css";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function DeleteArt({ ID }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    // Replace 'ID' with the actual ID
    try {
      // Make a DELETE request to the API endpoint
      const response = await axios.delete(
        `https://localhost:44306/api/Artwork/delete/${String(ID)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response as needed
      console.log("Delete successful:", response.data);
      alert("Delete successful!");
      navigate("/profile/shop");
    } catch (error) {
      // Handle errors
      console.error("Error deleting:", error.response);
      alert(error.response.data);
    }
  };
  return (
    <div>
      <a href="#popupDelete">
        <DeleteIcon className="iconDelete" />
      </a>

      {/* popup delete */}
      <div id="popupDelete" className="overlay">
        <div className="popup">
          <div className="iconclose">
            <a
              className="close"
              href="#"
              style={{ color: "black", textDecoration: "none" }}
            >
              &times;
            </a>
          </div>

          <div className="popupDetail">
            <div className="contentDelete">
              <div
                style={{
                  display: "flex",
                  width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <img
                    src="https://st.deviantart.net/eclipse/global/svg/il05-delete.svg"
                    alt=""
                    style={{ width: "90px", height: "88px" }}
                  />
                </div>
                <div style={{ marginLeft: "15px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "25px" }}>
                    Delete this artwork?
                  </div>
                </div>
              </div>
            </div>
            <div className="popupButton">
              <button onClick={() => handleDelete()}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
