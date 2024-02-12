import "../Styles/Navbar.scss";
import { useNavigate } from "react-router-dom";
import HaveToSignupModal from "./HaveToSignupModal";
import LogoutModal from "./LogoutModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login, logout } from "../Features/user";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
// import { styled, alpha } from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import ThemeSwitcher from "./ThemeSwitcher";
//-------------------
import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import ColorSwitches from "./ThemeSwitcher";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

const drawerWidth = 240;
const navItems = ["Home", "About", "Your Movies"];

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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
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

  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Navbar = (props) => {
  const { window } = props;

  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .post("http://localhost:3636/user/verify", {
          token: localStorage.getItem("token"),
        })
        .then(({ data }) => {
          dispatch(login({ _id: data._id, username: data.username }));
        })
        .catch((err) => console.log(err));
    } else {
      dispatch(logout());
    }
  }, [localStorage.getItem("token")]);

  const getTitle = (e) => {
    e.preventDefault();
    if (title !== "") {
      navigate(`/MovieSearch?title=${title}`);
      setTitle("");
    }
  };

  let user = useSelector((state) => state.user.value);
  console.log(user);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, color: "var(--basic-color)" }}>
        MB
      </Typography>
      <Divider />
      {/* <ColorSwitches /> */}
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center", color: "var(--basic-color)" }}
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar color="transparent" component="nav" position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            color="secondary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              marginRight: "90%",
              display: {
                sm: "none",
              },
              color: "var(--basic-color)",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "inherit" },
              color: "var(--basic-color)",
            }}
          >

            MovieBag

          </Typography>
       {/* <ThemeSwitcher /> */}
       <ThemeSwitcher setTheme={setTheme} theme={theme} />

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <StyledNavbarButton onClick={()=> navigate("/")} >Home</StyledNavbarButton>
          <StyledNavbarButton >About</StyledNavbarButton>
          <StyledNavbarButton onClick={()=> navigate("/yourMovies")} >Your Movies</StyledNavbarButton>

            {/* {navItems.map((item) => (
              <StyledNavbarButton key={item}>{item}</StyledNavbarButton>
            ))} */}
          </Box>
          {location.pathname !== "/" &&
          <Box >
          <form onSubmit={getTitle}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              placeholder="Search for a movie…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          </form>
          </Box>
          }
          <Stack  sx={{marginLeft: "15px"}}>
          <Avatar alt={user.username} src="/broken-image.jpg" sx={{ bgcolor: "var(--basic-color)", cursor:'pointer'}} 
          onClick={ user._id? ()=> setOpenLogoutModal(true): () => {
            navigate(`/login`);
          }}/>
          </Stack>
        </Toolbar>
      </AppBar>
     
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
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
      <LogoutModal
            open={openLogoutModal}
            onClose={() => {
              setOpenLogoutModal(false);
            }}
          />
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
};

Navbar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Navbar;
