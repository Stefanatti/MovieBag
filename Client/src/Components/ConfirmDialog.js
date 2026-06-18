import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  highlightText = "",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "var(--modal-bg)",
          borderRadius: "12px",
          border: "1px solid var(--basic-color)",
          minWidth: 300,
          maxWidth: 400,
        },
      }}
    >
      <DialogTitle
        sx={{ color: "var(--basic-color)", fontFamily: "Limelight" }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "var(--table-text-color)", opacity: 0.8 }}>
          {message}
          {highlightText && (
            <>
              {" "}
              <strong style={{ color: "var(--basic-color)" }}>
                {highlightText}
              </strong>
            </>
          )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "var(--basic-color)",
            color: "var(--basic-color)",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              borderColor: "var(--hover-color)",
              color: "var(--hover-color)",
              background: "rgba(255,255,255,0.05)",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
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
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
