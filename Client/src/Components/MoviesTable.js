import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";

const MoviesTable = ({ currentMyMovies, rateTheMovie, removeMovie, path }) => {
  const navigate = useNavigate();

  return (
    <div className="library-table">
      {/* Table Header */}
      <div className="library-table__header">
        <div className="library-table__header-cell library-table__header-cell--num">
          #
        </div>
        <div className="library-table__header-cell library-table__header-cell--title">
          Title
        </div>
        <div className="library-table__header-cell library-table__header-cell--year">
          Year
        </div>
        <div className="library-table__header-cell library-table__header-cell--director">
          Director
        </div>
        <div className="library-table__header-cell library-table__header-cell--rating">
          Rating
        </div>
        <div className="library-table__header-cell library-table__header-cell--actions">
          Actions
        </div>
      </div>

      {/* Table Rows */}
      <div className="library-table__body">
        {currentMyMovies.map((myMovie, index) => (
          <div key={myMovie._id} className="library-table__row">
            {/* Row Number */}
            <div className="library-table__cell library-table__cell--num">
              <span className="library-table__index">{index + 1}</span>
            </div>

            {/* Title */}
            <div className="library-table__cell library-table__cell--title">
              <span
                className="library-table__title-text"
                onClick={() => navigate(path + `${myMovie.id}`)}
              >
                {myMovie.title || myMovie.name}
              </span>
            </div>

            {/* Year */}
            <div className="library-table__cell library-table__cell--year">
              <Chip
                label={myMovie.year || "N/A"}
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

            {/* Director */}
            <div className="library-table__cell library-table__cell--director">
              <div className="library-table__director-info">
                <span>{myMovie.director || myMovie.creator || "Unknown"}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="library-table__cell library-table__cell--rating">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Rating
                  name={`movie-rating-${myMovie._id}`}
                  size="small"
                  value={myMovie.ratings?.stars || 0}
                  onChange={(event, newValue) => {
                    rateTheMovie(myMovie._id, newValue);
                  }}
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
              </Box>
            </div>

            {/* Actions */}
            <div className="library-table__cell library-table__cell--actions">
              <Tooltip title="Remove from library" arrow placement="top">
                <IconButton
                  onClick={() => removeMovie(myMovie._id)}
                  className="library-table__delete-btn"
                  size="small"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesTable;
