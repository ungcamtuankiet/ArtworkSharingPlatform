import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import axios from "axios";
import urlApi from "../../../configAPI/UrlApi";
import './ListArtwork.css'

export const ListArtwork = ({ itemData }) => {
  console.log(itemData);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const categoriesData = async () => {
      try {
        const response = await axios.get(
          `${urlApi}/api/Category/get-all-category`
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    categoriesData();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  const handleSortByClick = (event) => {
    const selectedOption = event.target.value;
    setSortBy(selectedOption);
  };

  const filteredItems = itemData.filter((item) =>
    selectedCategory ? item.category_Name === selectedCategory : true
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "asc") {
      return a.price - b.price;
    } else if (sortBy === "desc") {
      return b.price - a.price;
    }
    return 0; // Không sắp xếp
  });

  const showScrollBar = () => {
    const container = document.querySelector(".scroll-container");
    if (container) {
      container.style.overflowX = "auto";
    }
  };

  const hideScrollBar = () => {
    const container = document.querySelector(".scroll-container");
    if (container) {
      container.style.overflowX = "hidden";
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        boxSizing: "border-box",
      }}
    >
      <div
        className="category-bar"
        style={{
          margin: "15px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "90%",
            marginBottom: "5px",
            height: "40px",
            display: "flex",
          }}
        >
          <FormControl
            sx={{ m: 1, minWidth: 120, margin: 0 }}
            style={{ height: "100%" }}
            size="small"
          >
            <InputLabel id="demo-select-small-label">Sort Price</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={sortBy}
              label="Sort"
              onChange={handleSortByClick}
              sx={{ backgroundColor: "white" }}
              style={{ height: "100%" }}
            >
              <MenuItem value={""}>None</MenuItem>
              <MenuItem value={"asc"}>Increase</MenuItem>
              <MenuItem value={"desc"}>Decrease</MenuItem>
            </Select>
          </FormControl>
          <div
            className="scroll-container"
            onMouseOver={showScrollBar}
            onMouseOut={hideScrollBar}
          >
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                style={{
                  fontWeight:
                    category.name === selectedCategory ? "bold" : "normal",
                  marginLeft: "10px",
                  border: "1px solid #b6b7be",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  padding: "5px 15px",
                  cursor: "pointer",
                  height: "100%",
                  fontSize: "17px",
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "25px",
        }}
      >
        <Masonry
          columnsCount={3}
          gutter="10px"
          style={{ width: "96%", gap: "0" }}
        >
          {sortedItems.map((item, index) => (
            <Link
              to={item && item.id ? `/detail/${item.id}` : "/fallback-path"}
              style={{
                color: "black",
                display: "block",
                margin: "0 4px",
                position: "relative",
              }}
              onMouseEnter={() => item && setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <img
                src={item.url_Image}
                key={index}
                alt=""
                style={{ width: "100%", display: "block" }}
              />

              {hoveredItem === item && (
                <div
                  className="image-info"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    padding: "8px",
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    color: "white",
                    height: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                >
                  <section
                    style={{
                      margin: "10px",
                    }}
                  >
                    <p>
                      <span style={{ fontWeight: "bold" }}>
                        {item && item.name}
                      </span>
                    </p>
                    <p>
                      By:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {item && item.nick_Name}
                      </span>
                    </p>
                  </section>
                  <section
                    style={{
                      margin: "10px",
                    }}
                  >
                    <p>
                      {item && item.price !== 0 ? (
                        item.isPayment === false ? (
                          <span style={{ fontWeight: "bold" }}>
                            ${item && item.price}
                          </span>
                        ) : (
                          <span style={{ fontWeight: "bold" }}>Sold</span>
                        )
                      ) : (
                        <span style={{ fontWeight: "bold" }}>Free</span>
                      )}
                    </p>
                  </section>
                </div>
              )}
            </Link>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};
