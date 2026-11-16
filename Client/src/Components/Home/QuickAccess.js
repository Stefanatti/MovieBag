import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const shortcuts = [
  { label: "Your Movies", hint: "Everything you've watched", to: "/yourmovies", icon: MovieOutlinedIcon },
  { label: "Your TV Shows", hint: "Series you've followed", to: "/yourTvShows", icon: TvOutlinedIcon },
  { label: "Watchlist", hint: "Saved for later", to: "/watchlist/movies", icon: BookmarkBorderIcon },
  { label: "My Reviews", hint: "Your thoughts, in one place", to: "/myreviews", icon: RateReviewOutlinedIcon },
];

const surface = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.09)",
  backdropFilter: "blur(10px)",
};

const QuickAccess = ({ user }) => {
  if (!user?._id) {
    return (
      <Box
        component="section"
        aria-labelledby="join-heading"
        sx={{
          ...surface,
          borderRadius: "20px",
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2.5,
        }}
      >
        <Box>
          <Typography
            id="join-heading"
            component="h2"
            sx={{ fontFamily: "Limelight", color: "var(--basic-color)", fontSize: { xs: "1.4rem", md: "1.7rem" } }}
          >
            Keep track of everything you watch
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5, maxWidth: 620 }}>
            Build your movie and TV library, rate titles, keep a watchlist and share reviews.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            sx={{
              borderRadius: "999px",
              px: 3,
              fontWeight: 800,
              textTransform: "none",
              backgroundColor: "var(--basic-color)",
              color: "#fff",
              "&:hover": { backgroundColor: "var(--basic-color)", filter: "brightness(1.1)" },
            }}
          >
            Sign up free
          </Button>
          <Button
            component={Link}
            to="/login"
            sx={{
              borderRadius: "999px",
              px: 3,
              fontWeight: 700,
              textTransform: "none",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
            }}
          >
            Log in
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="section" aria-labelledby="library-heading">
      <Typography
        id="library-heading"
        component="h2"
        sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: "1.1rem", mb: 1.5 }}
      >
        Welcome back,{" "}
        <Box component="span" sx={{ color: "var(--basic-color)" }}>
          {user.username}
        </Box>
      </Typography>
      <Box
        component="nav"
        aria-label="Your library"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {shortcuts.map(({ label, hint, to, icon: Icon }) => (
          <Box
            key={to}
            component={Link}
            to={to}
            sx={{
              ...surface,
              minWidth: 0,
              borderRadius: "16px",
              p: { xs: 1.5, md: 2 },
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "#fff",
              textDecoration: "none",
              transition: "border-color 0.25s ease, transform 0.25s ease, background 0.25s ease",
              "& .arrow": { transition: "transform 0.25s ease", opacity: 0.5 },
              "&:hover, &:focus-visible": {
                borderColor: "var(--basic-color)",
                transform: "translateY(-2px)",
              },
              "&:hover .arrow, &:focus-visible .arrow": { transform: "translateX(3px)", opacity: 1 },
              "&:focus-visible": { outline: "2px solid var(--basic-color)", outlineOffset: "2px" },
              "@media (prefers-reduced-motion: reduce)": {
                "&:hover, &:focus-visible": { transform: "none" },
              },
            }}
          >
            <Box
              sx={{
                width: { xs: 38, md: 44 },
                height: { xs: 38, md: 44 },
                flexShrink: 0,
                borderRadius: "12px",
                display: "grid",
                placeItems: "center",
                color: "var(--basic-color)",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            >
              <Icon />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.88rem", md: "0.98rem" }, lineHeight: 1.2 }}>
                {label}
              </Typography>
              <Typography
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.55)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {hint}
              </Typography>
            </Box>
            <ArrowForwardRoundedIcon className="arrow" sx={{ display: { xs: "none", md: "block" }, fontSize: 18 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default QuickAccess;
