import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import urlApi from "../../../../configAPI/UrlApi";
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SearchBar() {
  const [inputValue, setInput] = useState("");
  const [option, setOption] = useState("");
  const navigate = useNavigate();

  const Url = `${urlApi}/api/Artwork/search?search=${inputValue}&searchBy=${option}`;
  const axiosData = (inputValue, option) => {
    axios
      .post(Url, {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        navigate(`/searchlist`, { state: { searchData: response.data } });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    console.log(inputValue);
  };

  const handleOption = (event) => {
    const selectedOption = event.target.value;
    setOption(selectedOption);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      axiosData(inputValue, option);
    }
  };

  return (
    <div className="searchBar">
      <SearchIcon style={{ marginLeft: "10px" }}/>
      <input
        placeholder="Search"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">
          Search by
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={option}
          onChange={handleOption}
          label="Search By"
        >
          <MenuItem value="">Name Artwork</MenuItem>
          <MenuItem value={"nick_name"}>Creator Name</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

;
