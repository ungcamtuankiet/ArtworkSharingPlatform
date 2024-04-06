import React, { useState, useEffect } from "react";
import "./Sent.css";
import urlApi from "../../../../configAPI/UrlApi";
import axios from "axios";
import DeleteSent from "./deleteSent/DeleteSent";

export default function Sent({ username, updateData, onLiClick }) {
  const [hasData, setHasData] = useState(false);
  const [sent, setSent] = useState([]);
  const token = localStorage.getItem("token");
  const [updateDe, setUpdateDe] = useState([]);

  const urlNoAva =
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/logo%2F499638df-cf1c-4ee7-9abf-fb51e875e6dc?alt=media&token=367643f5-8904-4be8-97a0-a794e6b76bd0";

  useEffect(() => {
    if (token) {
      axios
        .get(`${urlApi}/api/RequestOrder/get-mine-request`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setHasData(true);
            setSent(response.data);
            console.log(response.data);
          } else {
            // Nếu response.data không phải là mảng, xử lý tương ứng
            console.error("Dữ liệu trả về không phải là mảng");
          }
        })
        .catch((error) => {
          // Xử lý lỗi nếu có
          console.error("Lỗi khi gọi API:", error);
        });
    }
  }, [updateData, updateDe]);

  const getStatus = (isActive, isDeleted) => {
    if (isDeleted) {
      return "Bị từ chối";
    } else {
      return !isActive ? "Được chấp nhận" : "Đang xử lý";
    }
  };

  return (
    <React.Fragment>
      {hasData && sent.length > 0 ? (
        <>
          {sent.map((note) => (
            <li
              key={note.id}
              className="liSent"
              onClick={() => onLiClick(note.id)}
              style={{ cursor: "pointer" }}
            >
              <div id="div1">
                <section
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <img src={urlNoAva} alt="" style={{ marginTop: "10px" }} />
                    <div style={{ margin: "0 0 0 12px" }}>
                      <section style={{ textAlign: "left" }}>
                        From: <strong>{username.nickName}</strong>
                      </section>
                      <section style={{ textAlign: "left" }}>
                        To: <strong>{note.nickName_Receivier}</strong>
                      </section>
                    </div>
                  </div>
                  <div>
                    <p style={{ margin: "0", marginBottom: "5px" }}>
                      {note.isSendResult === true ? (
                        <strong>Sent result</strong>
                      ) : (
                        <strong>
                          {getStatus(note.isActive, note.isDeleted)}
                        </strong>
                      )}
                    </p>
                    <p style={{ margin: "0", textAlign: "right", color: "black" }}>
                      {!note.isActive && <strong>{note.statusRequest}</strong>}
                    </p>
                  </div>
                </section>
                <section
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ textAlign: "left" }}>{note.text}</p>
                  {note.isActive && (
                    <DeleteSent note={note} setUpdateDe={setUpdateDe} />
                  )}
                </section>
              </div>
            </li>
          ))}
        </>
      ) : (
        <li id="li1">
          <span>No Sent Notes</span>
        </li>
      )}
    </React.Fragment>
  );
}
