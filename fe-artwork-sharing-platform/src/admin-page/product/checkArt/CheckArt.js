import React from "react";
import Accept from "./accept/Accept";
import Cancel from "./cancel/Cancel";

export default function CheckArt({item}) {
    const isActive = item.isActive;
    const isDeleted = item.isDeleted;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Accept item={item} isActive={isActive} isDeleted={isDeleted}/>
      <span
        style={{
          height: "35.6px",
          width: "1px",
          backgroundColor: "black",
          margin: "0 5px",
        }}
      ></span>{" "}
      <Cancel item={item} isActive={isActive} isDeleted={isDeleted}/>
    </div>
  );
}
