import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Box, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Carusel = ({ data, path, error, loading }) => {
  const navigate = useNavigate();

  const StyledImage = styled("img")({
    width: "85%",
    height: "auto",
    border: "1px solid ",
    borderRadius: "15px",
    boxShadow: `0px 16px 24px rgba(0, 0, 0, 0.3)`,
    cursor: "pointer",
    marginBottom: "50px",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-10px) scale(1.05) rotate(-2deg)", // Add scaling and slight rotation
      boxShadow: `0px 12px 24px rgba(0, 0, 0, 0.5)`, // Make the shadow more intense
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
    <>
      {error || data.length === 0 ? (
        <Typography variant="h6" color={"var(--basic-color)"}>
          Movies did not load, please try again.
        </Typography>
      ) : (
        (loading && (
          <Typography variant="h6" color={"var(--basic-color)"}>
            Movies Loading...
          </Typography>
        ),
        (
          <Slider {...settings}>
            {data.map((data, index) => (
              <div key={index}>
                <Box sx={{ ml: 2, paddingTop: "30px" }}>
                  <StyledImage
                    src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
                    alt={`Slide ${index}`}
                    onClick={() => navigate(`${path}${data.id}`)}
                  />
                </Box>
              </div>
            ))}
          </Slider>
        ))
      )}
    </>
  );
};

export default Carusel;
