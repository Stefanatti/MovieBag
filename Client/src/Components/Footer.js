import React from 'react';
import { Grid, Paper, Typography, Container, Box } from "@mui/material";

function Footer(props) {
    return (
        
             <Box
        sx={{

          width: "100%   ",
          height: "40px",
          backgroundColor: "#1c1b1b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignContent: 'flex-end',
          marginTop: 'auto'
        }}
      >
        <Typography
          variant="subtitle1"
          color="text.primary"
          sx={{
            color: "var(--basic-color)",
            alignSelf: "center",
          }}
        >
          Created By Stefanos Kotsios 2023
        </Typography>
      </Box>
        
    );
}

export default Footer;