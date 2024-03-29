import "../Styles/Navbar.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../Features/user";
import { getUserMovies } from "../Features/movies";
import { styled, alpha } from "@mui/material/styles";
import ThemeSwitcher from "./ThemeSwitcher";
//-------------------
import * as React from "react";
import { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import useFetchData from "../Hooks/useFetchData";

import {
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Toolbar,
  Typography,
  Avatar,
  Hidden,
  Box,
  TableContainer,
  InputBase,
} from "@mui/material";
const HaveToSignupModal = lazy(() => import("./HaveToSignupModal"));
const LogoutModal = lazy(() => import("./LogoutModal"));

const drawerWidth = 240;
const navItems = [
  "Your Tv Shows",
  "Your Movies",
  "Movies Watchlist",
  "Tv Watchlist",
];

const StyledNavbarButton = styled(Button)`
  position: relative;
  color: var(--basic-color);
  &::after {
    content: "";
    opacity: 0;
    transition: all 0.2s;
    height: 2px;
    width: 100%;
    background-color: var(--basic-color);
    position: absolute;
    bottom: 0;
    left: 0;
  }
  &:hover::after {
    opacity: 1;
  }

  &:hover {
    color: var(--basic-color);
  }
`;

const Search = styled("form")(({ theme }) => ({
  position: "relative",
  border: "1px solid var(--basic-color)",

  borderRadius: "30px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--basic-color)",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "var(--basic-color)",
  height: "43px",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30ch",
      "&:focus": {
        width: "32ch",
      },
    },
  },
}));

const Navbar = (props) => {
  const { window } = props;
  let user = useSelector((state) => state.user.value);

  const navigate = useNavigate();
  const location = useLocation();
  const [myMovies, setMyMovies] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [title, setTitle] = useState("");
  const [openHaveToSignupModal, setOpenHaveToSignupModal] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const path = location.pathname;
  const pageName = path.substring(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("other-theme");

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const getTitle = (e) => {
    e.preventDefault();
    if (title !== "") {
      navigate(`/MovieSearch?title=${title}`);
      setTitle("");
    }
  };

  const handleItemClick = (item) => {
    if (user._id) {
      if (item === "Your Movies") navigate(`/yourmovies`);
      else if (item === "Your Tv Shows") navigate(`/yourtvShows`);
      else if (item === "Movies Watchlist") navigate(`/watchlist/movies`);
      else navigate("/watchlist/tvShows");
    } else setOpenHaveToSignupModal(true);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, color: "var(--basic-color)" }}
        onClick={() => navigate("/")}
      >
        MovieBag
      </Typography>
      <Divider />
      <List>
        <ListItem
          sx={{ display: "flex", flexDirection: "column" }}
          disablePadding
        >
          <ThemeSwitcher setTheme={setTheme} theme={theme} />
        </ListItem>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center", color: "var(--basic-color)" }}
              onClick={() => handleItemClick(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", overflowX: "hidden" }}>
      <CssBaseline />
      <AppBar color="transparent" component="nav" position="static">
        <Toolbar sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flexGrow: 1 }}>
            <IconButton
              color="secondary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                // marginRight: "73%",
                display: {
                  lg: "none",
                },
                color: "var(--basic-color)",
              }}
            >
              <MenuIcon />
            </IconButton>
            {/* <Box sx={{ display: "flex" }}> */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                mt: 1,
                fontFamily: "Limelight",
                cursor: "pointer",
                display: { xs: "none", sm: "inherit" },
                color: "var(--basic-color)",
              }}
              onClick={() => navigate("/")}
            >
              MovieBag
            </Typography>

            <Search
              sx={{ display: "flex" }}
              component="form"
              onSubmit={getTitle}
            >
              <SearchIconWrapper>
                <SearchIcon onClick={getTitle} />
              </SearchIconWrapper>
              <StyledInputBase
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Search for a movie or Tv show…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "none",
                  md: "none",
                  lg: "block",
                  flexGrow: "1",
                },
              }}
            >
              {navItems.map((item) => (
                <StyledNavbarButton
                  key={item}
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </StyledNavbarButton>
              ))}
            </Box>
            <Box
              sx={{
                marginLeft: "15px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <Hidden lgDown>
                <ThemeSwitcher setTheme={setTheme} theme={theme} />
              </Hidden>
              <Avatar
                alt={user.username}
                src="/broken-image.jpg"
                sx={{ bgcolor: "var(--basic-color)", cursor: "pointer" }}
                onClick={
                  user._id
                    ? () => setOpenLogoutModal(true)
                    : () => {
                        navigate(`/login`);
                      }
                }
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          // variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "var(--background-app-color)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Suspense>
        <LogoutModal
          open={openLogoutModal}
          onClose={() => {
            setOpenLogoutModal(false);
          }}
        />
        <HaveToSignupModal
          open={openHaveToSignupModal}
          onClose={() => {
            setOpenHaveToSignupModal(false);
          }}
        />
      </Suspense>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
};

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
