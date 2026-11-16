import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import {
  Alert,
  Box,
  Button,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import MasonryGrid, { useMasonryColumns } from "./MasonryGrid";

const PAGE_SIZE = 20;
const POSTER_RATIO = 1.5;
const WIDE_RATIO = 0.75;
const IMG = "https://image.tmdb.org/t/p/";

const tileIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
`;
const shimmer = keyframes`
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
`;

const interleave = (a = [], b = []) => {
  const mixed = [];
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    if (a[i]) mixed.push(a[i]);
    if (b[i]) mixed.push(b[i]);
  }
  return mixed;
};

// Every third tile becomes a landscape backdrop tile to give the wall rhythm.
export const isWideTile = (item, index) =>
  Boolean(item.backdrop_path) && index % 3 === 1;

export const titlePath = (item) =>
  `${item.mediaType === "tv" ? "/tvShow" : "/movie"}?id=${item.id}`;

const DiscoverTile = ({ item, index, wide, showType }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth) setLoaded(true);
  }, []);

  const rating = Number(item.vote_average) > 0 ? item.vote_average.toFixed(1) : null;
  const typeLabel = item.mediaType === "tv" ? "TV" : "Movie";
  const label = [
    item.title,
    item.year,
    showType ? typeLabel : null,
    rating ? `rated ${rating} out of 10` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Box
      component={Link}
      to={titlePath(item)}
      aria-label={label}
      sx={{
        position: "relative",
        display: "block",
        aspectRatio: wide ? "4 / 3" : "2 / 3",
        borderRadius: wide ? "18px" : "14px",
        overflow: "hidden",
        color: "#fff",
        textDecoration: "none",
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%)",
        backgroundSize: "200% 100%",
        animation: `${tileIn} 0.5s ease both${loaded ? "" : `, ${shimmer} 1.6s linear infinite`}`,
        animationDelay: `${Math.min(index % PAGE_SIZE, 12) * 35}ms, 0ms`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        outline: "none",
        "& img": {
          transition: "transform 0.6s cubic-bezier(.2,.7,.2,1), opacity 0.4s ease",
        },
        "&:hover, &:focus-visible": {
          boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
          transform: "translateY(-3px)",
        },
        "&:hover img, &:focus-visible img": { transform: "scale(1.06)" },
        "&:hover .tile-info, &:focus-visible .tile-info": {
          opacity: 1,
          transform: "none",
        },
        "&:focus-visible": {
          outline: "3px solid var(--basic-color)",
          outlineOffset: "3px",
        },
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
          "&, & img, & .tile-info": { transition: "none" },
          "&:hover, &:focus-visible": { transform: "none" },
          "&:hover img, &:focus-visible img": { transform: "none" },
        },
      }}
    >
      <Box
        component="img"
        ref={imgRef}
        alt=""
        loading={index < 8 ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        src={wide ? `${IMG}w780${item.backdrop_path}` : `${IMG}w342${item.poster_path}`}
        srcSet={
          wide
            ? `${IMG}w300${item.backdrop_path} 300w, ${IMG}w780${item.backdrop_path} 780w`
            : `${IMG}w185${item.poster_path} 185w, ${IMG}w342${item.poster_path} 342w, ${IMG}w500${item.poster_path} 500w`
        }
        sizes="(min-width: 1200px) 20vw, (min-width: 900px) 25vw, (min-width: 600px) 33vw, 50vw"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: loaded ? 1 : 0,
        }}
      />

      {rating && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            px: 0.8,
            py: 0.25,
            borderRadius: "999px",
            backgroundColor: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(6px)",
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          <StarRoundedIcon sx={{ fontSize: 15, color: "#ffc940" }} />
          {rating}
        </Box>
      )}
      {showType && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            px: 0.9,
            py: 0.2,
            borderRadius: "6px",
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            backgroundColor:
              item.mediaType === "tv" ? "rgba(139, 92, 246, 0.9)" : "var(--basic-color)",
          }}
        >
          {typeLabel}
        </Box>
      )}

      <Box
        className="tile-info"
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          p: wide ? 2 : 1.5,
          pt: 5,
          background: "linear-gradient(transparent, rgba(0,0,0,0.88) 70%)",
          // Wide tiles always show their title; posters reveal it on hover/focus,
          // or always on touch screens where hover is unavailable.
          opacity: wide ? 1 : 0,
          transform: wide ? "none" : "translateY(8px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          "@media (hover: none)": { opacity: 1, transform: "none" },
        }}
      >
        <Typography
          sx={{
            fontFamily: wide ? "Limelight" : "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: wide ? { xs: "1rem", md: "1.2rem" } : "0.9rem",
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </Typography>
        {item.year && (
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", mt: 0.3 }}>
            {item.year}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const segmentSx = {
  "& .MuiToggleButton-root": {
    color: "rgba(255,255,255,0.7)",
    borderColor: "rgba(255,255,255,0.14)",
    textTransform: "none",
    fontWeight: 600,
    px: { xs: 1.5, sm: 2.2 },
    py: 0.6,
    "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "#fff",
      backgroundColor: "var(--basic-color)",
      borderColor: "var(--basic-color)",
    },
    "&.Mui-focusVisible": { outline: "2px solid #fff", outlineOffset: "2px" },
  },
};

const DiscoverWall = ({ lists, loading, error, onRetry }) => {
  const columns = useMasonryColumns();
  const [list, setList] = useState("popular");
  const [type, setType] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => setVisible(PAGE_SIZE), [list, type]);

  const items = useMemo(() => {
    const { movie = [], tv = [] } = lists[list] || {};
    if (type === "movie") return movie;
    if (type === "tv") return tv;
    return interleave(movie, tv);
  }, [lists, list, type]);

  const shown = items.slice(0, visible);
  // Landscape tiles are too cramped in a two-column phone layout.
  const wideFor = (item, index) => columns > 2 && isWideTile(item, index);
  const subtitle =
    list === "popular" ? "What everyone is watching right now" : "The highest rated of all time";

  return (
    <Box component="section" id="discover" aria-labelledby="discover-heading" sx={{ scrollMarginTop: 80 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            id="discover-heading"
            component="h2"
            sx={{
              fontFamily: "Limelight",
              color: "var(--basic-color)",
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              lineHeight: 1.1,
            }}
          >
            Discover
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}>{subtitle}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={list}
            onChange={(e, value) => value && setList(value)}
            aria-label="Choose list"
            sx={segmentSx}
          >
            <ToggleButton value="popular">Popular</ToggleButton>
            <ToggleButton value="top">Top rated</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={type}
            onChange={(e, value) => value && setType(value)}
            aria-label="Filter by type"
            sx={segmentSx}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="movie">Movies</ToggleButton>
            <ToggleButton value="tv">TV Shows</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {error && !shown.length ? (
        <Alert
          severity="error"
          variant="outlined"
          action={
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          }
          sx={{ color: "#fff" }}
        >
          We couldn't load these titles.
        </Alert>
      ) : loading && !shown.length ? (
        <Box aria-busy="true" aria-label="Loading titles">
          <MasonryGrid
            items={Array.from({ length: columns * 3 }, (_, i) => i)}
            columns={columns}
            getRatio={(i) => (columns > 2 && i % 3 === 1 ? WIDE_RATIO : POSTER_RATIO)}
            getKey={(i) => i}
            renderItem={(i) => (
              <Skeleton
                variant="rounded"
                sx={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: columns > 2 && i % 3 === 1 ? "4 / 3" : "2 / 3",
                  borderRadius: "14px",
                  bgcolor: "rgba(255,255,255,0.07)",
                }}
              />
            )}
          />
        </Box>
      ) : (
        <>
          <MasonryGrid
            items={shown}
            columns={columns}
            getRatio={(item, index) => (wideFor(item, index) ? WIDE_RATIO : POSTER_RATIO)}
            getKey={(item) => `${item.mediaType}-${item.id}`}
            renderItem={(item, index) => (
              <DiscoverTile
                item={item}
                index={index}
                wide={wideFor(item, index)}
                showType={type === "all"}
              />
            )}
          />
          <Box
            role="status"
            sx={{
              position: "absolute",
              width: "1px",
              height: "1px",
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
              whiteSpace: "nowrap",
            }}
          >
            {`Showing ${shown.length} of ${items.length} titles`}
          </Box>
          {visible < items.length && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => setVisible((count) => count + PAGE_SIZE)}
                sx={{
                  borderRadius: "999px",
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.25)",
                  "&:hover": {
                    borderColor: "var(--basic-color)",
                    backgroundColor: "rgba(255,255,255,0.06)",
                  },
                }}
              >
                Show more ({items.length - visible} left)
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default DiscoverWall;
