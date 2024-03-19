import { DeleteOutlined, PushpinFilled } from "@ant-design/icons";

const MoviesTable = ({
  currentMyMovies,
  watchedMovie,
  navigate,
  removeMovie,
  watched,
  setWatched,
  path,
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr className="thead">
            <th
              className="watched-th"
              onClick={() => {
                watched ? setWatched(false) : setWatched(true);
              }}
            >
              Watched ?
            </th>
            <th className="table-th">Title</th>
            <th className="table-th">Year</th>
            <th className="table-th">Type</th>
            <th className="table-th">Director</th>
            <th className="table-th">Delete</th>
          </tr>
        </thead>
        {/* {watched ? ( */}
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

        {/* // ) : (
      //   <tbody>
      //     {filterMovies.map((myMovie, index) => { 
      //       return (
      //         <tr key={myMovie._id} className="trows">
      //           <td className="watched-td">
      //             <PushpinFilled
      //               onClick={() => {
      //                 watchedMovie(myMovie._id);
      //               }}
      //               className={myMovie.watched ? "watched" : "not-watched "}
      //             />
      //           </td>
      //           <td
      //             onClick={() => navigate(`/movie?title=${myMovie.title}`)}
      //             className="movie-title-td"
      //           >
      //             {myMovie.title}
      //           </td>
      //           <td>{myMovie.year}</td>
      //           <td>{myMovie.type}</td>
      //           <td>{myMovie.director}</td>
      //           <td>
      //             <DeleteOutlined
      //               onClick={() => {
      //                 removeMovie(myMovie._id);
      //               }}
      //             />
      //           </td>
      //         </tr>
      //       );
      //     })}
      //   </tbody>
      // )}*/}
      </table>
    </div>
  );
};

export default MoviesTable;
