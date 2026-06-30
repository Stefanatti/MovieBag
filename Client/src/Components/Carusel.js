import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

const CustomArrow = ({ direction, onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "40%",
      transform: "translateY(-50%)",
      zIndex: 2,
      ...(direction === "prev" ? { left: -16 } : { right: -16 }),
      width: 40,
      height: 40,
      backgroundColor: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(255,255,255,0.15)",
      color: "var(--basic-color)",
      "&:hover": {
        backgroundColor: "var(--basic-color)",
        color: "#fff",
      },
      transition: "all 0.25s ease",
    }}
  >
    {direction === "prev" ? (
      <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
    ) : (
      <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
    )}
  </IconButton>
);

const Carusel = ({ data, path, error, loading }) => {
  const navigate = useNavigate();

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (error || !data || data.length === 0) {
    return (
      <Typography variant="h6" color="var(--basic-color)">
        Movies did not load, please try again.
      </Typography>
    );
  }

  if (loading) {
    return (
      <Typography variant="h6" color="var(--basic-color)">
        Movies Loading...
      </Typography>
    );
  }

  return (
    <Box sx={{ px: 2 }}>
      <Slider {...settings}>
        {data.map((item, index) => (
          <Box key={index} sx={{ px: 1 }}>
            <Box
              onClick={() => navigate(`${path}${item.id}`)}
              sx={{
                cursor: "pointer",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.03)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                },
                "&:hover .poster-overlay": {
                  opacity: 1,
                },
              }}
            >
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                alt={item.title || item.name || `Poster ${index}`}
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "12px",
                }}
              />
              <Box
                className="poster-overlay"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    "linear-gradient(transparent 0%, rgba(0,0,0,0.85) 100%)",
                  p: 1.5,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                {item.vote_average && (
                  <Typography
                    sx={{
                      color: "var(--basic-color)",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                    }}
                  >
                    ★ {item.vote_average.toFixed(1)}
                  </Typography>
                )}
              </Box>
            </Box>
            <Typography
              sx={{
                color: "var(--home-page-posters-color)",
                fontSize: "0.85rem",
                fontWeight: 500,
                fontFamily: "Montserrat, sans-serif",
                mt: 1,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                px: 0.5,
              }}
            >
              {item.title || item.name}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Carusel;
