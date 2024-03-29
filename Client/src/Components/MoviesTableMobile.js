import { DeleteOutlined, PushpinFilled } from "@ant-design/icons";
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
                  <PushpinFilled
                    onClick={() => {
                      watchedMovie(myMovie._id);
                    }}
                    className={myMovie.watched ? "watched" : "not-watched "}
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
      ) : (
        <tbody>
          {currentMyMovies.map((myMovie, index) => {
            return (
              <tr key={myMovie._id} className="trows">
                <td className="watched-td">
                  <PushpinFilled
                    onClick={() => {
                      watchedMovie(myMovie._id);
                    }}
                    className={myMovie.watched ? "watched" : "not-watched "}
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
      )}
    </table>
  );
};
export default MoviesTableMobile;
