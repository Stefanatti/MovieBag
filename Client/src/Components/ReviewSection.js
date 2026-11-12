import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import api from "../api/axios";
import ReviewEditor from "./ReviewEditor";

const panelStyle = {
  background: "var(--main-card-color)",
  color: "var(--table-text-color)",
  borderRadius: "12px",
  p: { xs: 2, sm: 3 },
};

const buttonStyle = {
  color: "var(--basic-color)",
  borderColor: "var(--basic-color)",
  textTransform: "none",
};

const errorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export const ReviewItem = ({ review, userId }) => {
  const [showSpoilers, setShowSpoilers] = useState(false);
  const hidden = review.containsSpoilers && !showSpoilers;

  return (
    <Box component="article" sx={{ ...panelStyle, border: "1px solid rgba(255,255,255,0.15)" }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
          {review.author ? review.author.username : "Deleted user"}
        </Typography>
        {review.author?._id === userId && <Chip label="Your review" size="small" sx={{ color: "inherit" }} />}
        <Chip label={review.isPrivate ? "Private" : "Public"} size="small" sx={{ color: "inherit", border: "1px solid var(--basic-color)" }} />
        {review.containsSpoilers && <Chip label="Contains spoilers" size="small" color="warning" />}
      </Stack>
      <Typography variant="caption" component="p" sx={{ opacity: 0.8, mb: 1 }}>
        <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
        {review.updatedAt !== review.createdAt && " (edited)"}
      </Typography>
      {hidden ? (
        <Button onClick={() => setShowSpoilers(true)} sx={buttonStyle}>
          Show spoilers
        </Button>
      ) : (
        <>
          <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {review.text}
          </Typography>
          {review.containsSpoilers && (
            <Button onClick={() => setShowSpoilers(false)} sx={buttonStyle}>
              Hide spoilers
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

const Reviews = ({ tmdbId, mediaType, userId }) => {
  const [data, setData] = useState({ reviews: [], total: 0, totalPages: 0 });
  const [myReview, setMyReview] = useState(null);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const titlePath = `/reviews/${mediaType}/${tmdbId}`;

  useEffect(() => {
    const controller = new AbortController();
    const loadReviews = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [publicResponse, ownResponse] = await Promise.all([
          api.get(titlePath, { params: { page }, signal: controller.signal }),
          userId
            ? api.get(`/reviews/mine/${mediaType}/${tmdbId}`, { signal: controller.signal })
            : Promise.resolve(null),
        ]);
        if (controller.signal.aborted) return;
        const result = publicResponse.data;
        setMyReview(ownResponse ? ownResponse.data.review : null);
        if (page > Math.max(1, result.totalPages)) {
          setPage(Math.max(1, result.totalPages));
          return;
        }
        setData(result);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(errorMessage(error, "Unable to load reviews. Please try again."));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadReviews();
    return () => controller.abort();
  }, [titlePath, mediaType, tmdbId, page, reload, userId]);

  const reviewChanged = (review) => {
    setMyReview(review);
    setPage(1);
    setReload((value) => value + 1);
  };

  return (
    <Box component="section" aria-label="Community reviews" sx={{ my: 4, color: "var(--table-text-color)" }}>
      <Typography component="h2" variant="h5" sx={{ color: "var(--basic-color)", mb: 2 }}>
        Community reviews{!loading && !loadError ? ` (${data.total})` : ""}
      </Typography>
      <Box sx={{ ...panelStyle, mb: 2 }}>
        {!userId ? (
          <Button component={Link} to="/login" variant="outlined" sx={buttonStyle}>
            Log in to write a review
          </Button>
        ) : (
          <>
            {myReview && (
              <Box sx={{ mb: 2 }}>
                <ReviewItem key={`${myReview._id}:${myReview.updatedAt}`} review={myReview} userId={userId} />
              </Box>
            )}
            <ReviewEditor
              review={myReview}
              tmdbId={tmdbId}
              mediaType={mediaType}
              disabled={loading || Boolean(loadError)}
              onChange={reviewChanged}
              onSavingChange={setSaving}
              onStale={() => setReload((value) => value + 1)}
            />
          </>
        )}
      </Box>
      {loading ? (
        <Box role="status" sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress aria-label="Loading reviews" sx={{ color: "var(--basic-color)" }} />
        </Box>
      ) : loadError ? (
        <Alert
          severity="error"
          action={<Button color="inherit" onClick={() => setReload((value) => value + 1)}>Retry</Button>}
        >
          {loadError}
        </Alert>
      ) : (
        <>
          <Stack spacing={2}>
            {data.reviews.filter((review) => review._id !== myReview?._id).map((review) => (
              <ReviewItem key={`${review._id}:${review.updatedAt}`} review={review} userId={userId} />
            ))}
            {data.total === 0 && (
              <Typography>
                {myReview ? "No public reviews yet." : "No reviews yet. Be the first to share your thoughts!"}
              </Typography>
            )}
          </Stack>
          {data.totalPages > 1 && (
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
              <Button disabled={page === 1 || saving} onClick={() => setPage((value) => value - 1)} sx={buttonStyle}>
                Previous
              </Button>
              <Typography aria-live="polite">Page {page} of {data.totalPages}</Typography>
              <Button disabled={page >= data.totalPages || saving} onClick={() => setPage((value) => value + 1)} sx={buttonStyle}>
                Next
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

const ReviewSection = ({ tmdbId, mediaType }) => {
  const userId = useSelector((state) => state.user.value._id);
  return <Reviews key={`${mediaType}:${tmdbId}:${userId}`} tmdbId={tmdbId} mediaType={mediaType} userId={userId} />;
};

export default ReviewSection;
