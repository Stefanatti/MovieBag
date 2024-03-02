import { Grid, Paper } from "@mui/material";

const Poster = ({ url, md, sm, height }) => {
  return (
    <Grid item xs={md} md={md} sm={sm}>
      <Paper
        elevation={3}
        sx={{
          border: "2px solid var(--home-page-posters-color)",
          height: `${height}px`,
          backgroundImage: `url(${url})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></Paper>
    </Grid>
  );
};

export default Poster;
