import { useState } from "react";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { Box, Button, IconButton, Skeleton, Typography, useMediaQuery } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import { titlePath } from "./DiscoverWall";

const SLIDE_MS = 8000;
const IMG = "https://image.tmdb.org/t/p/";

const progress = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;
const contentIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
`;

const heroHeight = { xs: 480, sm: 500, md: 560, lg: 600 };

const HomeHero = ({ items, loading }) => {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  // Backdrops are fetched lazily: the current slide, the next one, and any already seen.
  const [seen, setSeen] = useState(() => new Set([0, 1]));

  if (loading) {
    return (
      <Skeleton
        variant="rounded"
        sx={{
          height: heroHeight,
          borderRadius: { xs: "18px", md: "28px" },
          bgcolor: "rgba(255,255,255,0.07)",
          mt: { xs: 1, md: 2 },
        }}
      />
    );
  }
  if (!items?.length) return null;

  const active = Math.min(index, items.length - 1);
  const item = items[active];
  const autoplay = items.length > 1 && !reducedMotion;
  const paused = hovered || focused || userPaused;
  const go = (next) => {
    const target = (next + items.length) % items.length;
    setIndex(target);
    setSeen((current) => {
      const after = (target + 1) % items.length;
      if (current.has(target) && current.has(after)) return current;
      return new Set([...current, target, after]);
    });
  };
  const rating = Number(item.vote_average) > 0 ? item.vote_average.toFixed(1) : null;
  const typeLabel = item.mediaType === "tv" ? "TV Show" : "Movie";

  const scrollToDiscover = (event) => {
    event.preventDefault();
    document
      .getElementById("discover")
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <Box
      component="section"
      aria-roledescription="carousel"
      aria-label="Featured titles"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      sx={{
        position: "relative",
        height: heroHeight,
        mt: { xs: 1, md: 2 },
        borderRadius: { xs: "18px", md: "28px" },
        overflow: "hidden",
        backgroundColor: "#07090c",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        isolation: "isolate",
      }}
    >
      {items.map((slide, slideIndex) => {
        const isActive = slideIndex === active;
        const shouldLoad = seen.has(slideIndex);
        return (
          <Box
            key={`${slide.mediaType}-${slide.id}`}
            component="img"
            alt=""
            aria-hidden="true"
            src={shouldLoad ? `${IMG}w1280${slide.backdrop_path}` : undefined}
            srcSet={
              shouldLoad
                ? `${IMG}w780${slide.backdrop_path} 780w, ${IMG}w1280${slide.backdrop_path} 1280w`
                : undefined
            }
            sizes="(min-width: 1536px) 1536px, 100vw"
            fetchpriority={slideIndex === 0 ? "high" : undefined}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: { xs: "65% center", md: "center 25%" },
              opacity: isActive ? 1 : 0,
              transform: isActive ? "scale(1.04)" : "scale(1)",
              transition: "opacity 1s ease, transform 8s ease-out",
              zIndex: -2,
              "@media (prefers-reduced-motion: reduce)": {
                transform: "none",
                transition: "none",
              },
            }}
          />
        );
      })}

      {/* Legibility scrims */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: {
            xs: "linear-gradient(0deg, rgba(5,7,10,0.97) 18%, rgba(5,7,10,0.55) 58%, rgba(5,7,10,0.1) 100%)",
            md: "linear-gradient(90deg, rgba(5,7,10,0.95) 0%, rgba(5,7,10,0.7) 38%, rgba(5,7,10,0.05) 72%), linear-gradient(0deg, rgba(5,7,10,0.8) 0%, transparent 35%)",
          },
        }}
      />

      <Box
        key={`${item.mediaType}-${item.id}`}
        aria-live={autoplay && !paused ? "off" : "polite"}
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          right: { xs: 0, md: "38%" },
          px: { xs: 3, sm: 4, md: 6 },
          pt: { xs: 3, sm: 4, md: 6 },
          pb: { xs: 9, sm: 10, md: 7 },
          color: "#fff",
          animation: `${contentIn} 0.7s ease both`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        <Typography
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--basic-color)",
            mb: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{ width: 22, height: 2, backgroundColor: "var(--basic-color)", borderRadius: 1 }}
          />
          Trending {item.mediaType === "tv" ? "on TV" : "in movies"}
        </Typography>
        <Typography
          component="h2"
          sx={{
            fontFamily: "Limelight",
            fontSize: { xs: "2rem", sm: "2.6rem", md: "3.6rem" },
            lineHeight: 1.05,
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 1.5,
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          {rating && (
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.4 }}>
              <StarRoundedIcon sx={{ color: "#ffc940", fontSize: 20 }} />
              {rating}
            </Box>
          )}
          {item.year && <span>{item.year}</span>}
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.2,
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: "6px",
              fontSize: "0.72rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {typeLabel}
          </Box>
        </Box>
        {item.overview && (
          <Typography
            sx={{
              mt: 2,
              maxWidth: 560,
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.6,
              fontSize: { xs: "0.9rem", md: "1rem" },
              display: "-webkit-box",
              WebkitLineClamp: { xs: 2, md: 3 },
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.overview}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 3 }}>
          <Button
            component={Link}
            to={titlePath(item)}
            variant="contained"
            startIcon={<InfoOutlinedIcon />}
            sx={{
              borderRadius: "999px",
              px: 3,
              py: 1.1,
              fontWeight: 800,
              textTransform: "none",
              backgroundColor: "var(--basic-color)",
              color: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              "&:hover": { backgroundColor: "var(--basic-color)", filter: "brightness(1.1)" },
            }}
          >
            View details
          </Button>
          <Button
            href="#discover"
            onClick={scrollToDiscover}
            startIcon={<ExploreOutlinedIcon />}
            sx={{
              borderRadius: "999px",
              px: 3,
              py: 1.1,
              fontWeight: 700,
              textTransform: "none",
              color: "#fff",
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
            }}
          >
            Explore more
          </Button>
        </Box>
      </Box>

      {items.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            right: { xs: 12, md: 28 },
            bottom: { xs: 16, md: 28 },
            left: { xs: 12, md: "auto" },
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", md: "flex-end" },
            gap: 1.5,
          }}
        >
          {/* Poster thumbnails on desktop */}
          <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 1 }}>
            {items.map((slide, slideIndex) => (
              <Box
                key={`${slide.mediaType}-${slide.id}`}
                component="button"
                type="button"
                onClick={() => go(slideIndex)}
                aria-label={`Show ${slide.title}`}
                aria-current={slideIndex === active ? "true" : undefined}
                sx={{
                  p: 0,
                  width: 52,
                  aspectRatio: "2 / 3",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: slideIndex === active ? "var(--basic-color)" : "rgba(255,255,255,0.2)",
                  opacity: slideIndex === active ? 1 : 0.6,
                  transform: slideIndex === active ? "translateY(-4px)" : "none",
                  transition: "all 0.3s ease",
                  background: "rgba(255,255,255,0.08)",
                  "&:hover": { opacity: 1 },
                  "&:focus-visible": { outline: "2px solid #fff", outlineOffset: "2px" },
                }}
              >
                <Box
                  component="img"
                  src={`${IMG}w154${slide.poster_path}`}
                  alt=""
                  loading="lazy"
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </Box>
            ))}
          </Box>
          {/* Dots on smaller screens */}
          <Box sx={{ display: { xs: "flex", lg: "none" }, gap: 0.5 }}>
            {items.map((slide, slideIndex) => (
              <Box
                key={`${slide.mediaType}-${slide.id}`}
                component="button"
                type="button"
                onClick={() => go(slideIndex)}
                aria-label={`Show ${slide.title}`}
                aria-current={slideIndex === active ? "true" : undefined}
                sx={{
                  p: 0,
                  border: 0,
                  height: 24,
                  width: slideIndex === active ? 34 : 18,
                  cursor: "pointer",
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  transition: "width 0.3s ease",
                  "&::before": {
                    content: '""',
                    width: "100%",
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      slideIndex === active ? "var(--basic-color)" : "rgba(255,255,255,0.4)",
                  },
                  "&:focus-visible": { outline: "2px solid #fff", outlineOffset: "1px" },
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {[
              { label: "Previous title", icon: <ChevronLeftRoundedIcon />, onClick: () => go(active - 1) },
              ...(autoplay
                ? [
                    {
                      label: userPaused ? "Play slideshow" : "Pause slideshow",
                      icon: userPaused ? <PlayArrowRoundedIcon /> : <PauseRoundedIcon />,
                      onClick: () => setUserPaused((value) => !value),
                    },
                  ]
                : []),
              { label: "Next title", icon: <ChevronRightRoundedIcon />, onClick: () => go(active + 1) },
            ].map((control) => (
              <IconButton
                key={control.label}
                aria-label={control.label}
                onClick={control.onClick}
                size="small"
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.18)" },
                  "&.Mui-focusVisible": { outline: "2px solid #fff" },
                }}
              >
                {control.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      )}

      {autoplay && (
        <Box
          key={active}
          aria-hidden="true"
          data-testid="hero-progress"
          onAnimationEnd={() => go(active + 1)}
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            transformOrigin: "left",
            backgroundColor: "var(--basic-color)",
            animation: `${progress} ${SLIDE_MS}ms linear both`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      )}
    </Box>
  );
};

export default HomeHero;
