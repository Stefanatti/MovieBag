import { logout } from "../Features/user";
import { useDispatch } from "react-redux";

import * as React from "react";
import {
  Box,
  Card,
  Button,
  CardHeader,
  Modal,
  CardMedia,
  CardActions,
} from "@mui/material";

const style = {
  position: "absolute",
  backgroundColor: "red",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "rgb(39 39 38)",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const LogoutModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const logOut = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      dispatch(logout());
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card sx={style}>
          <CardHeader
            sx={{ textAlign: "center", color: "var(--basic-color)" }}
            title="Are you sure you want to log out?"
          />
          <CardMedia
            component="img"
            height="254"
            image={require("../images/maxresdefault.jpg")}
            alt="Paella dish"
          />
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button variant="contained" size="small" onClick={onClose}>
              Stay
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                logOut();
              }}
            >
              Leave
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </div>
  );
};

export default LogoutModal;
