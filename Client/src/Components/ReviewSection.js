import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../api/axios";

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

const ReviewItem = ({ review, userId }) => {
  const [showSpoilers, setShowSpoilers] = useState(false);
  const hidden = review.containsSpoilers && !showSpoilers;

  return (
    <Box component="article" sx={{ ...panelStyle, border: "1px solid rgba(255,255,255,0.15)" }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
          {review.author ? review.author.username : "Deleted user"}
        </Typography>
        {review.author?._id === userId && <Chip label="Your review" size="small" sx={{ color: "inherit" }} />}
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
  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState("");
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
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

  const openForm = () => {
    setText(myReview ? myReview.text : "");
    setContainsSpoilers(myReview ? myReview.containsSpoilers : false);
    setFormError("");
    setFormOpen(true);
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (saving) return;
    if (!text.trim() || text.trim().length > 2000) {
      setFormError("Review text must contain 1 to 2,000 characters.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const body = { text: text.trim(), containsSpoilers };
      const response = myReview
        ? await api.patch(`/reviews/${myReview._id}`, body)
        : await api.post(titlePath, body);
      setMyReview(response.data.review);
      setFormOpen(false);
      setText("");
      setContainsSpoilers(false);
      setPage(1);
      setReload((value) => value + 1);
      toast.success(response.data.message);
    } catch (error) {
      setFormError(errorMessage(error, "Unable to save your review. Please try again."));
      if (error.response?.status === 409 || error.response?.status === 404) {
        setReload((value) => value + 1);
      }
    } finally {
      setSaving(false);
    }
  };

  const removeReview = async () => {
    if (saving || !myReview) return;
    setSaving(true);
    setFormError("");
    try {
      const response = await api.delete(`/reviews/${myReview._id}`);
      setMyReview(null);
      setConfirmDelete(false);
      setFormOpen(false);
      setPage(1);
      setReload((value) => value + 1);
      toast.success(response.data.message);
    } catch (error) {
      setFormError(errorMessage(error, "Unable to delete your review. Please try again."));
      setConfirmDelete(false);
      if (error.response?.status === 404) setReload((value) => value + 1);
    } finally {
      setSaving(false);
    }
  };

  const unavailable = loading || Boolean(loadError) || saving;

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
        ) : formOpen ? (
          <Box component="form" onSubmit={submitReview}>
            <TextField
              label={myReview ? "Edit your review" : "Your review"}
              value={text}
              onChange={(event) => setText(event.target.value)}
              multiline
              minRows={4}
              fullWidth
              disabled={saving}
              inputProps={{ maxLength: 2000 }}
              helperText={`${text.length}/2,000 characters`}
              sx={{
                "& .MuiInputBase-root, & .MuiInputLabel-root, & .MuiFormHelperText-root": {
                  color: "var(--table-text-color)",
                },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--basic-color)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "var(--basic-color)" },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={containsSpoilers}
                  onChange={(event) => setContainsSpoilers(event.target.checked)}
                  disabled={saving}
                  sx={{ color: "var(--basic-color)", "&.Mui-checked": { color: "var(--basic-color)" } }}
                />
              }
              label="Contains spoilers"
            />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button type="submit" variant="outlined" disabled={unavailable} sx={buttonStyle}>
                {saving ? "Saving..." : myReview ? "Save changes" : "Publish review"}
              </Button>
              <Button onClick={() => { setFormOpen(false); setFormError(""); }} disabled={saving} sx={buttonStyle}>
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <Stack spacing={1}>
            <Typography>
              {myReview ? "You have reviewed this title." : "Share your thoughts about this title."}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button onClick={openForm} variant="outlined" disabled={unavailable} sx={buttonStyle}>
                {myReview ? "Edit your review" : "Write a review"}
              </Button>
              {myReview && (
                <Button onClick={() => setConfirmDelete(true)} disabled={unavailable} color="error">
                  Delete your review
                </Button>
              )}
            </Stack>
          </Stack>
        )}
        {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}
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
            {data.reviews.map((review) => (
              <ReviewItem key={`${review._id}:${review.updatedAt}`} review={review} userId={userId} />
            ))}
            {data.total === 0 && <Typography>No reviews yet. Be the first to share your thoughts!</Typography>}
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
      <Dialog
        open={confirmDelete}
        onClose={() => { if (!saving) setConfirmDelete(false); }}
        aria-labelledby="delete-review-title"
        PaperProps={{ sx: panelStyle }}
      >
        <DialogTitle id="delete-review-title">Delete your review?</DialogTitle>
        <DialogContent>This cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} disabled={saving} sx={buttonStyle}>Cancel</Button>
          <Button onClick={removeReview} disabled={saving} color="error">
            {saving ? "Deleting..." : "Delete review"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ReviewSection = ({ tmdbId, mediaType }) => {
  const userId = useSelector((state) => state.user.value._id);
  return <Reviews key={`${mediaType}:${tmdbId}:${userId}`} tmdbId={tmdbId} mediaType={mediaType} userId={userId} />;
};

export default ReviewSection;
