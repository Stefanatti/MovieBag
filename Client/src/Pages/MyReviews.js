import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { ReviewItem } from "../Components/ReviewSection";
import ReviewEditor from "../Components/ReviewEditor";
import api from "../api/axios";

const buttonStyle = {
  color: "var(--basic-color)",
  borderColor: "var(--basic-color)",
  textTransform: "none",
};

const ReviewedTitle = ({ review, userId, onChange, onSavingChange, disabled }) => {
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [posterFailed, setPosterFailed] = useState(false);
  const isMovie = review.mediaType === "movie";
  const titlePath = `/${isMovie ? "movie" : "tvShow"}?id=${review.tmdbId}`;
  const fallbackTitle = `${isMovie ? "Movie" : "TV show"} #${review.tmdbId}`;

  useEffect(() => {
    const controller = new AbortController();
    const loadTitle = async () => {
      setLoading(true);
      setError("");
      setPosterFailed(false);
      try {
        const response = await api.get(
          `/api/${isMovie ? "" : "tv/"}id/${review.tmdbId}`,
          { signal: controller.signal },
        );
        if (controller.signal.aborted) return;
        if (String(response.data.id) !== review.tmdbId || !(response.data.title || response.data.name)) {
          throw new Error("Title details are unavailable.");
        }
        setTitle(response.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Title details could not be loaded. Your review is still available.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadTitle();
    return () => controller.abort();
  }, [isMovie, review.tmdbId, retry]);

  const name = title ? title.title || title.name : fallbackTitle;
  const poster = title?.poster_path;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        p: { xs: 2, sm: 3 },
        borderRadius: "12px",
        background: "var(--main-card-color)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <Box sx={{ width: { xs: 120, sm: 140 }, flexShrink: 0 }}>
        <Box component={Link} to={titlePath} aria-label={`View ${name}`} sx={{ display: "block", color: "inherit", textDecoration: "none" }}>
          {loading ? (
            <Box sx={{ height: 180, display: "grid", placeItems: "center" }}>
              <CircularProgress size={28} aria-label="Loading title details" sx={{ color: "var(--basic-color)" }} />
            </Box>
          ) : poster && !posterFailed ? (
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/w185${poster}`}
              alt={`${name} poster`}
              loading="lazy"
              onError={() => setPosterFailed(true)}
              sx={{ display: "block", width: "100%", aspectRatio: "2 / 3", objectFit: "cover", borderRadius: "8px" }}
            />
          ) : (
            <Box sx={{ minHeight: 180, display: "grid", placeItems: "center", p: 2, borderRadius: "8px", background: "rgba(255,255,255,0.08)" }}>
              <Typography variant="body2" textAlign="center">
                {posterFailed ? "Poster could not be loaded" : error ? "Poster unavailable" : "No poster available"}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component={Link}
          to={titlePath}
          variant="h6"
          sx={{ color: "var(--basic-color)", overflowWrap: "anywhere", textDecoration: "none" }}
        >
          {name}
        </Typography>
        <Chip label={isMovie ? "Movie" : "TV show"} size="small" sx={{ alignSelf: "flex-start", color: "inherit", border: "1px solid var(--basic-color)" }} />
        {error && (
          <Alert severity="warning" action={<Button color="inherit" onClick={() => setRetry((value) => value + 1)}>Retry title</Button>}>
            {error}
          </Alert>
        )}
        <ReviewItem key={`${review._id}:${review.updatedAt}`} review={review} userId={userId} />
        <ReviewEditor
          review={review}
          disabled={disabled}
          onChange={(updated) => onChange(review._id, updated)}
          onSavingChange={(saving) => onSavingChange(review._id, saving)}
        />
        <Button component={Link} to={titlePath} variant="outlined" sx={{ ...buttonStyle, alignSelf: "flex-start" }}>
          View title / manage review
        </Button>
      </Stack>
    </Box>
  );
};

const ReviewHistory = ({ userId }) => {
  const [data, setData] = useState({ reviews: [], total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [savingIds, setSavingIds] = useState([]);
  const saving = savingIds.length > 0;

  const savingChanged = (id, isSaving) => {
    setSavingIds((ids) => isSaving ? [...ids, id] : ids.filter((value) => value !== id));
  };

  const reviewChanged = (id, updated) => {
    setData((current) => ({
      ...current,
      reviews: updated
        ? current.reviews.map((review) => review._id === id ? updated : review)
        : current.reviews.filter((review) => review._id !== id),
      total: updated ? current.total : current.total - 1,
    }));
    if (!updated) setRetry((value) => value + 1);
  };

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    const loadReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/reviews/mine", {
          params: { page },
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (page > Math.max(1, response.data.totalPages)) {
          setPage(Math.max(1, response.data.totalPages));
          return;
        }
        setData(response.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.response?.data?.message || "Unable to load your reviews. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadReviews();
    return () => controller.abort();
  }, [page, retry, userId]);

  return (
    <Container maxWidth="lg" sx={{ py: 3, color: "var(--table-text-color)" }}>
      <Typography component="h1" variant="h4" sx={{ color: "var(--basic-color)", mb: 1 }}>
        My Reviews
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Your public and private movie and TV-show reviews, newest first. Edit, publish, or make a review private here.
      </Typography>
      {!userId ? (
        <Button component={Link} to="/login" sx={buttonStyle}>Log in to see your reviews</Button>
      ) : loading ? (
        <Box role="status" sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress aria-label="Loading your reviews" sx={{ color: "var(--basic-color)" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" action={<Button color="inherit" onClick={() => setRetry((value) => value + 1)}>Retry</Button>}>
          {error}
        </Alert>
      ) : data.total === 0 ? (
        <Box sx={{ py: 4 }}>
          <Typography>You haven't written any reviews yet.</Typography>
          <Button component={Link} to="/" variant="outlined" sx={{ ...buttonStyle, mt: 2 }}>Discover movies and TV shows</Button>
        </Box>
      ) : (
        <>
          <Typography sx={{ mb: 2 }}>{data.total} {data.total === 1 ? "review" : "reviews"}</Typography>
          <Stack spacing={3}>
            {data.reviews.map((review) => (
              <ReviewedTitle
                key={review._id}
                review={review}
                userId={userId}
                onChange={reviewChanged}
                onSavingChange={savingChanged}
                disabled={savingIds.some((id) => id !== review._id)}
              />
            ))}
          </Stack>
          {data.totalPages > 1 && (
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
              <Button disabled={page === 1 || saving} onClick={() => setPage((value) => value - 1)} sx={buttonStyle}>Previous</Button>
              <Typography aria-live="polite">Page {page} of {data.totalPages}</Typography>
              <Button disabled={page >= data.totalPages || saving} onClick={() => setPage((value) => value + 1)} sx={buttonStyle}>Next</Button>
            </Stack>
          )}
        </>
      )}
    </Container>
  );
};

const MyReviews = () => {
  const userId = useSelector((state) => state.user.value._id);
  return <ReviewHistory key={userId} userId={userId} />;
};

export default MyReviews;
