import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import HaveToSignupModal from "./HaveToSignupModal";
import SearchIcon from "@mui/icons-material/Search";
import {Grid, Paper, Button, Typography, Container, Box, useMediaQuery, keyframes} from "@mui/material";
import { useSelector } from "react-redux";
import {alpha, styled, useTheme} from "@mui/material/styles";
import TextField from '@mui/material/TextField';
import InputBase from "@mui/material/InputBase";
import * as React from "react";


  const Main = () => {
  const navigate = useNavigate();
  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  let user = useSelector((state) => state.user.value);
  const [title, setTitle] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const getTitle = (e) => {
    e.preventDefault();
    if (title !== "") {
      navigate(`/MovieSearch?title=${title}`);
      setTitle("");
    }
  };

  const Poster = ({ url,md,sm, height }) => {
    return (
      <Grid item xs={md} md={md} sm={sm}>
        <Paper
          elevation={3}
          sx={{
            border: "2px solid var(--home-page-posters-color)",
            height: `${height}px`,
            backgroundImage: `url(${url})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
        </Paper>
      </Grid>
    );
  };





  return (
    <div className="main-div">
      <Container maxWidth="lg">
        <Grid container spacing={3} >
            {isSmallScreen? (
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
            ):(
                <>
          <Poster
            md={2}
            height={100}
            url={
              " https://i.pinimg.com/564x/c1/c8/eb/c1c8ebaba51997369f8c6cccc5ca7aea.jpg "
            }
          />
            {/*</Grid>*/}
          <Poster
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
        </Grid>
        <div className="middle-div">
            <div className={"search-container"} >

    <form onSubmit={getTitle} >
<input
                  type="text"
                  value={title}
                  placeholder="Search for movies or series"
                  aria-label="Search"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
/>
                <button className="btnon" type="submit">
                  <SearchIcon fontSize="large"  />
                </button>
    </form>
            </div>

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
                    textOverflow: "ellipsis"

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
        </div>

        <Grid
          container
          spacing={3}
          marginTop="50px"
          marginBottom="100px"
          justifyContent="space-around"
        >
            {isSmallScreen? (
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
            ):(
                <>
                    <Poster
                        md={2}
                        height={100}
                        url={
                            "https://i.pinimg.com/originals/92/65/25/926525370b1e2147cf8d756138379456.jpg"
                        }
                    />
                    {/*</Grid>*/}
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
      </Container>
    </div>
  );
};

export default Main;
