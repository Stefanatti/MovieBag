import {
  Typography,
  Box,
  Dialog,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import * as React from "react";

import YouTube from "react-youtube";

export default function TrailerModal({ open, trailer, onClose }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const responsiveHeight = isSmallScreen ? "35vh" : "80vh";
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        PaperProps={{
          sx: {
            width: "80vw",
            // height: "80vh",
            maxHeight: responsiveHeight,
            maxWidth: "none",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            padding: 2,
            backgroundColor: "rgb(46, 41, 46)",
          }}
        >
          {trailer && trailer.length ? (
            <YouTube
              videoId={trailer[0].key}
              opts={{ width: "100%", height: 530 }}
            />
          ) : (
            <Typography
              variant={"h5"}
              fontFamily={"lato"}
              color={"rgb(201, 201, 190)"}
            >
              Sorry, we can not find a trailer
            </Typography>
          )}
        </Box>
      </Dialog>
    </div>
  );
}
