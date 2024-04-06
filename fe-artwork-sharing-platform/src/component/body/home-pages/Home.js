import React, { useState, useEffect } from "react";
import "./Home.css";
import urlApi from '../../../configAPI/UrlApi'
import axios from "axios";
import Slider from "react-slick";
import { ListArtwork } from "../list-artwork/ListArtwork";

export default function Home() {
  const sliderImg = [
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/slider%2Fbb796dde-4c67-4164-9945-4c5ae0d03938?alt=media&token=c747d758-a107-4541-8c9a-183e33986c56",
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/slider%2Ffbafe525-1178-4baa-9d11-b5c3b9d7fbaf?alt=media&token=bc9bc548-a787-44b3-bf1e-774ba345da5a",
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/slider%2Fd91b3ab6-e40a-4f04-bdf4-4a0a57d785aa?alt=media&token=3f94c702-fb13-4479-ba51-483dcdde9d6b",
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/slider%2Fc69be4d2-eb93-43c2-8967-515398bacd08?alt=media&token=6dbd3e05-f042-4c16-92de-6d171a15acdd",
    "https://firebasestorage.googleapis.com/v0/b/artwork-platform.appspot.com/o/slider%2F948fd2ef-0a9d-411d-8787-ec561f48129e?alt=media&token=ab62f46b-6e1b-4a02-bd45-6383e0d49157"
  ]
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${urlApi}/api/Artwork/get-all`
        );
        setItemData(response.data);
        // console.log("Data from API: ", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid">
      <Slider
        dots={false}
        infinite={true}
        arrows={false}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={2000}
        swipe={false}
        draggable={false}
      >
        {sliderImg.slice(0, 5).map((imageUrl, index) => (
          <div key={index} className="slider-item">
            <img className="slider-image" src={imageUrl} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
      <>
        <ListArtwork itemData={itemData} />
      </>
    </div>
  );
}
