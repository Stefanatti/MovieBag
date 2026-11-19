import { Alert, Box, Button, Container, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const artwork = {
  login: {
    image: "https://alternativemovieposters.com/wp-content/uploads/2013/12/mementobg.jpg",
    title: "Memento",
    caption: "Every great story stays with you.",
  },
  signup: {
    image: "https://alternativemovieposters.com/wp-content/uploads/2021/12/Beth-Morris_EyesWideShut.jpg",
    title: "Eyes Wide Shut",
    caption: "Your next obsession starts here.",
  },
  recovery: {
    image: "https://alternativemovieposters.com/wp-content/uploads/2020/03/ratliff_eternalsunshine.jpg",
    title: "Eternal Sunshine of the Spotless Mind",
    caption: "Some things are worth remembering.",
  },
};

export const AuthLink = (props) => (
  <Link component={RouterLink} sx={{ color: "#fff", textUnderlineOffset: "4px" }} {...props} />
);

export const AuthLayout = ({ title, description, children, variant = "login" }) => (
  <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4, md: 5 } }}>
    <Paper
      component="section"
      aria-labelledby="account-heading"
      elevation={0}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.1fr) minmax(0, 1fr)" },
        overflow: "hidden",
        borderRadius: { xs: "20px", md: "28px" },
        border: "1px solid rgba(255,255,255,.16)",
        background: "linear-gradient(145deg, #202c33, #10191f)",
        boxShadow: "0 24px 80px rgba(0,0,0,.3)",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 180, sm: 240, md: 620 },
          backgroundColor: "#253038",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={artwork[variant].image}
          alt={`${artwork[variant].title} artwork`}
          sx={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
          }}
        />
        <Box sx={{
          position: "absolute", inset: 0,
          background: "linear-gradient(0deg, rgba(7,14,18,.97), rgba(7,14,18,.1) 75%)",
        }} />
        <Stack
          spacing={1.5}
          sx={{
            position: "relative", height: "100%", minHeight: "inherit", boxSizing: "border-box",
            justifyContent: "space-between", p: { xs: 3, md: 5 },
          }}
        >
          <Typography sx={{ fontFamily: "Limelight", fontSize: "1.25rem", textShadow: "0 2px 12px #000" }}>
            MovieBag<Box component="span" sx={{ color: "var(--basic-color)" }}>.</Box>
          </Typography>
          <Box sx={{ maxWidth: 350 }}>
            <Box sx={{ width: 36, height: 3, mb: 2, bgcolor: "var(--basic-color)", borderRadius: 2 }} />
            <Typography sx={{ fontFamily: "Limelight", fontSize: { xs: "1.4rem", md: "2.3rem" }, lineHeight: 1.15 }}>
              {artwork[variant].caption}
            </Typography>
            <Typography sx={{ display: { xs: "none", md: "block" }, color: "#d0dae3", mt: 2, fontSize: ".9rem" }}>
              Films, series, and the thoughts you keep along the way.
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Stack spacing={2.5} sx={{ p: { xs: 3, sm: 4, md: 5 }, justifyContent: "center", minWidth: 0 }}>
        <Box>
          <Typography sx={{ mb: 1, letterSpacing: ".16em", fontSize: ".75rem", fontWeight: 700, color: "#d0dae3" }}>
            MOVIEBAG ACCOUNT
          </Typography>
          <Typography id="account-heading" component="h1" sx={{ fontFamily: "Limelight", fontSize: "clamp(1.7rem, 5vw, 2.2rem)", lineHeight: 1.15 }}>
            {title}
          </Typography>
          <Typography sx={{ mt: 1, color: "#d0dae3" }}>{description}</Typography>
        </Box>
        {children}
      </Stack>
    </Paper>
  </Container>
);

export const AuthForm = ({ busy, onSubmit, error, children }) => (
  <Stack component="form" spacing={2} noValidate aria-busy={busy} onSubmit={onSubmit}>
    {error && <Alert severity="error">{error}</Alert>}
    {children}
  </Stack>
);

export const AuthField = ({ registration, issue, hint, ...props }) => {
  const { ref, ...field } = registration;
  return (
    <TextField
      fullWidth required
      {...field}
      inputRef={ref}
      error={Boolean(issue)}
      helperText={issue?.message || hint}
      {...props}
      sx={{
        "& .MuiInputBase-root, & .MuiInputLabel-root, & .MuiIconButton-root": { color: "#fff" },
        "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "rgba(255,255,255,.025)" },
        "& .MuiInputLabel-root.Mui-focused:not(.Mui-error)": { color: "#fff" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#8998a5" },
        "& .MuiOutlinedInput-root:hover:not(.Mui-error) .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        "& .MuiOutlinedInput-root.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline": { borderColor: "var(--basic-color)" },
        "& .MuiFormHelperText-root:not(.Mui-error)": { color: "#d0dae3" },
        "& .MuiFormHelperText-root.Mui-error, & .MuiInputLabel-root.Mui-error": { color: "#ffb2b2" },
      }}
    />
  );
};

export const AuthSubmit = ({ busy, label, pendingLabel }) => (
  <Button
    type="submit" variant="contained" fullWidth disabled={busy}
    sx={{
      py: 1.25, borderRadius: "12px", textTransform: "none", fontWeight: 800,
      backgroundColor: "var(--basic-color)", color: "#fff",
      "&:hover": { backgroundColor: "var(--basic-color)", filter: "brightness(1.12)" },
      "&:focus-visible": { outline: "2px solid #fff", outlineOffset: 3 },
      "&.Mui-disabled": { backgroundColor: "#b1bfcc", color: "#26313b" },
    }}
  >
    {busy ? pendingLabel : label}
  </Button>
);
