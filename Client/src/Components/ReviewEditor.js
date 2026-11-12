import { useId, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
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

const buttonStyle = {
  color: "var(--basic-color)",
  borderColor: "var(--basic-color)",
  textTransform: "none",
};

const checkboxStyle = {
  color: "var(--basic-color)",
  "&.Mui-checked": { color: "var(--basic-color)" },
};

const ReviewEditor = ({
  review,
  tmdbId,
  mediaType,
  disabled = false,
  onChange,
  onSavingChange,
  onStale,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState("");
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const busy = useRef(false);
  const dialogTitleId = useId();
  const unavailable = disabled || saving;

  const openForm = () => {
    setText(review ? review.text : "");
    setContainsSpoilers(review ? review.containsSpoilers : false);
    setIsPrivate(review?.isPrivate === true);
    setError("");
    setFormOpen(true);
  };

  const mutate = async (operation, body) => {
    if (busy.current || disabled) return;
    busy.current = true;
    setSaving(true);
    onSavingChange?.(true);
    setError("");
    try {
      let response;
      if (operation === "delete") {
        response = await api.delete(`/reviews/${review._id}`);
      } else if (review) {
        response = await api.patch(`/reviews/${review._id}`, body);
      } else {
        response = await api.post(`/reviews/${mediaType}/${tmdbId}`, body);
      }
      setConfirmDelete(false);
      setFormOpen(false);
      onChange(operation === "delete" ? null : response.data.review);
      toast.success(response.data.message);
    } catch (err) {
      const fallback = operation === "delete"
        ? "Unable to delete your review. Please try again."
        : "Unable to save your review. Please try again.";
      setError(err.response?.data?.message || fallback);
      setConfirmDelete(false);
      if (err.response?.status === 404 || err.response?.status === 409) onStale?.();
    } finally {
      busy.current = false;
      setSaving(false);
      onSavingChange?.(false);
    }
  };

  const submitReview = (event) => {
    event.preventDefault();
    if (!text.trim() || text.trim().length > 2000) {
      setError("Review text must contain 1 to 2,000 characters.");
      return;
    }
    mutate("save", { text: text.trim(), containsSpoilers, isPrivate });
  };

  return (
    <Box>
      {formOpen ? (
        <Box component="form" onSubmit={submitReview}>
          <TextField
            label={review ? "Edit your review" : "Your review"}
            value={text}
            onChange={(event) => setText(event.target.value)}
            multiline
            minRows={4}
            fullWidth
            disabled={unavailable}
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
          <Stack>
            <FormControlLabel
              control={<Checkbox checked={containsSpoilers} onChange={(event) => setContainsSpoilers(event.target.checked)} disabled={unavailable} sx={checkboxStyle} />}
              label="Contains spoilers"
            />
            <FormControlLabel
              control={<Checkbox checked={isPrivate} onChange={(event) => setIsPrivate(event.target.checked)} disabled={unavailable} sx={checkboxStyle} />}
              label="Private review (only you can see it)"
            />
          </Stack>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {isPrivate ? "Only you can read this review." : "Public: everyone can read this review."}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button type="submit" variant="outlined" disabled={unavailable} sx={buttonStyle}>
              {saving ? "Saving..." : review ? "Save changes" : isPrivate ? "Save private review" : "Publish review"}
            </Button>
            <Button onClick={() => { setFormOpen(false); setError(""); }} disabled={saving} sx={buttonStyle}>
              Cancel
            </Button>
          </Stack>
        </Box>
      ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button onClick={openForm} variant="outlined" disabled={unavailable} sx={buttonStyle}>
            {review ? "Edit your review" : "Write a review"}
          </Button>
          {review && (
            <>
              <Button onClick={() => mutate("visibility", { isPrivate: review.isPrivate !== true })} disabled={unavailable} sx={buttonStyle}>
                {review.isPrivate ? "Publish review" : "Make private"}
              </Button>
              <Button onClick={() => setConfirmDelete(true)} disabled={unavailable} color="error">
                Delete your review
              </Button>
            </>
          )}
        </Stack>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Dialog
        open={confirmDelete}
        onClose={() => { if (!saving) setConfirmDelete(false); }}
        aria-labelledby={dialogTitleId}
        PaperProps={{ sx: { background: "var(--main-card-color)", color: "var(--table-text-color)", borderRadius: "12px", p: 2 } }}
      >
        <DialogTitle id={dialogTitleId}>Delete your review?</DialogTitle>
        <DialogContent>This cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} disabled={saving} sx={buttonStyle}>Cancel</Button>
          <Button onClick={() => mutate("delete")} disabled={unavailable} color="error">
            {saving ? "Deleting..." : "Delete review"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewEditor;
