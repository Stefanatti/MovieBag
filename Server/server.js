const express = require("express");
const app = express();
const path = require("path");
const userRooter = require("./routers/userRoute.js");
const movieRooter = require("./routers/movieRoute");
const watchlistMovieRooter = require("./routers/watchlistMovieRoute");
const tvShowRooter = require("./routers/tvShowRoute");
const watchlistTvShowRooter = require("./routers/watchlistTvShowRoute");
const apiRooter = require("./routers/apiRoute");
var bodyParser = require("body-parser");
require("dotenv").config({ path: ".env" });

const cors = require("cors");
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "build")));

app.use("/user", userRooter);
app.use("/movie", movieRooter);
app.use("/watchlist/movie", watchlistMovieRooter);
app.use("/tvShow", tvShowRooter);
app.use("/watchlist/tvShow", watchlistTvShowRooter);

app.use("/api", apiRooter);

const PORT = process.env.PORT || 3636;
app.listen(PORT, () => {
  console.log("App is running on port", PORT);
});
