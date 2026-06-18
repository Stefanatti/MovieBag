import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Box,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions as MuiDialogActions,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTheme } from "@mui/material/styles";

const WatchlistCard = ({ show, removeShow }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Card
        sx={{
          borderRadius: "14px",
          background: "rgba(30, 28, 28, 0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          willChange: "transform",
          "&:hover": {
            transform: "translateY(-6px)",
            borderColor: "var(--basic-color)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          },
          "&:hover .delete-btn": {
            opacity: 1,
          },
          "&:hover .poster-overlay": {
            opacity: 1,
          },
        }}
      >
        {/* Delete button - visible on hover */}
        <IconButton
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmOpen(true);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 3,
            opacity: isSmallScreen ? 1 : 0,
            transition: "opacity 0.2s ease",
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            color: "#ff4444",
            width: 34,
            height: 34,
            "&:hover": {
              backgroundColor: "rgba(255,0,0,0.2)",
            },
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Poster */}
        <Box
          onClick={() =>
            navigate(
              show.type === "movie"
                ? `/movie?id=${show.id}`
                : `/tvShow?id=${show.id}`,
            )
          }
          sx={{
            cursor: "pointer",
            position: "relative",
            aspectRatio: "2/3",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={`https://image.tmdb.org/t/p/w500/${show.poster}`}
            alt={show.title || show.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Gradient overlay on hover */}
          <Box
            className="poster-overlay"
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background:
                "linear-gradient(transparent 0%, rgba(0,0,0,0.9) 100%)",
              opacity: isSmallScreen ? 1 : 0,
              transition: "opacity 0.3s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 1.5,
              gap: 0.5,
            }}
          >
            <Typography
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.75rem",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {show.type === "movie"
                ? `Dir: ${show.director}`
                : `By: ${show.creator}`}
            </Typography>
          </Box>

          {/* Type badge */}
          <Chip
            label={show.type === "movie" ? "Movie" : "TV"}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              height: 22,
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
              backgroundColor:
                show.type === "movie"
                  ? "var(--basic-color)"
                  : "rgba(139, 92, 246, 0.85)",
              color: "#fff",
            }}
          />
        </Box>

        {/* Title + Year bar */}
        <Box
          sx={{
            px: 1.5,
            py: 1.2,
            display: "flex",
            flexDirection: "column",
            gap: 0.3,
          }}
        >
          <Typography
            onClick={() =>
              navigate(
                show.type === "movie"
                  ? `/movie?id=${show.id}`
                  : `/tvShow?id=${show.id}`,
              )
            }
            sx={{
              color: "#fff",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: isSmallScreen ? "0.85rem" : "0.95rem",
              lineHeight: 1.3,
              cursor: "pointer",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              "&:hover": {
                color: "var(--basic-color)",
              },
              transition: "color 0.2s ease",
            }}
          >
            {show.title || show.name}
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.78rem",
            }}
          >
            {show.year}
          </Typography>
        </Box>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            background: "rgba(30, 28, 28, 0.97)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            minWidth: 300,
          },
        }}
      >
        <DialogTitle
          sx={{ color: "var(--basic-color)", fontFamily: "Limelight" }}
        >
          Remove from Watchlist?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
            Are you sure you want to remove{" "}
            <strong style={{ color: "var(--basic-color)" }}>
              {show.title || show.name}
            </strong>{" "}
            from your watchlist?
          </Typography>
        </DialogContent>
        <MuiDialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "var(--basic-color)",
              color: "var(--basic-color)",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                borderColor: "var(--hover-color)",
                color: "var(--hover-color)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              removeShow(show._id);
              setConfirmOpen(false);
            }}
            variant="contained"
            sx={{
              backgroundColor: "var(--basic-color)",
              borderRadius: "8px",
              textTransform: "none",
              color: "#fff",
              "&:hover": {
                backgroundColor: "var(--hover-color)",
              },
            }}
          >
            Remove
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  );
};

export default WatchlistCard;
