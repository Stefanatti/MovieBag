import { logout } from "../Features/user";
import { useDispatch } from "react-redux";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  CardMedia,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const LogoutModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const logOut = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("id");
      dispatch(logout());
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "14px",
          background: "var(--cards-color)",
          border: "2px solid var(--basic-color)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
          maxWidth: "420px",
          width: "90%",
          overflow: "hidden",
        },
      }}
    >
      <CardMedia
        component="img"
        height="220"
        image={require("../images/maxresdefault.jpg")}
        alt="Logout"
        sx={{ objectFit: "cover" }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: -3.5,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "var(--basic-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            border: "3px solid var(--table-background-color)",
          }}
        >
          <LogoutIcon sx={{ color: "#fff", fontSize: 26 }} />
        </Box>
      </Box>
      <DialogContent sx={{ textAlign: "center", pt: 2, pb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            color: "var(--basic-color)",
            fontFamily: "Limelight",
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          Leaving so soon?
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--table-text-color)", opacity: 0.8 }}
        >
          Are you sure you want to log out of your account?
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 1.5,
          pb: 2.5,
          px: 3,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "var(--basic-color)",
            color: "var(--basic-color)",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            "&:hover": {
              borderColor: "var(--hover-color)",
              color: "var(--hover-color)",
              background: "rgba(255,255,255,0.05)",
            },
          }}
        >
          Stay
        </Button>
        <Button
          onClick={logOut}
          variant="contained"
          sx={{
            backgroundColor: "var(--basic-color)",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            color: "#fff",
            "&:hover": {
              backgroundColor: "var(--hover-color)",
            },
          }}
        >
          Log Out
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutModal;
