import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalMoviesRoundedIcon from "@mui/icons-material/LocalMoviesRounded";
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded";
import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";

const MoviesTable = ({
  currentMyMovies,
  rateTheMovie,
  removeMovie,
  path,
  showType,
}) => {
  const isMovie = showType === "movie";
  const ItemIcon = isMovie ? LocalMoviesRoundedIcon : LiveTvRoundedIcon;
  const navigate = useNavigate();

  return (
    <div
      className="library-table"
      role="table"
      aria-label={isMovie ? "Your movies" : "Your TV shows"}
    >
      <div className="library-table__header" role="row">
        <div
          className="library-table__header-cell library-table__header-cell--poster"
          role="columnheader"
        >
          Poster
        </div>
        <div
          className="library-table__header-cell library-table__header-cell--title"
          role="columnheader"
        >
          Title
        </div>
        <div
          className="library-table__header-cell library-table__header-cell--year"
          role="columnheader"
        >
          Year
        </div>
        <div
          className="library-table__header-cell library-table__header-cell--director"
          role="columnheader"
        >
          {isMovie ? "Director" : "Creator"}
        </div>
        <div
          className="library-table__header-cell library-table__header-cell--rating"
          role="columnheader"
        >
          Your rating
        </div>
        <div
          className="library-table__header-cell library-table__header-cell--actions"
          role="columnheader"
        >
          Actions
        </div>
      </div>

      <div className="library-table__body" role="rowgroup">
        {currentMyMovies.map((item) => {
          const title = item.title || item.name;
          const creator = item.director || item.creator || "Unknown";
          const posterUrl = item.poster
            ? `https://image.tmdb.org/t/p/w185/${item.poster.replace(/^\//, "")}`
            : null;

          return (
            <article
              key={item._id}
              className="library-table__row"
              role="row"
            >
              <div
                className="library-table__cell library-table__cell--poster"
                role="cell"
              >
                <button
                  type="button"
                  className="library-table__poster"
                  onClick={() => navigate(path + item.id)}
                  aria-label={`View ${title}`}
                >
                  {posterUrl ? (
                    <img src={posterUrl} alt="" loading="lazy" />
                  ) : (
                    <ItemIcon aria-hidden="true" />
                  )}
                </button>
              </div>

              <div
                className="library-table__cell library-table__cell--title"
                role="cell"
              >
                <span className="library-table__mobile-label">Title</span>
                <div className="library-table__title-info">
                  <button
                    type="button"
                    className="library-table__title-text"
                    onClick={() => navigate(path + item.id)}
                  >
                    {title}
                  </button>
                  {item.watched && (
                    <span className="library-table__status">Watched</span>
                  )}
                </div>
              </div>

              <div
                className="library-table__cell library-table__cell--year"
                role="cell"
                aria-label={`Year ${item.year || "not available"}`}
              >
                <span className="library-table__mobile-label">Year</span>
                <Chip
                  label={item.year || "N/A"}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "var(--table-text-color)",
                    borderColor: "var(--table-text-color)",
                    opacity: 0.85,
                    fontSize: "0.75rem",
                  }}
                />
              </div>

              <div
                className="library-table__cell library-table__cell--director"
                role="cell"
                aria-label={`${isMovie ? "Director" : "Creator"} ${creator}`}
              >
                <span className="library-table__mobile-label">
                  {isMovie ? "Director" : "Creator"}
                </span>
                <div className="library-table__director-info">
                  <span>{creator}</span>
                </div>
              </div>

              <div
                className="library-table__cell library-table__cell--rating"
                role="cell"
              >
                <span className="library-table__mobile-label">Your rating</span>
                <Rating
                  name={`library-rating-${item._id}`}
                  value={item.ratings?.stars || 0}
                  onChange={(event, newValue) =>
                    rateTheMovie(item._id, newValue)
                  }
                  size="small"
                  aria-label={`Rate ${title}`}
                  emptyIcon={
                    <StarIcon
                      style={{ opacity: 0.3, color: "var(--basic-color)" }}
                      fontSize="inherit"
                    />
                  }
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "var(--basic-color)",
                    },
                  }}
                />
              </div>

              <div
                className="library-table__cell library-table__cell--actions"
                role="cell"
              >
                <IconButton
                  onClick={() => removeMovie(item._id)}
                  className="library-table__delete-btn"
                  aria-label={`Remove ${title} from your library`}
                  title={`Remove ${title} from your library`}
                  size="small"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default MoviesTable;
