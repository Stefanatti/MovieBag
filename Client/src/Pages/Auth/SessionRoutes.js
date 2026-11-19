import { Alert, Box, Button, CircularProgress, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { returnToFrom } from "./returnTo";

export default function SessionRoutes({ session, retry, privateOnly = false }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();

  if (session === "checking") {
    return (
      <Stack role="status" direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ py: 6, color: "#fff" }}>
        <CircularProgress size={20} color="inherit" aria-hidden="true" />
        <span>Checking your session...</span>
      </Stack>
    );
  }
  if (!privateOnly) return <Outlet />;
  if (session === "unavailable" && !isAuthenticated) {
    return (
      <Box sx={{ maxWidth: 520, mx: "auto", px: 2, py: 4 }}>
        <Alert severity="warning" action={<Button color="inherit" onClick={retry}>Try again</Button>}>
          Could not check your session. Check your connection and try again.
        </Alert>
      </Box>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ returnTo: returnToFrom(location) }} />;
  }
  return <Outlet />;
}
