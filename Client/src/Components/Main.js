import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HaveToSignupModal from "./HaveToSignupModal";
import { Grid, Typography, Container, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import Poster from "./Poster";

const Main = ({ user }) => {
  const navigate = useNavigate();
  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  console.log(user);

  return (
    <div className="main-div">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
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
    </div>
  );
};

export default Main;
