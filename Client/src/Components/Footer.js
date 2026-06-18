import React from "react";
import { Typography, Box } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        height: "48px",
        backgroundColor: "#1c1b1b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: "auto",
        flexShrink: 0,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: "var(--basic-color)",
        }}
      >
        Created By Stefanos Kotsios 2023
      </Typography>
    </Box>
  );
}

export default Footer;
