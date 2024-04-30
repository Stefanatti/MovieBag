import { Box, Typography } from "@mui/material";
import React from "react";
import { Container } from "react-bootstrap";

const ErrorPage = () => {
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
          Oups! Something went wrong!🤔 Please try again later.
        </Typography>
      </Box>
    </Container>
  );
};

export default ErrorPage;
