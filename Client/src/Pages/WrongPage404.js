import { Box, Typography, Container } from "@mui/material";
import React from "react";

const WrongPage404 = () => {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h5" color={"var(--basic-color)"}>
          Oups 404!😯 Page not found!
        </Typography>
      </Box>
    </Container>
  );
};

export default WrongPage404;
