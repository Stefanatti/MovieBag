import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HaveToSignupModal from "./HaveToSignupModal";
import { Grid, Typography, Container, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import Poster from "./Poster";
// import ShowSlider from "./ShowsSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import useFetchData from "../Hooks/useFetchData";
import axios from "axios";

const Main = ({ user }) => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_URL;
  const [popularMovies, setPopularMovies] = useState([]);
  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const settings = {
    //dots: true,
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

  const images = [
    "https://i.pinimg.com/564x/64/46/c4/6446c4977328cb7166df18f29288c2a0.jpg",
    "https://alternativemovieposters.com/wp-content/uploads/2019/09/karam_fightclub.jpg",
    " https://i.pinimg.com/564x/c1/c8/eb/c1c8ebaba51997369f8c6cccc5ca7aea.jpg ",
    "https://alternativemovieposters.com/wp-content/uploads/2017/10/yolli_blade.jpg",
    "https://i.pinimg.com/564x/e3/e8/8f/e3e88f32f7a46ac437ac15e9b921bb5a.jpg",
    "https://alternativemovieposters.com/wp-content/uploads/2017/10/yolli_blade.jpg",
  ];

  useEffect(() => {
    const getPopular = async () => {
      try {
        const response = await axios.get(`${url}/api/popular`);
        //console.log(response.data);
        setPopularMovies(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPopular();
  }, []);

  // console.log(user);
  console.log(popularMovies);

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography
          variant="h3"
          sx={{
            color: "var(--basic-color)",
            fontFamily: "Limelight",
            fontSize: "34px",
            mb: 3,
            overflow: "hidden",
            [theme.breakpoints.down("md")]: {
              fontSize: "22px",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          }}
        >
          Popular Movies:
        </Typography>
        <Box>
          <Slider {...settings} style={{ "& .slick-prev": { left: "50px" } }}>
            {popularMovies.map((movie, index) => (
              <div key={index}>
                <Box sx={{ ml: 2 }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={`Slide ${index}`}
                    style={{
                      width: "90%",
                      textAlign: "center",
                      height: "auto",
                      border: "2px solid var(--home-page-posters-color)",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/movie?id=${movie.id}`)}
                  />
                </Box>
              </div>
            ))}
          </Slider>
        </Box>
      </Box>
      {/* <ShowSlider images={images} /> */}
      {/* <Grid container spacing={3}>
          {isSmallScreen ? (
            <>
              <Poster
                md={6}
                num={"1"}
                height={100}
                url={
                  "https://i.pinimg.com/564x/64/46/c4/6446c4977328cb7166df18f29288c2a0.jpg"
                }
              />
              <Poster
                md={6}
                num={"1"}
                height={100}
                url={
                  "https://alternativemovieposters.com/wp-content/uploads/2019/09/karam_fightclub.jpg"
                }
              />
            </>
          ) : (
            <>
              <Poster
                md={2}
                height={100}
                url={
                  " https://i.pinimg.com/564x/c1/c8/eb/c1c8ebaba51997369f8c6cccc5ca7aea.jpg "
                }
              />
              {/*</Grid>*/}
      {/* <Poster
                height={150}
                md={4}
                url={
                  "https://i.pinimg.com/564x/64/46/c4/6446c4977328cb7166df18f29288c2a0.jpg"
                }
              />
              <Poster
                md={3}
                height={180}
                url={
                  "https://alternativemovieposters.com/wp-content/uploads/2019/09/karam_fightclub.jpg"
                }
              />
              <Poster
                md={3}
                height={120}
                url={
                  "https://i.pinimg.com/564x/89/c7/8d/89c78d2711beb00462fac71236378d20.jpg"
                }
              />
            </>
          )}
        </Grid>  */}

      <div className="middle-div">
        {/* <div className={"search-container"}> */}
        <Box>
          <Typography
            variant="h1"
            sx={{
              color: "var(--basic-color)",
              fontFamily: "Limelight",
              fontSize: "72px",
              cursor: "pointer",
              overflow: "hidden",
              [theme.breakpoints.down("md")]: {
                fontSize: "42px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            }}
            onClick={
              user._id
                ? () => navigate(`/yourmovies`)
                : () => {
                    setOpenHaveToSignupModal(true);
                  }
            }
          >
            Your <br /> Movies
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h1"
            sx={{
              color: "var(--basic-color)",
              fontFamily: "Limelight",
              fontSize: "72px",
              cursor: "pointer",
              overflow: "hidden",
              [theme.breakpoints.down("md")]: {
                fontSize: "42px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            }}
            onClick={
              user._id
                ? () => navigate(`/yourTvShows`)
                : () => {
                    setOpenHaveToSignupModal(true);
                  }
            }
          >
            Your <br /> TV Shows
          </Typography>
        </Box>
      </div>
      <Grid
        container
        spacing={3}
        marginTop="50px"
        marginBottom="100px"
        justifyContent="space-around"
      >
        {isSmallScreen ? (
          <>
            <Poster
              md={6}
              height={100}
              url={
                "https://i.pinimg.com/564x/e3/e8/8f/e3e88f32f7a46ac437ac15e9b921bb5a.jpg"
              }
            />
            <Poster
              md={6}
              height={100}
              url={
                "https://alternativemovieposters.com/wp-content/uploads/2017/10/yolli_blade.jpg"
              }
            />
          </>
        ) : (
          <>
            <Poster
              md={2}
              height={100}
              url={
                "https://i.pinimg.com/originals/92/65/25/926525370b1e2147cf8d756138379456.jpg"
              }
            />
            <Poster
              height={150}
              md={4}
              url={
                "https://i.pinimg.com/564x/e3/e8/8f/e3e88f32f7a46ac437ac15e9b921bb5a.jpg"
              }
            />
            <Poster
              md={3}
              height={180}
              url={
                "https://alternativemovieposters.com/wp-content/uploads/2017/10/yolli_blade.jpg"
              }
            />
            <Poster
              md={3}
              height={120}
              url={
                "https://i.pinimg.com/236x/08/5e/d6/085ed68da55db43d01e5261be6de87b9.jpg"
              }
            />
          </>
        )}
      </Grid>
      <HaveToSignupModal
        open={openHaveToSignupModal}
        onClose={() => {
          setOpenHaveToSignupModal(false);
        }}
      />
    </Container>
  );
};

export default Main;
