import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Box, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Carusel = ({ data, path }) => {
  const navigate = useNavigate();

  const StyledImage = styled("img")({
    width: "90%",
    height: "auto",
    border: "1px solid ",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-10px)",
    },
  });

  const settings = {
    centerPadding: "100px",
    infinite: true,
    adaptiveHeight: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {data.map((data, index) => (
        <div key={index}>
          <Box sx={{ ml: 2 }}>
            <StyledImage
              src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
              alt={`Slide ${index}`}
              onClick={() => navigate(`${path}${data.id}`)}
            />
          </Box>
        </div>
      ))}
    </Slider>
  );
};

export default Carusel;
