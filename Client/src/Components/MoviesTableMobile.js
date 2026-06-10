import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PushPinIcon from "@mui/icons-material/PushPin";
import { useState } from "react";
import Pagination from "../Components/Pagination";
import { Container } from "@mui/material";

const MoviesTableMobile = ({
  currentMyMovies,
  watchedMovie,
  navigate,
  removeMovie,
  currentMyUnwatchedMovies,
  watched,
  setWatched,
  search,
  myMovies,
}) => {
  return (
    // <div className="table-container">

    <table className={"tableMobile"}>
      <thead>
        <tr className="theadMobile">
          <th
            className="watched-th"
            onClick={() => {
              watched ? setWatched(false) : setWatched(true);
            }}
          >
            Watched ?
          </th>
          <th className="table-th">Title</th>
          {/*<th className="table-th">Year</th>*/}
          {/*<th className="table-th">Type</th>*/}
          {/*<th className="table-th">Director</th>*/}
          <th className="table-th">Delete</th>
        </tr>
      </thead>
      {watched ? (
        <tbody>
          {currentMyUnwatchedMovies.map((myMovie, index) => {
            return (
              <tr key={myMovie._id} className="trowsMobile">
                <td className="watched-td">
                  <PushPinIcon
                    onClick={() => {
                      watchedMovie(myMovie._id);
                    }}
                    className={myMovie.watched ? "watched" : "not-watched "}
                    sx={{ cursor: "pointer", fontSize: 18 }}
                  />
                </td>
                <td
                  onClick={() => navigate(`/movie?title=${myMovie.title}`)}
                  className="movie-title-td"
                >
                  {myMovie.title}
                </td>
                {/*<td>{myMovie.year}</td>*/}
                {/*<td>{myMovie.type}</td>*/}
                {/*<td>{myMovie.director}</td>*/}
                <td>
                  <DeleteOutlineIcon
                    onClick={() => {
                      removeMovie(myMovie._id);
                    }}
                    sx={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      ) : (
        <tbody>
          {currentMyMovies.map((myMovie, index) => {
            return (
              <tr key={myMovie._id} className="trows">
                <td className="watched-td">
                  <PushPinIcon
                    onClick={() => {
                      watchedMovie(myMovie._id);
                    }}
                    className={myMovie.watched ? "watched" : "not-watched "}
                    sx={{ cursor: "pointer", fontSize: 18 }}
                  />
                </td>
                <td
                  onClick={() => navigate(`/movie?title=${myMovie.title}`)}
                  className="movie-title-td"
                >
                  {myMovie.title}
                </td>
                <td>{myMovie.year}</td>
                <td>{myMovie.type}</td>
                <td>{myMovie.director}</td>
                <td>
                  <DeleteOutlineIcon
                    onClick={() => {
                      removeMovie(myMovie._id);
                    }}
                    sx={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      )}
    </table>
  );
};
export default MoviesTableMobile;
