import { DeleteOutlined, PushpinFilled } from "@ant-design/icons";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const MoviesTable = ({
  currentMyMovies,
  rateTheMovie,
  navigate,
  removeMovie,
  path,
}) => {
  const [value, setValue] = useState();

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr className="thead">
            <th className="table-th">Rate</th>
            <th className="table-th">Title</th>
            <th className="table-th">Year</th>
            <th className="table-th">Type</th>
            <th className="table-th">Director</th>
            <th className="table-th">Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentMyMovies.map((myMovie, index) => {
            return (
              <tr key={myMovie._id} className="trows">
                <td className="watched-td">
                  {/* <PushpinFilled
                    onClick={() => {
                      watchedMovie(myMovie._id);
                    }}
                    className={myMovie.watched ? "watched" : "not-watched "}
                  /> */}
                  <Box
                    sx={{
                      "& > legend": { mt: 1 },
                    }}
                  >
                    <Rating
                      name={`movie-rating-${myMovie._id}`}
                      size="small"
                      value={myMovie.ratings.stars}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                        rateTheMovie(myMovie._id, newValue);
                      }}
                    />
                  </Box>
                </td>
                <td
                  onClick={() => navigate(path + `${myMovie.id}`)}
                  className="movie-title-td"
                >
                  {myMovie.title || myMovie.name}
                </td>
                <td>{myMovie.year}</td>
                <td>{myMovie.type}</td>
                <td>{myMovie.director || myMovie.creator}</td>
                <td>
                  <DeleteOutlined
                    onClick={() => {
                      removeMovie(myMovie._id);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MoviesTable;
